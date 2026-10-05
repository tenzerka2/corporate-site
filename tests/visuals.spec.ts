import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("карта: город, маршрут, поиск и клавиатура", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const map = page.getByRole("group", { name: "Карта России с городами доставки и маршрутами из Москвы" });
  await expect(map.getByRole("button")).toHaveCount(18);
  await map.getByRole("button", { name: "Новосибирск", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".route-detail h3")).toHaveText("Новосибирск");
  await expect(page.locator(".route-detail")).toContainText("5–6 дней");
  const path = await page.locator(".map-route-active").getAttribute("d");
  await page.getByRole("combobox", { name: "Город назначения" }).click();
  await page.getByRole("textbox", { name: "Поиск: Город назначения" }).fill("Владивосток");
  await page.getByRole("option", { name: "Владивосток" }).click();
  await expect(page.locator(".route-detail h3")).toHaveText("Владивосток");
  expect(await page.locator(".map-route-active").getAttribute("d")).not.toBe(path);
  await expect(page.locator(".route-detail")).toContainText("Партнёрский терминал");
  await page.evaluate(() => { const section = document.querySelector("#geography")!; window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY - 112); });
  await page.locator("#geography").screenshot({ path: "artifacts/stage-2/map-selected.png" });
  const axe = await new AxeBuilder({ page }).include("#geography").analyze();
  expect(axe.violations).toEqual([]);
});
test("визуалы: изображения, адаптив и локальные источники", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  for (const width of [360,390,768,1024,1440,2560]) {
    await page.goto("about:blank");
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/visuals");
    await page.waitForLoadState("networkidle");
    await page.evaluate(async () => { for (const image of document.images) { image.loading = "eager"; } await document.fonts.ready; });
    await expect.poll(() => page.evaluate(() => Array.from(document.images).filter(i => !i.complete || i.naturalWidth === 0).map(i => i.currentSrc)), { timeout: 15000 }).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `artifacts/stage-2/visuals-${width}.png`, fullPage: true });
  }
  expect(errors).toEqual([]);
});
