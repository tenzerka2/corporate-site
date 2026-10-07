import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const prefix = process.env.ONEGA_BASE_PATH || "";
test.beforeEach(async ({ page }) => {
  const goto = page.goto.bind(page);
  page.goto = (url, options) => goto(url.startsWith("/") ? `${prefix}${url}` : url, options);
});

const widths = [360, 390, 768, 1024, 1440, 1920, 2560];

const pages = [
  "/",
  "/services",
  "/services/groupage",
  "/services/truck",
  "/services/storage",
  "/services/marketplaces",
  "/tariffs",
  "/calculator",
  "/tracking",
  "/about",
  "/warehouses",
  "/contacts",
  "/privacy",
];

test("главная: структура, общая левая граница и отдельная фотография", async ({ page }) => {
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const size = await page.locator("h1").evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(size, `h1 @ ${width}`).toBeLessThanOrEqual(width < 768 ? 48 : 76);
    await expect(page.locator("section:first-of-type input, section:first-of-type select")).toHaveCount(0);
    await expect(page.locator("#how ol > li")).toHaveCount(3);
    await expect(page.locator("#services h3")).toHaveCount(4);
    const layout = await page.evaluate(() => {
      const title = document.querySelector("h1")!.getBoundingClientRect();
      const logo = document.querySelector("header a img")!.getBoundingClientRect();
      const services = document.querySelector("#services h2")!.getBoundingClientRect();
      const photo = document.querySelector("main section:first-of-type img")!.getBoundingClientRect();
      return { title: title.x, logo: logo.x, services: services.x, photoTop: photo.top, photoLeft: photo.left, titleRight: title.right, titleBottom: title.bottom };
    });
    expect(layout.title, `gutter @ ${width}`).toBeGreaterThan(0);
    expect(Math.abs(layout.title - layout.services)).toBeLessThan(1);
    expect(Math.abs(layout.title - layout.logo)).toBeLessThan(1);
    expect(width >= 1024 ? layout.photoLeft >= layout.titleRight : layout.photoTop > layout.titleBottom).toBe(true);
  }
});

test("все страницы: один h1, без горизонтального скролла, доступность", async ({ page }) => {
  test.setTimeout(180_000);
  for (const path of pages) {
    for (const width of [390, 1024, 1440, 2560]) {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(200);
      await expect(page.locator("h1"), path).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `scroll ${path} @ ${width}`).toBe(true);
      if (width !== 768) {
        const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
        expect(axe.violations.map((v) => `${v.id} ${v.nodes.map((n) => n.target).join(",")}`), `axe ${path} @ ${width}`).toEqual([]);
      }
    }
  }
});

test("все ссылки ведут на существующие страницы и якоря", async ({ page }) => {
  const known = new Set(pages);
  for (const path of pages) {
    await page.goto(path);
    const hrefs = await page.locator("a[href]").evaluateAll((els) => els.map((e) => e.getAttribute("href")!));
    for (const href of hrefs) {
      if (/^(tel|mailto):/.test(href) || href === "https://shvetsov.studio/cases/onega") continue;
      const [routeAndQuery, hash] = href.replace(prefix, "").split("#");
      const route = routeAndQuery.split("?")[0];
      const target = route || path;
      expect(known.has(target), `${path} -> ${href}`).toBe(true);
      if (hash) {
        if (target !== path) await page.goto(target);
        expect(await page.locator(`#${hash}`).count(), `${path} -> ${href}`).toBe(1);
        if (target !== path) await page.goto(path);
      }
    }
  }
  expect((await page.goto("/services/nope"))?.status()).toBe(404);
});

test("калькулятор: пересчёт, машина, ошибка, обмен городов", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const calc = page.locator("#calculator");
  const total = calc.getByTestId("total");
  await expect(total).toContainText("7 500");
  await expect(calc.getByTestId("route")).toContainText("Москва → Екатеринбург");
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
  await expect(calc.getByTestId("route")).toContainText("Екатеринбург → Москва");
  await calc.getByLabel("Куда", { exact: true }).selectOption({ label: "Казань" });
  await expect(calc.getByTestId("route")).toContainText("Екатеринбург → Казань");
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
  await expect(page.getByRole("dialog", { name: "Демонстрационная заявка оформлена" })).toContainText(/ОН-\d{6}-\d{4}/);
});

