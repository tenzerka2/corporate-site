import { expect, test } from "@playwright/test";

test("главная: последовательность, адаптив, читаемые тексты и действия", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [360, 390, 768, 1024, 1440, 1920, 2560]) {
    await page.goto("about:blank");
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const hero = page.locator(".home-hero");
    await expect(hero.locator(".hero-promises li")).toHaveCount(3);
    await expect(page.locator(".company-stats > div")).toHaveCount(5);
    await expect(page.locator(".home-industry-grid li")).toHaveCount(8);
    await expect(page.locator(".process-grid > li")).toHaveCount(3);
    await expect(page.locator(".benefits-grid > li")).toHaveCount(6);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const alignment = await page.evaluate(() => {
      const selectors = [
        ".site-header .logo",
        ".hero-copy h1",
        "#industries-title",
        "#process-title",
        "#benefits-title",
        "#services-title",
      ];
      return selectors.map(
        (selector) =>
          document.querySelector(selector)!.getBoundingClientRect().left,
      );
    });
    // Header has the burger before its logo; section text follows the shared container.
    expect(alignment[0]).toBeGreaterThan(15);
    expect(
      Math.max(...alignment.slice(1)) - Math.min(...alignment.slice(1)),
    ).toBeLessThan(1);
    if (width < 768) {
      const artwork = await page.locator(".hero-visual").boundingBox();
      const title = await page.locator("h1").boundingBox();
      expect(artwork!.y + artwork!.height).toBeLessThanOrEqual(title!.y);
    }
    await page.screenshot({ path: `artifacts/stage-3/hero-${width}.png` });
    await page.evaluate(() => {
      for (const image of document.images) image.loading = "eager";
    });
    await expect
      .poll(
        () =>
          page.evaluate(() =>
            Array.from(document.images)
              .filter((i) => !i.complete || i.naturalWidth === 0)
              .map((i) => i.currentSrc),
          ),
        { timeout: 15000 },
      )
      .toEqual([]);
    await page.screenshot({
      path: `artifacts/stage-3/home-${width}.png`,
      fullPage: true,
    });
  }
  for (const [name, href] of [
    ["Рассчитать стоимость", "/calculator"],
    ["Связаться с менеджером", "/help"],
  ]) {
    await page.getByRole("link", { name, exact: true }).first().click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await expect(
      page.getByText("Раздел в разработке", { exact: true }),
    ).toBeVisible();
    await page.goBack();
  }
  await page.goto("/#how-it-works");
  expect(
    await page
      .locator("#process-title")
      .evaluate((el) => el.getBoundingClientRect().top),
  ).toBeGreaterThanOrEqual(72);
});

test("движение: однократные счётчики и режим уменьшенной анимации", async ({
  page,
  browser,
}) => {
  await page.goto("/");
  await page.locator(".company-stats").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-counter]").first()).toHaveText("1 200+", {
    timeout: 3000,
  });
  await page.locator(".home-benefits").scrollIntoViewIfNeeded();
  await page.locator(".company-stats").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-counter]").first()).toHaveText("1 200+");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.locator(".hero-entry")).toHaveCSS("animation-name", "none");
  await page.locator(".company-stats").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-counter]").first()).toHaveText("1 200+");
  const context = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await context.newPage();
  await staticPage.goto("/");
  await expect(
    staticPage.getByRole("heading", { name: "Как это работает", exact: true }),
  ).toBeVisible();
  await expect(staticPage.locator("[data-counter]").first()).toHaveText(
    "1 200+",
  );
  await context.close();
});
