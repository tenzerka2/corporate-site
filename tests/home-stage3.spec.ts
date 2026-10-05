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
    // Strict layout: no checklists or icon rows on the first screen.
    await expect(hero.locator(".check-item, svg.lucide-check")).toHaveCount(0);
    await expect(hero.locator(".quick-quote")).toHaveCount(1);
    await expect(page.locator(".company-stats > div")).toHaveCount(5);
    await expect(page.locator(".service-row")).toHaveCount(4);
    await expect(page.locator(".section-label")).toHaveCount(7);
    await expect(page.locator(".photo-band")).toHaveCount(3);
    await expect(page.locator(".warehouse-table tbody tr")).toHaveCount(6);
    await expect(page.locator("#why-onega .spec-grid > div")).toHaveCount(6);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const alignment = await page.evaluate(() => {
      const selectors = [
        ".site-header .logo",
        ".hero-copy h1",
        "#services-title",
        "#about-title",
        "#conditions-title",
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
    await expect(
      page.locator(
        'img[src*="/images/photos/"], img[src*="/images/renders/"], img[src*="/images/illustrations/"]',
      ),
    ).toHaveCount(0);
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
  await page.getByRole("link", { name: "Рассчитать стоимость", exact: true }).first().click();
  await expect(page).toHaveURL(/#calculator$/);
  await expect(page.locator("#calculator")).toBeInViewport();
  await page.getByRole("link", { name: "Написать менеджеру", exact: true }).click();
  await expect(page).toHaveURL(/\/contacts$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Контакты");
  await page.goBack();
  await page.goto("/#why-onega");
  expect(
    await page
      .locator("#conditions-title")
      .evaluate((el) => el.getBoundingClientRect().top),
  ).toBeGreaterThanOrEqual(72);
});

test("без лишнего движения: цифры и секции видны сразу, страница работает без JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(".company-stats dd").first()).toHaveText("1 200+");
  await expect(page.getByRole("heading", { name: "Что мы делаем", exact: true })).toBeVisible();
  await expect(page.locator("img[alt*='Тягач Онеги']").first()).toBeVisible();
  await context.close();
});
