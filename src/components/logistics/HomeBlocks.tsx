import Link from "next/link";
import {
  ArrowUpRight,
  Calculator as CalculatorIcon,
  CalendarClock,
  FileSignature,
  Phone,
  ReceiptText,
  TrendingDown,
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
import { Reveal } from "@/components/home/HomeMotion";
import { PresetLink } from "./PresetLink";

const regularIcons = {
  contract: FileSignature,
  schedule: CalendarClock,
  report: ReceiptText,
  tariff: TrendingDown,
};

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
        <ul className="services-grid">
          {servicesBlock.items.map((service, index) => (
            <li key={service.slug}>
              <Reveal className="service-card" delay={index * 60}>
                <div className="service-figure">
                  <span className="service-figure-value">{service.figure}</span>
                  <span className="service-figure-label">
                    {service.figureLabel}
                  </span>
                </div>
                <div className="service-body">
                  <h3>{service.title}</h3>
                  {service.text.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  <p className="service-details">{service.details}</p>
                  <div className="service-actions">
                    <PresetLink
                      mode={service.mode}
                      className="button button-secondary button-small"
                    >
                      {service.action}
                    </PresetLink>
                    <Link href={service.href} className="text-link">
                      {servicesBlock.more}
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </Reveal>
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
        <ul className="regular-grid">
          {regularBlock.items.map((item, index) => {
            const Icon = regularIcons[item.icon as keyof typeof regularIcons];
            return (
              <li key={item.title}>
                <Reveal className="regular-item" delay={index * 60}>
                  <Icon size={28} aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </Reveal>
              </li>
            );
          })}
        </ul>
        <div className="regular-action">
          <ButtonLink href="/help" variant="secondary">
            {regularBlock.action}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

export function FaqBlock() {
  return (
    <section className="section faq-block" id="faq" aria-labelledby="faq-title">
      <Container wide>
        <div className="faq-layout">
          <div>
            <h2 id="faq-title">{faqBlock.title}</h2>
            <p className="lead muted">{faqBlock.description}</p>
          </div>
          <Accordion items={faqBlock.items} />
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
              <CalculatorIcon size={19} aria-hidden="true" />
              {finalBlock.calculate}
            </PresetLink>
            <a
              className="button button-secondary button-regular"
              href={`tel:${site.phone.replace(/\D/g, "")}`}
            >
              <Phone size={19} aria-hidden="true" />
              {finalBlock.call}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
