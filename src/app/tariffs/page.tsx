import { ButtonLink } from "@/components/ui";
import { DataTable, PageHero, PageSection } from "@/components/page/PageParts";
import { calculatorCopy } from "@/content/logistics";
import { tariffsPage as copy } from "@/content/company";
import {
  GROUPAGE_MINIMUM,
  formatRoubles,
  groupageZones,
  vehicles,
} from "@/lib/tariff";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: copy.title, description: copy.description, path: "/tariffs" });

const number = new Intl.NumberFormat("ru-RU");

export default function TariffsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: copy.title, path: "/tariffs" }]}
        title={copy.title}
        lead={copy.lead}
        actions={<ButtonLink href="/calculator">{calculatorCopy.title}</ButtonLink>}
      />
      <PageSection id="groupage" title={copy.groupageTitle} lead={copy.groupageNote}>
        <DataTable
          caption={`${copy.groupageTitle}. Минимум ${formatRoubles(GROUPAGE_MINIMUM)}`}
          head={[copy.zone, copy.perKg, copy.perM3]}
          rows={groupageZones.map((zone, index) => [
            Number.isFinite(zone.upToKm)
              ? copy.upTo(number.format(zone.upToKm))
              : copy.beyond(number.format(groupageZones[index - 1].upToKm)),
            formatRoubles(zone.perKg),
            formatRoubles(zone.perM3),
          ])}
        />
      </PageSection>
      <PageSection id="ftl" title={copy.ftlTitle} lead={copy.ftlNote} tone="surface">
        <DataTable
          caption={copy.ftlTitle}
          head={[copy.vehicle, copy.capacity, copy.perKm]}
          rows={vehicles.map((vehicle) => [
            calculatorCopy.vehicles[vehicle.id].replace(/, \d+ м³$/, ""),
            `${number.format(vehicle.maxKg)} кг, ${vehicle.maxM3} м³`,
            formatRoubles(vehicle.perKm),
          ])}
        />
      </PageSection>
      <PageSection id="extras" title={copy.extrasTitle}>
        <DataTable
          caption={copy.extrasTitle}
          head={[copy.service, copy.price]}
          rows={copy.extras.map((row) => [row.name, row.price])}
        />
        <h3 className="tariff-terms-title">{copy.termsTitle}</h3>
        <p className="measure">{copy.terms}</p>
      </PageSection>
    </>
  );
}
