const cp=require('node:child_process');
const crypto=require('node:crypto');
const fs=require('node:fs');
const path=require('node:path');

const captureStatus=(events,requirements)=>{
  const everyRequirementPassed=(requirements||[]).length>0&&(requirements||[]).every(requirement=>
    events.some(event=>event.requirementId===requirement.id&&event.outcome==='pass'));
  return everyRequirementPassed&&!events.some(event=>event.outcome==='fail')?'SUCCESS':'ASSERTION_FAILED';
};

function createMain(deps){
  const {ROOT,DEMO_ROOT,VERSION,CODES,validate,canon,option,resolveRun,runId,ignored,read,review,approval,capture,manifest,recipeHash,assertRecipeMatchesApprovedReview}=deps;
  const fail=(message,code=1)=>{console.error(`ERROR: ${message}`);process.exitCode=code};

  return async function main(argv=process.argv.slice(2)){
    const [command,...args]=argv;
    if(command==='--help'||!command){
      console.log('demo validate --recipe FILE | review --recipe FILE --run-id ID | approve --run-id ID --reviewer NAME | run --recipe FILE [--run-id ID] | verify-manifest --run-id ID|--latest | doctor');
      return;
    }
    if(command==='doctor'){
      console.log(`demo ${VERSION}`);
      let blocked=false;
      try{require('@playwright/test');console.log('playwright: ok')}catch{console.error('playwright: missing (install package dependencies and Chromium locally)');blocked=true}
      const ffmpeg=cp.spawnSync('ffmpeg',['-hide_banner','-filters'],{encoding:'utf8'});
      if(ffmpeg.status===0){
        const filters=ffmpeg.stdout+ffmpeg.stderr;
        const required=['crop','scale','overlay','tpad','concat','zoompan'];
        const missing=required.filter(filter=>!new RegExp(`\\b${filter}\\b`).test(filters));
        console.log(`ffmpeg: ok (${required.filter(filter=>!missing.includes(filter)).join(', ')})`);
        if(missing.length){console.error(`ffmpeg filters missing: ${missing.join(', ')}`);blocked=true}
        const encoders=cp.spawnSync('ffmpeg',['-hide_banner','-encoders'],{encoding:'utf8'});
        if(!/\blibx264\b/.test(encoders.stdout+encoders.stderr)){console.error('ffmpeg H.264 encoder libx264: missing');blocked=true}
        else console.log('ffmpeg H.264 encoder libx264: ok');
      }else{
        console.error('ffmpeg: missing');
        blocked=true;
      }
      if(blocked)process.exitCode=CODES.BLOCKED;
      return;
    }

    let recipeFile;
    try{recipeFile=option(args,'--recipe',{required:['validate','review','run'].includes(command)})}
    catch(error){return fail(error.message,CODES.NEEDS_CLARIFICATION)}

    if(command==='validate'){
      try{
        const result=validate(read(recipeFile));
        if(!result.ok){console.error(result.errors.join('\n'));process.exitCode=CODES.BLOCKED}
        else console.log(JSON.stringify({valid:true,viewports:result.viewports}));
      }catch(error){fail(error.message,CODES.BLOCKED)}
      return;
    }

    if(command==='review'){
      let id;
      try{id=option(args,'--run-id',{required:true})}catch(error){return fail(error.message,CODES.NEEDS_CLARIFICATION)}
      let run;
      try{run=resolveRun(id)}catch(error){return fail(error.message,CODES.NEEDS_CLARIFICATION)}
      const recipe=read(recipeFile);
      const result=validate(recipe);
      if(!result.ok)return fail(result.errors.join('\n'),CODES.BLOCKED);
      if(!recipe.source?.changeId&&!recipe.source?.citation)return fail('source.changeId or source.citation is required for review provenance',CODES.NEEDS_CLARIFICATION);
      if(!ignored(run))return fail('run root is not ignored',CODES.ARTIFACT_FAILED);
      fs.mkdirSync(run,{recursive:true});
      const featureHash=review(run,recipe);
      const approvedRecipeHash=recipeHash(recipe,canon);
      fs.writeFileSync(path.join(run,'review','review.json'),JSON.stringify({runId:id,featureHash,recipeHash:approvedRecipeHash,status:'pending',review:'operator-review-required'},null,2));
      console.log(`RUN_ID=${id}\nFEATURE_HASH=${featureHash}\nRECIPE_HASH=${approvedRecipeHash}`);
      return;
    }

    if(command==='approve'){
      let id,reviewer;
      try{id=option(args,'--run-id',{required:true});reviewer=option(args,'--reviewer',{required:true})}
      catch(error){return fail(error.message,CODES.NEEDS_CLARIFICATION)}
      let run;
      try{run=resolveRun(id)}catch(error){return fail(error.message,CODES.NEEDS_CLARIFICATION)}
      const metadataFile=path.join(run,'review','review.json');
      if(!fs.existsSync(metadataFile))return fail('review not found',CODES.NEEDS_CLARIFICATION);
      const metadata=read(metadataFile);
      const reviewFile=fs.readFileSync(path.join(run,'review','demo.feature.review'));
      const featureHash=crypto.createHash('sha256').update(reviewFile).digest('hex');
      if(featureHash!==metadata.featureHash||!metadata.recipeHash||!reviewFile.includes(`canonical-recipe-sha256=${metadata.recipeHash}`))return fail('review changed or lacks recipe hash; regenerate',CODES.NEEDS_CLARIFICATION);
      const approved={runId:id,featureHash,recipeHash:metadata.recipeHash,status:'approved',reviewer,timestamp:new Date().toISOString()};
      fs.writeFileSync(path.join(run,'review','approval.json'),JSON.stringify(approved,null,2));
      console.log(JSON.stringify(approved));
      return;
    }

    if(command==='verify-manifest'){
      let id;
      try{id=option(args,'--run-id')}catch(error){return fail(error.message,CODES.NEEDS_CLARIFICATION)}
      if(args.includes('--run-id')&&!id)return fail('--run-id requires a non-flag value',CODES.NEEDS_CLARIFICATION);
      if(!id){
        fs.mkdirSync(DEMO_ROOT,{recursive:true});
        id=fs.readdirSync(DEMO_ROOT).filter(entry=>/^[A-Za-z0-9._-]+$/.test(entry)&&fs.existsSync(path.join(DEMO_ROOT,entry,'manifest.json'))).sort().pop();
      }
      let run;
      if(id){try{run=resolveRun(id)}catch(error){return fail(error.message,CODES.NEEDS_CLARIFICATION)}}
      const manifestFile=path.join(run||DEMO_ROOT,'manifest.json');
      if(!fs.existsSync(manifestFile))return fail('manifest not found',CODES.ARTIFACT_FAILED);
      const value=read(manifestFile);
      const valid=value.schemaVersion==='1'&&value.files.every(file=>fs.existsSync(path.join(path.dirname(manifestFile),file.path)));
      console.log(JSON.stringify({valid,runId:value.runId,status:value.status}));
      if(!valid)process.exitCode=CODES.ARTIFACT_FAILED;
      return;
    }

    if(command==='run'){
      const recipe=read(recipeFile);
      const validation=validate(recipe);
      if(!validation.ok)return fail(validation.errors.join('\n'),CODES.BLOCKED);
      let id;
      try{
        id=option(args,'--run-id');
        if(args.includes('--run-id')&&!id)throw new Error('--run-id requires a non-flag value');
        id=id||runId();
      }catch(error){return fail(error.message,CODES.NEEDS_CLARIFICATION)}
      let run;
      try{run=resolveRun(id)}catch(error){return fail(error.message,CODES.NEEDS_CLARIFICATION)}
      if(!ignored(run))return fail('run root is not ignored',CODES.ARTIFACT_FAILED);
      fs.mkdirSync(run,{recursive:true});
      const featureFile=path.join(run,'review','demo.feature.review');
      const metadataFile=path.join(run,'review','review.json');
      let metadata;
      if(fs.existsSync(featureFile)&&fs.existsSync(metadataFile)){
        const featureHash=crypto.createHash('sha256').update(fs.readFileSync(featureFile)).digest('hex');
        metadata=read(metadataFile);
        if(metadata.featureHash!==featureHash)return fail('review artifact changed; regenerate',CODES.NEEDS_CLARIFICATION);
      }else{
        const featureHash=review(run,recipe);
        metadata={runId:id,featureHash,recipeHash:recipeHash(recipe,canon),status:'pending',review:'operator-review-required'};
        fs.writeFileSync(metadataFile,JSON.stringify(metadata,null,2));
      }
      try{assertRecipeMatchesApprovedReview(recipe,metadata,approval(run),id,canon)}
      catch(error){return fail(error.message,CODES[error.code]||CODES.NEEDS_CLARIFICATION)}
      fs.writeFileSync(path.join(run,'recipe.frozen.json'),canon(recipe));
      fs.writeFileSync(path.join(run,'recipe.sha256'),recipeHash(recipe,canon));
      try{
        const result=await capture(recipe,run);
        const status=captureStatus(result.events,recipe.requirements);
        manifest(run,recipe,result,status);
        console.log(`MP4=${result.artifacts?.mp4||'not-composed'}\nCONTACT_SHEET=${result.artifacts?.contactSheet||'not-composed'}\nMANIFEST=${path.join(run,'manifest.json')}\nWould you like revisions to shot selection, pacing, zoom, annotation, or framing?`);
        process.exitCode=status==='SUCCESS'?0:CODES.ASSERTION_FAILED;
      }catch(error){
        manifest(run,recipe,null,error.code||'BLOCKED');
        console.error(error.message);
        process.exitCode=CODES[error.code]||CODES.BLOCKED;
      }
    }
  };
}

module.exports={createMain,captureStatus};
