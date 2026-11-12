const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const cp = require('node:child_process');
const { validate } = require('../src');
const { captureComparison, fitPage } = require('../src/capture/comparison');
const { captureLegacy } = require('../src/capture/legacy');
const { buildFfmpegArgs, validateComposition } = require('../src/compose/ffmpeg');
const recipe = require('../references/recipe-example.json');

const fullPageRecipe = () => {
  const changed = structuredClone(recipe);
  changed.comparison.composition.enabled = false;
  for (const shot of changed.comparison.shots) {
    shot.framing = 'full-page';
    delete shot.zoom;
  }
  return changed;
};

test('a full-page comparison recipe accepts whole-document framing without a zoom effect', { tags: ['composition', 'validation'] }, () => {
  assert.equal(validate(fullPageRecipe()).ok, true);
  const changed = fullPageRecipe();
  changed.comparison.shots[0].framing = 'full-page;crop';
  assert.equal(validate(changed).ok, false);
  changed.comparison.shots[0].framing = 'full-page';
  changed.comparison.shots[0].zoom = 'push-in';
  assert.equal(validate(changed).ok, false);
});

test('a tall page fits in each recording after the only click expands its height', { tags: ['composition'] }, async () => {
  const contexts = [], actions = [];
  const doc = { scrollWidth: 1440, scrollHeight: 900, style: {} };
  const previousDocument = globalThis.document, previousScrollTo = globalThis.scrollTo;
  globalThis.document = { documentElement: doc, body: { scrollWidth: 1440, scrollHeight: 900 } };
  globalThis.scrollTo = () => {};
  const page = {
    clock: { install: async () => {}, fastForward: async () => {} },
    goto: async () => {},
    evaluate: async (callback, value) => value?.width === 1440 ? callback(value) : undefined,
    locator: () => ({ click: async () => { actions.push('click'); doc.scrollHeight = 3000; }, first: () => ({ waitFor: async () => {}, boundingBox: async () => ({ x: 10, y: 10, width: 200, height: 50 }) }) }),
    video: () => ({ saveAs: async () => {} }),
    mouse: { move: async () => {} },
  };
  const browser = {
    newContext: async options => { contexts.push(options); return { newPage: async () => page, close: async () => {} }; },
    close: async () => {},
  };
  const run = fs.mkdtempSync(path.join(os.tmpdir(), 'demo-full-page-'));
  try {
    const changed = fullPageRecipe();
    changed.comparison.shots[0].action = 'click';
    for (const shot of changed.comparison.shots) shot.durationMs = 1;
    const result = await captureComparison(changed, run, { playwright: { chromium: { launch: async () => browser } } });
    const recorded = contexts.filter(options => options.recordVideo);
    assert.equal(recorded.length, recipe.comparison.shots.length);
    assert.deepEqual(actions, ['click']);
    assert.equal(doc.style.transform, 'scale(0.3)');
    for (const context of recorded) {
      assert.deepEqual(context.viewport, { width: 1440, height: 900 });
      assert.deepEqual(context.recordVideo.size, context.viewport);
    }
    for (const event of result.events) {
      assert.deepEqual(event.crop, { x: 0, y: 0, width: 1440, height: 900 });
      assert.equal(event.framing, 'full-page');
      assert.equal(event.pageSize.height, 3000);
    }
  } finally { globalThis.document = previousDocument; globalThis.scrollTo = previousScrollTo; fs.rmSync(run, { recursive: true, force: true }); }
});

test('whole-page video and contact frames fit tall content with visible padding and no push-in', { tags: ['composition'] }, () => {
  const args = buildFfmpegArgs({ output: 'demo.mp4', contactSheet: 'sheet.jpg', shots: [
    { input: 'before.webm', framing: 'full-page', crop: { x: 0, y: 0, width: 1440, height: 3000 }, durationMs: 1000 },
    { input: 'after.webm', framing: 'full-page', crop: { x: 0, y: 0, width: 1440, height: 3000 }, durationMs: 1000 },
  ] });
  const video = args.video.join(' '), sheet = args.contactSheet.join(' ');
  assert.match(video, /scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:/);
  assert.match(sheet, /scale=640:360:force_original_aspect_ratio=decrease,pad=640:360:/);
  assert.doesNotMatch(video, /zoompan/);
  assert.throws(() => validateComposition({ output: '../unsafe.mp4', shots: [{ input: 'x.webm', crop: { x: 0, y: 0, width: 1, height: 1 }, durationMs: 1000, framing: 'full-page' }] }));
});

