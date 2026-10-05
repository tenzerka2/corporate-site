import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = [
  "/",
  "/calculator",
  "/services/groupage",
  "/services/ftl",
  "/services/warehouse",
  "/services/marketplaces",
  "/directions",
  "/directions/moscow-ekaterinburg",
  "/directions/saint-petersburg-kazan",
  "/tracking",
  "/about",
  "/contacts",
  "/tariffs",
  "/documents",
  "/faq",
  "/privacy",
  "/terms",
  "/offer",
];
const clean = ".site-header, .skip-link { visibility: hidden !important; }";

test("SEO: уникальные заголовки и описания, canonical, один H1, валидный JSON-LD", async ({
  page,
}) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const path of pages) {
    await page.goto(path);
    const info = await page.evaluate(() => ({
      title: document.title,
      description: document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content,
      canonical: document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href,
      og: document.querySelector<HTMLMetaElement>('meta[property="og:image"]')?.content,
      h1: document.querySelectorAll("h1").length,
      jsonLd: Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(
        (s) => s.textContent ?? "",
      ),
    }));
    expect(info.h1, path).toBe(1);
    expect(info.description, path).toBeTruthy();
    expect(new URL(info.canonical!).pathname.replace(/\/$/, "") || "/", path).toBe(path);
    expect(info.og, path).toContain("/og.png");
    titles.add(info.title);
    descriptions.add(info.description!);
    const types = info.jsonLd.flatMap((text) => {
      const data = JSON.parse(text);
      return (Array.isArray(data) ? data : [data]).map((item) => item["@type"]);
    });
    expect(types, path).toContain("Organization");
    if (path !== "/" && path !== "/calculator") expect(types, path).toContain("BreadcrumbList");
    if (path.startsWith("/services/") || path === "/faq")
      expect(types, path).toContain("FAQPage");
    if (path === "/contacts") expect(types.filter((t) => t === "LocalBusiness")).toHaveLength(6);
  }
  expect(titles.size).toBe(pages.length);
  expect(descriptions.size).toBe(pages.length);

  const sitemap = await (await page.request.get("/sitemap.xml")).text();
  for (const path of pages.filter((p) => p !== "/")) expect(sitemap).toContain(`${path}</loc>`);
  const robots = await (await page.request.get("/robots.txt")).text();
  expect(robots).toContain("Sitemap:");
  expect((await page.request.get("/og.png")).status()).toBe(200);
  expect((await page.request.get("/docs/onega-demo-documents.pdf")).status()).toBe(200);
});

test("страницы: адаптив без горизонтального скролла и доступность", async ({ page }) => {
  test.setTimeout(600_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of pages) {
      await page.goto(path);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${path} @ ${width}`,
      ).toBe(true);
      if (width === 390 || width === 1440) {
        const axe = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        expect(
          axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`),
          `${path} @ ${width}`,
        ).toEqual([]);
      }
      if ([390, 1440].includes(width) && !path.includes("saint"))
        await page.screenshot({
          path: `artifacts/stage-5/${width}${path.replace(/\W+/g, "_") || "_home"}.png`,
          fullPage: true,
          style: clean,
        });
    }
  }
});

test("отслеживание: демо-номер, таймлайн, документы и неверный номер", async ({ page }) => {
  await page.goto("/tracking");
  const input = page.getByLabel("Номер заявки");
  await input.fill("123");
  await page.getByRole("button", { name: "Найти" }).click();
  await expect(page.locator(".tracking-form").getByRole("alert")).toContainText("ON-2026-104733");
  await expect(input).toBeFocused();
  await input.fill("ON-2026-000001");
  await page.keyboard.press("Enter");
  await expect(page.locator(".tracking-form").getByRole("alert")).toContainText("не найдена");
  await input.fill("он 2026 104733");
  await page.keyboard.press("Enter");
  const result = page.getByRole("region", { name: "ON-2026-104733" });
  await expect(result).toBeFocused();
  await expect(result.locator("[aria-current=step]")).toContainText("На складе в Екатеринбурге");
  await expect(result.locator(".map-current")).toHaveCount(1);
  const download = page.waitForEvent("download");
  await result.getByRole("link", { name: "Скачать документы" }).click();
  expect((await download).suggestedFilename()).toBe("onega-demo-documents.pdf");
});

test("услуга и направление предзаполняют калькулятор", async ({ page }) => {
  await page.goto("/services/ftl");
  await expect(page.locator("#calculator input[value=ftl]")).toBeChecked();
  await expect(page.locator("table")).toContainText("Фура до 20 т");
  await page.goto("/directions/saint-petersburg-kazan");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Грузоперевозки Санкт-Петербург → Казань",
  );
  await expect(page.getByRole("combobox", { name: "Откуда", exact: true })).toHaveText(
    "Санкт-Петербург",
  );
  await expect(page.getByRole("combobox", { name: "Куда", exact: true })).toHaveText("Казань");
  await expect(page.locator(".link-grid li")).toHaveCount(4);
});

test("контакты: форма проверяет поля и показывает подтверждение", async ({ page }) => {
  await page.goto("/contacts");
  await page.getByRole("button", { name: "Отправить" }).click();
  await expect(page.getByLabel("Имя")).toBeFocused();
  await page.getByLabel("Имя").fill("Олег");
  await page.getByLabel("Телефон").pressSequentially("9001234567");
  await page.getByText("Даю согласие на обработку персональных данных").click();
  await page.getByRole("button", { name: "Отправить" }).click();
  await expect(page.getByRole("status")).toContainText("Сообщение отправлено");
});

test("404 в стиле сайта с переходом к расчёту", async ({ page }) => {
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Страница не найдена");
  await page.getByRole("link", { name: "Рассчитать", exact: true }).click();
  await expect(page).toHaveURL(/\/calculator$/);
  await page.goto("/services/unknown");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Страница не найдена");
});
