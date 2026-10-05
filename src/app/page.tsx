import Link from "next/link";
import { visualCopy } from "@/content/visuals";
import {
  ArrowUpRight,
  Calculator,
  PackageSearch,
  ShieldCheck,
  FileCheck2,
  LocateFixed,
} from "lucide-react";
import { ButtonLink, CheckItem, Container } from "@/components/ui";
import { copy } from "@/content/site";
import { home } from "@/content/home";
import { labels } from "@/content/labels";
import { faqBlock } from "@/content/logistics";
import { JsonLd } from "@/components/page/PageParts";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { HomeSections } from "@/components/home/HomeSections";
import { CompanyStats } from "@/components/home/HomeMotion";
import { Planner } from "@/components/logistics/Planner";
import {
  FaqBlock,
  FinalBlock,
  RegularBlock,
  ServicesBlock,
} from "@/components/logistics/HomeBlocks";
const assuranceIcons = [ShieldCheck, FileCheck2, LocateFixed];

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
                <ButtonLink href="#calculator" icon={<Calculator size={19} />}>
                  {home.calculate}
                </ButtonLink>
                <ButtonLink
                  href="/tracking"
                  variant="secondary"
                  icon={<PackageSearch size={19} />}
                >
                  {copy.home.tracking}
                </ButtonLink>
              </div>
            </div>
            <div className="hero-conditions">
              <ul className="hero-promises">
                {home.promises.map((promise) => (
                  <li key={promise}>
                    <CheckItem>{promise}</CheckItem>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="hero-assurances">
            {home.assurances.map((assurance, index) => {
              const Icon = assuranceIcons[index];
              return (
                <span key={assurance}>
                  <Icon size={20} aria-hidden="true" />
                  {assurance}
                </span>
              );
            })}
          </div>
          <div className="hero-bottom">
            <span>{copy.home.note}</span>
            <Link href="/visuals">
              {visualCopy.overview}
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </Container>
      </section>
      <Container wide>
        <CompanyStats />
      </Container>
      <HomeSections />
      <ServicesBlock />
      <Planner />
      <RegularBlock />
      <FaqBlock />
      <FinalBlock />
    </>
  );
}
