import { describe, expect, it } from "vitest";
import {
  DEMO_TRACKING_NUMBER,
  currentStageIndex,
  findShipment,
  formatStageTime,
  normalizeTrackingNumber,
} from "./tracking";

describe("Отслеживание", () => {
  it("приводит номер к одному виду", () => {
    expect(normalizeTrackingNumber(" on 2026 104733 ")).toBe(DEMO_TRACKING_NUMBER);
    expect(normalizeTrackingNumber("ОН-2026-104733")).toBe(DEMO_TRACKING_NUMBER);
    expect(normalizeTrackingNumber("ON2026104733")).toBe(DEMO_TRACKING_NUMBER);
    expect(normalizeTrackingNumber("123")).toBeNull();
  });
  it("находит демо-груз и отличает неверный номер от ненайденного", () => {
    expect(findShipment("on-2026-104733").status).toBe("found");
    expect(findShipment("abc")).toEqual({ status: "invalid" });
    expect(findShipment("ON-2026-000001")).toEqual({
      status: "missing",
      number: "ON-2026-000001",
    });
  });
  it("текущий этап последний из пройденных", () => {
    const lookup = findShipment(DEMO_TRACKING_NUMBER);
    if (lookup.status !== "found") throw new Error();
    const index = currentStageIndex(lookup.shipment);
    expect(lookup.shipment.stages[index].id).toBe("warehouse");
    expect(lookup.shipment.stages[index].place).toContain("Екатеринбург");
  });
  it("показывает время по Москве", () => {
    expect(formatStageTime("2026-10-04T18:45:00+03:00")).toBe("4 октября, 18:45");
  });
});