test('top and bottom of a tall page remain visible in the composed video', { tags: ['composition'] }, () => {
  const run = fs.mkdtempSync(path.join(os.tmpdir(), 'demo-full-page-video-'));
  try {
    const make = cp.spawnSync('ffmpeg', ['-loglevel', 'error', '-f', 'lavfi', '-i', 'color=c=red:s=240x600:r=30', '-f', 'lavfi', '-i', 'color=c=blue:s=240x600:r=30', '-filter_complex', '[0:v][1:v]vstack=inputs=2[v]', '-map', '[v]', '-t', '1', '-c:v', 'libx264', '-y', 'tall.mp4'], { cwd: run, encoding: 'utf8' });
    assert.equal(make.status, 0, make.stderr);
    const args = buildFfmpegArgs({ output: 'demo.mp4', shots: [{ input: 'tall.mp4', framing: 'full-page', crop: { x: 0, y: 0, width: 240, height: 1200 }, durationMs: 500 }] });
    const composed = cp.spawnSync('ffmpeg', ['-loglevel', 'error', ...args.video], { cwd: run, encoding: 'utf8' });
    assert.equal(composed.status, 0, composed.stderr);
    const read = y => cp.spawnSync('ffmpeg', ['-loglevel', 'error', '-i', 'demo.mp4', '-vf', `crop=2:2:640:${y}`, '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { cwd: run, encoding: null });
    const top = read(60), bottom = read(650), side = cp.spawnSync('ffmpeg', ['-loglevel', 'error', '-i', 'demo.mp4', '-vf', 'crop=2:2:40:360', '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { cwd: run });
    assert.equal(top.status, 0, String(top.stderr));
    assert.equal(bottom.status, 0, String(bottom.stderr));
    assert.equal(side.status, 0, String(side.stderr));
    assert.ok(top.stdout[0] > top.stdout[2] + 80, 'red top is visible');
    assert.ok(bottom.stdout[2] > bottom.stdout[0] + 80, 'blue bottom is visible');
    assert.ok(side.stdout[0] < 30 && side.stdout[2] < 30, 'horizontal padding is visible');
  } finally { fs.rmSync(run, { recursive: true, force: true }); }
});

test('an older comparison recipe still frames the entire page after a single click', { tags: ['composition'] }, async () => {
  const changed = structuredClone(recipe);
  changed.comparison.composition.enabled = false;
  changed.comparison.shots[0].action = 'click';
  for (const shot of changed.comparison.shots) shot.durationMs = 1;
  const doc = { scrollWidth: 1440, scrollHeight: 900, style: {} };
  const previousDocument = globalThis.document, previousScrollTo = globalThis.scrollTo;
  globalThis.document = { documentElement: doc, body: { scrollWidth: 1440, scrollHeight: 900 } };
  globalThis.scrollTo = () => {};
  let clicks = 0;
  const page = {
    clock: { install: async () => {}, fastForward: async () => {} },
    goto: async () => {},
    evaluate: async (callback, value) => value?.width === 1440 ? callback(value) : undefined,
    locator: () => ({ click: async () => { clicks++; doc.scrollHeight = 3000; }, first: () => ({ waitFor: async () => {}, boundingBox: async () => ({ x: 0, y: 0, width: 100, height: 100 }) }) }),
    mouse: { move: async () => {} },
    video: () => ({ saveAs: async () => {} }),
  };
  const browser = { newContext: async () => ({ newPage: async () => page, close: async () => {} }), close: async () => {} };
  const run = fs.mkdtempSync(path.join(os.tmpdir(), 'demo-old-full-page-'));
  try {
    const result = await captureComparison(changed, run, { playwright: { chromium: { launch: async () => browser } } });
    assert.equal(clicks, 1);
    assert.equal(doc.style.transform, 'scale(0.3)');
    assert.equal(result.events[0].framing, 'full-page');
  } finally { globalThis.document = previousDocument; globalThis.scrollTo = previousScrollTo; fs.rmSync(run, { recursive: true, force: true }); }
});

test('a current-behavior recording fits a page expanded by a click', { tags: ['composition'] }, async () => {
  const changed = structuredClone(recipe);
  changed.comparison.status = 'current-behavior';
  changed.requirements[0].steps = [{ id: 'step-1', action: 'click', selector: '#expand' }];
  const doc = { scrollWidth: 1440, scrollHeight: 900, style: {} };
  const previousDocument = globalThis.document, previousScrollTo = globalThis.scrollTo;
  globalThis.document = { documentElement: doc, body: { scrollWidth: 1440, scrollHeight: 900 } };
  globalThis.scrollTo = () => {};
  let clicks = 0;
  const page = {
    evaluate: async (callback, value) => value?.width === 1440 ? callback(value) : undefined,
    locator: () => ({ click: async () => { clicks++; doc.scrollHeight = 3000; } }),
    url: () => changed.target.url,
  };
  const browser = { newContext: async () => ({ newPage: async () => page, close: async () => {} }), close: async () => {} };
  const run = fs.mkdtempSync(path.join(os.tmpdir(), 'demo-legacy-page-'));
  try {
    const result = await captureLegacy(changed, run, changed.viewports, { playwright: { chromium: { launch: async () => browser } } });
    assert.equal(result.events[0].outcome, 'pass');
    assert.equal(clicks, 1);
    assert.equal(doc.style.transform, 'scale(0.3)');
  } finally { globalThis.document = previousDocument; globalThis.scrollTo = previousScrollTo; fs.rmSync(run, { recursive: true, force: true }); }
});

test('a rotated whole page remains visible and keeps its original size after repeated recordings', { tags: ['composition'] }, async t => {
  const { chromium } = require('@playwright/test');
  let browser;
  try {
    browser = await chromium.launch(fs.existsSync(chromium.executablePath()) ? { headless: true } : { channel: 'chrome', headless: true });
  } catch (error) {
    if (/Executable doesn't exist|executable .*not found/.test(error.message)) return t.skip('No browser executable is installed');
    throw error;
  }
  try {
    const page = await browser.newPage({ viewport: { width: 900, height: 600 } });
    await page.setContent(`<!doctype html><html style="width:1300px;height:1800px;transform:rotate(10deg);transform-origin:center center"><body style="margin:0;width:1300px;height:1800px;background:#345"></body></html>`);
    const viewport = { width: 900, height: 600 };
    const measure = () => page.evaluate(() => {
      const root = document.documentElement;
      const { left, top, right, bottom } = root.getBoundingClientRect();
      return { left, top, right, bottom, transform: root.style.transform, origin: root.style.transformOrigin };
    });
    const firstFit = await fitPage(page, viewport);
    const first = await measure();
    for (const [edge, value, limit] of [['left', first.left, 0], ['top', first.top, 0], ['right', first.right, viewport.width], ['bottom', first.bottom, viewport.height]]) {
      assert.ok(edge === 'left' || edge === 'top' ? value >= limit - 1 : value <= limit + 1, `${edge} corner ${value} is outside the recording viewport`);
    }
    assert.equal(first.origin, 'center center');
    const secondFit = await fitPage(page, viewport);
    const second = await measure();
    assert.deepEqual(secondFit, firstFit, 'another recording uses the original document dimensions and scale');
    assert.deepEqual(second, first, 'another recording does not compound the rotation, translation, or scale');
  } finally { await browser.close(); }
});

test('an offset rotated whole page fits inside the recording viewport on repeated recordings', { tags: ['composition'] }, async t => {
  const { chromium } = require('@playwright/test');
  let browser;
  try {
    browser = await chromium.launch(fs.existsSync(chromium.executablePath()) ? { headless: true } : { channel: 'chrome', headless: true });
  } catch (error) {
    if (/Executable doesn't exist|executable .*not found/.test(error.message)) return t.skip('No browser executable is installed');
    throw error;
  }
  try {
    const viewport = { width: 900, height: 600 };
    const page = await browser.newPage({ viewport });
    await page.setContent(`<!doctype html><html style="position:relative;left:200px;top:100px;width:1300px;height:1800px;transform:rotate(10deg);transform-origin:center center"><body style="margin:0;width:1300px;height:1800px;background:#345"></body></html>`);
    const measure = () => page.evaluate(() => {
      const root = document.documentElement;
      const { left, top, right, bottom } = root.getBoundingClientRect();
      return { left, top, right, bottom, transform: root.style.transform, origin: root.style.transformOrigin };
    });
    const assertVisible = bounds => {
      assert.ok(bounds.left >= -1, `left edge ${bounds.left} is outside the recording viewport`);
      assert.ok(bounds.top >= -1, `top edge ${bounds.top} is outside the recording viewport`);
      assert.ok(bounds.right <= viewport.width + 1, `right edge ${bounds.right} is outside the recording viewport`);
      assert.ok(bounds.bottom <= viewport.height + 1, `bottom edge ${bounds.bottom} is outside the recording viewport`);
    };
    const firstFit = await fitPage(page, viewport);
    const first = await measure();
    assertVisible(first);
    assert.equal(first.origin, 'center center');
    const secondFit = await fitPage(page, viewport);
    const second = await measure();
    assertVisible(second);
    assert.deepEqual(secondFit, firstFit, 'another recording uses the original document dimensions and scale');
    assert.deepEqual(second, first, 'another recording does not compound the rotation, translation, or scale');
  } finally { await browser.close(); }
});

test('a perspective-rotated whole page reports unsupported 3D framing instead of cropping', { tags: ['composition'] }, async t => {
  const { chromium } = require('@playwright/test');
  let browser;
  try {
    browser = await chromium.launch(fs.existsSync(chromium.executablePath()) ? { headless: true } : { channel: 'chrome', headless: true });
  } catch (error) {
    if (/Executable doesn't exist|executable .*not found/.test(error.message)) return t.skip('No browser executable is installed');
    throw error;
  }
  try {
    const page = await browser.newPage({ viewport: { width: 900, height: 600 } });
    await page.setContent(`<!doctype html><html style="width:1300px;height:1800px;transform:perspective(500px) rotateY(20deg);transform-origin:center center"><body style="margin:0;width:1300px;height:1800px;background:#345"></body></html>`);
    await assert.rejects(fitPage(page, { width: 900, height: 600 }), /full page 3D transforms are not supported/);
  } finally { await browser.close(); }
});

test('a page keeps its existing transform without multiplying the fit on repeated recordings', { tags: ['composition'] }, async () => {
  const doc = { scrollWidth: 1440, scrollHeight: 3000, style: { transform: 'translateX(5px)' } };
  const previousDocument = globalThis.document, previousScrollTo = globalThis.scrollTo;
  globalThis.document = { documentElement: doc, body: { scrollWidth: 1440, scrollHeight: 3000 } };
  globalThis.scrollTo = () => {};
  const page = { evaluate: async (callback, value) => callback(value) };
  try {
    assert.equal((await fitPage(page, { width: 1440, height: 900 })).scale, 0.3);
    assert.equal(doc.style.transform, 'scale(0.3) translateX(5px)');
    await fitPage(page, { width: 1440, height: 900 });
    assert.equal(doc.style.transform, 'scale(0.3) translateX(5px)');
  } finally { globalThis.document = previousDocument; globalThis.scrollTo = previousScrollTo; }
});

test('a page keeps stylesheet positioning visible after fitting tall content', { tags: ['composition'] }, async () => {
  const doc = { scrollWidth: 1440, scrollHeight: 3000, style: { transform: '' } };
  const previousDocument = globalThis.document, previousScrollTo = globalThis.scrollTo, previousComputed = globalThis.getComputedStyle;
  globalThis.document = { documentElement: doc, body: { scrollWidth: 1440, scrollHeight: 3000 } };
  globalThis.scrollTo = () => {};
  globalThis.getComputedStyle = () => ({ transform: 'matrix(1, 0, 0, 1, 5, 0)' });
  try {
    const page = { evaluate: async (callback, value) => callback(value) };
    await fitPage(page, { width: 1440, height: 900 });
    assert.equal(doc.style.transform, 'translate(-1.5px, 0px) scale(0.3) matrix(1, 0, 0, 1, 5, 0)');
    const offset = Number(/^translate\(([-\d.]+)px, 0px\)/.exec(doc.style.transform)[1]);
    assert.equal(offset + 0.3 * 5, 0, 'the scaled stylesheet offset lands at the viewport origin');
    await fitPage(page, { width: 1440, height: 900 });
    assert.equal(doc.style.transform, 'translate(-1.5px, 0px) scale(0.3) matrix(1, 0, 0, 1, 5, 0)');
  } finally { globalThis.document = previousDocument; globalThis.scrollTo = previousScrollTo; globalThis.getComputedStyle = previousComputed; }
});
