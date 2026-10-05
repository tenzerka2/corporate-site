import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero, PageSection } from "@/components/page/PageParts";
import { MapExplorer } from "@/components/logistics/StandaloneCalculator";
import { FinalBlock } from "@/components/logistics/HomeBlocks";
import { directionsPage as copy } from "@/content/company";
import { directionsBlock, mapCopy } from "@/content/logistics";
import { directionName, directionQuote, directionSlug, directions } from "@/lib/directions";
import { formatDays, formatRoubles } from "@/lib/tariff";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: copy.title,
  description: copy.description,
  path: "/directions",
});

const number = new Intl.NumberFormat("ru-RU");

export default function DirectionsPage() {
  return (
    <>
      <PageHero crumbs={[{ name: copy.title, path: "/directions" }]} title={copy.title} lead={copy.lead} />
      <PageSection id="list" title={directionsBlock.listTitle} lead={directionsBlock.priceNote}>
        <ul className="direction-cards">
          {directions.map((direction) => {
            const quote = directionQuote(direction);
            return (
              <li key={directionSlug(direction)}>
                <Link href={`/directions/${directionSlug(direction)}`}>
                  <span className="direction-card-title">
                    {directionName(direction)}
                    <ArrowUpRight size={20} aria-hidden="true" />
                  </span>
                  <span className="direction-card-meta">
                    {number.format(quote.distanceKm)} км, {formatDays(quote.days)}
                  </span>
                  <span className="direction-card-price">
                    {directionsBlock.priceFrom} {formatRoubles(quote.price)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </PageSection>
      <PageSection id="map" title={directionsBlock.title} lead={directionsBlock.description} tone="surface">
        <MapExplorer />
        <p className="caption muted">{mapCopy.demo}</p>
      </PageSection>
      <FinalBlock />
    </>
  );
}
