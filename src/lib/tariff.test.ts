import { describe, expect, it } from "vitest";
import {
  DOOR_FEE,
  GROUPAGE_MIN,
  formatDays,
  formatRub,
  parseNumber,
  quote,
  roadKm,
  transitDays,
  vehicleFor,
  zoneDays,
  zoneFor,
  zoneRange,
  type QuoteInput,
} from "./tariff";

const base: QuoteInput = {
  from: "moscow",
  to: "ekaterinburg",
  mode: "groupage",
  weightKg: 250,
  volumeM3: 1.2,
  pickup: false,
  delivery: false,
  packaging: false,
};
const ok = (patch: Partial<QuoteInput> = {}) => {
  const result = quote({ ...base, ...patch });
  if (!result.ok) throw new Error(result.error);
  return result.quote;
};

describe("расстояние", () => {
  it("Москва и Санкт-Петербург: около 793 км по дорогам", () => {
    expect(roadKm("moscow", "spb")).toBeGreaterThan(780);
    expect(roadKm("moscow", "spb")).toBeLessThan(800);
  });
  it("симметрично и не меньше 30 км внутри города", () => {
    expect(roadKm("kazan", "moscow")).toBe(roadKm("moscow", "kazan"));
    expect(roadKm("moscow", "moscow")).toBe(30);
  });
});

describe("сборный груз", () => {
  it("не дешевле минимальной цены", () => {
    expect(ok({ weightKg: 1, volumeM3: 0.01 }).lines.transport).toBe(GROUPAGE_MIN);
  });
  it("считается по большему из веса и объёма", () => {
    const zone = zoneFor(roadKm("moscow", "ekaterinburg"));
    expect(ok({ weightKg: 900, volumeM3: 1 }).lines.transport).toBe(900 * zone.perKg);
    expect(ok({ weightKg: 100, volumeM3: 3 }).lines.transport).toBe(3 * zone.perM3);
  });
  it("подписи зон для таблиц", () => {
    expect(zoneRange(0)).toBe("до 800 км");
    expect(zoneRange(1).replace(/\s/g, " ")).toBe("800–2 000 км");
    expect(zoneRange(3).replace(/\s/g, " ")).toBe("дальше 4 000 км");
    expect(formatDays(zoneDays(0))).toBe("3–4 дня");
  });
  it("зоны меняются на границах 800, 2 000 и 4 000 км", () => {
    expect(zoneFor(800).upToKm).toBe(800);
    expect(zoneFor(801).upToKm).toBe(2000);
    expect(zoneFor(4001).upToKm).toBe(Infinity);
  });
});

describe("отдельная машина", () => {
  it("подбирается по весу и по объёму", () => {
    expect(vehicleFor(1500, 9)?.id).toBe("van");
    expect(vehicleFor(1501, 1)?.id).toBe("t5");
    expect(vehicleFor(300, 40)?.id).toBe("t10");
    expect(vehicleFor(20001, 1)).toBeNull();
  });
  it("короткий рейс оплачивается как 100 км", () => {
    expect(ok({ mode: "truck", to: "moscow" }).lines.transport).toBe(100 * 44_00);
  });
  it("груз больше одной фуры не считается", () => {
    expect(quote({ ...base, weightKg: 25000 })).toEqual({ ok: false, error: "capacity" });
  });
});

describe("доплаты, срок и формат", () => {
  it("двери по 900 ₽, упаковка 12 % от перевозки", () => {
    const q = ok({ pickup: true, delivery: true, packaging: true, weightKg: 1000 });
    expect(q.lines.pickup + q.lines.delivery).toBe(2 * DOOR_FEE);
    expect(q.lines.packaging).toBe(Math.round((q.lines.transport * 0.12) / 100) * 100);
  });
  it("все суммы в целых рублях", () => {
    const q = ok({ weightKg: 123.45, volumeM3: 0.333, packaging: true });
    for (const value of Object.values(q.lines)) expect(value % 100).toBe(0);
  });
  it("день на 600 км и день на консолидацию сборного груза", () => {
    expect(transitDays(601, "truck")).toEqual({ min: 2, max: 3 });
    expect(transitDays(1771, "groupage")).toEqual({ min: 4, max: 5 });
  });
  it("ошибочный ввод", () => {
    expect(quote({ ...base, weightKg: 0 })).toEqual({ ok: false, error: "weight" });
    expect(quote({ ...base, volumeM3: NaN })).toEqual({ ok: false, error: "volume" });
  });
  it("формат ru-RU", () => {
    expect(formatRub(7_500_00).replace(/\s/g, " ")).toBe("7 500 ₽");
    expect(formatDays({ min: 4, max: 5 })).toBe("4–5 дней");
    expect(formatDays({ min: 1, max: 2 })).toBe("1–2 дня");
    expect(parseNumber("1,5")).toBe(1.5);
    expect(parseNumber("")).toBeNaN();
  });
});
