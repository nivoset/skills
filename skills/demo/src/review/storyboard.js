const path=require('node:path');
const {recipeHash}=require('./gate');
const {resolveSameOriginUrl,resolveSameOriginRoute}=require('../comparison/validate');

const ROOT=path.resolve(__dirname,'../..');

function gherkinStep(step){
  return ({navigate:'When I open the target page',click:'When I click the configured control',fill:'When I enter the configured value',select:'When I select the configured option','wait-for':'When I wait for the target state',screenshot:'Then I capture the page','assert-visible':'Then the configured element is visible','assert-text':'Then the configured text is present','assert-url':'Then the URL matches the configured value'})[step.action]||'Then the step is rejected';
}

const targetLine=(name,target)=>{
  const fields=[];
  if(target?.url)fields.push(`url=${target.url}`);
  else if(target?.healthUrl)fields.push(`url=${target.healthUrl}`);
  if(target?.url&&target.healthUrl)fields.push(`healthUrl=${target.healthUrl}`);
  if(target?.command){
    fields.push(`argv=${JSON.stringify(target.command)}`);
    fields.push(`cwd=${path.resolve(ROOT,target.cwd||ROOT)}`);
  }
  return `# targets.${name} ${fields.join(' ')||'missing'}`;
};

function shotLine(shot,index){
  return `# shot=${index+1} requirementId=${shot.requirementId} stepId=${shot.stepId} phase=${shot.phase} route=${shot.route} action=${shot.action||'navigate'} focus=${shot.focusSelector} framing=${shot.framing} durationMs=${shot.durationMs} annotation=${shot.annotation} scroll=${JSON.stringify(shot.scroll||{x:0,y:0})} zoom=${shot.zoom||'static'}`;
}

function interactionText(shot){
  if((shot.action||'navigate')==='click')return `I use the interaction on \"${shot.route}\"`;
  return `I open \"${shot.route}\"`;
}

function failureLocationText(shot){
  if((shot.action||'navigate')==='click')return `the interaction on \"${shot.route}\"`;
  return `the page at \"${shot.route}\"`;
}

function beforeAfterScenarios(recipe,changeId){
  const groups=new Map();
  for(const shot of recipe.comparison?.shots||[]){
    const key=`${shot.requirementId}/${shot.stepId}`;
    const group=groups.get(key)||{};
    group[shot.phase]=shot;
    groups.set(key,group);
  }
  return (recipe.requirements||[]).flatMap(requirement=>(requirement.steps||[]).flatMap(step=>{
    const key=`${requirement.id}/${step.id}`;
    const pair=groups.get(key)||{};
    const before=pair.before||{action:step.action||'navigate',route:step.url||'/',focusSelector:step.selector||'body'};
    const after=pair.after||before;
    const outcome=step.expected||requirement.expected||'demonstrated behavior';
    return [
      `  # requirementId: ${requirement.id} changeId: ${step.source||requirement?.source||changeId} outcome: ${outcome}`,
      `  Scenario: ${requirement.id}/${step.id} desired user expectation # requirementId=${requirement.id} changeId=${step.source||requirement?.source||changeId} outcome=${outcome}`,
      `    # requirementId: ${requirement.id} changeId: ${step.source||requirement?.source||changeId} outcome: ${outcome}`,
      `    # requirementId: ${requirement.id} changeId: ${step.source||requirement?.source||changeId} outcome: ${outcome} beforeFailurePoint: ${failureLocationText(before)}`,
      `    # requirementId: ${requirement.id} changeId: ${step.source||requirement?.source||changeId} outcome: ${outcome} beforeFailure: does-not-meet-expected`,
      `    Given the product is in the after state`,
      `    When ${interactionText(after)}`,
      `    Then the result satisfies \"${outcome}\"`,
    ];
  }));
}

