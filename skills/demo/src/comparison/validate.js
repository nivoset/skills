const safeUrl=value=>{
  try{let url=new URL(value);return url.protocol==='http:'||url.protocol==='https:'}catch{return false}
};
const safeId=value=>typeof value==='string'&&/^[A-Za-z0-9._-]+$/.test(value);

const resolveSameOriginUrl=(base,value)=>{
  if(typeof value!=='string'||!value||value.includes('\\')||value.startsWith('//'))return null;
  try{
    const target=new URL(base);
    const resolved=new URL(value,target);
    return ['http:','https:'].includes(target.protocol)&&resolved.origin===target.origin?resolved.href:null;
  }catch{return null}
};
const resolveSameOriginRoute=(base,value)=>typeof value==='string'&&value.startsWith('/')?resolveSameOriginUrl(base,value):null;

exports.validateComparison=c=>{
  if(!c||c.status==='not-comparable')return {ok:false,code:'NOT_COMPARABLE'};
  if(c.status!=='before-after')return {ok:true,status:c.status||'current-behavior'};
  for(const phase of ['before','after']){
    const target=c.targets?.[phase];
    const validCommand=Array.isArray(target?.command)&&target.command.length&&target.command.every(item=>typeof item==='string'&&item);
    if(!target||(!safeUrl(target.url)&&!validCommand))return {ok:false,code:'NOT_COMPARABLE',error:`${phase} target requires an explicit http(s) URL or command array`};
  }
  if(!Array.isArray(c.shots)||c.shots.length<2)return {ok:false,code:'NOT_COMPARABLE',error:'before-after comparison requires at least two shots'};
  for(const [index,shot] of c.shots.entries()){
    const target=c.targets?.[shot.phase];
    const safeRoute=target?.url?resolveSameOriginRoute(target.url,shot.route):typeof shot.route==='string'&&shot.route.startsWith('/')&&!shot.route.startsWith('//')&&!shot.route.includes('\\');
    if(!safeId(shot.requirementId)||!safeId(shot.stepId)||!['before','after'].includes(shot.phase)||!['navigate','click'].includes(shot.action||'navigate')||!safeRoute||!shot.focusSelector||shot.framing!=='union-16:9'||!Number.isInteger(shot.durationMs)||shot.durationMs<=0||!shot.annotation)return {ok:false,code:'NOT_COMPARABLE',error:`shot ${index+1} is invalid`};
    if(shot.zoom&&!['static','push-in'].includes(shot.zoom))return {ok:false,code:'NOT_COMPARABLE',error:`shot ${index+1} has unsupported zoom`};
  }
  if(!c.shots.some(s=>s.phase==='before')||!c.shots.some(s=>s.phase==='after'))return {ok:false,code:'NOT_COMPARABLE',error:'shots must include before and after phases'};
  if(c.composition?.transition&&c.composition.transition!=='hard-cut')return {ok:false,code:'NOT_COMPARABLE',error:'before-after transition must be hard-cut'};
  return {ok:true,status:c.status};
};

exports.resolveSameOriginUrl=resolveSameOriginUrl;
exports.resolveSameOriginRoute=resolveSameOriginRoute;
