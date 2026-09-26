const cp=require('node:child_process');
const path=require('node:path');
const {resolveSameOriginUrl}=require('../comparison/validate');
const {isContained}=require('../recipe/validate');

const ROOT=path.resolve(__dirname,'../..');

async function captureLegacy(recipe,run,viewports,options={}){
  let playwright=options.playwright;
  if(!playwright)try{playwright=require('@playwright/test')}catch{throw Object.assign(new Error('Playwright is not installed; run npm install'),{code:'BLOCKED'})}
  const {chromium}=playwright;
  const childProcess=options.childProcess||cp;
  const fetchTarget=options.fetch||fetch;
  const target=recipe.target;
  let server=null;
  const base=target.url||target.healthUrl;
  const health=target.healthUrl||base;
  if(target.command){
    let ready=false;
    server=childProcess.execFile(target.command[0],target.command.slice(1),{cwd:path.resolve(ROOT,target.cwd||ROOT),env:{...process.env,DEMO_RUN_ID:path.basename(run)},shell:false});
    const deadline=Date.now()+(recipe.timeouts?.startupMs||30000);
    while(Date.now()<deadline){
      try{const response=await fetchTarget(health);if(response.ok){ready=true;break}}catch{}
      await new Promise(resolve=>setTimeout(resolve,250));
    }
    if(!ready){server.kill('SIGTERM');throw Object.assign(new Error('target health check timed out'),{code:'TARGET_START_FAILED'})}
  }
  const browser=await chromium.launch({headless:true});
  const events=[];
  const overlays=[];
  try{
    for(const view of viewports){
      const context=await browser.newContext({viewport:{width:view.width,height:view.height},recordVideo:{dir:path.join(run,'video')}});
      const page=await context.newPage();
      for(const requirement of recipe.requirements){
        for(const step of requirement.steps){
          const started=Date.now();
          let outcome='pass';
          let error=null;
          try{
            await page.evaluate(text=>{
              document.querySelector('[data-demo-caption]')?.remove();
              const element=document.createElement('div');
              element.dataset.demoCaption='true';
              element.setAttribute('aria-hidden','true');
              element.textContent=text;
              Object.assign(element.style,{position:'fixed',bottom:'16px',left:'16px',zIndex:2147483647,background:'#111',color:'#fff',padding:'10px 14px',font:'16px sans-serif',borderRadius:'4px'});
              document.body.append(element);
            },step.narration||`${step.action} for ${requirement.id}`);
            if(recipe.redaction?.requiredSelectors?.length){
              const missing=await page.evaluate(selectors=>{
                const absent=[];
                for(const selector of selectors){
                  const element=document.querySelector(selector);
                  if(!element)absent.push(selector);
                  else{
                    element.setAttribute('data-demo-redacted','true');
                    element.style.setProperty('color','transparent','important');
                    element.style.setProperty('background','#111','important');
                  }
                }
                return absent;
              },recipe.redaction.requiredSelectors);
              if(missing.length&&recipe.redaction.onFailure==='block')throw Object.assign(new Error(`required redaction selector not found: ${missing.join(',')}`),{code:'REDACTION_FAILED'});
            }
            const resolvedUrl=['navigate','assert-url'].includes(step.action)&&resolveSameOriginUrl(base,step.url);
            if(['navigate','assert-url'].includes(step.action)&&!resolvedUrl)throw new Error('URL must stay on the target origin');
            if(step.action==='navigate')await page.goto(resolvedUrl);
            else if(step.action==='click')await page.locator(step.selector).click({timeout:recipe.timeouts?.actionMs||5000});
            else if(step.action==='fill')await page.locator(step.selector).fill(String(step.value??''));
            else if(step.action==='select')await page.locator(step.selector).selectOption(String(step.value));
            else if(step.action==='wait-for'){
              if(step.selector)await page.locator(step.selector).waitFor({state:'visible'});
              else await page.waitForURL(resolveSameOriginUrl(base,step.url));
            }
            else if(step.action==='screenshot'){
              const dest=path.join(run,path.basename(`${view.name}-${requirement.id}-${step.id}.png`));
              if(!isContained(run,dest))throw new Error('screenshot path escapes run directory');
              await page.screenshot({path:dest});
            }
            else if(step.action==='assert-visible')await page.locator(step.selector).waitFor({state:'visible'});
            else if(step.action==='assert-text'&&!await page.locator(step.selector).getByText(String(step.text)).count())throw new Error('text not found');
            else if(step.action==='assert-url'&&page.url()!==resolvedUrl)throw new Error('URL mismatch');
            if(step.highlight||recipe.overlay?.highlights){
              try{
                await page.evaluate(selector=>{
                  const element=document.querySelector(selector);
                  if(!element)throw new Error('selector not found');
                  const overlay=document.createElement('div');
                  overlay.dataset.demoOverlay='highlight';
                  const bounds=element.getBoundingClientRect();
                  Object.assign(overlay.style,{position:'fixed',zIndex:2147483646,pointerEvents:'none',border:'3px solid #ffb000',boxShadow:'0 0 0 3px #111',left:`${bounds.left}px`,top:`${bounds.top}px`,width:`${bounds.width}px`,height:`${bounds.height}px`});
                  document.body.append(overlay);
                },step.selector);
                overlays.push({requirementId:requirement.id,stepId:step.id||step.action,status:'pass'});
              }catch(cause){overlays.push({requirementId:requirement.id,stepId:step.id||step.action,status:'failed',error:cause.message})}
            }
          }catch(cause){outcome='fail';error=cause.message}
          const ended=Date.now();
          events.push({requirementId:requirement.id,stepId:step.id||step.action,action:step.action,outcome,error,url:page.url(),viewport:view.name,startMs:started,endMs:ended,narration:{stepId:step.id||step.action,text:step.narration||`${step.action} for ${requirement.id}`,startMs:started,endMs:ended}});
          if(outcome==='fail'&&recipe.stopOnFailure)break;
        }
      }
      await context.close();
    }
  }finally{
    await browser.close();
    if(server)server.kill('SIGTERM');
  }
  return {events,overlays};
}

module.exports={captureLegacy};
