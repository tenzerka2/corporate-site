import { describe, expect, it } from "vitest";
import {
  CITY_DISTANCE_KM,
  DOOR_SERVICE,
  GROUPAGE_MINIMUM,
  calculateTariff,
  formatDays,
  formatRoubles,
  groupageZone,
  haversineKm,
  parseAmount,
  pickVehicle,
  roadDistanceKm,
  roundRoubles,
  transitDays,
  type TariffInput,
} from "./tariff";
import { cities } from "../content/cities";

const city = (id: string) => cities.find((item) => item.id === id)!;
const base: TariffInput = {
  from: city("moscow"),
  to: city("ekaterinburg"),
  mode: "groupage",
  weightKg: 100,
  volumeM3: 0.5,
  pickup: false,
  delivery: false,
  packaging: false,
};
function result(input: Partial<TariffInput>) {
  const outcome = calculateTariff({ ...base, ...input });
  if (!outcome.ok) throw new Error(outcome.error);
  return outcome.result;
}

describe("Расстояние", () => {
  it("гаверсинус даёт известное расстояние Москва и Санкт-Петербург", () => {
    const km = haversineKm(city("moscow"), city("saint-petersburg"));
    expect(km).toBeGreaterThan(630);
    expect(km).toBeLessThan(640);
  });
  it("дорожное расстояние больше прямого на 25 % и симметрично", () => {
    const direct = haversineKm(city("moscow"), city("kazan"));
    expect(roadDistanceKm(city("moscow"), city("kazan"))).toBe(
      Math.round(direct * 1.25),
    );
    expect(roadDistanceKm(city("kazan"), city("moscow"))).toBe(
      roadDistanceKm(city("moscow"), city("kazan")),
    );
  });
  it("доставка внутри города считается как городской рейс", () => {
    expect(roadDistanceKm(city("moscow"), city("moscow"))).toBe(
      CITY_DISTANCE_KM,
    );
  });
});

describe("Сборный груз", () => {
  it("лёгкий груз стоит не меньше минимальной цены", () => {
    expect(result({ weightKg: 1, volumeM3: 0.01 }).transport).toBe(
      GROUPAGE_MINIMUM,
    );
  });
  it("берёт большее из цены за вес и за объём", () => {
    const zone = groupageZone(result({}).distanceKm);
    expect(result({ weightKg: 500, volumeM3: 0.5 }).transport).toBe(
      500 * zone.perKg,
    );
    expect(result({ weightKg: 100, volumeM3: 3 }).transport).toBe(
      3 * zone.perM3,
    );
  });
  it("зоны расстояний переключаются на границах", () => {
    expect(groupageZone(800).upToKm).toBe(800);
    expect(groupageZone(801).upToKm).toBe(2_000);
    expect(groupageZone(2_001).upToKm).toBe(4_000);
    expect(groupageZone(4_001).upToKm).toBe(Infinity);
  });
  it("дальняя зона дороже ближней за тот же груз", () => {
    const near = result({ to: city("saint-petersburg"), weightKg: 300 });
    const far = result({ to: city("vladivostok"), weightKg: 300 });
    expect(far.transport).toBeGreaterThan(near.transport * 2);
  });
});

