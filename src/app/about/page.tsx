import { ButtonLink, Container } from "@/components/ui";
import { PageHero, PageSection } from "@/components/page/PageParts";
import { CompanyStats } from "@/components/home/HomeMotion";
import { FinalBlock } from "@/components/logistics/HomeBlocks";
import { aboutPage as copy, warehouses } from "@/content/company";
import { cityById } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: copy.title, description: copy.description, path: "/about" });

export default function AboutPage() {
  return (
    <>
      <PageHero crumbs={[{ name: copy.title, path: "/about" }]} title={copy.title} lead={copy.lead} />
      <Container wide>
        <CompanyStats />
      </Container>
      <PageSection id="story" title={copy.storyTitle}>
        <div className="prose-columns">
          {copy.story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <figure className="about-quote">
          <blockquote>{copy.quote}</blockquote>
          <figcaption>{copy.quoteCaption}</figcaption>
        </figure>
      </PageSection>
      <PageSection id="principles" title={copy.principlesTitle} tone="surface">
        <ul className="principles-grid">
          {copy.principles.map((item, index) => (
            <li key={item.title}>
              <span className="step-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      </PageSection>
      <PageSection id="warehouses" title={copy.warehousesTitle}>
        <ul className="warehouse-grid">
          {warehouses.map((item) => (
            <li key={item.city}>
              <h3>{cityById(item.city).name}</h3>
              <p>{item.address}</p>
              <p className="muted">
                {item.area}, {item.hours}
              </p>
            </li>
          ))}
        </ul>
        <div className="regular-action">
          <ButtonLink href="/contacts" variant="secondary">
            {copy.contactsLink}
          </ButtonLink>
        </div>
      </PageSection>
      <FinalBlock />
    </>
  );
}
