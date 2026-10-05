import { Badge, Container } from "@/components/ui";
import { PageHero } from "./PageParts";
import { legalDemo } from "@/content/company";

export function LegalPage({
  path,
  page,
}: {
  path: string;
  page: { title: string; sections: { title: string; text: string }[] };
}) {
  return (
    <>
      <PageHero crumbs={[{ name: page.title, path }]} title={page.title} />
      <section className="page-section" aria-label={page.title}>
        <Container>
          <div className="legal">
            <Badge>{legalDemo}</Badge>
            {page.sections.map((section, index) => (
              <section key={section.title} aria-labelledby={`legal-${index}`}>
                <h2 id={`legal-${index}`}>
                  {index + 1}. {section.title}
                </h2>
                <p>{section.text}</p>
              </section>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
