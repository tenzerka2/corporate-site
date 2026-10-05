// Tariffs of the fictional demo company. Every amount is an integer number of kopecks.

export type Coordinates = { latitude: number; longitude: number };
export type ShipmentMode = "groupage" | "ftl";
export type VehicleId = "van" | "truck5" | "truck10" | "truck20";

export const ROAD_FACTOR = 1.25;
export const EARTH_RADIUS_KM = 6371;
/** Trips inside one city are billed as this distance. */
export const CITY_DISTANCE_KM = 30;
export const GROUPAGE_MINIMUM = 150_000;
export const DOOR_SERVICE = 90_000;
export const PACKAGING_PERCENT = 12;
export const KM_PER_DAY = 600;
export const MAX_WEIGHT_KG = 20_000;
export const MAX_VOLUME_M3 = 82;

/** Groupage zones by road distance: price per kg and per m³. */
export const groupageZones = [
  { upToKm: 800, perKg: 1_400, perM3: 350_000 },
  { upToKm: 2_000, perKg: 2_200, perM3: 550_000 },
  { upToKm: 4_000, perKg: 3_200, perM3: 800_000 },
  { upToKm: Infinity, perKg: 4_600, perM3: 1_150_000 },
] as const;

/** Vehicles ordered from small to large. Minimum billed distance covers city trips. */
export const vehicles = [
  { id: "van", maxKg: 1_500, maxM3: 9, perKm: 4_400 },
  { id: "truck5", maxKg: 5_000, maxM3: 30, perKm: 6_500 },
  { id: "truck10", maxKg: 10_000, maxM3: 50, perKm: 8_600 },
  { id: "truck20", maxKg: 20_000, maxM3: 82, perKm: 11_000 },
] as const satisfies readonly {
  id: VehicleId;
  maxKg: number;
  maxM3: number;
  perKm: number;
}[];
export const FTL_MINIMUM_KM = 100;

export type Vehicle = (typeof vehicles)[number];

export type TariffInput = {
  from: Coordinates;
  to: Coordinates;
  mode: ShipmentMode;
  weightKg: number;
  volumeM3: number;
  pickup: boolean;
  delivery: boolean;
  packaging: boolean;
};

export type TariffResult = {
  distanceKm: number;
  vehicle: VehicleId | null;
  transport: number;
  pickup: number;
  delivery: number;
  packaging: number;
  total: number;
  days: { min: number; max: number };
};

export type TariffError = "weight" | "volume" | "capacity";

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/** Great-circle distance in kilometres. */
export function haversineKm(a: Coordinates, b: Coordinates) {
  const dLat = toRadians(b.latitude - a.latitude);
  const dLon = toRadians(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(a.latitude)) *
      Math.cos(toRadians(b.latitude)) *
      Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Road distance estimate, whole kilometres. */
export function roadDistanceKm(a: Coordinates, b: Coordinates) {
  const km = Math.round(haversineKm(a, b) * ROAD_FACTOR);
  return Math.max(CITY_DISTANCE_KM, km);
}

export function groupageZone(distanceKm: number) {
  return groupageZones.find((zone) => distanceKm <= zone.upToKm)!;
}

/** Smallest vehicle that takes both weight and volume, or null if none fits. */
export function pickVehicle(weightKg: number, volumeM3: number) {
  return (
    vehicles.find(
      (vehicle) => weightKg <= vehicle.maxKg && volumeM3 <= vehicle.maxM3,
    ) ?? null
  );
}

/** Rounds kopecks to whole roubles. */
export function roundRoubles(kopecks: number) {
  return Math.round(kopecks / 100) * 100;
}

export function transitDays(distanceKm: number, mode: ShipmentMode) {
  const road = Math.max(1, Math.ceil(distanceKm / KM_PER_DAY));
  const min = road + (mode === "groupage" ? 1 : 0);
  return { min, max: min + 1 };
}

export function validateCargo(
  weightKg: number,
  volumeM3: number,
): TariffError | null {
  if (!Number.isFinite(weightKg) || weightKg <= 0) return "weight";
  if (!Number.isFinite(volumeM3) || volumeM3 <= 0) return "volume";
  if (weightKg > MAX_WEIGHT_KG || volumeM3 > MAX_VOLUME_M3) return "capacity";
  return null;
}

export function calculateTariff(
  input: TariffInput,
): { ok: true; result: TariffResult } | { ok: false; error: TariffError } {
  const error = validateCargo(input.weightKg, input.volumeM3);
  if (error) return { ok: false, error };
  const distanceKm = roadDistanceKm(input.from, input.to);
  let transport: number;
  let vehicle: VehicleId | null = null;
  if (input.mode === "groupage") {
    const zone = groupageZone(distanceKm);
    transport = Math.max(
      GROUPAGE_MINIMUM,
      input.weightKg * zone.perKg,
      input.volumeM3 * zone.perM3,
    );
  } else {
    const picked = pickVehicle(input.weightKg, input.volumeM3)!;
    vehicle = picked.id;
    transport = Math.max(FTL_MINIMUM_KM, distanceKm) * picked.perKm;
  }
  transport = roundRoubles(transport);
  const packaging = input.packaging
    ? roundRoubles((transport * PACKAGING_PERCENT) / 100)
    : 0;
  const pickup = input.pickup ? DOOR_SERVICE : 0;
  const delivery = input.delivery ? DOOR_SERVICE : 0;
  return {
    ok: true,
    result: {
      distanceKm,
      vehicle,
      transport,
      pickup,
      delivery,
      packaging,
      total: transport + pickup + delivery + packaging,
      days: transitDays(distanceKm, input.mode),
    },
  };
}

const roubles = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

export function formatRoubles(kopecks: number) {
  return roubles.format(Math.round(kopecks / 100));
}

/** Russian plural for days: 1 день, 2 дня, 5 дней. */
export function pluralDays(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "день";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "дня";
  return "дней";
}

export function formatDays({ min, max }: { min: number; max: number }) {
  return min === max
    ? `${min} ${pluralDays(min)}`
    : `${min}–${max} ${pluralDays(max)}`;
}

/** Accepts both "1,5" and "1.5"; empty input becomes NaN. */
export function parseAmount(value: string) {
  const normalized = value.replace(/\s/g, "").replace(",", ".");
  return normalized === "" ? NaN : Number(normalized);
}
