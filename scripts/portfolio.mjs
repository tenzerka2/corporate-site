// Portfolio materials: screenshots, a 1080p walkthrough video and a 1920x1080 cover.
// Needs a running production server (npm run start -- --port 3106) and ffmpeg.
// Usage: node scripts/portfolio.mjs [baseUrl]
import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, readdir, rm } from "node:fs/promises";

const base = process.argv[2] || process.env.ONEGA_TEST_URL || "http://127.0.0.1:3106";
const out = "portfolio";
const hide = ".skip-link { visibility: hidden !important; }";
const hideHeader = ".site-header, .skip-link { visibility: hidden !important; }";
await mkdir(`${out}/screens`, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH,
  args: ["--no-sandbox"],
});

async function open(path, width, height, scale = 2) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: scale });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  return page;
}
const shot = (page, name, options = {}) =>
  page.screenshot({ path: `${out}/screens/${name}.png`, style: hide, ...options });

// Desktop
let page = await open("/", 1440, 900);
await shot(page, "01-home-hero-1440");
await shot(page, "02-home-full-1440", { fullPage: true });
await page.getByRole("button", { name: "Услуги", exact: true }).click();
await page.locator("#site-menu").waitFor();
await page.waitForTimeout(400);
await shot(page, "03-mega-menu-1440");
await page.keyboard.press("Escape");
await page.locator("#calculator").getByText("Отдельная машина", { exact: true }).click();
await page.locator("#calculator").getByLabel("Вес, кг").fill("3200");
await page.locator("#calculator").getByLabel("Объём, м³").fill("18");
await page.locator("#calculator .checkbox-label", { hasText: "Доставить до двери" }).click();
await page.waitForTimeout(500);
await page.locator("#calculator").screenshot({
  path: `${out}/screens/04-calculator-result-1440.png`,
  style: hideHeader,
});
await page.locator("#geography").scrollIntoViewIfNeeded();
await page
  .getByRole("group", { name: /Карта России/ })
  .getByRole("button", { name: "Новосибирск", exact: true })
  .hover();
await page.waitForTimeout(300);
await page.locator("#geography").screenshot({
  path: `${out}/screens/05-directions-map-1440.png`,
  style: hide,
});
await page.close();

page = await open("/services/groupage", 1440, 900);
await shot(page, "06-service-page-1440", { fullPage: true });
await page.close();
page = await open("/tracking", 1440, 900);
await page.getByRole("button", { name: "ON-2026-104733" }).click();
await page.waitForTimeout(300);
await shot(page, "07-tracking-1440", { fullPage: true });
await page.close();

// Mobile
page = await open("/", 390, 844, 3);
await shot(page, "08-mobile-hero-390");
await page.locator("#calculator").screenshot({
  path: `${out}/screens/09-mobile-calculator-390.png`,
  style: hideHeader,
});
await page.close();

// Video: 1920x1080, recorded at real speed, then compressed with ffmpeg.
await rm(`${out}/.video`, { recursive: true, force: true });
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  recordVideo: { dir: `${out}/.video`, size: { width: 1920, height: 1080 } },
});
page = await context.newPage();
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
const smoothScroll = (to, ms) =>
  page.evaluate(
    ({ to, ms }) =>
      new Promise((done) => {
        const from = scrollY;
        const target = typeof to === "number" ? to : document.querySelector(to).getBoundingClientRect().top + scrollY - 96;
        const start = performance.now();
        const step = (time) => {
          const t = Math.min(1, (time - start) / ms);
          const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          scrollTo(0, from + (target - from) * eased);
          if (t < 1) requestAnimationFrame(step);
          else done();
        };
        requestAnimationFrame(step);
      }),
    { to, ms },
  );
