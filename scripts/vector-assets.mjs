import fs from 'node:fs/promises';
const dir='public/images';await fs.mkdir(`${dir}/illustrations`,{recursive:true});await fs.mkdir(`${dir}/industries`,{recursive:true});
const wrap=(body,w=480,h=360)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" stroke="#0B2A4A" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">${body}</svg>`;
const polygon=(p,fill='#F2F4F7')=>`<polygon points="${p}" fill="${fill}"/>`;
const isoBox=(x,y,w,d,h)=>{const k=.577;return polygon(`${x},${y} ${x+w},${y-w*k} ${x+w+d},${y+(d-w)*k} ${x+d},${y+d*k}`)+polygon(`${x},${y} ${x+d},${y+d*k} ${x+d},${y+d*k+h} ${x},${y+h}`)+polygon(`${x+d},${y+d*k} ${x+w+d},${y+(d-w)*k} ${x+w+d},${y+(d-w)*k+h} ${x+d},${y+d*k+h}`);};
let laptop=polygon('90,224 257,127 381,199 214,296')+polygon('98,220 98,99 263,194 263,315')+polygon('108,211 108,116 253,200 253,295','#FFFFFF');
// Upright screen plane and floating form fields in the same 30 degree system.
laptop=polygon('100,229 259,137 386,210 227,302')+polygon('100,229 100,87 259,179 259,321')+polygon('112,222 112,110 247,188 247,300','#FFFFFF')+'<path d="M265 204l65 38-54 31-65-38M277 276l28 16-21 12-28-16"/>';
for(const [i,label] of ['Откуда','Куда','Вес'].entries()){const y=82+i*61;laptop+=`<g transform="translate(275 ${y}) skewY(30)"><rect width="118" height="39" fill="white"/><text x="12" y="25" stroke="none" fill="#0B2A4A" font-family="Arial,sans-serif" font-size="14">${label}</text><path d="M90 17l5 5 5-5"/></g>`;}
laptop+='<path d="M147 221l65 38v18l-65-38Z" fill="#F26B1D" stroke="none"/>';
await fs.writeFile(`${dir}/illustrations/calculation.svg`,wrap(laptop));
let pickup=isoBox(190,125,120,104,124)+'<path d="M214 161v94l61 35v-94Z" fill="white"/><path d="M223 173l44 25M223 186l44 25M223 199l44 25M223 212l44 25"/>';
pickup+=isoBox(65,210,90,49,49)+isoBox(53,249,35,40,36);
pickup+='<path d="M54 250v-23l35 20v23Z" fill="white"/><path d="M83 294v-17l32-18"/><ellipse cx="75" cy="291" rx="8" ry="12" fill="white"/><ellipse cx="123" cy="277" rx="8" ry="12" fill="white"/><ellipse cx="168" cy="251" rx="8" ry="12" fill="white"/>';
pickup+=isoBox(283,275,42,32,7)+isoBox(287,245,30,24,28);
pickup+='<circle cx="378" cy="223" r="10" fill="white"/><path d="M367 283v-47l11-5 12 12v37M371 282v40M385 281v39M371 250l-16 18 20 9"/><path d="M377 250l22 12-9 23-22-12Z" fill="#F26B1D"/>';
await fs.writeFile(`${dir}/illustrations/pickup.svg`,wrap(pickup));
let delivery=isoBox(94,183,95,75,83)+polygon('94,183 189,128 173,97 78,152')+polygon('189,128 264,171 294,146 219,103')+polygon('94,183 169,226 139,250 64,207')+polygon('169,226 264,171 289,201 194,256');
delivery+='<g transform="translate(286 100) skewY(30)"><rect width="112" height="149" fill="white"/><path d="M20 32h69M20 48h69M20 64h44"/><path d="M28 102l17 17 34-42" stroke="#F26B1D" stroke-width="4"/><text x="30" y="141" stroke="none" fill="#0B2A4A" font-size="18" font-family="Arial,sans-serif">ЭДО</text></g>';
await fs.writeFile(`${dir}/illustrations/delivery.svg`,wrap(delivery));
const icons={retail:'<path d="M8 21v20h32V21M6 21l4-13h28l4 13M6 21q5 7 9 0 5 7 9 0 5 7 9 0 5 7 9 0M19 41V29h10v12M17 8l-2 13M31 8l2 13"/>',production:'<path d="M7 41V21l12-8v11l12-8v25ZM31 41h10V7h-7l-3 22M12 32h3m8 0h3M12 37h3m8 0h3"/>',marketplaces:'<path d="M8 17l16-9 16 9v19l-16 9-16-9ZM8 17l16 9 16-9M24 26v19M16 13l16 9v9"/>',construction:'<path d="M8 42V7h5v35M13 8h29l-9 9H13M26 8v23m-4 0q4 8 8 0M5 42h12M8 12l5 7-5 7 5 7-5 7M17 8l7 9 7-9"/>',agriculture:'<path d="M24 43V16M24 31C8 32 7 23 8 17c10 0 16 5 16 14ZM24 23c0-10 5-15 15-16 1 10-3 16-15 16ZM24 38c0-9 6-13 15-13 0 10-5 14-15 13Z"/>',pharma:'<path d="M11 30l19-19a9 9 0 0113 13L24 43a9 9 0 01-13-13ZM21 20l13 13M29 18l5-5"/>',autoparts:'<path d="M10 30a9 9 0 01-4-13l5 5 6-6-5-5a9 9 0 0113 5l15 15a6 6 0 01-9 9L16 25M34 34l2 2"/>',furniture:'<path d="M8 24V12a4 4 0 014-4h24a4 4 0 014 4v12M7 24h5v8h24v-8h5v16H7ZM10 40v4M38 40v4M24 8v24"/>'};
for(const [name,body] of Object.entries(icons))await fs.writeFile(`${dir}/industries/${name}.svg`,wrap(body,48,48));
