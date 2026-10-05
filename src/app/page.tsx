import { ButtonLink, Container } from "@/components/ui";
import { copy } from "@/content/site";
import { home } from "@/content/home";
import { labels } from "@/content/labels";
import { faqBlock } from "@/content/logistics";
import { JsonLd } from "@/components/page/PageParts";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { ConditionsSection, ProcessSection } from "@/components/home/HomeSections";
import { QuickQuote } from "@/components/logistics/QuickQuote";
import { CompanyStats } from "@/components/home/HomeMotion";
import { Planner } from "@/components/logistics/Planner";
import {
  FaqBlock,
  FinalBlock,
  RegularBlock,
  ServicesBlock,
} from "@/components/logistics/HomeBlocks";

export const metadata = {
  ...pageMetadata({
    title: labels.onegaLogistikGruzoperevozkiPoRossii,
    description: home.metaDescription,
    path: "/",
  }),
  title: { absolute: labels.onegaLogistikGruzoperevozkiPoRossii },
};

export default function Home() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqBlock.items)} />
      <section className="industrial-hero home-hero">
        <Container wide>
          <div className="hero-layout">
            <div className="hero-copy">
              <h1>{copy.home.title}</h1>
              <p className="hero-subtitle">{home.subtitle}</p>
              <div className="hero-actions">
                <ButtonLink href="#calculator">{home.calculate}</ButtonLink>
                <ButtonLink href="/tracking" variant="secondary">
                  {copy.home.tracking}
                </ButtonLink>
              </div>
            </div>
            <QuickQuote />
          </div>
          <p className="hero-bottom">{copy.home.note}</p>
        </Container>
      </section>
      <CompanyStats />
      <ServicesBlock />
      <Planner />
      <ProcessSection />
      <ConditionsSection />
      <RegularBlock />
      <FaqBlock />
      <FinalBlock />
    </>
  );
}
