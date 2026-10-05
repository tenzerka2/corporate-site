import sharp from 'sharp';
import fs from 'node:fs/promises';
const dir='public/images/renders';
const {data,info}=await sharp(`${dir}/hero-lines-raw.png`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
for(let i=0;i<data.length;i+=4){const a=Math.max(data[i],data[i+1],data[i+2]);data[i]=195;data[i+1]=212;data[i+2]=230;data[i+3]=a;}
const wire=await sharp(data,{raw:info}).extract({left:0,top:0,width:1920,height:2400}).png().toBuffer();
const solid=await sharp(`${dir}/hero-solid.png`).extract({left:1920,top:0,width:1920,height:2400}).png().toBuffer();
await sharp({create:{width:3840,height:2400,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite([{input:wire,left:0,top:0},{input:solid,left:1920,top:0}]).png().toFile(`${dir}/hero.png`);
for(const slug of ['hero','groupage','ftl','warehouse','marketplaces']){
 for(let quality=88;quality>=40;quality-=3){await sharp(`${dir}/${slug}.png`).resize({width:1600}).webp({quality}).toFile(`${dir}/${slug}.webp`);if((await fs.stat(`${dir}/${slug}.webp`)).size<=200000)break;}
}
const logo=await sharp('public/brand/logo-dark.svg').resize(250).toBuffer();
const hero=await sharp(`${dir}/hero.png`).resize(870).toBuffer();
const title=Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><g fill="white" font-family="DejaVu Sans,sans-serif" font-size="48" font-weight="bold"><text x="64" y="180">Грузоперевозки</text><text x="64" y="240">по России</text><text x="64" y="300">для бизнеса</text></g><path d="M64 343h80" stroke="#F26B1D" stroke-width="5"/></svg>');
await sharp({create:{width:1200,height:630,channels:3,background:'#0B2A4A'}}).composite([{input:hero,left:330,top:84},{input:logo,left:64,top:48},{input:title}]).png().toFile('public/images/og.png');
// One page for reviewing the family of visual assets.
const assets=[...['groupage','ftl','warehouse','marketplaces'].map(x=>`${dir}/${x}.webp`),...['logistics-office','loading','customer-handover'].map(x=>`public/images/photos/${x}.webp`),'public/images/russia-map.svg'];
const layers=[];
for(let i=0;i<assets.length;i++)layers.push({input:await sharp(assets[i]).resize(400,300,{fit:'contain',background:'#F9FAFB'}).png().toBuffer(),left:i%4*400,top:Math.floor(i/4)*300});
layers.push({input:await sharp('public/images/photos/contact-sheet.png').toBuffer(),left:0,top:600});
const heroTile=await sharp(`${dir}/hero.png`).resize(800,400,{fit:'contain',background:'#0B2A4A'}).flatten({background:'#0B2A4A'}).toBuffer();
layers.push({input:heroTile,left:0,top:1365},{input:await sharp('public/images/og.png').resize(800,400,{fit:'contain',background:'#0B2A4A'}).toBuffer(),left:800,top:1365});
const icons=['retail','production','marketplaces','construction','agriculture','pharma','autoparts','furniture'];
for(let i=0;i<icons.length;i++)layers.push({input:await sharp(`public/images/industries/${icons[i]}.svg`).resize(64,64).png().toBuffer(),left:i*200+68,top:1800});
await sharp({create:{width:1600,height:1900,channels:3,background:'#FFFFFF'}}).composite(layers).png().toFile('public/images/contact-sheet.png');
