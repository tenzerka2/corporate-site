import { ButtonLink, Container } from "@/components/ui";
import { home } from "@/content/home";
import { labels } from "@/content/labels";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import { photos } from "@/content/photos";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  AboutSection,
  ConditionsSection,
  ContactSection,
  ServicesIndex,
  WarehousesSection,
} from "@/components/home/HomeSections";
import { Planner } from "@/components/logistics/Planner";

export const metadata = {
  ...pageMetadata({
    title: labels.onegaLogistikGruzoperevozkiPoRossii,
    description: home.metaDescription,
    path: "/",
  }),
  title: { absolute: labels.onegaLogistikGruzoperevozkiPoRossii },
};

// Hero with one photo, services, calculation, then company, warehouses, terms, contact.
export default function Home() {
  return (
    <>
      <section className="home-hero">
        <Container wide>
          <div className="hero-grid">
            <div className="hero-copy">
              <h1 className="hero-title">{home.title}</h1>
              <p className="hero-subtitle">{home.subtitle}</p>
              <div className="hero-actions">
                <ButtonLink href="#calculator">{home.calculate}</ButtonLink>
                <Link href="/tracking" className="text-link">
                  {home.tracking}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div className="hero-photo">
              <Image
                src={photos.terminal.image}
                alt={photos.terminal.alt}
                sizes="(min-width: 1024px) 58vw, 100vw"
                placeholder="blur"
                priority
                unoptimized
              />
            </div>
          </div>
        </Container>
      </section>
      <ServicesIndex />
      <Planner />
      <AboutSection />
      <WarehousesSection />
      <ConditionsSection />
      <ContactSection />
      <Container wide>
        <p className="demo-note">{home.note}</p>
      </Container>
    </>
  );
}
