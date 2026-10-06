import { ButtonLink, Container } from "@/components/ui";
import { home } from "@/content/home";
import { labels } from "@/content/labels";
import { pageMetadata } from "@/lib/seo";
import { PhotoBand } from "@/components/page/Photo";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  AboutSection,
  ConditionsSection,
  ContactSection,
  ServicesIndex,
  WarehousesSection,
} from "@/components/home/HomeSections";
import { QuickQuote } from "@/components/logistics/QuickQuote";
import { Planner } from "@/components/logistics/Planner";

export const metadata = {
  ...pageMetadata({
    title: labels.onegaLogistikGruzoperevozkiPoRossii,
    description: home.metaDescription,
    path: "/",
  }),
  title: { absolute: labels.onegaLogistikGruzoperevozkiPoRossii },
};

// Title page, F01 terminal, company, service index with its own photos,
// geography and calculation, F05 warehouse, warehouses, terms, contact.
export default function Home() {
  return (
    <>
      <section className="home-hero">
        <Container wide>
          <div className="hero-meta">
            {home.meta.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className="hero-grid">
            <h1 className="hero-title">{home.title}</h1>
            <div className="hero-aside">
              <p className="hero-facts-text">
                {home.facts.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
              <div className="hero-links">
                <ButtonLink href="#calculator">{home.calculate}</ButtonLink>
                <Link href="/tracking" className="text-link">
                  {home.tracking}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
          <QuickQuote />
        </Container>
      </section>
      <PhotoBand name="terminal" priority />
      <AboutSection />
      <ServicesIndex />
      <Planner />
      <PhotoBand name="warehouse" />
      <WarehousesSection />
      <ConditionsSection />
      <ContactSection />
      <Container wide>
        <p className="demo-note">{home.note}</p>
      </Container>
    </>
  );
}
