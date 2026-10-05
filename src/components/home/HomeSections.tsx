import Link from "next/link";
import { ArrowUpRight, Calculator } from "lucide-react";
import { ButtonLink, CheckItem, Container } from "@/components/ui";
import { home } from "@/content/home";
import { industryAssets } from "@/content/visuals";
import { Reveal } from "./HomeMotion";

export function HomeSections() {
  return (
    <>
      <section
        className="section home-industries"
        aria-labelledby="industries-title"
      >
        <Container wide>
          <Reveal>
            <div className="section-heading">
              <div>
                <h2 id="industries-title">{home.industriesTitle}</h2>
                <p className="lead muted">{home.industriesDescription}</p>
              </div>
            </div>
            <ul className="home-industry-grid">
              {industryAssets.map((industry) => (
                <li key={industry.slug}>
                  <span>{industry.title}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>
      <section
        className="home-process"
        id="how-it-works"
        aria-labelledby="process-title"
      >
        <Container wide>
          <div className="section-heading">
            <div>
              <h2 id="process-title">{home.processTitle}</h2>
              <p className="lead muted">{home.processDescription}</p>
            </div>
          </div>
          <ol className="process-grid">
            {home.steps.map((step, index) => (
              <li key={step.slug}>
                <div className="process-step">
                  <div className="process-copy">
                    <div className="process-heading">
                      <span className="step-number" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3>{step.title}</h3>
                    </div>
                    <p>{step.description}</p>
                    {index === 0 && (
                      <Link href="/calculator" className="text-link">
                        {home.openCalculator}
                        <ArrowUpRight size={18} aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <div className="process-action">
            <ButtonLink
              href="/calculator"
              icon={<Calculator size={19} aria-hidden="true" />}
            >
              {home.calculate}
            </ButtonLink>
          </div>
        </Container>
      </section>
      <section
        className="section home-benefits"
        id="why-onega"
        aria-labelledby="benefits-title"
      >
        <Container wide>
          <div className="benefits-layout">
            <Reveal className="benefits-copy">
              <h2 id="benefits-title">{home.benefitsTitle}</h2>
              <ul className="benefits-grid">
                {home.benefits.map((benefit) => (
                  <li key={benefit}>
                    <CheckItem>{benefit}</CheckItem>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="manager-panel" delay={60}>
              <div className="manager-copy">
                <h3>{home.managerTitle}</h3>
                <p>{home.managerDescription}</p>
                <ButtonLink href="/help" variant="secondary">
                  {home.managerAction}
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
