import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Calculator } from "lucide-react";
import { ButtonLink, Container } from "@/components/ui";
import { HeroFacts, PageHero, PageSection } from "@/components/page/PageParts";
import { MapExplorer, StandaloneCalculator } from "@/components/logistics/StandaloneCalculator";
import { FinalBlock } from "@/components/logistics/HomeBlocks";
import { directionNotes, directionsPage as copy } from "@/content/company";
import { directionsBlock, mapCopy } from "@/content/logistics";
import {
  directionName,
  directionQuote,
  directionSlug,
  directions,
  findDirection,
  nearbyDirections,
} from "@/lib/directions";
import { cityById } from "@/lib/routes";
import { formatDays, formatRoubles } from "@/lib/tariff";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return directions.map((direction) => ({ slug: directionSlug(direction) }));
}

const number = new Intl.NumberFormat("ru-RU");

export async function generateMetadata({ params }: Props) {
  const direction = findDirection((await params).slug);
  if (!direction) return {};
  const quote = directionQuote(direction);
  const from = cityById(direction.from).name;
  const to = cityById(direction.to).name;
  return pageMetadata({
    title: copy.h1(from, to),
    description: copy.metaDescription(from, to, formatDays(quote.days), formatRoubles(quote.price)),
    path: `/directions/${directionSlug(direction)}`,
  });
}

export default async function DirectionPage({ params }: Props) {
  const slug = (await params).slug;
  const direction = findDirection(slug);
  if (!direction) notFound();
  const quote = directionQuote(direction);
  const from = cityById(direction.from);
  const to = cityById(direction.to);
  return (
    <>
      <PageHero
        crumbs={[
          { name: copy.title, path: "/directions" },
          { name: directionName(direction), path: `/directions/${slug}` },
        ]}
        title={copy.h1(from.name, to.name)}
        lead={copy.heroLead(formatDays(quote.days), formatRoubles(quote.price))}
        actions={
          <ButtonLink href="#calculator" icon={<Calculator size={19} aria-hidden="true" />}>
            {copy.calculate}
          </ButtonLink>
        }
        aside={
          <HeroFacts
            facts={[
              { label: copy.term, value: formatDays(quote.days) },
              { label: copy.price, value: formatRoubles(quote.price) },
              { label: copy.distance, value: `${number.format(quote.distanceKm)} км` },
            ]}
          />
        }
      />
      <section className="page-section" aria-labelledby="about-title">
        <Container wide>
          <div className="direction-about">
            <div className="direction-about-map">
              <MapExplorer from={direction.from} to={direction.to} network={false} interactive={false} />
              <p className="caption muted">{mapCopy.demo}</p>
            </div>
            <div className="direction-about-text">
              <h2 id="about-title">{copy.aboutTitle}</h2>
              <p>
                {copy.paragraphs.distance(
                  directionName(direction),
                  number.format(quote.distanceKm),
                  formatDays(quote.days),
                )}
              </p>
              <p>{copy.paragraphs.warehouse(to.warehouse)}</p>
              <p>{directionNotes[slug]}</p>
            </div>
          </div>
        </Container>
      </section>
      <StandaloneCalculator
        initial={{ from: direction.from, to: direction.to }}
        headingLevel={2}
        readQuery={false}
      />
      <PageSection id="nearby" title={copy.nearbyTitle}>
        <ul className="link-grid">
          {nearbyDirections(direction).map((item) => {
            const itemQuote = directionQuote(item);
            return (
              <li key={directionSlug(item)}>
                <Link href={`/directions/${directionSlug(item)}`}>
                  <span>{directionName(item)}</span>
                  <ArrowUpRight size={20} aria-hidden="true" />
                </Link>
                <p>
                  {formatDays(itemQuote.days)}, {directionsBlock.priceFrom}{" "}
                  {formatRoubles(itemQuote.price)}
                </p>
              </li>
            );
          })}
        </ul>
        <Link href="/directions" className="text-link link-grid-more">
          {copy.allDirections}
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </PageSection>
      <FinalBlock />
    </>
  );
}