await smoothScroll("#how-it-works", 3500);
await page.waitForTimeout(800);
await smoothScroll(".services-block", 3000);
await page.waitForTimeout(800);
await smoothScroll(0, 1800);
await page.getByRole("button", { name: "Услуги", exact: true }).click();
await page.waitForTimeout(2200);
await page.keyboard.press("Escape");
await page.waitForTimeout(500);
await smoothScroll("#geography", 2500);
const map = page.getByRole("group", { name: /Карта России/ });
for (const city of ["Казань", "Екатеринбург", "Новосибирск"]) {
  await map.getByRole("button", { name: city, exact: true }).hover();
  await page.waitForTimeout(900);
}
await page.getByRole("button", { name: /Москва → Новосибирск/ }).click();
await page.waitForTimeout(1200);
await smoothScroll("#calculator", 1800);
await page.waitForTimeout(600);
const calc = page.locator("#calculator");
await calc.getByLabel("Вес, кг").fill("");
await calc.getByLabel("Вес, кг").pressSequentially("1800", { delay: 140 });
await page.waitForTimeout(700);
await calc.getByText("Отдельная машина", { exact: true }).click();
await page.waitForTimeout(1200);
await calc.locator(".checkbox-label", { hasText: "Жёсткая упаковка" }).click();
await page.waitForTimeout(1000);
await calc.getByRole("button", { name: "Оформить заявку" }).click();
await page.waitForTimeout(2500);
await page.keyboard.press("Escape");
await page.waitForTimeout(800);
await smoothScroll(".faq-block", 2000);
await page.waitForTimeout(1500);
await context.close();
const [raw] = (await readdir(`${out}/.video`)).filter((f) => f.endsWith(".webm"));
execFileSync("ffmpeg", [
  "-y", "-loglevel", "error",
  "-i", `${out}/.video/${raw}`,
  "-vf", "scale=1920:1080,fps=30",
  "-c:v", "libx264", "-preset", "slow", "-crf", "26",
  "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an",
  `${out}/onega-walkthrough-1080p.mp4`,
]);
await rm(`${out}/.video`, { recursive: true, force: true });

// Cover: real screenshots in flat device frames on a light background.
const toData = async (file) => `data:image/png;base64,${(await readFile(file)).toString("base64")}`;
const desktop = await toData(`${out}/screens/01-home-hero-1440.png`);
const mobile = await toData(`${out}/screens/08-mobile-hero-390.png`);
const logo = await (await fetch(`${base}/brand/logo.svg`)).text();
page = await open("/ui", 1920, 1080, 1);
await page.waitForTimeout(500);
await page.evaluate(
  ({ desktop, mobile, logo }) => {
    document.body.innerHTML = `<div class="cover">
      <div class="cover-copy"><div class="cover-logo">${logo}</div>
        <p class="cover-kicker">Кейс Shvetsov Studio</p>
        <h1>Сайт транспортной компании с калькулятором перевозок</h1>
        <p class="cover-text">Расчёт цены и срока, заявка, карта направлений, отслеживание груза. Демо-проект, компания вымышлена.</p></div>
      <div class="laptop"><div class="laptop-screen"><img src="${desktop}" alt=""></div><div class="laptop-base"></div></div>
      <div class="phone"><img src="${mobile}" alt=""></div></div>`;
    const style = document.createElement("style");
    style.textContent = `body{margin:0}
    .cover{position:relative;width:1920px;height:1080px;overflow:hidden;background:#f2f4f7;font-family:var(--font-inter),sans-serif;color:#0b1f33}
    .cover-copy{position:absolute;left:120px;top:120px;width:560px}
    .cover-logo svg{height:48px;width:auto}
    .cover-kicker{margin-top:72px;font-size:20px;font-weight:600;color:#667085}
    .cover h1{margin-top:20px;font-size:56px;line-height:62px;letter-spacing:-.04em;color:#0b2a4a}
    .cover-text{margin-top:28px;font-size:22px;line-height:32px;color:#667085}
    .laptop{position:absolute;left:760px;top:170px;width:1240px}
    .laptop-screen{background:#0b1f33;border-radius:20px 20px 0 0;padding:22px 22px 26px}
    .laptop-screen img{display:block;width:100%;border-radius:4px}
    .laptop-base{height:26px;margin:0 -60px;background:#d0d5dd;border-radius:0 0 18px 18px;box-shadow:0 30px 60px -30px rgba(16,24,40,.35)}
    .phone{position:absolute;left:660px;top:420px;width:300px;padding:14px;background:#0b1f33;border-radius:44px;box-shadow:0 30px 60px -20px rgba(16,24,40,.4)}
    .phone img{display:block;width:100%;border-radius:32px}`;
    document.head.append(style);
  },
  { desktop, mobile, logo },
);
await page.evaluate(() => Promise.all(Array.from(document.images, (i) => i.decode())));
await page.screenshot({ path: `${out}/cover-1920x1080.png` });
await page.close();
await browser.close();
console.log("portfolio/: screens, onega-walkthrough-1080p.mp4, cover-1920x1080.png");
