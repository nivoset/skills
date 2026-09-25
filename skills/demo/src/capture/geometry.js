const finite=n=>typeof n==='number'&&Number.isFinite(n);

function box(value,name){
  if(!value||!['x','y','width','height'].every(k=>finite(value[k]))||value.width<=0||value.height<=0)throw new TypeError(`${name} must be a positive finite bounding box`);
  return value;
}

function viewport(value){
  if(!value||!finite(value.width)||!finite(value.height)||value.width<=0||value.height<=0)throw new TypeError('viewport must have positive finite dimensions');
  return value;
}

function unionCrop16x9(before,after,view,padding=32){
  before=box(before,'before');after=box(after,'after');view=viewport(view);
  if(!Number.isInteger(padding)||padding<0)throw new TypeError('padding must be a non-negative integer');
  const left=Math.max(0,Math.min(before.x,after.x)-padding);
  const top=Math.max(0,Math.min(before.y,after.y)-padding);
  const right=Math.min(view.width,Math.max(before.x+before.width,after.x+after.width)+padding);
  const bottom=Math.min(view.height,Math.max(before.y+before.height,after.y+after.height)+padding);
  const centerX=(left+right)/2,centerY=(top+bottom)/2;
  let width=right-left,height=bottom-top;
  if(width/height<16/9)width=height*16/9;else height=width*9/16;
  width=Math.min(view.width,Math.floor(width/16)*16);
  height=Math.min(view.height,Math.floor(width*9/16));
  width=Math.floor(height*16/9);
  let x=Math.round(centerX-width/2),y=Math.round(centerY-height/2);
  x=Math.max(0,Math.min(x,view.width-width));y=Math.max(0,Math.min(y,view.height-height));
  return {x,y,width,height};
}

module.exports={unionCrop16x9};
