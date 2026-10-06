import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const clean = ".site-header, .skip-link { visibility: hidden !important; }";
const total = (page: Page) => page.getByTestId("calculator-total");
const digits = async (page: Page) =>
  Number((await total(page).innerText()).replace(/\D/g, ""));

async function scrollTo(page: Page, selector: string) {
  await page.evaluate((s) => {
    const element = document.querySelector(s)!;
    window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - 96);
  }, selector);
}

test("калькулятор пересчитывает цену, выбирает машину и сообщает об ошибках", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const calculator = page.locator("#calculator");
  await expect(total(page)).toContainText("₽");
  const groupage = await digits(page);
  await calculator.getByLabel("Вес, кг").fill("800");
  await expect.poll(() => digits(page)).toBeGreaterThan(groupage);

  await calculator.getByText("Отдельная машина", { exact: true }).click();
  await expect(calculator.locator(".calculator-vehicle dd")).toHaveText(
    "Газель до 1,5 т, 9 м³",
  );
  await calculator.getByLabel("Вес, кг").fill("18000");
  await expect(calculator.locator(".calculator-vehicle dd")).toHaveText(
    "Фура до 20 т, 82 м³",
  );
  const ftl = await digits(page);
  await calculator.locator(".checkbox-label", { hasText: "Жёсткая упаковка" }).click();
  await expect.poll(() => digits(page)).toBeGreaterThan(ftl);
  await expect(calculator.locator(".calc-lines")).toContainText(
    "Жёсткая упаковка",
  );

  await calculator.getByLabel("Вес, кг").fill("25000");
  await expect(calculator.getByRole("status")).toContainText("не помещается");
  await expect(calculator.getByLabel("Вес, кг")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await calculator.getByLabel("Вес, кг").fill("18000");

  await calculator.getByRole("button", { name: "Поменять города местами" }).click();
  await expect(calculator.getByRole("combobox", { name: "Откуда", exact: true })).toHaveText(
    "Екатеринбург",
  );
  await calculator.getByRole("combobox", { name: "Куда", exact: true }).click();
  await page.getByRole("textbox", { name: "Поиск: Куда" }).fill("Владив");
  await page.getByRole("option", { name: "Владивосток" }).click();
  await expect(calculator.locator(".calc-lines")).toContainText("дн");
  await scrollTo(page, "#calculator");
  await calculator.screenshot({ path: "artifacts/stage-4/calculator-result-1440.png", style: clean });
});

test("направления подставляют города в калькулятор, карта показывает карточку города", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const route = page.getByRole("button", { name: /Москва → Новосибирск/ });
  await route.click();
  await expect(route).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#calculator").getByRole("combobox", { name: "Куда", exact: true })).toHaveText(
    "Новосибирск",
  );
  await expect(page.locator(".map-label")).toHaveText(["Москва", "Новосибирск"]);

  const map = page.getByRole("group", { name: /Карта России/ });
  await expect(map.getByRole("button")).toHaveCount(18);
  await scrollTo(page, "#geography");
  await map.getByRole("button", { name: "Краснодар", exact: true }).hover();
  const card = page.getByRole("tooltip");
  await expect(card).toContainText("Краснодар");
  await expect(card).toContainText("из Москвы");
  await expect(card).toContainText("Собственный склад");
  await page.locator("#geography").screenshot({
    path: "artifacts/stage-4/map-hover-1440.png",
    style: ".skip-link { visibility: hidden !important; }",
  });
  await page.keyboard.press("Escape");
  await expect(card).toHaveCount(0);

  await map.getByRole("button", { name: "Омск", exact: true }).focus();
  await expect(page.getByRole("tooltip")).toContainText("Партнёрский терминал");
  await page.keyboard.press("Enter");
  await expect(page.locator("#calculator").getByRole("combobox", { name: "Куда", exact: true })).toHaveText("Омск");

  const axe = await new AxeBuilder({ page })
    .include("#geography")
    .include("#calculator")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(axe.violations.map((v) => v.id)).toEqual([]);
});

