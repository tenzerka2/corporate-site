import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
const studio=process.env.STUDIO_WORK_DIR || '/root/sites/shvetsov-studio/public/work';
const out='screenshots/release';
await mkdir(out,{recursive:true});
await mkdir(`${studio}/onega-case`,{recursive:true});
const browser=await chromium.launch({args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:1600,height:1000},reducedMotion:'reduce'});
const page=await context.newPage();
const base=process.env.ONEGA_CAPTURE_URL || 'http://127.0.0.1:3108/work/onega';
async function ready(){await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(async i=>{i.loading='eager';try{await i.decode()}catch{}}))})}
await page.goto(base);await ready();
await page.screenshot({path:`${out}/desktop.png`});
await sharp(`${out}/desktop.png`).webp({quality:88}).toFile(`${studio}/covers/onega.webp`);
await sharp(`${out}/desktop.png`).resize({width:1200,height:630,fit:'cover',position:'top'}).png().toFile('public/og.png');
await page.setViewportSize({width:1440,height:1000});
await page.locator('#calculator').screenshot({path:`${out}/calculator.png`,style:'header {visibility:hidden!important}'});
await sharp(`${out}/calculator.png`).webp({quality:88}).toFile(`${studio}/onega-case/calculator.webp`);
await page.goto(`${base}/services/truck`);await ready();
await page.locator('main > section').first().screenshot({path:`${out}/service.png`});
await sharp(`${out}/service.png`).webp({quality:88}).toFile(`${studio}/onega-case/service.webp`);
for(const width of [2560,1440,1024,390]){
 await page.setViewportSize({width,height:900});
 for(const route of ['', '/services/truck','/calculator','/tracking']){
  await page.goto(base+route);await ready();
  await page.screenshot({path:`${out}/${route.replaceAll('/','-')||'home'}-${width}.png`,fullPage:true});
 }
}
await page.goto(base);await ready();
await page.screenshot({path:`${out}/mobile.png`});
await page.screenshot({path:`${out}/mobile-full.png`,fullPage:true});
await sharp(`${out}/mobile-full.png`).extract({left:0,top:0,width:390,height:2532}).resize({width:640}).webp({quality:85}).toFile(`${studio}/covers/onega-phone.webp`);
await browser.close();
