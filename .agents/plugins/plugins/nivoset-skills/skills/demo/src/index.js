#!/usr/bin/env node
const fs=require('fs'), path=require('path'), crypto=require('crypto'), cp=require('child_process');
const {captureComparison}=require('./capture/comparison');
const {captureLegacy}=require('./capture/legacy');
const {createMain}=require('./cli/main');
const {validate}=require('./recipe/validate');
const {gherkin:buildGherkin,validateReview}=require('./review/storyboard');
const {assertRecipeMatchesApprovedReview,recipeHash}=require('./review/gate');
const ROOT=path.resolve(__dirname,'..'), DEMO_ROOT=path.resolve(ROOT,'.tmp','demo'), VERSION='1.0.0';
const CODES={SUCCESS:0,NEEDS_CLARIFICATION:10,BLOCKED:11,TARGET_START_FAILED:20,ACTION_FAILED:21,ASSERTION_FAILED:22,ANNOTATION_FAILED:23,NARRATION_UNAVAILABLE:24,ARTIFACT_FAILED:30,CLEANUP_FAILED:31,NOT_COMPARABLE:32,RECIPE_MUTATED:33,REDACTION_FAILED:34};
const fail=(m,c=1)=>{console.error(`ERROR: ${m}`); process.exitCode=c};
function read(f){return JSON.parse(fs.readFileSync(f,'utf8'))} function canon(x){if(Array.isArray(x))return '['+x.map(canon).join(',')+']';if(x&&typeof x==='object')return '{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+canon(x[k])).join(',')+'}';return JSON.stringify(x)}
function option(args,name,{required=false}={}){const index=args.indexOf(name),value=index>=0?args[index+1]:undefined;if(value&&value!=='--'&&!value.startsWith('-'))return value;if(required)throw Object.assign(new Error(`${name} requires a non-flag value`),{code:'NEEDS_CLARIFICATION'});return undefined}
function resolveRun(id){if(typeof id!=='string'||!/^[A-Za-z0-9._-]+$/.test(id))throw Object.assign(new Error('--run-id must match ^[A-Za-z0-9._-]+$'),{code:'NEEDS_CLARIFICATION'});fs.mkdirSync(DEMO_ROOT,{recursive:true});const root=fs.realpathSync.native(DEMO_ROOT),candidate=path.resolve(root,id),run=fs.existsSync(candidate)?fs.realpathSync.native(candidate):candidate;if(!run.startsWith(`${root}${path.sep}`))throw Object.assign(new Error('run path escapes .tmp/demo'),{code:'NEEDS_CLARIFICATION'});return run}
function runId(){return new Date().toISOString().replace(/[-:.TZ]/g,'').slice(0,14)+'-'+crypto.randomBytes(3).toString('hex')}
function ignored(dir){try{cp.execFileSync('git',['check-ignore','-q',dir],{cwd:ROOT});return true}catch{return false}}
function gherkin(recipe){return buildGherkin(recipe,canon)}
function review(run,r){let d=path.join(run,'review');fs.mkdirSync(d,{recursive:true});let g=gherkin(r),check=validateReview(g,r);if(!check.ok)throw Error(check.errors.join('; '));fs.writeFileSync(path.join(d,'demo.feature.review'),g);return crypto.createHash('sha256').update(g).digest('hex')}
function approval(run){let f=path.join(run,'review','approval.json');return fs.existsSync(f)?read(f):null}
async function capture(r,run){return r.comparison?.status==='before-after'?captureComparison(r,run):captureLegacy(r,run,validate(r).viewports)}

function manifest(run,r,result,status){let files=[];function walk(d){for(const n of fs.readdirSync(d)){let f=path.join(d,n),st=fs.statSync(f);if(st.isDirectory())walk(f);else files.push({path:path.relative(run,f),sha256:crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex'),bytes:st.size})}}walk(run);const requirements=r.requirements.map(q=>{const evidence=result?.events?.filter(e=>e.requirementId===q.id)||[];return {id:q.id,evidence,status:evidence.some(e=>e.outcome==='fail')?'fail':evidence.some(e=>e.outcome==='pass')?'pass':'not-run'}});if(status==='SUCCESS'&&requirements.some(requirement=>requirement.status!=='pass'))throw Object.assign(new Error('refusing SUCCESS without pass evidence for every requirement'),{code:'ASSERTION_FAILED'});let m={schemaVersion:'1',runnerVersion:VERSION,status,runId:path.basename(run),recipeHash:crypto.createHash('sha256').update(canon(r)).digest('hex'),requirements,assertionEvidence:result?.events||[],overlayEvidence:result?.overlays||[],narration:(result?.events||[]).map(e=>e.narration),comparison:r.comparison,files};fs.writeFileSync(path.join(run,'manifest.json'),JSON.stringify(m,null,2));return m}
const main=createMain({ROOT,DEMO_ROOT,VERSION,CODES,validate,canon,option,resolveRun,runId,ignored,read,review,approval,capture,manifest,recipeHash,assertRecipeMatchesApprovedReview});
if(require.main===module)main().catch(e=>fail(e.message,CODES.BLOCKED));
module.exports={validate,canon,gherkin,validateReview,manifest,main,CODES};
