import Image from "next/image";
import Link from "next/link";
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
                src="/images/renders/tractor-technical.webp"
                width={1920}
                height={1200}
                alt={copy.home.imageAlt}
                priority
                sizes="(max-width: 767px) 100vw, 65vw"
              />
            </div>
          </div>
          <div className="hero-bottom">
            <span>{copy.home.note}</span>
            <Link href="/ui">
              {copy.home.uiLink}
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </Container>
      </section>
      <section className="service-index" aria-label="Услуги">
        <Container wide>
          <div className="service-index-grid">
            {services.map((service) => (
              <Link href={service.href} key={service.href}>
                <span>{service.title}</span>
                <ArrowUpRight size={22} />
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
