import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";
import { Container } from "@/components/ui";
import { home } from "@/content/home";
import { site } from "@/content/site";

export function ProcessSection() {
  return (
    <section className="section home-process" id="how-it-works" aria-labelledby="process-title">
      <Container wide>
        <div className="section-heading">
          <div>
            <h2 id="process-title">{home.processTitle}</h2>
            <p className="lead muted">{home.processDescription}</p>
          </div>
        </div>
        <ol className="spec-grid spec-grid-3">
          {home.steps.map((step, index) => (
            <li key={step.slug}>
              <span className="step-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              {index === 0 && (
                <Link href="#calculator" className="text-link">
                  {home.openCalculator}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
              )}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

export function ConditionsSection() {
  const tel = site.phone.replace(/\D/g, "");
  return (
    <section className="section home-conditions" id="why-onega" aria-labelledby="conditions-title">
      <Container wide>
        <div className="conditions-layout">
          <div>
            <h2 id="conditions-title">{home.conditionsTitle}</h2>
            <dl className="spec-grid spec-grid-2">
              {home.conditions.map((item) => (
                <div key={item.title}>
                  <dt>{item.title}</dt>
                  <dd>{item.text}</dd>
                </div>
              ))}
            </dl>
          </div>
          <aside className="manager-panel" aria-labelledby="manager-title">
            <h3 id="manager-title">{home.managerTitle}</h3>
            <p>{home.managerDescription}</p>
            <a className="manager-phone" href={`tel:${tel}`}>
              <Phone size={20} aria-hidden="true" />
              {site.phone}
            </a>
            <Link href="/contacts" className="text-link">
              {home.managerAction}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </Container>
    </section>
  );
}
