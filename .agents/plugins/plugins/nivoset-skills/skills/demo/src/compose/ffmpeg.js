const path=require('node:path');

const safeRelative=(value,name)=>{
  if(typeof value!=='string'||!value||path.isAbsolute(value)||value.startsWith('//')||value.includes('\\')||value.includes('\0')||value.includes(':')||value.split('/').includes('..'))throw new TypeError(`${name} must be a safe relative path`);
  return value;
};
const positiveInt=(value,name)=>{
  if(!Number.isInteger(value)||value<=0)throw new TypeError(`${name} must be a positive integer`);
  return value;
};

function validateComposition(composition){
  if(!composition||typeof composition!=='object')throw new TypeError('composition is required');
  safeRelative(composition.output,'composition.output');
  if(composition.contactSheet)safeRelative(composition.contactSheet,'composition.contactSheet');
  if(!Array.isArray(composition.shots)||!composition.shots.length)throw new TypeError('composition.shots must be non-empty');
  composition.shots.forEach((shot,index)=>{
    safeRelative(shot.input,`shots[${index}].input`);
    positiveInt(shot.durationMs,`shots[${index}].durationMs`);
    if(!shot.crop||!['x','y','width','height'].every(k=>Number.isInteger(shot.crop[k])&&shot.crop[k]>=0))throw new TypeError(`shots[${index}].crop must contain non-negative integers`);
    positiveInt(shot.crop.width,`shots[${index}].crop.width`);positiveInt(shot.crop.height,`shots[${index}].crop.height`);
    if(shot.labelPng)safeRelative(shot.labelPng,`shots[${index}].labelPng`);
    if(shot.zoom&&shot.zoom!=='static'&&shot.zoom!=='push-in')throw new TypeError(`shots[${index}].zoom is unsupported`);
  });
  return composition;
}

function buildFfmpegArgs(composition){
  validateComposition(composition);
  const inputs=[],filters=[],streams=[];
  let inputIndex=0;
  composition.shots.forEach((shot,index)=>{
    const videoInput=inputIndex++,duration=(shot.durationMs/1000).toFixed(3);
    inputs.push('-sseof',`-${duration}`,'-i',shot.input);
    const output=shot.labelPng?`base${index}`:`v${index}`;
    let chain=`[${videoInput}:v]crop=${shot.crop.width}:${shot.crop.height}:${shot.crop.x}:${shot.crop.y},scale=1280:720,setsar=1,fps=30,format=yuv420p,tpad=stop_mode=clone:stop_duration=0.034`;
    if(shot.zoom==='push-in')chain+=`,zoompan=z='min(zoom+0.0015,1.15)':d=${Math.ceil(shot.durationMs*30/1000)}:s=1280x720:fps=30`;
    chain+=`[${output}]`;filters.push(chain);
    if(shot.labelPng){
      const labelInput=inputIndex++;inputs.push('-loop','1','-i',shot.labelPng);
      filters.push(`[base${index}][${labelInput}:v]overlay=24:24:shortest=1[v${index}]`);
    }
    streams.push(`[v${index}]`);
  });
  filters.push(`${streams.join('')}concat=n=${streams.length}:v=1:a=0[outv]`);
  const video=[...inputs,'-filter_complex',filters.join(';'),'-map','[outv]','-an','-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart','-y',composition.output];
  let contactSheet=null;
  if(composition.contactSheet){
    const before=composition.shots[0],after=composition.shots.at(-1);
    const beforeCrop=before.crop,afterCrop=after.crop;
    contactSheet=['-sseof','-0.100','-i',before.input,'-sseof','-0.100','-i',after.input,'-filter_complex',`[0:v]crop=${beforeCrop.width}:${beforeCrop.height}:${beforeCrop.x}:${beforeCrop.y},scale=640:360,setsar=1[before];[1:v]crop=${afterCrop.width}:${afterCrop.height}:${afterCrop.x}:${afterCrop.y},scale=640:360,setsar=1[after];[before][after]hstack=inputs=2[out]`,'-map','[out]','-frames:v','1','-y',composition.contactSheet];
  }
  return {video,contactSheet};
}

module.exports={buildFfmpegArgs,validateComposition};
