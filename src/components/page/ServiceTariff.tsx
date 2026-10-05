import { calculatorCopy } from "@/content/logistics";
import { serviceCopy, type TariffTable } from "@/content/services";
import { cityById, type CityId } from "@/lib/routes";
import {
  calculateTariff,
  formatDays,
  formatRoubles,
  roadDistanceKm,
  vehicles,
  FTL_MINIMUM_KM,
  type ShipmentMode,
} from "@/lib/tariff";
import { DataTable } from "./PageParts";

function routePrice(
  from: CityId,
  to: CityId,
  mode: ShipmentMode,
  weightKg: number,
  volumeM3: number,
) {
  const outcome = calculateTariff({
    from: cityById(from),
    to: cityById(to),
    mode,
    weightKg,
    volumeM3,
    pickup: false,
    delivery: false,
    packaging: false,
  });
  if (!outcome.ok) throw new Error(outcome.error);
  return outcome.result;
}

export function ServiceTariff({ table }: { table: TariffTable }) {
  if (table.kind === "routes") {
    return (
      <DataTable
        caption={table.caption}
        head={[serviceCopy.route, serviceCopy.term, ...table.cargo.map((c) => c.label)]}
        rows={table.routes.map(({ from, to }) => {
          const prices = table.cargo.map((c) =>
            routePrice(from, to, table.mode, c.weightKg, c.volumeM3),
          );
          return [
            serviceCopy.example(cityById(from).name, cityById(to).name),
            formatDays(prices[0].days),
            ...prices.map((p) => formatRoubles(p.total)),
          ];
        })}
      />
    );
  }
  if (table.kind === "vehicles") {
    const { from, to } = table.example;
    const km = Math.max(FTL_MINIMUM_KM, roadDistanceKm(cityById(from), cityById(to)));
    return (
      <DataTable
        caption={table.caption}
        head={[
          serviceCopy.vehicle,
          serviceCopy.perKm,
          serviceCopy.example(cityById(from).name, cityById(to).name),
        ]}
        rows={vehicles.map((vehicle) => [
          calculatorCopy.vehicles[vehicle.id],
          formatRoubles(vehicle.perKm),
          formatRoubles(km * vehicle.perKm),
        ])}
      />
    );
  }
  return (
    <DataTable
      caption={table.caption}
      head={[serviceCopy.service, serviceCopy.unit, serviceCopy.price]}
      rows={table.rows.map((row) => [row.name, row.unit, row.price])}
    />
  );
}
