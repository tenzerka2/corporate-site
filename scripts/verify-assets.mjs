import { chromium, expect } from '@playwright/test';
const base=process.env.ONEGA_URL || 'https://shvetsov.studio';
const prefix='/work/onega';
const routes=['','/services','/services/groupage','/services/truck','/services/storage','/services/marketplaces','/tariffs','/calculator','/tracking','/about','/warehouses','/contacts','/privacy'];
const browser=await chromium.launch({args:['--no-sandbox']});
const page=await browser.newPage();
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
try {
 for(const route of routes){
  expect((await page.goto(base+prefix+route)).status()).toBe(200);
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(async i=>{i.loading='eager';try{await i.decode()}catch{}}))});
  expect(await page.locator('img').evaluateAll(images=>images.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.currentSrc))).toEqual([]);
  await expect(page.locator('meta[name=robots]')).toHaveAttribute('content',/noindex/);
  expect(await page.locator('body').innerText()).not.toContain('—');
 }
 const image=await page.locator('meta[property="og:image"]').getAttribute('content');
 expect(image).toBe('https://shvetsov.studio/work/onega/og.png');
 expect((await page.request.get(image)).status()).toBe(200);
 expect((await page.request.get(base+prefix+'/no-such-page')).status()).toBe(404);
 expect(errors).toEqual([]);
 console.log('PASS: 13 pages, local images/fonts, no browser errors, noindex, sharing image, 404');
} finally {await browser.close()}
