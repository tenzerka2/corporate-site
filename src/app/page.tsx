import Image from "next/image";
import Link from "next/link";
import { RussiaMap } from "@/components/RussiaMap";
import { visualCopy, renderAssets } from "@/content/visuals";
import { ArrowUpRight, Calculator, PackageSearch } from "lucide-react";
import { ButtonLink, Container } from "@/components/ui";
import { copy, services } from "@/content/site";
export default function Home() {
  return (
    <>
      <section className="industrial-hero">
        <Container wide>
          <div className="hero-layout">
            <div className="hero-copy">
              <h1>{copy.home.title}</h1>
              <p className="lead">{copy.home.description}</p>
              <div className="hero-actions">
                <ButtonLink href="/calculator" icon={<Calculator size={19} />}>
                  {copy.home.calculation}
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
            <div className="hero-visual">
              <Image
                src="/images/renders/hero.webp"
                width={1920}
                height={1200}
                alt={copy.home.imageAlt}
                unoptimized
                priority
                sizes="(max-width: 767px) 100vw, 65vw"
              />
            </div>
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
      <section className="service-index" aria-label="Услуги">
        <Container wide>
          <div className="service-index-grid">
            {services.map((service, index) => (
              <Link href={service.href} key={service.href}>
                <Image unoptimized src={`/images/renders/${renderAssets[index].slug}.webp`} alt={renderAssets[index].alt} width={1600} height={1200} sizes="(max-width: 767px) 100vw, 25vw" />
                <span className="service-index-label">{service.title}<ArrowUpRight size={22} /></span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
      <section className="section" id="geography">
        <Container wide>
          <div className="section-heading"><div><h2>{visualCopy.geography}</h2><p className="muted measure">{visualCopy.geographyDescription}</p></div></div>
          <RussiaMap />
        </Container>
      </section>
    </>
  );
}
