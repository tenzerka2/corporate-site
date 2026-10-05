import { cities, type City } from "../content/cities";
import { calculateTariff, transitDays, roadDistanceKm } from "./tariff";

export type CityId = City["id"];

/** Shipment used for "от … ₽" prices in lists: one pallet, 100 kg and 0.5 m³. */
export const REFERENCE_CARGO = { weightKg: 100, volumeM3: 0.5 } as const;

export function findCity(id: string) {
  return cities.find((city) => city.id === id);
}

export function cityById(id: CityId) {
  return findCity(id)!;
}

/** Groupage terms and the starting price for the reference shipment. */
export function routeQuote(fromId: CityId, toId: CityId) {
  const from = cityById(fromId);
  const to = cityById(toId);
  const distanceKm = roadDistanceKm(from, to);
  const outcome = calculateTariff({
    from,
    to,
    mode: "groupage",
    ...REFERENCE_CARGO,
    pickup: false,
    delivery: false,
    packaging: false,
  });
  if (!outcome.ok) throw new Error(outcome.error);
  return {
    distanceKm,
    days: transitDays(distanceKm, "groupage"),
    price: outcome.result.total,
  };
}