function gherkin(recipe,canonicalize){
  const comparison=recipe.comparison;
  const beforeAfter=comparison?.status==='before-after';
  const targets=beforeAfter
    ? [targetLine('before',comparison.targets?.before),targetLine('after',comparison.targets?.after)]
    : [targetLine('target',recipe.target)];
  const storyboard=(comparison?.shots||[]).map(shotLine);
  const firstRequirement=recipe.requirements?.[0];
  const changeId=recipe.source?.changeId||recipe.source?.citation||'unknown';
  const scenarios=beforeAfter
    ? beforeAfterScenarios(recipe,changeId)
    : (recipe.requirements||[]).flatMap(requirement=>(requirement.steps||[]).flatMap(step=>{
      const outcome=step.expected||requirement.expected||'demonstrated behavior';
      return [
        `  # requirementId: ${requirement.id} changeId: ${step.source||requirement?.source||changeId} outcome: ${outcome}`,
        `  Scenario: ${requirement.id}/${step.id} desired user expectation # requirementId=${requirement.id} changeId=${step.source||requirement?.source||changeId} outcome=${outcome}`,
        `    # requirementId: ${requirement.id} changeId: ${step.source||requirement?.source||changeId} outcome: ${outcome}`,
        `    ${gherkinStep(step)}`,
      ];
    }));
  return [
    '# DEMO REVIEW ONLY — generated; never copied to product tests',
    '# STORYBOARD — approve sequence and framing before recording',
    `# canonical-recipe-sha256=${recipeHash(recipe,canonicalize)}`,
    ...targets,
    `# viewport=${JSON.stringify((recipe.viewports||[])[0]||{width:1440,height:900})}`,
    `# composition=${JSON.stringify(comparison?.composition||{})}`,
    ...storyboard,
    `# requirementId: ${firstRequirement?.id||'unknown'} changeId: ${changeId} outcome: demonstrated behavior`,
    `Feature: Demonstrated change # requirementId=${firstRequirement?.id||'unknown'} changeId=${changeId} outcome=demonstrated`,
    ...scenarios,
  ].join('\n')+'\n';
}

function validateReview(text,recipe){
  const lines=text.split('\n');
  const requirementIds=new Set((recipe.requirements||[]).map(item=>item.id));
  const errors=[];
  let last='';
  for(const line of lines){
    if(/^\s*#/.test(line))last=line;
    if(/^\s*(Feature:|Rule:|Scenario:|Given |When |Then |And |But )/.test(line)){
      const provenance=(line.includes('#')?line.slice(line.indexOf('#')):last).replace(/^.*#\s*/,'');
      for(const key of ['requirementId','changeId','outcome']){
        if(!new RegExp('(?:^|\\s)'+key+'(?:=|:)\\s*(?=\\S)').test(provenance))errors.push(`missing ${key} provenance: ${line.trim()}`);
      }
      const match=provenance.match(/requirementId[=:]\s*(\S+)/);
      if(match&&!requirementIds.has(match[1]))errors.push(`unknown requirement: ${match[1]}`);
    }
  }
  if(recipe.comparison?.status==='before-after'){
    const shotKey=(requirementId,stepId,phase,action,value)=>`${requirementId}/${stepId}/${phase}/${action||'navigate'}/${value||''}`;
    const required=(recipe.requirements||[]).flatMap(requirement=>(requirement.steps||[]).flatMap(step=>
      ['before','after'].map(phase=>shotKey(requirement.id,step.id,phase,step.action||'navigate',(step.action||'navigate')==='click'?step.selector:step.url))
    )).sort();
    const recorded=(recipe.comparison.shots||[]).map(shot=>shotKey(shot.requirementId,shot.stepId,shot.phase,shot.action||'navigate',(shot.action||'navigate')==='click'?shot.focusSelector:shot.route)).sort();
    if(required.length!==recorded.length||required.some((key,index)=>key!==recorded[index]))errors.push('each requirement step must map to before and after shots with matching action and route/selector');
    for(const shot of recipe.comparison.shots||[]){
      const base=recipe.comparison.targets?.[shot.phase]?.url;
      if(!base)continue;
      const routeUrl=resolveSameOriginRoute(base,shot.route);
      const requirement=recipe.requirements?.find(item=>item.id===shot.requirementId);
      const step=requirement?.steps?.find(item=>item.id===shot.stepId);
      const stepUrl=step?.url===undefined?routeUrl:resolveSameOriginUrl(base,step.url);
      if(!routeUrl||!stepUrl||routeUrl!==stepUrl)errors.push(`shot ${shot.requirementId}/${shot.stepId} must stay on its target origin`);
    }
  }
  return {ok:!errors.length,errors};
}

module.exports={gherkin,validateReview};
