import { describe, expect, it } from "vitest";
import { formatPhone, orderNumber, phoneDigits, validateOrder } from "./order";

describe("заявка", () => {
  it("маска телефона по мере ввода и при вставке", () => {
    expect(formatPhone("9")).toBe("+7 (9");
    expect(formatPhone("9001234567")).toBe("+7 (900) 123-45-67");
    expect(formatPhone("+7 (900) 123-45-678")).toBe("+7 (900) 123-45-67");
    expect(phoneDigits("8 (900) 123-45-67")).toBe("9001234567");
  });
  it("обязательные поля", () => {
    expect(validateOrder({ name: "Ирина", phone: "+7 (900) 123-45-67", consent: true })).toEqual({});
    expect(validateOrder({ name: " ", phone: "+7 (900", consent: false })).toEqual({
      name: true,
      phone: true,
      consent: true,
    });
  });
  it("номер заявки", () => {
    expect(orderNumber(new Date(2026, 9, 6), 0)).toBe("ОН-261006-1000");
  });
});
