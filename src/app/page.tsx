import Image from "next/image";
import Link from "next/link";
import { RussiaMap } from "@/components/RussiaMap";
import { visualCopy, renderAssets } from "@/content/visuals";
import {
  ArrowUpRight,
  Calculator,
  PackageSearch,
  ShieldCheck,
  FileCheck2,
  LocateFixed,
} from "lucide-react";
import { ButtonLink, CheckItem, Container } from "@/components/ui";
import { copy, services } from "@/content/site";
import { home } from "@/content/home";
import { HomeSections } from "@/components/home/HomeSections";
import { CompanyStats, HeroArtwork } from "@/components/home/HomeMotion";
const assuranceIcons = [ShieldCheck, FileCheck2, LocateFixed];

export default function Home() {
  return (
    <>
      <section className="industrial-hero home-hero">
        <Container wide>
          <div className="hero-layout">
            <div className="hero-copy">
              <h1>{copy.home.title}</h1>
              <p className="hero-subtitle">{home.subtitle}</p>
              <ul className="hero-promises">
                {home.promises.map((promise) => (
                  <li key={promise}>
                    <CheckItem>{promise}</CheckItem>
                  </li>
                ))}
              </ul>
              <div className="hero-actions">
                <ButtonLink href="/calculator" icon={<Calculator size={19} />}>
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
            <HeroArtwork>
              <Image
                src="/images/renders/hero.webp"
                width={1920}
                height={1200}
                alt={copy.home.imageAlt}
                unoptimized
                preload
                sizes="(max-width: 767px) 100vw, 65vw"
              />
            </HeroArtwork>
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
      <section
        className="service-index home-service-index"
        aria-labelledby="services-title"
      >
        <Container wide>
          <div className="section-heading">
            <h2 id="services-title">{home.servicesTitle}</h2>
          </div>
          <div className="service-index-grid">
            {services.map((service, index) => (
              <Link href={service.href} key={service.href}>
                <Image
                  unoptimized
                  src={`/images/renders/${renderAssets[index].slug}.webp`}
                  alt={renderAssets[index].alt}
                  width={1600}
                  height={1200}
                  sizes="(max-width: 767px) 100vw, 25vw"
                />
                <span className="service-index-label">
                  {service.title}
                  <ArrowUpRight size={22} />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
      <section className="section" id="geography">
        <Container wide>
          <div className="section-heading">
            <div>
              <h2>{visualCopy.geography}</h2>
              <p className="muted measure">{visualCopy.geographyDescription}</p>
            </div>
          </div>
          <RussiaMap />
        </Container>
      </section>
    </>
  );
}
