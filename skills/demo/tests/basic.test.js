const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const { validate, canon, gherkin, validateReview, manifest } = require('../src');
const { unionCrop16x9 } = require('../src/capture/geometry');
const { buildFfmpegArgs, validateComposition } = require('../src/compose/ffmpeg');
const { captureComparison } = require('../src/capture/comparison');
const { captureLegacy } = require('../src/capture/legacy');
const { captureStatus } = require('../src/cli/main');
const recipe = require('../references/recipe-example.json');

const root = path.join(__dirname, '..');
const skill = fs.readFileSync(path.join(root, 'SKILL.md'), 'utf8');
const primeReference = path.join(root, 'references', 'prime-playwright.py');
const comparisonSource = path.join(root, 'src', 'capture', 'comparison.js');
const cli = args => cp.spawnSync('node', ['bin/demo', ...args], { cwd: root, encoding: 'utf8' });
const removeRun = id => fs.rmSync(path.join(root, '.tmp', 'demo', id), { recursive: true, force: true });
const unsafeRelativePaths = ['../out.mp4', String.raw`..\out.mp4`, String.raw`folder\out.mp4`, '//server/share/out.mp4', '/tmp/out.mp4', 'http://evil.test/out.mp4', 'bad\0name.mp4'];

test('demo is user-invocable and not model-auto-invoked', () => {
  assert.match(skill, /^disable-model-invocation:\s*true\s*$/m);
  assert.match(skill, /^user-invocable:\s*true\s*$/m);
});

test('valid recipe accepts explicit viewport and allow-listed steps', () => assert.equal(validate(recipe).ok, true));
test('unsafe recipe output is rejected before runtime', () => {
  const changed = structuredClone(recipe);
  changed.outputs.root = '../captures';
  assert.equal(validate(changed).ok, false);
});
test('current-behavior rejects shell strings and accepts argv arrays', () => {
  const changed = structuredClone(recipe);
  changed.comparison.status = 'current-behavior';
  changed.target = { command: 'npm start' };
  assert.equal(validate(changed).ok, false);
  changed.target = { command: ['npm', 'start'] };
  assert.equal(validate(changed).ok, false);
  changed.target.url = 'http://127.0.0.1:3000';
  assert.equal(validate(changed).ok, true);
});
test('command targets require one canonical origin and reject baseUrl', () => {
  const changed = structuredClone(recipe);
  changed.comparison.status = 'current-behavior';
  changed.target = { command: ['npm', 'start'] };
  changed.requirements[0].steps = [{ id: 'step-1', action: 'navigate', url: 'http://evil.test/' }];
  assert.equal(validate(changed).ok, false);
  changed.target.healthUrl = 'http://127.0.0.1:3000/health';
  changed.requirements[0].steps[0].url = 'http://127.0.0.1:3000/dashboard';
  assert.equal(validate(changed).ok, true);
  changed.requirements[0].steps[0].url = 'http://evil.test/';
  assert.equal(validate(changed).ok, false);
  changed.requirements[0].steps[0].url = '/dashboard';
  changed.target.baseUrl = 'http://evil.test/';
  assert.equal(validate(changed).ok, false);
});
test('comparison targets reject split URL and health-check origins', () => {
  const changed = structuredClone(recipe);
  changed.comparison.targets.before.healthUrl = 'http://127.0.0.1:3999/health';
  assert.equal(validate(changed).ok, false);
});
test('generated review has provenance on executable elements', () => assert.equal(validateReview(gherkin(recipe), recipe).ok, true));
test('review storyboard exposes both comparison target URLs', () => {
  const output = gherkin(recipe);
  assert.match(output, /targets\.before url=http:\/\/127\.0\.0\.1:3000/);
  assert.match(output, /targets\.after url=http:\/\/127\.0\.0\.1:3001/);
});
test('before-after storyboard uses desired user expectation naming and keeps before failures as comments', () => {
  const output = gherkin(recipe);
  assert.equal((output.match(/^\s*Scenario:/gm) || []).length, recipe.requirements[0].steps.length);
  assert.match(output, /Scenario: REQ-1\/step-1 desired user expectation/);
  assert.match(output, /Scenario: REQ-1\/step-2 desired user expectation/);
  assert.match(output, /beforeFailurePoint: the page at "\/"/);
  assert.match(output, /beforeFailure: does-not-meet-expected/);
  assert.match(output, /Given the product is in the after state/);
  assert.doesNotMatch(output, /Then the result does not satisfy/);
  assert.match(output, /Then the result satisfies "home route loads and is usable"/);
});
test('before-after recipes require one before and one after shot per requirement step', () => {
  const changed = structuredClone(recipe);
  changed.comparison.shots = changed.comparison.shots.filter(shot => !(shot.stepId === 'step-2' && shot.phase === 'after'));
  assert.equal(validate(changed).ok, false);
});
test('review rejects a journey whose requirements are not bound to recorded shots', () => {
  const changed = structuredClone(recipe);
  changed.requirements[0].steps.push({ id: 'unrecorded', action: 'navigate', url: '/missing' });
  assert.equal(validateReview(gherkin(changed), changed).ok, false);
});
test('canonical serialization is deterministic', () => assert.equal(canon({ b: 1, a: 2 }), '{"a":2,"b":1}'));

