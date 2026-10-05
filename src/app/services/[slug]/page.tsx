import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Calculator, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui";
import { HeroFacts, JsonLd, PageHero, PageSection } from "@/components/page/PageParts";
import { ServiceTariff } from "@/components/page/ServiceTariff";
import { FaqBlock, FinalBlock } from "@/components/logistics/HomeBlocks";
import { StandaloneCalculator } from "@/components/logistics/StandaloneCalculator";
import { findService, serviceCopy, servicePages } from "@/content/services";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return servicePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props) {
  const page = findService((await params).slug);
  if (!page) return {};
  return pageMetadata({
    title: page.title,
    description: page.description,
    path: `/services/${page.slug}`,
  });
}

export default async function ServicePage({ params }: Props) {
  const page = findService((await params).slug);
  if (!page) notFound();
  const others = servicePages.filter((item) => item.slug !== page.slug);
  return (
    <>
      <JsonLd data={faqJsonLd(page.faq)} />
      <PageHero
        crumbs={[{ name: page.title, path: `/services/${page.slug}` }]}
        title={page.title}
        lead={page.subtitle}
        actions={
          <>
            <ButtonLink href="#calculator" icon={<Calculator size={19} aria-hidden="true" />}>
              {serviceCopy.calculate}
            </ButtonLink>
            <ButtonLink href="/tariffs" variant="secondary">
              {serviceCopy.allTariffs}
            </ButtonLink>
          </>
        }
        aside={<HeroFacts facts={page.facts} />}
      />
      <PageSection id="includes" title={serviceCopy.includes}>
        <ul className="includes-grid">
          {page.includes.map((item) => (
            <li key={item.title}>
              <Check size={20} aria-hidden="true" />
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </PageSection>
      <PageSection id="tariffs" title={serviceCopy.tariffs} tone="surface">
        <ServiceTariff table={page.tariff} />
      </PageSection>
      <PageSection id="process" title={serviceCopy.process}>
        <ol className="process-grid">
          {page.steps.map((step, index) => (
            <li key={step.title}>
              <span className="step-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </PageSection>
      <StandaloneCalculator initial={{ mode: page.mode }} headingLevel={2} readQuery={false} />
      <FaqBlock title={serviceCopy.faq} items={page.faq} />
      <PageSection id="other" title={serviceCopy.other}>
        <ul className="link-grid">
          {others.map((item) => (
            <li key={item.slug}>
              <Link href={`/services/${item.slug}`}>
                <span>{item.title}</span>
                <ArrowUpRight size={20} aria-hidden="true" />
              </Link>
              <p>{item.subtitle}</p>
            </li>
          ))}
        </ul>
      </PageSection>
      <FinalBlock />
    </>
  );
}
