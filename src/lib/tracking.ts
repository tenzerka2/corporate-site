// Demo shipment tracking. Statuses are derived from the order number itself,
// so any number issued by the order form can be looked up.
import { cities, type CityId } from "@/content/cities";
import { roadKm, transitDays, type Mode } from "./tariff";

export type TrackingEvent = { status: string; place: string; date: Date; done: boolean };
export type Shipment = {
  number: string;
  from: CityId;
  to: CityId;
  distanceKm: number;
  created: Date;
  eta: Date;
  events: TrackingEvent[];
  delivered: boolean;
};

const warehouses = cities.filter((c) => c.warehouse);

/** «он 261006 1000», «ON-261006-1000» and «ОН2610061000» all become «ОН-261006-1000». */
export function normalizeNumber(input: string): string | null {
  const clean = input.trim().toUpperCase().replace(/^(ON|OH)/, "ОН").replace(/[\s-]/g, "");
  const match = /^ОН(\d{6})(\d{4})$/.exec(clean);
  return match ? `ОН-${match[1]}-${match[2]}` : null;
}

function createdDate(number: string): Date | null {
  const [, ymd] = number.split("-");
  const year = 2000 + Number(ymd.slice(0, 2));
  const month = Number(ymd.slice(2, 4)) - 1;
  const day = Number(ymd.slice(4, 6));
  const date = new Date(Date.UTC(year, month, day, 10, 0));
  return date.getUTCMonth() === month && date.getUTCDate() === day ? date : null;
}

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};
const addHours = (date: Date, hours: number) => new Date(date.getTime() + hours * 3_600_000);

export type TrackingContext = { from?: string; to?: string; mode?: string; created?: string };

export function trackShipment(input: string, now = new Date(), context: TrackingContext = {}): Shipment | null {
  const number = normalizeNumber(input);
  if (!number) return null;
  const date = createdDate(number);
  const created = context.created ? new Date(context.created) : date;
  if (!date || !created || !Number.isFinite(created.getTime()) || created > now) return null;
  if (created.getUTCFullYear() !== date.getUTCFullYear() || created.getUTCMonth() !== date.getUTCMonth() || created.getUTCDate() !== date.getUTCDate()) return null;

  const seed = Number(number.slice(-4));
  const origin = cities.find((city) => city.id === context.from) ?? warehouses[seed % warehouses.length];
  const others = cities.filter((c) => c.id !== origin.id);
  const target = cities.find((city) => city.id === context.to) ?? others[Math.floor(seed / warehouses.length) % others.length];
  const distanceKm = roadKm(origin.id, target.id);
  const mode: Mode = context.mode === "truck" ? "truck" : "groupage";
  const days = transitDays(distanceKm, mode);
  const eta = addDays(created, days.max);

  const plan = [
    { status: "Заявка принята", place: origin.name, date: created },
    { status: "Груз принят на складе", place: origin.name, date: addHours(created, 3) },
    { status: "Отправлен", place: origin.name, date: addDays(created, 1) },
    { status: "Прибыл на склад", place: target.name, date: addDays(created, days.min) },
    { status: "Доставлен получателю", place: target.name, date: eta },
  ];
  const events = plan.map((event) => ({ ...event, done: event.date <= now }));
  return {
    number,
    from: origin.id,
    to: target.id,
    distanceKm,
    created,
    eta,
    events,
    delivered: events[events.length - 1].done,
  };
}

const dateFormat = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" });
export const formatDate = (date: Date) => dateFormat.format(date);