test('review records recipe hash without freezing capture files', () => {
  const id = `test-gate-${Date.now()}`;
  const result = cli(['review', '--recipe', 'references/recipe-example.json', '--run-id', id]);
  const dir = path.join(root, '.tmp', 'demo', id);
  assert.equal(result.status, 0, result.stderr);
  assert.match(JSON.parse(fs.readFileSync(path.join(dir, 'review', 'review.json'))).recipeHash, /^[a-f0-9]{64}$/);
  assert.equal(fs.existsSync(path.join(dir, 'recipe.frozen.json')), false);
  assert.equal(fs.existsSync(path.join(dir, 'recipe.sha256')), false);
  removeRun(id);
});

for (const [field, mutate] of [
  ['URL', changed => { changed.comparison.targets.after.url = 'http://127.0.0.1:3999'; }],
  ['scroll', changed => { changed.comparison.shots[0].scroll.x = 40; }],
  ['command', changed => { changed.target = { command: ['node', 'server.js'], healthUrl: 'http://127.0.0.1:3000' }; changed.comparison.status = 'current-behavior'; }],
]) {
  test(`approved recipe rejects mutated ${field} before capture`, () => {
    const id = `test-mutation-${field.toLowerCase()}-${Date.now()}`;
    const dir = path.join(root, '.tmp', 'demo', id);
    assert.equal(cli(['review', '--recipe', 'references/recipe-example.json', '--run-id', id]).status, 0);
    assert.equal(cli(['approve', '--run-id', id, '--reviewer', 'test']).status, 0);
    const changed = structuredClone(recipe);
    mutate(changed);
    const file = path.join(dir, 'changed.json');
    fs.writeFileSync(file, JSON.stringify(changed));
    const result = cli(['run', '--recipe', file, '--run-id', id]);
    assert.equal(result.status, 33, result.stderr);
    removeRun(id);
  });
}

