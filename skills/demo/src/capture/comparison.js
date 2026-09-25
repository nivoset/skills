const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const {unionCrop16x9}=require('./geometry');
const {buildFfmpegArgs}=require('../compose/ffmpeg');
const {resolveSameOriginRoute}=require('../comparison/validate');

const resolveUrl=(base,route)=>{
  const url=resolveSameOriginRoute(base,route);
  if(!url)throw new TypeError('shot.route must be a same-origin relative path');
  return url;
};

async function preparePage(context,target,shot){
  const page=await context.newPage();
  if(page.clock?.install)await page.clock.install({time:'2026-01-01T00:00:00Z'});
  await page.goto(resolveUrl(target.url,shot.route),{waitUntil:'domcontentloaded'});
  await page.evaluate(({x,y})=>scrollTo(x,y),shot.scroll||{x:0,y:0});
  const locator=page.locator(shot.focusSelector).first();
  await locator.waitFor({state:'visible'});
  const bounds=await locator.boundingBox();
  if(!bounds)throw new Error(`focus selector has no bounding box: ${shot.focusSelector}`);
  return {page,bounds};
}

async function preflight(browser,comparison,viewport){
  const boxes=[];
  for(const shot of comparison.shots){
    const context=await browser.newContext({viewport});
    try{boxes.push((await preparePage(context,comparison.targets[shot.phase],shot)).bounds)}
    finally{await context.close()}
  }
  const before=boxes.filter((_,i)=>comparison.shots[i].phase==='before');
  const after=boxes.filter((_,i)=>comparison.shots[i].phase==='after');
  const union=(items)=>items.reduce((a,b)=>({x:Math.min(a.x,b.x),y:Math.min(a.y,b.y),width:Math.max(a.x+a.width,b.x+b.width)-Math.min(a.x,b.x),height:Math.max(a.y+a.height,b.y+b.height)-Math.min(a.y,b.y)}));
  return unionCrop16x9(union(before),union(after),viewport,comparison.composition?.padding??32);
}

async function captureComparison(recipe,run,options={}){
  let playwright=options.playwright;
  if(!playwright){
    try{playwright=require('@playwright/test')}catch{throw Object.assign(new Error('Playwright is not installed; run npm install in skills/demo and install Chromium'),{code:'BLOCKED'})}
  }
  const comparison=recipe.comparison;
  if(Object.values(comparison.targets).some(target=>target.command))throw Object.assign(new Error('before-after command targets are not supported safely in this runtime; start both targets and supply explicit URLs'),{code:'BLOCKED'});
  const viewport={width:(recipe.viewports?.[0]||{width:1440}).width,height:(recipe.viewports?.[0]||{height:900}).height};
  const browser=await playwright.chromium.launch({headless:true});
  const shotsDir=path.join(run,'shots');fs.mkdirSync(shotsDir,{recursive:true});
  const events=[];let crop;
  try{
    crop=await preflight(browser,comparison,viewport);
    for(const [index,shot] of comparison.shots.entries()){
      const context=await browser.newContext({viewport,recordVideo:{dir:path.join(run,'.video'),size:viewport}});
      let page,video;
      try{
        let bounds;
        ({page,bounds}=await preparePage(context,comparison.targets[shot.phase],shot));
        video=page.video();
        await page.evaluate(({annotation,crop})=>{
          const label=document.createElement('div');label.dataset.demoPhase='true';label.textContent=annotation;
          Object.assign(label.style,{position:'fixed',top:`${crop.y+24}px`,left:`${crop.x+24}px`,zIndex:'2147483647',padding:'12px 18px',background:'#111',color:'#fff',font:'bold 28px/1 sans-serif',letterSpacing:'2px',border:'3px solid #fff',borderRadius:'6px'});
          document.body.append(label);
        },{annotation:shot.annotation,crop});
        await page.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2,{steps:12});
        if(shot.action==='click')await page.locator(shot.focusSelector).click();
        await page.clock.fastForward(shot.durationMs);
      }finally{await context.close()}
      const file=path.join('shots',`${String(index+1).padStart(3,'0')}-${shot.phase}.webm`);
      await video.saveAs(path.join(run,file));
      events.push({shot:index+1,requirementId:shot.requirementId,stepId:shot.stepId,phase:shot.phase,route:shot.route,focusSelector:shot.focusSelector,annotation:shot.annotation,durationMs:shot.durationMs,crop,file,outcome:'pass'});
    }
  }finally{await browser.close()}
  let artifacts={mp4:null,contactSheet:null};
  if(comparison.composition?.enabled){
    const composition={output:comparison.composition.output,contactSheet:comparison.composition.contactSheet,shots:events.map((event,index)=>({input:event.file,crop,durationMs:comparison.shots[index].durationMs,zoom:comparison.shots[index].zoom||'static'}))};
    const args=buildFfmpegArgs(composition);
    const video=cp.spawnSync('ffmpeg',args.video,{cwd:run,encoding:'utf8'});
    if(video.status!==0)throw Object.assign(new Error(`ffmpeg composition failed: ${video.stderr}`),{code:'ARTIFACT_FAILED'});
    if(args.contactSheet){const sheet=cp.spawnSync('ffmpeg',args.contactSheet,{cwd:run,encoding:'utf8'});if(sheet.status!==0)throw Object.assign(new Error(`ffmpeg contact sheet failed: ${sheet.stderr}`),{code:'ARTIFACT_FAILED'})}
    artifacts={mp4:path.join(run,composition.output),contactSheet:composition.contactSheet?path.join(run,composition.contactSheet):null};
  }
  return {events,overlays:[],shots:events,artifacts,crop};
}

module.exports={captureComparison};
