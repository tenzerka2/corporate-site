import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("карта: город, маршрут и клавиатура", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/visuals");
  const map = page.getByRole("group", { name: "Карта России с городами доставки и маршрутами из Москвы" });
  await expect(map.getByRole("button")).toHaveCount(18);
  const path = await page.locator(".map-route-active").getAttribute("d");
  await map.getByRole("button", { name: "Новосибирск", exact: true }).focus();
  await expect(page.getByRole("tooltip")).toContainText("из Москвы");
  await page.keyboard.press("Enter");
  await expect(map.getByRole("button", { name: "Новосибирск", exact: true })).toHaveAttribute("aria-pressed", "true");
  expect(await page.locator(".map-route-active").getAttribute("d")).not.toBe(path);
  await map.getByRole("button", { name: "Владивосток", exact: true }).hover();
  await expect(page.getByRole("tooltip")).toContainText("Партнёрский терминал");
  await page.locator(".geography-map").screenshot({ path: "artifacts/stage-2/map-selected.png" });
  const axe = await new AxeBuilder({ page }).include(".geography-map").analyze();
  expect(axe.violations).toEqual([]);
});
test("визуальная система: адаптив и отсутствие отклонённых материалов", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  for (const width of [360,390,768,1024,1440,2560]) {
    await page.goto("about:blank");
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/visuals");
    await page.waitForLoadState("networkidle");
    await page.evaluate(async () => { for (const image of document.images) { image.loading = "eager"; } await document.fonts.ready; });
    await expect.poll(() => page.evaluate(() => Array.from(document.images).filter(i => !i.complete || i.naturalWidth === 0).map(i => i.currentSrc)), { timeout: 15000 }).toEqual([]);
    await expect(page.locator("img")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `artifacts/stage-2/visuals-${width}.png`, fullPage: true });
  }
  expect(errors).toEqual([]);
});