test('review artifact exposes command argv and canonical URL for approval', () => {
  const changed = structuredClone(recipe);
  changed.comparison.status = 'current-behavior';
  changed.target = {
    command: ['node', 'server.js', '--port', '3000'],
    healthUrl: 'http://127.0.0.1:3000/health',
  };
  assert.match(gherkin(changed), /argv=\["node","server\.js","--port","3000"\]/);
  assert.match(gherkin(changed), /url=http:\/\/127\.0\.0\.1:3000\/health/);
});
test('command review exposes the real execution directory and rejects invalid cwd values', () => {
  const changed = structuredClone(recipe);
  changed.comparison.status = 'current-behavior';
  changed.target = {
    command: ['node', 'server.js'],
    healthUrl: 'http://127.0.0.1:3000/health',
  };
  assert.match(gherkin(changed), new RegExp(`cwd=${root.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
  changed.target.cwd = 'tests';
  const previousCwd = process.cwd();
  try {
    process.chdir(path.dirname(root));
    assert.match(gherkin(changed), new RegExp(`cwd=${path.join(root, 'tests').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
  } finally {
    process.chdir(previousCwd);
  }
  changed.target.cwd = path.join(root, 'tests');
  assert.match(gherkin(changed), new RegExp(`cwd=${changed.target.cwd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
  changed.target.cwd = path.join(root, 'missing-directory');
  assert.equal(validate(changed).ok, false);
  changed.target.cwd = path.join(root, 'package.json');
  assert.equal(validate(changed).ok, false);
});
test('mutating command cwd after approval exits 33', () => {
  const id = `test-mutation-cwd-${Date.now()}`;
  const dir = path.join(root, '.tmp', 'demo', id);
  const changed = structuredClone(recipe);
  changed.comparison.status = 'current-behavior';
  changed.target = {
    command: ['/usr/bin/true'],
    cwd: root,
    healthUrl: 'http://127.0.0.1:3000/health',
  };
  const file = path.join(root, '.tmp', `${id}.json`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(changed));
  assert.equal(cli(['review', '--recipe', file, '--run-id', id]).status, 0);
  const reviewText = fs.readFileSync(path.join(dir, 'review', 'demo.feature.review'), 'utf8');
  assert.match(reviewText, new RegExp(`cwd=${root.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
  assert.equal(cli(['approve', '--run-id', id, '--reviewer', 'test']).status, 0);
  changed.target.cwd = path.join(root, 'tests');
  fs.writeFileSync(file, JSON.stringify(changed));
  assert.equal(cli(['run', '--recipe', file, '--run-id', id]).status, 33);
  fs.rmSync(file, { force: true });
  removeRun(id);
});
test('review artifact exposes both command target URLs for approval', () => {
  const changed = structuredClone(recipe);
  changed.comparison.status = 'current-behavior';
  changed.target = {
    command: ['node', 'server.js'],
    url: 'http://127.0.0.1:3000/app',
    healthUrl: 'http://127.0.0.1:3000/health',
  };
  const output = gherkin(changed);
  assert.match(output, /url=http:\/\/127\.0\.0\.1:3000\/app/);
  assert.match(output, /healthUrl=http:\/\/127\.0\.0\.1:3000\/health/);
});
test('review exposes shot storyboard details required for approval', () => {
  const output = gherkin(recipe);
  for (const value of ['requirementId=REQ-1', 'stepId=step-1', 'phase=before', 'phase=after', 'route=/', 'focus=body', 'framing=union-16:9', 'durationMs=1500', 'annotation=BEFORE']) {
    assert.match(output, new RegExp(value.replace('/', '\\/')));
  }
});
test('review provenance accepts outcomes containing spaces', () => assert.equal(validateReview(gherkin(recipe), recipe).ok, true));
test('comparison rejects malformed before-after configuration', () => {
  const changed = structuredClone(recipe);
  changed.comparison.targets.after.url = 'javascript:alert(1)';
  assert.equal(validate(changed).ok, false);
});
test('navigate and assert-url accept web or relative URLs and reject script URLs', () => {
  for (const action of ['navigate', 'assert-url']) {
    for (const url of ['http://127.0.0.1:3000/path', '/relative', 'relative/path']) {
      const changed = structuredClone(recipe);
      changed.requirements[0].steps = [{ id: 'step-1', action, url }];
      changed.comparison.status = 'current-behavior';
      assert.equal(validate(changed).ok, true, `${action} should accept ${url}`);
    }
    for (const url of ['https://example.test/path', 'javascript:alert(1)']) {
      const changed = structuredClone(recipe);
      changed.requirements[0].steps = [{ id: 'step-1', action, url }];
      changed.comparison.status = 'current-behavior';
      assert.equal(validate(changed).ok, false, `${action} should reject ${url}`);
    }
  }
});
for (const route of ['//evil.test/path', String.raw`/\evil.test/path`, String.raw`\\evil.test/path`]) {
  test(`off-origin route ${JSON.stringify(route)} is rejected before navigation`, async () => {
    const unsafeStep = structuredClone(recipe);
    unsafeStep.requirements[0].steps[0].url = route;
    assert.equal(validate(unsafeStep).ok, false);

    const unsafeShot = structuredClone(recipe);
    unsafeShot.comparison.shots[0].route = route;
    assert.equal(validate(unsafeShot).ok, false);

    const changed = structuredClone(recipe);
    changed.requirements[0].steps[0].url = route;
    changed.comparison.shots[0].route = route;
    assert.equal(validateReview(gherkin(changed), changed).ok, false);

    const navigated = [];
    const page = {
      clock: { install: async () => {} },
      goto: async url => navigated.push(url),
    };
    const browser = {
      newContext: async () => ({ newPage: async () => page, close: async () => {} }),
      close: async () => {},
    };
    await assert.rejects(
      captureComparison(changed, path.join(root, '.tmp', 'demo', `origin-lock-${Date.now()}`), { playwright: { chromium: { launch: async () => browser } } }),
      /same-origin relative path/,
    );
    assert.deepEqual(navigated, []);
  });
}
test('outputs root rejects lookalike prefixes outside the demo root', () => {
  const changed = structuredClone(recipe);
  changed.outputs.root = '/tmp/not-demo/.tmp/demo-exfil';
  assert.equal(validate(changed).ok, false);
});
test('outputs root rejects symlinks that escape the demo root', () => {
  const demoRoot = path.join(root, '.tmp', 'demo');
  const outside = path.join(root, '.tmp', `demo-outside-${Date.now()}`);
  const link = path.join(demoRoot, `escape-${Date.now()}`);
  fs.mkdirSync(outside, { recursive: true });
  fs.mkdirSync(demoRoot, { recursive: true });
  fs.symlinkSync(outside, link);
  const changed = structuredClone(recipe);
  changed.outputs.root = path.relative(root, path.join(link, 'captures'));
  assert.equal(validate(changed).ok, false);
  fs.rmSync(link, { force: true });
  fs.rmSync(outside, { recursive: true, force: true });
});
test('viewport and requirement identifiers reject path traversal characters', () => {
  for (const mutate of [
    changed => { changed.viewports[0].name = '../escape'; },
    changed => { changed.requirements[0].id = '../REQ-1'; },
    changed => { changed.requirements[0].steps[0].id = '../step-1'; },
  ]) {
    const changed = structuredClone(recipe);
    mutate(changed);
    assert.equal(validate(changed).ok, false);
  }
});
test('CLI rejects missing, flag-shaped, and traversal values', () => {
  assert.equal(cli(['approve', '--run-id', 'missing']).status, 10);
  assert.equal(cli(['approve', '--run-id', 'missing', '--reviewer', '--recipe']).status, 10);
  assert.equal(cli(['review', '--recipe', '--run-id', 'safe']).status, 10);
  assert.equal(cli(['review', '--recipe', 'references/recipe-example.json', '--run-id', '../escape']).status, 10);
  const malformedRun = cli(['run', '--recipe', 'references/recipe-example.json', '--run-id', '--reviewer']);
  assert.equal(malformedRun.status, 10);
  assert.match(malformedRun.stderr, /--run-id requires a non-flag value/);
});
test('requiring runtime does not print CLI help', () => {
  const result = cp.spawnSync('node', ['-e', "require('./src/index.js')"], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, '');
});

test('union crop is stable, padded, 16:9, and clamped to viewport', () => {
  const crop = unionCrop16x9({ x: 100, y: 100, width: 200, height: 100 }, { x: 140, y: 90, width: 260, height: 160 }, { width: 1440, height: 900 }, 32);
  assert.deepEqual(crop, { x: 58, y: 62, width: 384, height: 216 });
  assert.equal(crop.width / crop.height, 16 / 9);
});
test('composition rejects unsafe paths and numeric values', () => {
  for (const output of unsafeRelativePaths) {
    assert.throws(() => validateComposition({
      output,
      shots: [{ input: 'a.webm', crop: { x: 0, y: 0, width: 1, height: 1 }, durationMs: 1 }],
    }));
  }
  assert.throws(() => validateComposition({ output: 'out.mp4', shots: [{ input: 'a.webm', durationMs: 'oops' }] }));
  assert.throws(() => validateComposition({ output: 'out.mp4', shots: [{ input: 'http://evil.test/a.webm', crop: { x: 0, y: 0, width: 1, height: 1 }, durationMs: 1 }] }));
});
test('Prime composition rejects the JavaScript unsafe-path fixtures before subprocess', () => {
  const script = [
    'import importlib.util,json,sys',
    "spec=importlib.util.spec_from_file_location('prime',sys.argv[1])",
    'mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)',
    'paths=json.loads(sys.stdin.read())',
    'results=[]',
    'class SubprocessCalled(Exception): pass',
    'def called(*args,**kwargs): raise SubprocessCalled()',
    'mod.shutil.which=lambda name:"/usr/bin/ffmpeg"',
    'mod.subprocess.run=called',
    'for value in paths:',
    '  try: mod.compose(["-i",value,"out.mp4"])',
    '  except ValueError: results.append("rejected")',
    '  except SubprocessCalled: results.append("called")',
    'print(json.dumps(results))',
  ].join('\n');
  const result = cp.spawnSync('python3', ['-c', script, primeReference], {
    input: JSON.stringify(unsafeRelativePaths),
    encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), unsafeRelativePaths.map(() => 'rejected'));
});
test('ffmpeg args use hard concat and only approved filters', () => {
  const args = buildFfmpegArgs({ output: 'demo.mp4', contactSheet: 'contact.jpg', shots: [
    { input: 'before.webm', labelPng: 'before.png', crop: { x: 0, y: 0, width: 1280, height: 720 }, durationMs: 1000 },
    { input: 'after.webm', labelPng: 'after.png', crop: { x: 0, y: 0, width: 1280, height: 720 }, durationMs: 1000 },
  ] });
  const joined = [...args.video, ...args.contactSheet].join(' ');
  for (const filter of ['crop=', 'scale=', 'overlay=', 'tpad=', 'concat=']) assert.match(joined, new RegExp(filter));
  assert.doesNotMatch(joined, /drawtext|subtitles|xfade|(?:^|[,;])pad=|tile=|]null/);
  assert.deepEqual(args.video.slice(-2), ['-y', 'demo.mp4']);
});
test('contact sheet crops both inputs and joins equal 16:9 stills', () => {
  const args = buildFfmpegArgs({ output: 'demo.mp4', contactSheet: 'contact.jpg', shots: [
    { input: 'before.webm', crop: { x: 10, y: 20, width: 960, height: 540 }, durationMs: 1000 },
    { input: 'after.webm', crop: { x: 30, y: 40, width: 1280, height: 720 }, durationMs: 1000 },
  ] }).contactSheet.join(' ');
  assert.match(args, /\[0:v\]crop=960:540:10:20,scale=640:360/);
  assert.match(args, /\[1:v\]crop=1280:720:30:40,scale=640:360/);
  assert.match(args, /hstack=inputs=2/);
});
test('generated contact-sheet ffmpeg args execute', () => {
  const dir = path.join(root, '.tmp', 'demo', `ffmpeg-sheet-${Date.now()}`);
  fs.mkdirSync(dir, { recursive: true });
  for (const [name, color] of [['before.mp4', 'red'], ['after.mp4', 'blue']]) {
    const made = cp.spawnSync('ffmpeg', ['-loglevel', 'error', '-f', 'lavfi', '-i', `color=c=${color}:s=640x360:r=30`, '-t', '1', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-y', name], { cwd: dir, encoding: 'utf8' });
    assert.equal(made.status, 0, made.stderr);
  }
  const args = buildFfmpegArgs({ output: 'demo.mp4', contactSheet: 'contact.jpg', shots: [
    { input: 'before.mp4', crop: { x: 0, y: 0, width: 640, height: 360 }, durationMs: 500 },
    { input: 'after.mp4', crop: { x: 0, y: 0, width: 640, height: 360 }, durationMs: 500 },
  ] });
  const result = cp.spawnSync('ffmpeg', ['-loglevel', 'error', ...args.contactSheet], { cwd: dir, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  fs.rmSync(dir, { recursive: true, force: true });
});
test('generated ffmpeg args execute push-in and concat', () => {
  const dir = path.join(root, '.tmp', 'demo', `ffmpeg-probe-${Date.now()}`);
  fs.mkdirSync(dir, { recursive: true });
  for (const [name, color] of [['before.mp4', 'red'], ['after.mp4', 'blue']]) {
    const made = cp.spawnSync('ffmpeg', ['-loglevel', 'error', '-f', 'lavfi', '-i', `color=c=${color}:s=640x360:r=30`, '-t', '1', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-y', name], { cwd: dir, encoding: 'utf8' });
    assert.equal(made.status, 0, made.stderr);
  }
  const args = buildFfmpegArgs({ output: 'demo.mp4', shots: [
    { input: 'before.mp4', crop: { x: 0, y: 0, width: 640, height: 360 }, durationMs: 500, zoom: 'push-in' },
    { input: 'after.mp4', crop: { x: 0, y: 0, width: 640, height: 360 }, durationMs: 500, zoom: 'static' },
  ] });
  const result = cp.spawnSync('ffmpeg', ['-loglevel', 'error', ...args.video], { cwd: dir, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  fs.rmSync(dir, { recursive: true, force: true });
});
test('recording closes each shot context before saving video', async () => {
  const actions = [], contexts = [];
  const page = {
    clock: {
      install: async options => actions.push(['clock', options]),
      fastForward: async durationMs => actions.push(['fastForward', durationMs]),
    },
    goto: async () => {}, evaluate: async (_callback, value) => { if (value?.x !== undefined) actions.push(['scroll', value]); },
    locator: () => ({ click: async () => actions.push('click'), first: () => ({
      waitFor: async () => actions.push('waitFor'),
      boundingBox: async () => { actions.push('boundingBox'); return { x: 10, y: 10, width: 320, height: 180 }; },
    }) }),
    video: () => ({ saveAs: async () => { assert.equal(actions.at(-1), 'close'); actions.push('save'); } }),
    mouse: { move: async (...args) => actions.push(['mouse', ...args]) },
  };
  const browser = {
    newContext: async options => {
      const context = { options, newPage: async () => page, close: async () => actions.push('close') };
      contexts.push(context);
      return context;
    },
    close: async () => {},
  };
  const changed = structuredClone(recipe);
  changed.comparison.composition.enabled = false;
  changed.comparison.shots[1].action = 'click';
  const dir = path.join(root, '.tmp', 'demo', `lifecycle-${Date.now()}`);
  fs.mkdirSync(dir, { recursive: true });
  await captureComparison(changed, dir, { playwright: { chromium: { launch: async () => browser } } });
  assert.equal(contexts.filter(item => item.options.recordVideo).length, recipe.comparison.shots.length);
  assert.equal(actions.filter(item => item === 'save').length, recipe.comparison.shots.length);
  assert.equal(actions.filter(item => Array.isArray(item) && item[0] === 'clock').length, recipe.comparison.shots.length * 2);
  assert.deepEqual(
    actions.filter(item => Array.isArray(item) && item[0] === 'fastForward').map(item => item[1]),
    recipe.comparison.shots.map(shot => shot.durationMs),
  );
  assert.ok(actions.some(item => Array.isArray(item) && item[0] === 'scroll'));
  assert.ok(actions.some(item => Array.isArray(item) && item[0] === 'mouse' && item[1] === 170 && item[2] === 100));
  assert.ok(actions.includes('click'));
  for (const [index, action] of actions.entries()) {
    if (action === 'boundingBox') assert.equal(actions[index - 1], 'waitFor');
  }
  fs.rmSync(dir, { recursive: true, force: true });
});
test('manifest refuses SUCCESS when a requirement lacks pass evidence', () => {
  const dir = path.join(root, '.tmp', 'demo', `manifest-${Date.now()}`);
  fs.mkdirSync(dir, { recursive: true });
  assert.throws(() => manifest(dir, recipe, { events: [], overlays: [] }, 'SUCCESS'), /without pass evidence/);
  fs.rmSync(dir, { recursive: true, force: true });
});
test('manifest refuses SUCCESS when requirement evidence is only skipped or missing an outcome', () => {
  for (const event of [
    { requirementId: 'REQ-1', stepId: 'step-1', outcome: 'skipped' },
    { requirementId: 'REQ-1', stepId: 'step-1' },
  ]) {
    const dir = path.join(root, '.tmp', 'demo', `manifest-outcome-${Date.now()}-${event.outcome || 'missing'}`);
    fs.mkdirSync(dir, { recursive: true });
    assert.throws(() => manifest(dir, recipe, { events: [event], overlays: [] }, 'SUCCESS'), /without pass evidence/);
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
test('CLI reports SUCCESS only when every requirement has pass evidence', () => {
  const requirements = [{ id: 'REQ-1' }, { id: 'REQ-2' }];
  assert.equal(captureStatus([], requirements), 'ASSERTION_FAILED');
  assert.equal(captureStatus([{ requirementId: 'REQ-1', outcome: 'pass' }], requirements), 'ASSERTION_FAILED');
  assert.equal(captureStatus([
    { requirementId: 'REQ-1', outcome: 'pass' },
    { requirementId: 'REQ-2', outcome: 'skipped' },
  ], requirements), 'ASSERTION_FAILED');
  assert.equal(captureStatus([
    { requirementId: 'REQ-1', outcome: 'pass' },
    { requirementId: 'REQ-2', outcome: 'pass' },
  ], requirements), 'SUCCESS');
  assert.equal(captureStatus([
    { requirementId: 'REQ-1', outcome: 'pass' },
    { requirementId: 'REQ-2', outcome: 'pass' },
    { requirementId: 'REQ-2', outcome: 'fail' },
  ], requirements), 'ASSERTION_FAILED');
});
test('legacy capture rejects unsafe navigation before goto', async () => {
  for (const action of ['navigate', 'assert-url']) {
    for (const url of ['javascript:alert(1)', '//evil.test/path', String.raw`/\evil.test/path`]) {
      const changed = structuredClone(recipe);
      changed.comparison.status = 'current-behavior';
      changed.requirements[0].steps = [{ id: 'step-1', action, url }];
      const navigated = [];
      const page = {
        evaluate: async () => [],
        goto: async value => navigated.push(value),
        url: () => changed.target.url,
      };
      const browser = {
        newContext: async () => ({ newPage: async () => page, close: async () => {} }),
        close: async () => {},
      };
      const result = await captureLegacy(changed, path.join(root, '.tmp', 'demo', `legacy-origin-${Date.now()}`), [{ name: 'standard', width: 1440, height: 900 }], {
        playwright: { chromium: { launch: async () => browser } },
      });
      assert.equal(result.events[0].outcome, 'fail');
      assert.deepEqual(navigated, []);
    }
  }
});
test('legacy command targets use argv execution without a shell', async () => {
  const changed = structuredClone(recipe);
  changed.comparison.status = 'current-behavior';
  changed.target = { command: ['/usr/bin/true'], healthUrl: 'http://127.0.0.1:3000' };
  changed.timeouts.startupMs = 5;
  changed.requirements[0].steps = [{ id: 'step-1', action: 'navigate', url: '/' }];
  const calls = [];
  const childProcess = {
    execFile: (...args) => {
      calls.push(args);
      return { kill: () => {} };
    },
  };
  const page = { evaluate: async () => [], goto: async () => {}, url: () => changed.target.healthUrl };
  const browser = {
    newContext: async () => ({ newPage: async () => page, close: async () => {} }),
    close: async () => {},
  };
  await captureLegacy(changed, path.join(root, '.tmp', 'demo', `legacy-argv-${Date.now()}`), [{ name: 'standard', width: 1440, height: 900 }], {
    childProcess,
    fetch: async () => ({ ok: true }),
    playwright: { chromium: { launch: async () => browser } },
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], '/usr/bin/true');
  assert.deepEqual(calls[0][1], []);
  assert.notEqual(calls[0][2].shell, true);
});
test('legacy command capture validates, probes, and navigates with one canonical origin', async () => {
  const changed = structuredClone(recipe);
  changed.comparison.status = 'current-behavior';
  changed.target = {
    command: ['/usr/bin/true'],
    url: 'http://127.0.0.1:3100/app',
    healthUrl: 'http://127.0.0.1:3200/health',
  };
  changed.requirements[0].steps = [{ id: 'step-1', action: 'navigate', url: '/dashboard' }];
  assert.equal(validate(changed).ok, false);
  changed.target.healthUrl = 'http://127.0.0.1:3100/health';
  assert.equal(validate(changed).ok, true);
  const probes = [];
  const navigated = [];
  const page = {
    evaluate: async () => [],
    goto: async value => navigated.push(value),
    url: () => navigated.at(-1),
  };
  const browser = {
    newContext: async () => ({ newPage: async () => page, close: async () => {} }),
    close: async () => {},
  };
  await captureLegacy(changed, path.join(root, '.tmp', 'demo', `legacy-canonical-origin-${Date.now()}`), [{ name: 'standard', width: 1440, height: 900 }], {
    childProcess: { execFile: () => ({ kill: () => {} }) },
    fetch: async value => { probes.push(value); return { ok: true }; },
    playwright: { chromium: { launch: async () => browser } },
  });
  assert.deepEqual(probes, [changed.target.healthUrl]);
  assert.deepEqual(navigated, ['http://127.0.0.1:3100/dashboard']);
  assert.equal(new URL(navigated[0]).origin, new URL(changed.target.url).origin);
});
test('legacy screenshot paths remain inside the run directory', async () => {
  const changed = structuredClone(recipe);
  changed.comparison.status = 'current-behavior';
  changed.viewports = [{ name: '../escape', width: 1440, height: 900 }];
  changed.requirements[0].steps = [{ id: 'step-1', action: 'screenshot' }];
  assert.equal(validate(changed).ok, false);
  const run = path.join(root, '.tmp', 'demo', `legacy-shot-${Date.now()}`);
  const outside = path.join(path.dirname(run), 'escape-REQ-1-step-1.png');
  fs.mkdirSync(run, { recursive: true });
  const page = {
    evaluate: async () => [],
    screenshot: async options => fs.writeFileSync(options.path, 'shot'),
    url: () => changed.target.url,
  };
  const browser = {
    newContext: async () => ({ newPage: async () => page, close: async () => {} }),
    close: async () => {},
  };
  await captureLegacy(changed, run, changed.viewports, {
    playwright: { chromium: { launch: async () => browser } },
  });
  assert.equal(fs.existsSync(outside), false);
  assert.equal(fs.existsSync(path.join(run, 'escape-REQ-1-step-1.png')), true);
  fs.rmSync(run, { recursive: true, force: true });
  fs.rmSync(outside, { force: true });
});
test('legacy wait-for uses a locator condition instead of a timeout', async () => {
  const changed = structuredClone(recipe);
  changed.comparison.status = 'current-behavior';
  changed.requirements[0].steps = [{ id: 'step-1', action: 'wait-for', selector: '#ready' }];
  const waits = [];
  const page = {
    evaluate: async () => [],
    locator: selector => ({ waitFor: async options => waits.push([selector, options]) }),
    url: () => changed.target.url,
  };
  const browser = {
    newContext: async () => ({ newPage: async () => page, close: async () => {} }),
    close: async () => {},
  };
  const result = await captureLegacy(changed, path.join(root, '.tmp', 'demo', `legacy-wait-${Date.now()}`), changed.viewports, {
    playwright: { chromium: { launch: async () => browser } },
  });
  assert.equal(result.events[0].outcome, 'pass');
  assert.deepEqual(waits, [['#ready', { state: 'visible' }]]);
});
test('Python union crop matches the JavaScript runtime on shared fixtures', () => {
  const fixtures = [
    [{ x: 100, y: 100, width: 200, height: 100 }, { x: 140, y: 90, width: 260, height: 160 }, { width: 1440, height: 900 }, 32],
    [{ x: 0, y: 0, width: 21, height: 17 }, { x: 1231, y: 697, width: 209, height: 203 }, { width: 1440, height: 900 }, 7],
    [{ x: 19.5, y: 20.5, width: 301, height: 99 }, { x: 44, y: 88, width: 111, height: 222 }, { width: 1280, height: 720 }, 16],
  ];
  const script = [
    'import importlib.util,json,sys',
    "spec=importlib.util.spec_from_file_location('prime',sys.argv[1])",
    'mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)',
    'fixtures=json.loads(sys.stdin.read())',
    "print(json.dumps([mod.union_crop(*x) for x in fixtures],separators=(',',':')))",
  ].join(';');
  const result = cp.spawnSync('python3', ['-c', script, primeReference], { input: JSON.stringify(fixtures), encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), fixtures.map(args => unionCrop16x9(...args)));
});
test('Prime recording waits for visible focus before reading its bounding box', () => {
  const source = fs.readFileSync(primeReference, 'utf8');
  const visible = source.indexOf('focus.wait_for(state="visible")');
  const bounds = source.indexOf('bounds = focus.bounding_box()');
  assert.ok(visible >= 0 && visible < bounds);
});
test('comparison runtimes advance an installed clock instead of waiting in real time', () => {
  const primeSource = fs.readFileSync(primeReference, 'utf8');
  const nodeSource = fs.readFileSync(comparisonSource, 'utf8');
  assert.match(primeSource, /page\.clock\.fast_forward\(duration_ms\)/);
  assert.match(nodeSource, /page\.clock\.fastForward\(shot\.durationMs\)/);
  assert.doesNotMatch(`${primeSource}\n${nodeSource}`, /waitForTimeout|wait_for_timeout/);
});

test('mutating viewport after approval exits 33', () => {
  const id = `test-mutation-viewport-${Date.now()}`;
  const dir = path.join(root, '.tmp', 'demo', id);
  assert.equal(cli(['review', '--recipe', 'references/recipe-example.json', '--run-id', id]).status, 0);
  assert.equal(cli(['approve', '--run-id', id, '--reviewer', 'test']).status, 0);
  const changed = structuredClone(recipe);
  changed.viewports[0].width = 1280;
  const file = path.join(dir, 'changed.json');
  fs.writeFileSync(file, JSON.stringify(changed));
  assert.equal(cli(['run', '--recipe', file, '--run-id', id]).status, 33);
  removeRun(id);
});

test('mutating composition after approval exits 33', () => {
  const id = `test-mutation-composition-${Date.now()}`;
  const dir = path.join(root, '.tmp', 'demo', id);
  assert.equal(cli(['review', '--recipe', 'references/recipe-example.json', '--run-id', id]).status, 0);
  assert.equal(cli(['approve', '--run-id', id, '--reviewer', 'test']).status, 0);
  const changed = structuredClone(recipe);
  changed.comparison.composition.padding = 64;
  const file = path.join(dir, 'changed.json');
  fs.writeFileSync(file, JSON.stringify(changed));
  assert.equal(cli(['run', '--recipe', file, '--run-id', id]).status, 33);
  removeRun(id);
});
