import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../', import.meta.url));
const { data, info } = await sharp(`${root}public/images/renders/tractor-blueprint-raw.png`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
for (let i=0; i<data.length; i+=4) {
  const alpha=Math.max(data[i],data[i+1],data[i+2]);
  data[i]=195; data[i+1]=212; data[i+2]=230; data[i+3]=alpha;
}
await sharp(data,{raw:info}).png().toFile(`${root}public/images/renders/tractor-blueprint.png`);
const wire=await sharp(`${root}public/images/renders/tractor-blueprint.png`).extract({left:0,top:0,width:960,height:1200}).toBuffer();
const solid=await sharp(`${root}public/images/renders/tractor-preview.png`).extract({left:960,top:0,width:960,height:1200}).toBuffer();
const composed=await sharp({create:{width:1920,height:1200,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite([{input:wire,left:0,top:0},{input:solid,left:960,top:0}]).png().toBuffer();
await sharp(composed).toFile(`${root}public/images/renders/tractor-technical.png`);
await sharp(composed).resize({width:1600}).webp({quality:85}).toFile(`${root}public/images/renders/tractor-technical.webp`);