describe("Отдельная машина", () => {
  it("выбирает машину по весу", () => {
    expect(pickVehicle(1_500, 1)?.id).toBe("van");
    expect(pickVehicle(1_501, 1)?.id).toBe("truck5");
    expect(pickVehicle(9_000, 1)?.id).toBe("truck10");
    expect(pickVehicle(20_000, 1)?.id).toBe("truck20");
    expect(pickVehicle(20_001, 1)).toBeNull();
  });
  it("выбирает машину по объёму, даже если вес небольшой", () => {
    expect(pickVehicle(300, 20)?.id).toBe("truck5");
    expect(pickVehicle(300, 60)?.id).toBe("truck20");
  });
  it("считает по ставке за километр выбранной машины", () => {
    const van = result({ mode: "ftl", weightKg: 800, volumeM3: 4 });
    const truck = result({ mode: "ftl", weightKg: 18_000, volumeM3: 70 });
    expect(van.vehicle).toBe("van");
    expect(truck.vehicle).toBe("truck20");
    expect(van.transport).toBe(van.distanceKm * 4_400);
    expect(truck.transport).toBeGreaterThan(van.transport);
  });
  it("короткий рейс оплачивается как 100 км", () => {
    const local = result({ mode: "ftl", to: city("moscow") });
    expect(local.transport).toBe(100 * 4_400);
  });
  it("груз больше 20 тонн или 82 м³ не помещается", () => {
    expect(calculateTariff({ ...base, weightKg: 25_000 })).toEqual({
      ok: false,
      error: "capacity",
    });
    expect(calculateTariff({ ...base, volumeM3: 90 })).toEqual({
      ok: false,
      error: "capacity",
    });
  });
});

describe("Доплаты и проверка ввода", () => {
  it("забор и доставка от двери добавляют по 900 ₽", () => {
    const plain = result({});
    const doors = result({ pickup: true, delivery: true });
    expect(doors.pickup).toBe(DOOR_SERVICE);
    expect(doors.delivery).toBe(DOOR_SERVICE);
    expect(doors.total - plain.total).toBe(180_000);
  });
  it("жёсткая упаковка стоит 12 % от тарифа перевозки", () => {
    const packed = result({ weightKg: 1_000, packaging: true });
    expect(packed.packaging).toBe(roundRoubles(packed.transport * 0.12));
    expect(packed.total).toBe(packed.transport + packed.packaging);
  });
  it("нулевой, пустой и отрицательный ввод не считается", () => {
    expect(calculateTariff({ ...base, weightKg: 0 })).toEqual({
      ok: false,
      error: "weight",
    });
    expect(calculateTariff({ ...base, volumeM3: NaN })).toEqual({
      ok: false,
      error: "volume",
    });
    expect(calculateTariff({ ...base, weightKg: -5 }).ok).toBe(false);
  });
  it("разбирает десятичную запятую и пробелы", () => {
    expect(parseAmount("1,5")).toBe(1.5);
    expect(parseAmount("1 200")).toBe(1200);
    expect(parseAmount("")).toBeNaN();
  });
});

describe("Округление и вывод", () => {
  it("все суммы целые и кратны рублю", () => {
    const r = result({
      weightKg: 123.457,
      volumeM3: 0.333,
      packaging: true,
      pickup: true,
    });
    for (const amount of [r.transport, r.packaging, r.pickup, r.total]) {
      expect(Number.isInteger(amount)).toBe(true);
      expect(amount % 100).toBe(0);
    }
  });
  it("округляет копейки до рубля по правилам арифметики", () => {
    expect(roundRoubles(184_049)).toBe(184_000);
    expect(roundRoubles(184_050)).toBe(184_100);
  });
  it("форматирует рубли для ru-RU", () => {
    expect(formatRoubles(1_840_000).replace(/\s/g, " ")).toBe("18 400 ₽");
  });
});

describe("Сроки", () => {
  it("один день на 600 км, минимум один день", () => {
    expect(transitDays(30, "ftl")).toEqual({ min: 1, max: 2 });
    expect(transitDays(600, "ftl")).toEqual({ min: 1, max: 2 });
    expect(transitDays(601, "ftl")).toEqual({ min: 2, max: 3 });
  });
  it("сборному грузу нужен день на консолидацию", () => {
    expect(transitDays(1_800, "groupage")).toEqual({ min: 4, max: 5 });
  });
  it("склоняет дни", () => {
    expect(formatDays({ min: 1, max: 2 })).toBe("1–2 дня");
    expect(formatDays({ min: 4, max: 5 })).toBe("4–5 дней");
    expect(formatDays({ min: 20, max: 21 })).toBe("20–21 день");
  });
});
