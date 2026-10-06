import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const widths = [360, 390, 768, 1024, 1440, 1920];

test("главная: структура, адаптив, доступность", async ({ page }) => {
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    const size = await page.locator("h1").evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(size, `h1 @ ${width}`).toBeLessThanOrEqual(width < 768 ? 48 : 76);
    // Hero: headline, copy, actions, photo. No form inside.
    await expect(page.locator("#hero-title ~ * input, section:first-of-type select")).toHaveCount(0);
    await expect(page.locator("#services ol > li")).toHaveCount(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `scroll @ ${width}`).toBe(true);
    if (width === 390 || width === 1440) {
      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      expect(axe.violations.map((v) => `${v.id} ${v.nodes.map((n) => n.target).join(",")}`), `axe @ ${width}`).toEqual([]);
    }
  }
});

test("все ссылки ведут на существующие адреса", async ({ page, request }) => {
  await page.goto("/");
  const hrefs = await page.locator("a[href]").evaluateAll((els) => els.map((e) => e.getAttribute("href")!));
  for (const href of hrefs) {
    if (href.startsWith("#")) expect(await page.locator(href).count(), href).toBe(1);
    else if (href.startsWith("/")) expect((await request.get(href)).status(), href).toBe(200);
  }
});

test("калькулятор: пересчёт, машина, ошибка, обмен городов", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const calc = page.locator("#calculator");
  const total = calc.getByTestId("total");
  await expect(total).toContainText("7 500");
  await expect(calc.locator("h2").first()).toContainText("Москва → Екатеринбург");
  await calc.getByLabel("Вес, кг").fill("900");
  await expect(total).toContainText("20 700");
  await calc.getByText("Отдельная машина").click();
  await expect(calc.getByTestId("vehicle")).toHaveText("Газель");
  await calc.getByLabel("Вес, кг").fill("18000");
  await expect(calc.getByTestId("vehicle")).toHaveText("Фура 20 т");
  await calc.getByLabel("Вес, кг").fill("25000");
  await expect(calc.getByRole("status")).toContainText("не помещается");
  await calc.getByLabel("Вес, кг").fill("250");
  await calc.getByRole("button", { name: "Поменять города местами" }).click();
  await expect(calc.locator("h2").first()).toContainText("Екатеринбург → Москва");
  await calc.getByLabel("Куда", { exact: true }).selectOption({ label: "Казань" });
  await expect(calc.locator("h2").first()).toContainText("Екатеринбург → Казань");
});

test("калькулятор на телефоне: доп. параметры свёрнуты, цена сразу после веса", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const calc = page.locator("#calculator");
  const toggle = calc.getByRole("button", { name: "Дополнительные параметры" });
  await expect(calc.getByText("Тип перевозки")).toBeHidden();
  const priceTop = await calc.getByTestId("total").evaluate((e) => e.getBoundingClientRect().top);
  const toggleTop = await toggle.evaluate((e) => e.getBoundingClientRect().top);
  expect(priceTop).toBeLessThan(toggleTop);
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(calc.getByText("Тип перевозки")).toBeVisible();
});

test("заявка: проверка полей, Escape, клик вне, возврат фокуса, успех", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const open = page.getByRole("button", { name: "Оформить заявку" });
  await open.click();
  const dialog = page.getByRole("dialog", { name: "Заявка на перевозку" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Москва → Екатеринбург, 250 кг");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(open).toBeFocused();
  await open.click();
  await page.mouse.click(10, 10);
  await expect(dialog).toBeHidden();
  await open.click();
  await dialog.getByRole("button", { name: "Отправить заявку" }).click();
  await expect(dialog.getByLabel("Имя")).toBeFocused();
  await dialog.getByLabel("Имя").fill("Ирина");
  await dialog.getByLabel("Телефон").pressSequentially("9001234567");
  await expect(dialog.getByLabel("Телефон")).toHaveValue("+7 (900) 123-45-67");
  await dialog.getByText("Даю согласие").click();
  await dialog.getByRole("button", { name: "Отправить заявку" }).click();
  await expect(page.getByRole("dialog", { name: "Заявка принята" })).toContainText(/ОН-\d{6}-\d{4}/);
});

test("мобильное меню: Escape закрывает и возвращает фокус", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const burger = page.getByRole("button", { name: "Меню" });
  await burger.click();
  await expect(page.locator("#site-menu")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#site-menu")).toBeHidden();
  await expect(burger).toBeFocused();
});