test("выпадающее меню: открытие, переход, Escape", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Услуги" });
  await trigger.click();
  await expect(page.locator("#menu-0")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#menu-0")).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.locator("#menu-0").getByRole("link", { name: /Отдельная машина/ }).click();
  await expect(page).toHaveURL(/\/services\/truck$/);
  await expect(page.locator("h1")).toContainText("Отдельная машина");
  await expect(page.locator("#menu-0")).toBeHidden();
});

test("вкладки условий: клик и стрелки", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/services/truck");
  const tabs = page.getByRole("tab");
  await expect(tabs).toHaveCount(4);
  await expect(page.getByRole("tabpanel")).toContainText("1\u00a0500 кг");
  await tabs.nth(3).click();
  await expect(page.getByRole("tabpanel")).toContainText("Фура 20 т");
  await page.keyboard.press("ArrowDown");
  await expect(tabs.nth(0)).toBeFocused();
  await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("End");
  await expect(tabs.nth(3)).toHaveAttribute("aria-selected", "true");
});

test("отслеживание: номер находится, ошибка на неверный", async ({ page }) => {
  await page.goto("/tracking");
  const field = page.getByLabel("Номер заявки");
  await field.fill("123");
  await page.getByRole("button", { name: "Найти" }).click();
  await expect(page.getByText("Не нашли заявку")).toBeVisible();
  await field.fill("он 260901 4821");
  await page.getByRole("button", { name: "Найти" }).click();
  await expect(page.getByText("ОН-260901-4821")).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: /→/ })).toBeVisible();
  await expect(page.locator("article ol li")).toHaveCount(5);
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

test("отдельная машина: услуга, расчёт, заявка и её маршрут в отслеживании", async ({ page }) => {
  await page.goto("/services/truck");
  await page.getByRole("link", {name:"Рассчитать стоимость",exact:true}).first().click();
  await expect(page).toHaveURL(/calculator\?mode=truck$/);
  const calc=page.locator("#calculator");
  await expect(calc.getByRole("radio",{name:"Отдельная машина"})).toBeChecked();
  await calc.getByLabel("Откуда",{exact:true}).selectOption("kazan");
  await calc.getByLabel("Куда",{exact:true}).selectOption("novosibirsk");
  await calc.getByRole("button",{name:"Оформить заявку"}).click();
  const dialog=page.getByRole("dialog");
  await dialog.getByLabel("Имя").fill("Демо");
  await dialog.getByLabel("Телефон").fill("89001234567");
  await dialog.getByRole("checkbox").check();
  await dialog.getByRole("button",{name:"Отправить заявку"}).click();
  const content=await dialog.getByRole("status").innerText();
  const number=content.match(/ОН-\d{6}-\d{4}/)![0];
  await dialog.getByRole("link",{name:"Где мой груз"}).click();
  await expect(page.getByLabel("Номер заявки")).toHaveValue(number);
  await expect(page.getByRole("heading",{level:2,name:"Казань → Новосибирск"})).toBeVisible();
  expect(page.url()).not.toContain("9001234567");
  await page.screenshot({path:"screenshots/release/order-to-tracking.png",fullPage:true});
  await page.reload();
  await expect(page.getByRole("heading",{level:2,name:"Казань → Новосибирск"})).toBeVisible();
});

test("десять открытий заявки: фокус, отсутствие лишней прокрутки и узлов", async ({page}) => {
  await page.setViewportSize({width:390,height:700});
  await page.goto("/calculator");
  const open=page.getByRole("button",{name:"Оформить заявку"});
  await open.scrollIntoViewIfNeeded();
  const measure=()=>page.evaluate(()=>({height:document.body.scrollHeight,nodes:document.body.childElementCount}));
  const before=await measure();
  for(let i=0;i<10;i++) {
    await open.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    if(i===0)await page.screenshot({path:"screenshots/release/dialog-390-700.png"});
    await page.keyboard.press("Escape");
    await expect(open).toBeFocused();
  }
  expect(await measure()).toEqual(before);
});
