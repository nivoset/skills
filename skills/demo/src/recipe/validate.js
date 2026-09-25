const fs=require('node:fs');
const path=require('node:path');
const {validateComparison,resolveSameOriginUrl}=require('../comparison/validate');

const ROOT=path.resolve(__dirname,'../..');
const DEMO_ROOT=path.resolve(ROOT,'.tmp','demo');
const ACTIONS=new Set(['navigate','click','fill','select','wait-for','screenshot','assert-visible','assert-text','assert-url']);
const SAFE_ID=/^[A-Za-z0-9._-]+$/;

function resolvedRealPath(value){
  let current=path.resolve(value);
  const suffix=[];
  while(!fs.existsSync(current)){
    const parent=path.dirname(current);
    if(parent===current)break;
    suffix.unshift(path.basename(current));
    current=parent;
  }
  const real=fs.realpathSync.native(current);
  return path.join(real,...suffix);
}

function isContained(root,candidate){
  const realRoot=resolvedRealPath(root);
  const realCandidate=resolvedRealPath(candidate);
  return realCandidate===realRoot||realCandidate.startsWith(`${realRoot}${path.sep}`);
}

function isAllowedNavigationUrl(value,base){
  if(typeof value!=='string'||!value)return false;
  if(base)return Boolean(resolveSameOriginUrl(base,value));
  if(value.includes('\\')||value.startsWith('//'))return false;
  try{
    new URL(value);
    return false;
  }catch{
    try{return ['http:','https:'].includes(new URL(value,'https://demo.invalid/').protocol)}
    catch{return false}
  }
}

function validateTarget(target,label,errors){
  if(target?.url&&target.healthUrl){
    try{
      if(new URL(target.url).origin!==new URL(target.healthUrl).origin)errors.push(`${label}.url and ${label}.healthUrl: must have the same origin`);
    }catch{
      errors.push(`${label}.url and ${label}.healthUrl: must be valid URLs`);
    }
  }
  if(target?.command&&target.cwd!==undefined){
    try{
      if(typeof target.cwd!=='string'||!fs.statSync(path.resolve(ROOT,target.cwd)).isDirectory())throw new Error();
    }catch{
      errors.push(`${label}.cwd: must be a real directory`);
    }
  }
}

function validate(recipe){
  const errors=[];
  const targetHref=recipe?.target?.url||recipe?.target?.healthUrl;
  validateTarget(recipe?.target,'target',errors);
  for(const phase of ['before','after'])validateTarget(recipe?.comparison?.targets?.[phase],`comparison.targets.${phase}`,errors);
  if(!recipe||recipe.schemaVersion!=='1')errors.push('schemaVersion: must be "1"');
  if(!Array.isArray(recipe?.requirements)||!recipe.requirements.length)errors.push('requirements: must be non-empty');
  (recipe?.requirements||[]).forEach((requirement,index)=>{
    if(typeof requirement.id!=='string'||!SAFE_ID.test(requirement.id))errors.push(`requirements[${index}].id: must match ^[A-Za-z0-9._-]+$`);
    if(!Array.isArray(requirement.steps)||!requirement.steps.length)errors.push(`requirements[${index}].steps: required`);
    (requirement.steps||[]).forEach((step,stepIndex)=>{
      if(typeof step.id!=='string'||!SAFE_ID.test(step.id))errors.push(`requirements[${index}].steps[${stepIndex}].id: must match ^[A-Za-z0-9._-]+$`);
      if(!ACTIONS.has(step.action))errors.push(`requirements[${index}].steps[${stepIndex}].action: unsupported`);
      if(['click','fill','select','assert-visible','assert-text'].includes(step.action)&&!step.selector)errors.push(`requirements[${index}].steps[${stepIndex}].selector: required`);
      if(step.action==='wait-for'&&!step.selector&&!step.url)errors.push(`requirements[${index}].steps[${stepIndex}]: wait-for requires selector or url`);
      const beforeAfter=recipe.comparison?.status==='before-after';
      const matchingShots=beforeAfter
        ? (recipe.comparison.shots||[]).filter(candidate=>candidate.requirementId===requirement.id&&candidate.stepId===step.id)
        : [];
      if(beforeAfter){
        const phases=new Set(matchingShots.map(candidate=>candidate.phase));
        if(matchingShots.length!==2||!phases.has('before')||!phases.has('after'))errors.push(`requirements[${index}].steps[${stepIndex}]: requires one before shot and one after shot`);
        if(!['navigate','click'].includes(step.action))errors.push(`requirements[${index}].steps[${stepIndex}].action: before-after supports navigate or click`);
        for(const shot of matchingShots){
          const shotAction=shot.action||'navigate';
          if(shotAction!==step.action)errors.push(`requirements[${index}].steps[${stepIndex}]: shot action must match step action`);
          const expected=step.action==='click'?step.selector:step.url;
          const actual=shotAction==='click'?shot.focusSelector:shot.route;
          if(expected!==undefined&&actual!==expected)errors.push(`requirements[${index}].steps[${stepIndex}]: shot target must match step target`);
        }
      }
      const bases=beforeAfter
        ? matchingShots.map(shot=>recipe.comparison.targets?.[shot.phase]?.url).filter(Boolean)
        : [targetHref];
      if((['navigate','assert-url'].includes(step.action)||(step.action==='wait-for'&&step.url))&&(!bases.length||bases.some(base=>!isAllowedNavigationUrl(step.url,base))))errors.push(`requirements[${index}].steps[${stepIndex}].url: must stay on the target origin`);
    });
  });
  let viewports=recipe?.viewports||[];
  if(!viewports.length)viewports=[{name:'standard',width:1440,height:900}];
  viewports.forEach((viewport,index)=>{
    if(typeof viewport.name!=='string'||!SAFE_ID.test(viewport.name)||!Number.isInteger(viewport.width)||!Number.isInteger(viewport.height)||viewport.width<320||viewport.width>3840||viewport.height<240||viewport.height>2160)errors.push(`viewports[${index}]: invalid name or dimensions`);
  });
  if(!recipe?.target||(!recipe.target.url&&!recipe.target.command))errors.push('target: url or command required');
  if(recipe?.target?.command&&(!Array.isArray(recipe.target.command)||!recipe.target.command.length||recipe.target.command.some(item=>typeof item!=='string'||!item)))errors.push('target.command: must be a non-empty string array');
  if(recipe?.target?.command&&!resolveSameOriginUrl(targetHref,targetHref))errors.push('target: command requires an explicit http(s) url or healthUrl');
  if(recipe?.target?.baseUrl!==undefined)errors.push('target.baseUrl: unsupported; use url or healthUrl as the canonical origin');
  if(recipe?.outputs?.root&&!isContained(DEMO_ROOT,path.resolve(ROOT,recipe.outputs.root)))errors.push('outputs.root: must be under .tmp/demo');
  if(recipe?.redaction?.onFailure&&!['block','warn'].includes(recipe.redaction.onFailure))errors.push('redaction.onFailure: invalid');
  const comparison=validateComparison(recipe?.comparison);
  if(!comparison.ok)errors.push(`comparison: ${comparison.error||comparison.code}`);
  return {ok:!errors.length,errors,viewports};
}

module.exports={validate,isAllowedNavigationUrl,isContained};
