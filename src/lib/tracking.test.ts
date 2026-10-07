import { describe, expect, it } from "vitest";
import { normalizeNumber, trackShipment } from "./tracking";

const now = new Date(2026, 9, 6, 15, 0);

describe("отслеживание", () => {
  it("номер в любом написании", () => {
    expect(normalizeNumber("ОН-261006-1000")).toBe("ОН-261006-1000");
    expect(normalizeNumber(" он 261006 1000 ")).toBe("ОН-261006-1000");
    expect(normalizeNumber("ON-261006-1000")).toBe("ОН-261006-1000");
    expect(normalizeNumber("ОН-2610-1000")).toBeNull();
  });
  it("несуществующая или будущая дата не находится", () => {
    expect(trackShipment("ОН-261332-1000", now)).toBeNull();
    expect(trackShipment("ОН-261007-1000", now)).toBeNull();
  });
  it("заявка сегодня: принята, ещё не отправлена", () => {
    const s = trackShipment("ОН-261006-1000", now)!;
    expect(s.events.filter((e) => e.done).map((e) => e.status)).toEqual(["Заявка принята", "Груз принят на складе"]);
    expect(s.delivered).toBe(false);
    expect(s.from).not.toBe(s.to);
  });
  it("старая заявка доставлена, маршрут один и тот же", () => {
    const a = trackShipment("ОН-260901-4821", now)!;
    const b = trackShipment("он2609014821", now)!;
    expect(a.delivered).toBe(true);
    expect(a.from).toBe(b.from);
    expect(a.to).toBe(b.to);
    expect(a.eta > a.created).toBe(true);
  });
});

it("новая заявка утром находится и сохраняет маршрут и тип перевозки", () => {
  const created = new Date(2026, 9, 7, 7, 5);
  const shipment = trackShipment("ОН-261007-4821", new Date(2026, 9, 7, 7, 6), {
    created: created.toISOString(), from: "kazan", to: "novosibirsk", mode: "truck",
  })!;
  expect(shipment.from).toBe("kazan");
  expect(shipment.to).toBe("novosibirsk");
  expect(shipment.created).toEqual(created);
  expect(shipment.events.filter((event) => event.done).map((event) => event.status)).toEqual(["Заявка принята"]);
});

it("не принимает подменённую дату создания из ссылки", () => {
  for (const created of ["invalid", new Date(2026, 9, 6).toISOString(), new Date(2026, 9, 8).toISOString()]) {
    expect(trackShipment("ОН-261007-4821", new Date(2026, 9, 7, 15), { created })).toBeNull();
  }
});


it("ссылка на заявку сохраняется при смене часового пояса", () => {
  const context = { created: "2026-10-07T23:30:00.000Z", from: "moscow", to: "kazan" };
  const result = trackShipment("ОН-261007-4821", new Date("2026-10-07T23:31:00.000Z"), context);
  expect(result?.created.toISOString()).toBe(context.created);
});
