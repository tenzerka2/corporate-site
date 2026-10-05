// Shipment tracking for the demo. One known number shows the full timeline.
import type { CityId } from "./routes";

export type TrackingStage = {
  id: "accepted" | "transit" | "warehouse" | "delivery" | "delivered";
  title: string;
  place: string;
  /** ISO date-time in Moscow time; null for stages not reached yet. */
  at: string | null;
};

export type Shipment = {
  number: string;
  from: CityId;
  to: CityId;
  cargo: string;
  /** City where the cargo is now. */
  current: CityId;
  stages: TrackingStage[];
  document: string;
};

export const DEMO_TRACKING_NUMBER = "ON-2026-104733";

const shipments: Shipment[] = [
  {
    number: DEMO_TRACKING_NUMBER,
    from: "moscow",
    to: "ekaterinburg",
    cargo: "Сборный груз, 4 места, 380 кг, 2,1 м³",
    current: "ekaterinburg",
    document: "/docs/onega-demo-documents.pdf",
    stages: [
      {
        id: "accepted",
        title: "Принят",
        place: "Склад Онеги, Москва",
        at: "2026-10-01T15:20:00+03:00",
      },
      {
        id: "transit",
        title: "В пути",
        place: "Москва → Екатеринбург",
        at: "2026-10-02T06:10:00+03:00",
      },
      {
        id: "warehouse",
        title: "На складе в Екатеринбурге",
        place: "Склад Онеги, Екатеринбург",
        at: "2026-10-04T18:45:00+03:00",
      },
      {
        id: "delivery",
        title: "Передан на доставку",
        place: "Курьер Онеги, Екатеринбург",
        at: null,
      },
      { id: "delivered", title: "Доставлен", place: "Адрес получателя", at: null },
    ],
  },
];

/** Accepts lower case, spaces, Cyrillic «ОН» and missing dashes. */
export function normalizeTrackingNumber(value: string) {
  const compact = value
    .trim()
    .toUpperCase()
    .replace(/[\s_–—-]+/g, "")
    .replace(/^ОН/, "ON");
  const match = /^ON(\d{4})(\d{6})$/.exec(compact);
  return match ? `ON-${match[1]}-${match[2]}` : null;
}

export type TrackingLookup =
  | { status: "found"; shipment: Shipment }
  | { status: "invalid" }
  | { status: "missing"; number: string };

export function findShipment(value: string): TrackingLookup {
  const number = normalizeTrackingNumber(value);
  if (!number) return { status: "invalid" };
  const shipment = shipments.find((item) => item.number === number);
  return shipment ? { status: "found", shipment } : { status: "missing", number };
}

/** Index of the latest reached stage. */
export function currentStageIndex(shipment: Shipment) {
  return shipment.stages.reduce(
    (last, stage, index) => (stage.at ? index : last),
    -1,
  );
}

const dateTime = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Moscow",
});

export function formatStageTime(iso: string) {
  return dateTime.format(new Date(iso)).replace(" в ", ", ");
}
