import { describe, expect, it } from "vitest";
import {
  createOrderNumber,
  formatPhone,
  isValidInn,
  orderMessages,
  phoneDigits,
  validateOrder,
  type OrderFields,
} from "./order";

const valid: OrderFields = {
  name: "Ирина",
  phone: "+7 (900) 123-45-67",
  company: "",
  inn: "",
  comment: "",
  consent: true,
};

describe("Маска телефона", () => {
  it("форматирует по мере ввода", () => {
    expect(formatPhone("9")).toBe("+7 (9");
    expect(formatPhone("900")).toBe("+7 (900)");
    expect(formatPhone("9001")).toBe("+7 (900) 1");
    expect(formatPhone("9001234567")).toBe("+7 (900) 123-45-67");
  });
  it("понимает вставку с 8 и +7 и не теряет цифры при повторном вводе", () => {
    expect(phoneDigits("8 (900) 123-45-67")).toBe("9001234567");
    expect(phoneDigits("+7 900 123 45 67")).toBe("9001234567");
    expect(formatPhone(formatPhone("9001234567") + "8")).toBe(
      "+7 (900) 123-45-67",
    );
    expect(formatPhone("+7 (9")).toBe("+7 (9");
  });
});

describe("ИНН", () => {
  it("проверяет контрольные цифры", () => {
    expect(isValidInn("7707083893")).toBe(true);
    expect(isValidInn("7707083894")).toBe(false);
    expect(isValidInn("500100732259")).toBe(true);
    expect(isValidInn("500100732258")).toBe(false);
  });
});

describe("Проверка заявки", () => {
  it("принимает заполненную заявку без необязательных полей", () => {
    expect(validateOrder(valid)).toEqual({});
  });
  it("требует имя, полный телефон и согласие", () => {
    expect(
      validateOrder({ ...valid, name: " ", phone: "+7 (900", consent: false }),
    ).toEqual({
      name: orderMessages.name,
      phone: orderMessages.phone,
      consent: orderMessages.consent,
    });
  });
  it("проверяет ИНН, только если он указан", () => {
    expect(validateOrder({ ...valid, inn: "123" }).inn).toBe(orderMessages.inn);
    expect(validateOrder({ ...valid, inn: "7707083894" }).inn).toBe(
      orderMessages.innChecksum,
    );
    expect(validateOrder({ ...valid, inn: "7707083893" })).toEqual({});
  });
});

describe("Номер заявки", () => {
  it("содержит дату и четыре цифры", () => {
    expect(createOrderNumber(new Date(2026, 9, 5), 0)).toBe("ОН-261005-1000");
    expect(createOrderNumber(new Date(2026, 9, 5), 0.9999)).toBe(
      "ОН-261005-9999",
    );
  });
});
