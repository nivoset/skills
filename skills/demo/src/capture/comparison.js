const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
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

// Scale the rendered document into the recorded viewport after the one real interaction.
async function fitPage(page,viewport){
  if(!Number.isInteger(viewport.width)||!Number.isInteger(viewport.height)||viewport.width<=0||viewport.height<=0)throw new TypeError('recording viewport must contain positive integer dimensions');
  return page.evaluate(({width,height})=>{
    const doc=document.documentElement;
    const key=Symbol.for('demo.capture.originalTransform');
    if(!doc[key]||doc.style.transform!==doc[key].applied)doc[key]={original:doc.style.transform};
    const original=doc[key].original;
    doc.style.transform=original;
    let pageWidth,pageHeight,transform,origin,layoutX=0,layoutY=0;
    try{
      const computed=typeof getComputedStyle==='function'?getComputedStyle(doc):null;
      transform=computed?.transform||original;
      origin=computed?.transformOrigin||'0px 0px';
      // A transformed root can inflate body.scrollWidth/Height. Measure the
      // document and its layout offset without that transform.
      doc.style.transform='none';
      scrollTo(0,0);
      const layout=doc.getBoundingClientRect?.();
      layoutX=layout?.left||0;
      layoutY=layout?.top||0;
      pageWidth=Math.max(doc.scrollWidth,document.body?.scrollWidth||0);
      pageHeight=Math.max(doc.scrollHeight,document.body?.scrollHeight||0);
    }finally{doc.style.transform=original}
    if(!Number.isFinite(pageWidth)||!Number.isFinite(pageHeight)||pageWidth<=0||pageHeight<=0||pageWidth>8192||pageHeight>8192)throw new TypeError('full page dimensions must be positive and at most 8192');
    const [ox,oy]=origin.split(/\s+/).map(parseFloat);
    const originX=Number.isFinite(ox)?ox:0,originY=Number.isFinite(oy)?oy:0;
    let a=1,b=0,c=0,d=1,e=0,f=0;
    if(transform&&transform!=='none'){
      if(typeof DOMMatrix==='function'){
        const matrix=new DOMMatrix(transform);
        if(!matrix.is2D)throw new TypeError('full page 3D transforms are not supported');
        ({a,b,c,d,e,f}=matrix);
      }else{
        const values=/^matrix\(([^)]+)\)$/.exec(transform)?.[1].split(',').map(Number);
        if(values?.length===6)[a,b,c,d,e,f]=values;
      }
    }
    const corners=[[0,0],[pageWidth,0],[0,pageHeight],[pageWidth,pageHeight]].map(([x,y])=>[
      originX+a*(x-originX)+c*(y-originY)+e,
      originY+b*(x-originX)+d*(y-originY)+f,
    ]);
    const xs=corners.map(point=>point[0]),ys=corners.map(point=>point[1]);
    const minX=Math.min(...xs),minY=Math.min(...ys);
    const boundsWidth=Math.max(...xs)-minX,boundsHeight=Math.max(...ys)-minY;
    if(!Number.isFinite(boundsWidth)||!Number.isFinite(boundsHeight)||boundsWidth<=0||boundsHeight<=0)throw new TypeError('full page transformed bounds must be positive and finite');
    const scale=Math.min(1,width/boundsWidth,height/boundsHeight);
    // CSS transform-origin applies to the entire transform list, including
    // our fit. Compensate for it rather than changing the page's own origin.
    const tx=scale*(originX-minX)-originX-layoutX,ty=scale*(originY-minY)-originY-layoutY;
    const translation=Math.abs(tx)>1e-9||Math.abs(ty)>1e-9?`translate(${tx}px, ${ty}px) `:'';
    doc.style.transform=`${translation}scale(${scale})${transform&&transform!=='none'?` ${original||transform}`:''}`;
    doc[key].applied=doc.style.transform;
    scrollTo(0,0);
    return {width:pageWidth,height:pageHeight,scale};
  },viewport);
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
  const events=[];
  try{
    for(const [index,shot] of comparison.shots.entries()){
      const crop={x:0,y:0,width:viewport.width,height:viewport.height};
      const context=await browser.newContext({viewport,recordVideo:{dir:path.join(run,'.video'),size:viewport}});
      let page,video,pageSize;
      try{
        let bounds;
        ({page,bounds}=await preparePage(context,comparison.targets[shot.phase],shot));
        video=page.video();
        await page.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2,{steps:12});
        if(shot.action==='click'){
          await page.locator(shot.focusSelector).click();
          if(page.waitForLoadState)await page.waitForLoadState('domcontentloaded');
        }
        await page.evaluate(({annotation,crop})=>{
          const label=document.createElement('div');label.dataset.demoPhase='true';label.textContent=annotation;
          Object.assign(label.style,{position:'fixed',top:`${crop.y+24}px`,left:`${crop.x+24}px`,zIndex:'2147483647',padding:'12px 18px',background:'#111',color:'#fff',font:'bold 28px/1 sans-serif',letterSpacing:'2px',border:'3px solid #fff',borderRadius:'6px'});
          document.body.append(label);
        },{annotation:shot.annotation,crop});
        pageSize=await fitPage(page,viewport);
        await page.clock.fastForward(shot.durationMs);
        await new Promise(resolve=>setTimeout(resolve,shot.durationMs));
      }finally{await context.close()}
      const file=path.join('shots',`${String(index+1).padStart(3,'0')}-${shot.phase}.webm`);
      await video.saveAs(path.join(run,file));
      events.push({shot:index+1,requirementId:shot.requirementId,stepId:shot.stepId,phase:shot.phase,route:shot.route,focusSelector:shot.focusSelector,annotation:shot.annotation,durationMs:shot.durationMs,framing:'full-page',pageSize,crop,file,outcome:'pass'});
    }
  }finally{await browser.close()}
  let artifacts={mp4:null,contactSheet:null};
  if(comparison.composition?.enabled){
    const composition={output:comparison.composition.output,contactSheet:comparison.composition.contactSheet,shots:events.map((event,index)=>({input:event.file,framing:'full-page',crop:event.crop,durationMs:comparison.shots[index].durationMs,zoom:'static'}))};
    const args=buildFfmpegArgs(composition);
    const video=cp.spawnSync('ffmpeg',args.video,{cwd:run,encoding:'utf8'});
    if(video.status!==0)throw Object.assign(new Error(`ffmpeg composition failed: ${video.stderr}`),{code:'ARTIFACT_FAILED'});
    if(args.contactSheet){const sheet=cp.spawnSync('ffmpeg',args.contactSheet,{cwd:run,encoding:'utf8'});if(sheet.status!==0)throw Object.assign(new Error(`ffmpeg contact sheet failed: ${sheet.stderr}`),{code:'ARTIFACT_FAILED'})}
    artifacts={mp4:path.join(run,composition.output),contactSheet:composition.contactSheet?path.join(run,composition.contactSheet):null};
  }
  return {events,overlays:[],shots:events,artifacts,crop:events[0]?.crop};
}

module.exports={captureComparison,fitPage};
