import Link from "next/link";
import {
  ArrowUpRight,
} from "lucide-react";
import { ButtonLink, Container } from "@/components/ui";
import { Accordion } from "@/components/ui/interactive";
import { site } from "@/content/site";
import {
  faqBlock,
  finalBlock,
  regularBlock,
  servicesBlock,
} from "@/content/logistics";
import { PresetLink } from "./PresetLink";


export function ServicesBlock() {
  return (
    <section className="section services-block" aria-labelledby="services-title">
      <Container wide>
        <div className="section-heading">
          <div>
            <h2 id="services-title">{servicesBlock.title}</h2>
            <p className="lead muted measure">{servicesBlock.description}</p>
          </div>
        </div>
        <ul className="service-rows">
          {servicesBlock.items.map((service) => (
            <li key={service.slug} className="service-row">
              <div className="service-row-main">
                <h3>
                  <Link href={service.href}>{service.title}</Link>
                </h3>
                <p>{service.text[0]}</p>
              </div>
              <dl className="service-row-specs">
                <div>
                  <dt>{service.figureLabel}</dt>
                  <dd>{service.figure}</dd>
                </div>
                <div>
                  <dt>{servicesBlock.detailsLabel}</dt>
                  <dd>{service.details}</dd>
                </div>
              </dl>
              <div className="service-row-actions">
                <PresetLink mode={service.mode} className="button button-secondary button-small">
                  {service.action}
                </PresetLink>
                <Link href={service.href} className="text-link">
                  {servicesBlock.more}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function RegularBlock() {
  return (
    <section className="section regular-block" aria-labelledby="regular-title">
      <Container wide>
        <div className="section-heading">
          <div>
            <h2 id="regular-title">{regularBlock.title}</h2>
            <p className="lead muted measure">{regularBlock.description}</p>
          </div>
        </div>
        <dl className="spec-grid spec-grid-2">
          {regularBlock.items.map((item) => (
            <div key={item.title}>
              <dt>{item.title}</dt>
              <dd>{item.text}</dd>
            </div>
          ))}
        </dl>
        <div className="regular-action">
          <ButtonLink href="/contacts" variant="secondary">
            {regularBlock.action}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

export function FaqBlock({
  id = "faq",
  title = faqBlock.title,
  description = faqBlock.description,
  items = faqBlock.items,
}: {
  title?: string;
  description?: string;
  items?: readonly { title: string; content: string }[];
  id?: string;
}) {
  return (
    <section className="section faq-block" id={id} aria-labelledby={`${id}-title`}>
      <Container wide>
        <div className="faq-layout">
          <div>
            <h2 id={`${id}-title`}>{title}</h2>
            <p className="lead muted">{description}</p>
          </div>
          <Accordion items={[...items]} />
        </div>
      </Container>
    </section>
  );
}

export function FinalBlock() {
  return (
    <section className="final-block" aria-labelledby="final-title">
      <Container wide>
        <div className="final-panel">
          <div>
            <h2 id="final-title">{finalBlock.title}</h2>
            <p className="lead">{finalBlock.text}</p>
          </div>
          <div className="final-actions">
            <PresetLink className="button button-primary button-regular">
              {finalBlock.calculate}
            </PresetLink>
            <a
              className="button button-secondary button-regular"
              href={`tel:${site.phone.replace(/\D/g, "")}`}
            >
              {finalBlock.call}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
