import { ButtonLink, Container } from "@/components/ui";
import { home } from "@/content/home";
import { labels } from "@/content/labels";
import { pageMetadata } from "@/lib/seo";
import { PhotoBand } from "@/components/page/Photo";
import {
  AboutSection,
  ConditionsSection,
  ContactSection,
  WarehousesSection,
} from "@/components/home/HomeSections";
import { QuickQuote } from "@/components/logistics/QuickQuote";
import { Planner } from "@/components/logistics/Planner";
import { ServicesBlock } from "@/components/logistics/HomeBlocks";

export const metadata = {
  ...pageMetadata({
    title: labels.onegaLogistikGruzoperevozkiPoRossii,
    description: home.metaDescription,
    path: "/",
  }),
  title: { absolute: labels.onegaLogistikGruzoperevozkiPoRossii },
};

// Order: short first screen, terminal photo, company, services, geography and
// calculator, warehouses, terms, contact. One idea per screen, no filler blocks.
export default function Home() {
  return (
    <>
      <section className="home-hero">
        <Container wide>
          <div className="hero-layout">
            <div className="hero-copy">
              <h1>{home.title}</h1>
              <p className="hero-subtitle">{home.subtitle}</p>
              <div className="hero-actions">
                <ButtonLink href="#calculator">{home.calculate}</ButtonLink>
                <ButtonLink href="/tracking" variant="secondary">
                  {home.tracking}
                </ButtonLink>
              </div>
            </div>
            <QuickQuote />
          </div>
        </Container>
      </section>
      <PhotoBand name="terminal" priority />
      <AboutSection />
      <ServicesBlock />
      <PhotoBand name="highway" />
      <Planner />
      <WarehousesSection />
      <ConditionsSection />
      <PhotoBand name="loading" />
      <ContactSection />
      <Container wide>
        <p className="demo-note">{home.note}</p>
      </Container>
    </>
  );
}
