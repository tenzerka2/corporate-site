// Tariffs of the fictional company. Money is kept in whole kopecks.
import { city, type CityId } from "@/content/cities";

export type Mode = "groupage" | "truck";

export type Quote = {
  distanceKm: number;
  days: { min: number; max: number };
  vehicle: Vehicle | null;
  lines: { transport: number; pickup: number; delivery: number; packaging: number };
  total: number;
};

export type QuoteInput = {
  from: CityId;
  to: CityId;
  mode: Mode;
  weightKg: number;
  volumeM3: number;
  pickup: boolean;
  delivery: boolean;
  packaging: boolean;
};

export type QuoteError = "weight" | "volume" | "capacity";

const ROAD_FACTOR = 1.25;
const LOCAL_KM = 30;
const KM_PER_DAY = 600;
export const GROUPAGE_MIN = 1_500_00;
export const DOOR_FEE = 900_00;
export const PACKAGING_SHARE = 0.12;

/** Groupage rates by road distance: price per kg and per m³, whichever is higher. */
export const zones = [
  { upToKm: 800, perKg: 14_00, perM3: 3_500_00 },
  { upToKm: 2000, perKg: 22_00, perM3: 5_500_00 },
  { upToKm: 4000, perKg: 32_00, perM3: 8_000_00 },
  { upToKm: Infinity, perKg: 46_00, perM3: 11_500_00 },
] as const;

/** Trucks from small to large; the smallest one that fits is chosen. */
export const vehicles = [
  { id: "van", name: "Газель", maxKg: 1500, maxM3: 9, perKm: 44_00 },
  { id: "t5", name: "Грузовик 5 т", maxKg: 5000, maxM3: 30, perKm: 65_00 },
  { id: "t10", name: "Грузовик 10 т", maxKg: 10000, maxM3: 50, perKm: 86_00 },
  { id: "t20", name: "Фура 20 т", maxKg: 20000, maxM3: 82, perKm: 110_00 },
] as const;
export const TRUCK_MIN_KM = 100;

export type Vehicle = (typeof vehicles)[number];

/** Great-circle distance in kilometres. */
export function haversine(aLat: number, aLon: number, bLat: number, bLon: number) {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = rad(bLat - aLat);
  const dLon = rad(bLon - aLon);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

/** Road distance estimate in whole km; trips inside one city count as 30 km. */
export function roadKm(from: CityId, to: CityId) {
  const a = city(from);
  const b = city(to);
  return Math.max(LOCAL_KM, Math.round(haversine(a.lat, a.lon, b.lat, b.lon) * ROAD_FACTOR));
}

export function zoneFor(km: number) {
  return zones.find((zone) => km <= zone.upToKm)!;
}

export function vehicleFor(weightKg: number, volumeM3: number) {
  return vehicles.find((v) => weightKg <= v.maxKg && volumeM3 <= v.maxM3) ?? null;
}

export function transitDays(km: number, mode: Mode) {
  const min = Math.max(1, Math.ceil(km / KM_PER_DAY)) + (mode === "groupage" ? 1 : 0);
  return { min, max: min + 1 };
}

const toRoubles = (kopecks: number) => Math.round(kopecks / 100) * 100;

export function quote(input: QuoteInput): { ok: true; quote: Quote } | { ok: false; error: QuoteError } {
  const { weightKg, volumeM3 } = input;
  if (!Number.isFinite(weightKg) || weightKg <= 0) return { ok: false, error: "weight" };
  if (!Number.isFinite(volumeM3) || volumeM3 <= 0) return { ok: false, error: "volume" };
  const vehicle = vehicleFor(weightKg, volumeM3);
  if (!vehicle) return { ok: false, error: "capacity" };

  const distanceKm = roadKm(input.from, input.to);
  let transport: number;
  if (input.mode === "groupage") {
    const zone = zoneFor(distanceKm);
    transport = Math.max(GROUPAGE_MIN, weightKg * zone.perKg, volumeM3 * zone.perM3);
  } else {
    transport = Math.max(TRUCK_MIN_KM, distanceKm) * vehicle.perKm;
  }
  transport = toRoubles(transport);
  const lines = {
    transport,
    pickup: input.pickup ? DOOR_FEE : 0,
    delivery: input.delivery ? DOOR_FEE : 0,
    packaging: input.packaging ? toRoubles(transport * PACKAGING_SHARE) : 0,
  };
  return {
    ok: true,
    quote: {
      distanceKm,
      days: transitDays(distanceKm, input.mode),
      vehicle: input.mode === "truck" ? vehicle : null,
      lines,
      total: lines.transport + lines.pickup + lines.delivery + lines.packaging,
    },
  };
}

const rub = new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 });
const num = new Intl.NumberFormat("ru-RU");

export const formatRub = (kopecks: number) => rub.format(Math.round(kopecks / 100));
export const formatKm = (km: number) => `${num.format(km)} км`;

export function formatDays({ min, max }: { min: number; max: number }) {
  const n = max % 100;
  const last = max % 10;
  const word = n >= 11 && n <= 14 ? "дней" : last === 1 ? "день" : last >= 2 && last <= 4 ? "дня" : "дней";
  return `${min}–${max} ${word}`;
}

/** Accepts "1,5", "1.5" and "1 200"; empty input is NaN. */
export function parseNumber(value: string) {
  const clean = value.replace(/\s/g, "").replace(",", ".");
  return clean === "" ? NaN : Number(clean);
}
