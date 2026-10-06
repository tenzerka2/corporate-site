import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ButtonLink, Container } from "@/components/ui";
import { PhotoBand } from "@/components/page/Photo";
import { PresetLink } from "@/components/logistics/PresetLink";
import { CompanyStats } from "./CompanyStats";
import { home } from "@/content/home";
import { warehouses } from "@/content/company";
import { servicesBlock } from "@/content/logistics";
import { site } from "@/content/site";
import { cityById } from "@/lib/routes";

export function AboutSection() {
  return (
    <section className="home-section section-about" aria-labelledby="about-title">
      <Container wide>
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

// One consistent system: three service rows on the same grid, one photo,
// then marketplace delivery as its own block.
export function ServicesIndex() {
  const [groupage, ftl, warehouse, marketplaces] = servicesBlock.items;
  const copy = home.services;
  return (
    <section className="home-section section-services" id="services" aria-labelledby="services-title">
      <Container wide>
        <div className="services-head">
          <h2 id="services-title">{copy.title}</h2>
          <p>{copy.lead}</p>
        </div>
        <ol className="service-list">
          {[groupage, ftl, warehouse].map((item, index) => (
            <li key={item.slug} className="service-item">
              <span className="service-num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>
                <Link href={item.href}>{item.title}</Link>
              </h3>
              <p className="service-text">{item.text[0]}</p>
              <p className="service-param">
                <strong>{item.figure}</strong>
                <span>{item.figureLabel}</span>
              </p>
              <Link href={item.href} className="text-link service-more" aria-label={`${copy.more}: ${item.title}`}>
                {copy.more}
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>
      </Container>
      <PhotoBand name="warehouse" />
      <Container wide>
        <div className="marketplace-block">
          <div>
            <h3>
              <Link href={marketplaces.href}>{copy.marketplaces.title}</Link>
            </h3>
            <p>{copy.marketplaces.text}</p>
            <div className="marketplace-actions">
              <Link href={marketplaces.href} className="text-link">
                {copy.more}
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <PresetLink mode="groupage" className="text-link">
                {copy.calculate}
              </PresetLink>
            </div>
          </div>
          <dl className="marketplace-facts">
            {copy.marketplaces.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}

export function WarehousesSection() {
  return (
    <section className="home-section section-warehouses" aria-labelledby="warehouses-title">
      <Container wide>
        <div className="warehouses-layout">
          <div>
            <h2 id="warehouses-title">{home.warehousesTitle}</h2>
            <p className="warehouses-text">{home.warehousesText}</p>
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
    <section className="home-section section-conditions" id="why-onega" aria-labelledby="conditions-title">
      <Container wide>
        <h2 id="conditions-title" className="conditions-title">
          {home.conditionsTitle}
        </h2>
        <dl className="terms">
          {home.conditions.map((item, index) => (
            <div key={item.title}>
              <span className="terms-num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <dt>{item.title}</dt>
              <dd>{item.text}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

export function ContactSection() {
  const tel = site.phone.replace(/\D/g, "");
  return (
    <section className="home-section section-contact" aria-labelledby="contact-title">
      <Container wide>
        <div className="contact-layout">
          <div>
            <h2 id="contact-title">{home.contact.title}</h2>
            <p className="contact-text">{home.contact.text}</p>
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
