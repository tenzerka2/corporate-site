import { Container } from "@/components/ui";
import { HeroFacts, PageHero, PageSection } from "@/components/page/PageParts";
import { ApplyForm } from "@/components/sections/ApplyForm";
import { careersPage as copy } from "@/content/sections";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: copy.title, description: copy.description, path: "/careers" });

export default function CareersPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: copy.title, path: "/careers" }]}
        title={copy.title}
        lead={copy.lead}
        aside={<HeroFacts facts={copy.facts} />}
        photo="loading"
      />
      <PageSection id="vacancies" title={copy.listTitle}>
        <div className="vacancy-list">
          <div className="vacancy-head" aria-hidden="true">
            <span>{copy.head.role}</span>
            <span>{copy.head.city}</span>
            <span>{copy.head.schedule}</span>
            <span>{copy.head.salary}</span>
          </div>
          <ul>
          {copy.vacancies.map((vacancy) => (
            <li key={vacancy.id}>
            <details className="vacancy">
              <summary>
                <span className="vacancy-role">{vacancy.role}</span>
                <span data-label={copy.head.city}>{vacancy.city}</span>
                <span data-label={copy.head.schedule}>{vacancy.schedule}</span>
                <span className="vacancy-salary" data-label={copy.head.salary}>
                  {vacancy.salary}
                </span>
              </summary>
              <div className="vacancy-body">
                <div>
                  <h3>{copy.requirements}</h3>
                  <ul>
                    {vacancy.requirements.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3>{copy.conditions}</h3>
                  <ul>
                    {vacancy.conditions.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <a className="button button-primary button-regular" href={`#apply-${vacancy.id}`}>
                  {copy.apply}
                </a>
              </div>
            </details>
            </li>
          ))}
          </ul>
        </div>
      </PageSection>
      <section className="page-section page-section-surface" id="apply" aria-labelledby="apply-title">
        <Container wide>
          <div className="contacts-layout">
            <h2 id="apply-title">{copy.formTitle}</h2>
            <div className="contacts-form">
              <ApplyForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
