import { chromium } from '@playwright/test';
const browser=await chromium.launch({args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
try {
 await page.goto('https://shvetsov.studio/cases/onega');
 const consent=page.getByRole('button',{name:'Только необходимые'});
 if(await consent.isVisible())await consent.click();
 await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:'screenshots/release/case-desktop.png'});
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:'screenshots/release/case-mobile.png'});
 await page.goto('https://shvetsov.studio/work/onega');
 await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:'screenshots/release/mobile.png'});
 await page.setViewportSize({width:1440,height:900});
 await page.screenshot({path:'screenshots/release/desktop.png'});
 await page.goto('https://shvetsov.studio/work/onega/calculator');
 await page.locator('#calculator').screenshot({path:'screenshots/release/calculator.png',style:'header {visibility:hidden!important}'});
} finally {await browser.close()}