test("заявка: предзаполнение, проверка полей, фокус, Escape и экран успеха", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const open = page.getByRole("button", { name: "Оформить заявку" });
  await open.click();
  const dialog = page.getByRole("dialog", { name: "Заявка на перевозку" });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(".order-summary")).toContainText(
    "Москва → Екатеринбург",
  );
  await expect(dialog.locator(".order-summary")).toContainText("250 кг, 1,2 м³");
  await expect(dialog.locator(".order-summary")).toContainText("Забрать от двери");

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(open).toBeFocused();

  await open.click();
  const focusInDialog = () =>
    page.evaluate(() => Boolean(document.activeElement?.closest("[role=dialog]")));
  await expect.poll(focusInDialog).toBe(true);
  // Floating UI focus guards bounce focus back; check after each bounce settles.
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press("Tab");
    await expect.poll(focusInDialog).toBe(true);
  }

  await dialog.getByRole("button", { name: "Отправить заявку" }).click();
  await expect(dialog.getByLabel("Имя")).toBeFocused();
  await expect(dialog.getByRole("alert")).toHaveCount(3);
  await dialog.getByLabel("Имя").fill("Ирина");
  await dialog.getByLabel("Телефон").pressSequentially("89001234567");
  await expect(dialog.getByLabel("Телефон")).toHaveValue("+7 (900) 123-45-67");
  await dialog.getByLabel("ИНН, необязательно").fill("7707083894");
  await dialog.getByText("Даю согласие на обработку персональных данных").click();
  await dialog.getByRole("button", { name: "Отправить заявку" }).click();
  await expect(dialog.getByLabel("ИНН, необязательно")).toBeFocused();
  await dialog.getByLabel("ИНН, необязательно").fill("7707083893");
  await page.screenshot({ path: "artifacts/stage-4/order-form-1440.png" });
  await dialog.getByRole("button", { name: "Отправить заявку" }).click();
  const success = page.getByRole("dialog", {
    name: "Заявка принята, менеджер свяжется в течение 15 минут",
  });
  await expect(success).toContainText(/ОН-\d{6}-\d{4}/);
  const axe = await new AxeBuilder({ page })
    .include("[role=dialog]")
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(axe.violations.map((v) => v.id)).toEqual([]);
  await page.screenshot({ path: "artifacts/stage-4/order-success-1440.png" });
  await page.mouse.click(10, 10);
  await expect(success).toHaveCount(0);
});

test("вторая половина главной: состав, адаптив и ссылки", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [360, 390, 768, 1024, 1440, 1920, 2560]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".service-item")).toHaveCount(3);
    // Phones show the extra calculator options only on request.
    await expect(page.locator(".calc-more-toggle")).toBeVisible({ visible: width < 768 });
    await expect(page.locator(".directions-list li")).toHaveCount(8);
    await expect(page.locator(".contact-actions a")).toHaveCount(3);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBe(true);
    if ([390, 768, 1440].includes(width))
      for (const [name, selector] of [
        ["services", ".section-services"],
        ["calculator", "#calculator"],
        ["directions", "#geography"],
      ])
        await page.locator(selector).screenshot({
          path: `artifacts/stage-4/${name}-${width}.png`,
          style: clean,
        });
  }
  await page.locator("#calculator").getByText("Отдельная машина", { exact: true }).click();
  await page.locator(".marketplace-block").getByRole("link", { name: "Рассчитать" }).click();
  await expect(page.locator("#calculator input[value=groupage]")).toBeChecked();
  await page.goto("/faq");
  const question = page.getByRole("button", { name: "Что входит в страховку?" });
  await question.click();
  await expect(question).toHaveAttribute("aria-expanded", "true");
});

test("отдельная страница калькулятора учитывает услугу из меню", async ({
  page,
}) => {
  await page.goto("/calculator?service=truck");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Расчёт стоимости: Москва → Екатеринбург",
  );
  await expect(page.locator("#calculator input[value=ftl]")).toBeChecked();
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(axe.violations.map((v) => v.id)).toEqual([]);
});
