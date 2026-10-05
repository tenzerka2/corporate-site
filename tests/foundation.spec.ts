import { expect, test } from "@playwright/test";
const widths = [360, 390, 768, 1024, 1440, 1920, 2560];
test("адаптив, локальные ресурсы и ошибки браузера", async ({ page }) => {
  test.setTimeout(240_000);
  const errors: string[] = [];
  const external: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("request", (request) => {
    if (
      !request.url().startsWith("http://127.0.0.1") &&
      !request.url().startsWith("data:")
    )
      external.push(request.url());
  });
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/ui", "/services/groupage"]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(
        await page
          .locator(".site-header .logo")
          .evaluate((el) => el.getBoundingClientRect().left),
      ).toBeGreaterThan(15);
      expect(await page.locator("body").innerText()).not.toContain("—");
      await page.screenshot({
        path: `artifacts/${route === "/" ? "home" : route === "/ui" ? "ui" : "placeholder"}-${width}.png`,
        fullPage: true,
      });
    }
  }
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});
test("мега-меню, Escape, клик вне, полный экран и переходы", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const services = page.getByRole("button", { name: "Услуги", exact: true });
  await services.click();
  await expect(
    page.getByRole("dialog", { name: "Услуги", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".mega-column")).toHaveCount(4);
  await expect(page.locator("#site-menu")).toHaveCSS("opacity", "1");
  await page.screenshot({ path: "artifacts/01-mega-menu.png" });
  await page.keyboard.press("Escape");
  await expect(services).toBeFocused();
  await services.click();
  await page.mouse.click(1100, 700);
  await expect(page.locator("#site-menu")).toHaveCount(0);
  await page.getByRole("button", { name: "Почему мы" }).click();
  await expect(page.getByRole("dialog", { name: "Почему мы" })).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Открыть полное меню" }).click();
  await expect(page.getByRole("dialog", { name: "Полное меню" })).toBeVisible();
  await expect(page.locator("#site-menu")).toHaveCSS("opacity", "1");
  await page.screenshot({ path: "artifacts/02-full-menu.png" });
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press("Tab");
    await expect
      .poll(() =>
        page.evaluate(() => !!document.activeElement?.closest("#site-menu")),
      )
      .toBe(true);
  }
  await page
    .locator(".full-sections")
    .getByRole("link", { name: "Сборные грузы" })
    .click();
  await expect(page).toHaveURL(/services\/groupage/);
  await expect(page.locator("#site-menu")).toHaveCount(0);
  await page.goto("/");
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect(page.locator(".site-header")).toHaveCSS("height", "72px");
  await page.locator("footer").screenshot({ path: "artifacts/03-footer.png" });
});
test("мобильное меню, прокрутка и отсутствие лишних порталов", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 700 });
  await page.goto("/");
  const baseline = await page.evaluate(() => ({
    height: document.body.scrollHeight,
    portals: document.querySelectorAll("[data-floating-ui-portal]").length,
  }));
  const menu = page.getByRole("button", { name: "Открыть полное меню" });
  for (let i = 0; i < 10; i++) {
    await menu.click();
    await expect(page.locator("#site-menu")).toBeVisible();
    await expect(page.locator("#site-menu")).toHaveCSS("opacity", "1");
    if (i === 0)
      await page.screenshot({ path: "artifacts/mobile-menu-390.png" });
    await page.keyboard.press("Escape");
    await expect(page.locator("#site-menu")).toHaveCount(0);
  }
  expect(
    await page.evaluate(() => ({
      height: document.body.scrollHeight,
      portals: document.querySelectorAll("[data-floating-ui-portal]").length,
    })),
  ).toEqual(baseline);
  await menu.click();
  await page.locator(".nav-full").evaluate((el) => {
    el.scrollTop = el.scrollHeight;
  });
  await page.screenshot({ path: "artifacts/mobile-menu-bottom-390.png" });
  await page.locator(".full-menu-bottom a").focus();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
});
test("селекты, поиск, клавиатура, flip и сохранение высоты", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 700 });
  await page.goto("/ui");
  const origin = page.getByRole("combobox", { name: "Откуда", exact: true });
  await origin.scrollIntoViewIfNeeded();
  await origin.click();
  await page.getByRole("textbox", { name: "Поиск: Откуда" }).fill("каз");
  await page.getByRole("option", { name: "Казань" }).click();
  await expect(origin).toHaveText("Казань");
  const cargo = page.getByRole("combobox", { name: "Формат груза" });
  await cargo.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(cargo).toHaveText("Коробки");
  await expect(page.locator(".site-header")).toHaveCSS("height", "72px");
  const baseline = await page.evaluate(() => ({
    height: document.body.scrollHeight,
    portals: document.querySelectorAll("[data-floating-ui-portal]").length,
  }));
  for (let i = 0; i < 10; i++) {
    await cargo.click();
    await page.keyboard.press("Escape");
    await expect(cargo).toBeFocused();
  }
  expect(
    await page.evaluate(() => ({
      height: document.body.scrollHeight,
      portals: document.querySelectorAll("[data-floating-ui-portal]").length,
    })),
  ).toEqual(baseline);
  await cargo.evaluate((el) => {
    window.scrollBy(0, el.getBoundingClientRect().top - (innerHeight - 90));
  });
  await cargo.click();
  const box = await page.locator(".select-popover").boundingBox();
  const field = await cargo.boundingBox();
  expect(box!.y + box!.height).toBeLessThanOrEqual(field!.y);
  await page.screenshot({ path: "artifacts/select-flip-700.png" });
  await page.mouse.wheel(0, 100);
  await expect(page.locator(".select-popover")).toBeVisible();
  await page.screenshot({ path: "artifacts/select-scroll-700.png" });
  await page.keyboard.press("Escape");
});
test("вкладки, аккордеон, якоря и все внутренние ссылки", async ({
  page,
  request,
}) => {
  await page.goto("/ui");
  await page.getByRole("link", { name: "Вкладки", exact: true }).click();
  await expect(page.locator("#disclosure")).toBeInViewport();
  expect(
    await page
      .locator("#disclosure h2")
      .evaluate((el) => el.getBoundingClientRect().top),
  ).toBeGreaterThan(72);
  await page.getByRole("tab", { name: "Сборные грузы" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Отдельная машина" }),
  ).toHaveAttribute("aria-selected", "true");
  const question = page.getByRole("button", {
    name: "Как выбрать формат перевозки?",
  });
  await question.click();
  await expect(question).toHaveAttribute("aria-expanded", "true");
  const links = await page
    .locator('a[href^="/"]')
    .evaluateAll((elements) => [
      ...new Set(elements.map((el) => el.getAttribute("href")!)),
    ]);
  for (const href of links)
    expect((await request.get(href)).status(), href).toBe(200);
  expect((await request.get("/unknown-onega-page")).status()).toBe(404);
});

test("доступность страниц и всплывающих слоёв", async ({ page }) => {
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/ui"]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        result.violations.map(({ id, nodes }) => ({
          id,
          elements: nodes.map((n) => n.target),
        })),
      ).toEqual([]);
    }
  }
  await page.goto("/");
  await page.getByRole("button", { name: "Услуги", exact: true }).click();
  await expect(page.locator("#site-menu")).toHaveCSS("opacity", "1");
  expect(
    (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze())
      .violations,
  ).toEqual([]);
});
