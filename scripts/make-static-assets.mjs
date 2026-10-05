// Renders public/og.png and public/docs/onega-demo-documents.pdf with the site font.
// Needs a running production server: npm run start -- --port 3106
// Usage: node scripts/make-static-assets.mjs [baseUrl]
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] || process.env.ONEGA_TEST_URL || "http://127.0.0.1:3106";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH,
  args: ["--no-sandbox"],
});

// Loads a site page so its CSS and Inter faces are available, then swaps the body.
async function sitePage(viewport, html, css) {
  const page = await browser.newPage({ viewport });
  await page.goto(`${base}/ui`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.evaluate(
    ({ html, css }) => {
      document.body.innerHTML = html;
      const style = document.createElement("style");
      style.textContent = css;
      document.head.append(style);
    },
    { html, css },
  );
  await page.evaluate(() => document.fonts.ready);
  return page;
}

const mark = await (await fetch(`${base}/brand/mark.svg`)).text();
const logoDark = await (await fetch(`${base}/brand/logo-dark.svg`)).text();

const og = await sitePage(
  { width: 1200, height: 630 },
  `<div class="og">
    <div class="og-brand">${logoDark}</div>
    <h1>Доставка грузов<br>по России</h1>
    <p>Сборные грузы от 1 кг и отдельные машины до 20 т. Расчёт онлайн за 2 минуты.</p>
    <div class="og-facts"><span>6 складов</span><span>180 городов</span><span>140 машин</span></div>
    <small>Демо-проект Shvetsov Studio</small>
  </div>`,
  `body{margin:0;background:#0a1f3a}
  .og{box-sizing:border-box;width:1200px;height:630px;padding:64px 72px;background:#0a1f3a;color:#fff;font-family:var(--font-inter),sans-serif;position:relative;overflow:hidden}
  .og-brand{display:flex;align-items:center;gap:16px;font-size:34px;font-weight:700;letter-spacing:-.03em}
  .og-brand svg{height:44px;width:auto}
  .og h1{color:#fff;font-size:76px;line-height:80px;letter-spacing:-.045em;margin:56px 0 0}
  .og p{margin-top:24px;max-width:38ch;font-size:28px;line-height:38px;color:#aeb6c2}
  .og-facts{display:flex;gap:32px;margin-top:40px;font-size:22px;font-weight:600}
  .og-facts span{padding-top:12px;border-top:2px solid #f26b1d}
  .og small{position:absolute;right:72px;bottom:56px;font-size:16px;color:#aeb6c2}`,
);
await og.screenshot({ path: "public/og.png" });

const row = (cells) => `<tr>${cells.map((c) => `<td>${c}</td>`).join("")}</tr>`;
const docs = await sitePage(
  { width: 794, height: 1123 },
  `<section class="doc">
    <header><span class="doc-brand">${mark}Онега Логистик</span><span class="demo">ДЕМО. Документ вымышленной компании</span></header>
    <h1>Транспортная накладная № ON-2026-104733</h1>
    <p class="muted">от 1 октября 2026 года</p>
    <table>
      ${row(["Грузоотправитель", "ООО «Пример», Москва"])}
      ${row(["Грузополучатель", "ООО «Образец», Екатеринбург"])}
      ${row(["Перевозчик", "ООО «Онега Логистик»"])}
      ${row(["Маршрут", "Москва → Екатеринбург, 1 771 км"])}
      ${row(["Груз", "Сборный груз, 4 места, 380 кг, 2,1 м³"])}
      ${row(["Объявленная стоимость", "450 000 ₽"])}
      ${row(["Принят", "1 октября 2026, 15:20, склад Онеги, Москва"])}
    </table>
    <div class="signs"><span>Отправитель ____________</span><span>Перевозчик ____________</span></div>
  </section>
  <section class="doc">
    <header><span class="doc-brand">${mark}Онега Логистик</span><span class="demo">ДЕМО. Документ вымышленной компании</span></header>
    <h1>Акт оказанных услуг № ON-2026-104733</h1>
    <p class="muted">к заявке ON-2026-104733</p>
    <table class="lines">
      <tr><th>Услуга</th><th>Сумма</th></tr>
      ${row(["Перевозка сборного груза Москва → Екатеринбург", "11 550 ₽"])}
      ${row(["Забор от двери", "900 ₽"])}
      ${row(["Доставка до двери", "900 ₽"])}
      ${row(["<b>Итого, в том числе НДС</b>", "<b>13 350 ₽</b>"])}
    </table>
    <p>Услуги оказаны полностью и в срок. Заказчик претензий по объёму, качеству и срокам не имеет.</p>
    <div class="signs"><span>Исполнитель ____________</span><span>Заказчик ____________</span></div>
  </section>`,
  `body{margin:0;background:#fff}
  .doc{box-sizing:border-box;width:794px;height:1123px;padding:64px;font-family:var(--font-inter),sans-serif;color:#0b1f33;page-break-after:always;position:relative}
  header{display:flex;justify-content:space-between;align-items:center;padding-bottom:20px;border-bottom:2px solid #0a1f3a}
  .doc-brand{display:flex;align-items:center;gap:12px;font-weight:700;font-size:20px;color:#0a1f3a}
  .doc-brand svg{width:32px;height:auto}
  .demo{font-size:12px;font-weight:600;color:#d92d20;border:1px solid #d92d20;padding:4px 8px;border-radius:4px}
  h1{font-size:26px;line-height:32px;margin:48px 0 8px;letter-spacing:-.02em}
  .muted{color:#4f5866;margin:0}
  table{width:100%;border-collapse:collapse;margin:32px 0;font-size:15px}
  td,th{padding:12px 0;border-bottom:1px solid #e2e5ea;text-align:left;vertical-align:top}
  td:first-child{color:#4f5866;width:40%}
  .lines td:first-child{color:#0b1f33;width:auto}
  .lines td:last-child,.lines th:last-child{text-align:right}
  th{font-size:13px;color:#4f5866;font-weight:500}
  p{font-size:15px;line-height:24px}
  .signs{position:absolute;left:64px;right:64px;bottom:96px;display:flex;justify-content:space-between;font-size:15px}`,
);
await mkdir("public/docs", { recursive: true });
await docs.pdf({
  path: "public/docs/onega-demo-documents.pdf",
  width: "794px",
  height: "1123px",
  printBackground: true,
  pageRanges: "1-2",
});
await browser.close();
console.log("public/og.png, public/docs/onega-demo-documents.pdf");
