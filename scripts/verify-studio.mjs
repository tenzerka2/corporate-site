import { chromium, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const base = process.env.STUDIO_TEST_URL || 'http://127.0.0.1:4181';
const browser = await chromium.launch({args:['--no-sandbox']});
const page = await browser.newPage({reducedMotion:'reduce'});
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
await mkdir('screenshots/release',{recursive:true});
try {
 for(const width of [2560,1440,1024,390]) {
  await page.setViewportSize({width,height:900});
  for(const route of ['/cases/onega','/cases']) {
   const response=await page.goto(base+route);expect(response.status()).toBe(200);
   await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(async i=>{i.loading='eager';try{await i.decode()}catch{}}))});
   await expect(page.locator('h1')).toBeVisible();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width} ${route}`).toBe(true);
   const broken=await page.locator('img').evaluateAll(images=>images.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.currentSrc));expect(broken).toEqual([]);
   await page.screenshot({path:`screenshots/release/studio${route.replaceAll('/','-')}-${width}.png`,fullPage:true});
  }
 }
 await page.goto(`${base}/cases`);
 const workCard=page.locator('.case').filter({has:page.locator('h2',{hasText:'Онега Логистик'})});
 await expect(workCard).toHaveCount(1);
 for(const link of await workCard.locator('a').all()) await expect(link).toHaveAttribute('href','/work/onega');
 if(base.startsWith('https://shvetsov.studio')) {
   await workCard.locator('.case__frame').click();
   await expect(page).toHaveURL(/\/work\/onega$/);
   await expect(page.locator('h1')).toContainText('Доставка грузов');
 }
 await page.goto(base);
 const card=page.locator('.case').filter({has:page.locator('.case__name',{hasText:'Онега Логистик'})});
 await expect(card).toHaveCount(1);
 await card.scrollIntoViewIfNeeded();
 await page.screenshot({path:'screenshots/release/studio-home-card.png'});
 await expect(card.locator('.case__bar')).toHaveAttribute('href','/work/onega');
 if(base.startsWith('https://shvetsov.studio')) {
   await card.locator('.case__bar').click();
   await expect(page).toHaveURL(/\/work\/onega$/);
   await expect(page.locator('h1')).toContainText('Доставка грузов');
 }
 expect(errors).toEqual([]);
 console.log('PASS: studio case, portfolio and home card; 4 widths; images and navigation');
} finally {await browser.close()}
