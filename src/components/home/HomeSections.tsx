import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ButtonLink, Container, SectionLabel } from "@/components/ui";
import { PhotoFigure } from "@/components/page/Photo";
import { PresetLink } from "@/components/logistics/PresetLink";
import { CompanyStats } from "./CompanyStats";
import { home } from "@/content/home";
import { warehouses } from "@/content/company";
import { servicesBlock } from "@/content/logistics";
import { findService } from "@/content/services";
import { site } from "@/content/site";
import { cityById } from "@/lib/routes";

export function AboutSection() {
  return (
    <section className="home-section section-about" aria-labelledby="about-title">
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

type Item = (typeof servicesBlock.items)[number];

function ServiceLinks({ item }: { item: Item }) {
  return (
    <div className="svc-links">
      <Link href={item.href} className="text-link">
        {home.services.more}
        <ArrowUpRight size={18} aria-hidden="true" />
      </Link>
      {item.mode && (
        <PresetLink mode={item.mode} className="text-link svc-calc">
          {home.services.calculate}
        </PresetLink>
      )}
    </div>
  );
}

function Figure({ item }: { item: Item }) {
  return (
    <p className="svc-figure">
      <strong>{item.figure}</strong>
      <span>{item.figureLabel}</span>
    </p>
  );
}

// Four services, four compositions: the index reads as an edited page,
// not as one component repeated with different props.
export function ServicesIndex() {
  const [groupage, ftl, warehouse, marketplaces] = servicesBlock.items;
  const warehouseFacts = findService("warehouse")?.facts ?? [];
  return (
    <section className="home-section section-services" aria-labelledby="services-title">
      <Container wide>
        <SectionLabel index="02">{home.servicesLabel}</SectionLabel>
        <h2 id="services-title" className="sr-only">
          {home.servicesTitle}
        </h2>

        <article className="svc svc-a" aria-labelledby="svc-groupage">
          <span className="svc-num">01</span>
          <h3 id="svc-groupage" className="svc-title">
            <Link href={groupage.href}>{groupage.title}</Link>
          </h3>
          <div className="svc-side">
            <Figure item={groupage} />
            <p>{groupage.text[0]}</p>
            <p className="muted">{groupage.details}</p>
            <ServiceLinks item={groupage} />
          </div>
          <PhotoFigure name="pallets" sizes="(min-width: 1024px) 92vw, 100vw" className="svc-photo" />
        </article>

        <article className="svc svc-b" aria-labelledby="svc-ftl">
          <PhotoFigure name="highway" sizes="(min-width: 1024px) 58vw, 100vw" className="svc-photo" />
          <div className="svc-body">
            <span className="svc-num">02</span>
            <h3 id="svc-ftl" className="svc-title">
              <Link href={ftl.href}>{ftl.title}</Link>
            </h3>
            <Figure item={ftl} />
            <p>{ftl.text[0]}</p>
            <p className="muted">{ftl.text[1]}</p>
            <ServiceLinks item={ftl} />
          </div>
        </article>

        <article className="svc svc-c" aria-labelledby="svc-warehouse">
          <span className="svc-num">03</span>
          <h3 id="svc-warehouse" className="svc-title">
            <Link href={warehouse.href}>{warehouse.title}</Link>
          </h3>
          <dl className="svc-data">
            {warehouseFacts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div className="svc-side">
            <p>{warehouse.text[0]}</p>
            <ServiceLinks item={warehouse} />
          </div>
        </article>

        <article className="svc svc-d" aria-labelledby="svc-marketplaces">
          <div className="svc-body">
            <span className="svc-num">04</span>
            <h3 id="svc-marketplaces" className="svc-title">
              <Link href={marketplaces.href}>{marketplaces.title}</Link>
            </h3>
            <Figure item={marketplaces} />
            <p>{marketplaces.text[0]}</p>
            <ServiceLinks item={marketplaces} />
          </div>
          <PhotoFigure name="loading" sizes="(min-width: 1024px) 58vw, 100vw" className="svc-photo" />
        </article>
      </Container>
    </section>
  );
}

export function WarehousesSection() {
  return (
    <section className="home-section section-warehouses" aria-labelledby="warehouses-title">
      <Container wide>
        <SectionLabel index="05">{home.warehousesLabel}</SectionLabel>
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
        <SectionLabel index="06">{home.conditionsLabel}</SectionLabel>
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
        <SectionLabel index="07">{home.contact.label}</SectionLabel>
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
