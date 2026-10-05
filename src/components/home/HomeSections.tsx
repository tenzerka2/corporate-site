import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ButtonLink, Container, SectionLabel } from "@/components/ui";
import { PhotoFigure } from "@/components/page/Photo";
import { CompanyStats } from "./CompanyStats";
import { home } from "@/content/home";
import { warehouses } from "@/content/company";
import { site } from "@/content/site";
import { cityById } from "@/lib/routes";

export function AboutSection() {
  return (
    <section className="home-section" aria-labelledby="about-title">
      <Container wide>
        <SectionLabel index="01">{home.about.label}</SectionLabel>
        <div className="about-layout">
          <h2 id="about-title" className="statement">
            {home.about.statement}
          </h2>
          <div className="about-text">
            {home.about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <Link href="/about" className="text-link">
              {home.about.label}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <CompanyStats />
      </Container>
    </section>
  );
}

export function WarehousesSection() {
  return (
    <section className="home-section" aria-labelledby="warehouses-title">
      <Container wide>
        <SectionLabel index="05">{home.warehousesLabel}</SectionLabel>
        <div className="warehouses-layout">
          <div>
            <h2 id="warehouses-title">{home.warehousesTitle}</h2>
            <p className="lead muted warehouses-text">{home.warehousesText}</p>
            <PhotoFigure name="warehouse" sizes="(min-width: 1024px) 45vw, 100vw" />
          </div>
          <table className="warehouse-table">
            <caption className="sr-only">{home.warehousesTitle}</caption>
            <thead>
              <tr>
                <th scope="col">{home.warehouseHead.city}</th>
                <th scope="col">{home.warehouseHead.address}</th>
                <th scope="col">{home.warehouseHead.area}</th>
                <th scope="col">{home.warehouseHead.hours}</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map((item) => (
                <tr key={item.city}>
                  <th scope="row">{cityById(item.city).name}</th>
                  <td data-label={home.warehouseHead.address}>{item.address}</td>
                  <td data-label={home.warehouseHead.area}>{item.area}</td>
                  <td data-label={home.warehouseHead.hours}>{item.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}

export function ConditionsSection() {
  return (
    <section className="home-section" id="why-onega" aria-labelledby="conditions-title">
      <Container wide>
        <SectionLabel index="06">{home.conditionsLabel}</SectionLabel>
        <div className="conditions-layout">
          <h2 id="conditions-title">{home.conditionsTitle}</h2>
          <dl className="spec-grid spec-grid-3">
            {home.conditions.map((item) => (
              <div key={item.title}>
                <dt>{item.title}</dt>
                <dd>{item.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}

export function ContactSection() {
  const tel = site.phone.replace(/\D/g, "");
  return (
    <section className="home-section home-contact" aria-labelledby="contact-title">
      <Container wide>
        <SectionLabel index="07">{home.contact.label}</SectionLabel>
        <div className="contact-layout">
          <div>
            <h2 id="contact-title">{home.contact.title}</h2>
            <p className="lead muted">{home.contact.text}</p>
          </div>
          <div className="contact-actions">
            <a className="contact-phone" href={`tel:${tel}`}>
              {site.phone}
            </a>
            <a className="contact-mail" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <ButtonLink href="/contacts">{home.contact.write}</ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
