import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui";
import { JsonLd, PageHero, PageSection } from "@/components/page/PageParts";
import { ContactForm } from "@/components/contacts/ContactForm";
import { MapExplorer } from "@/components/logistics/StandaloneCalculator";
import { contactsPage as copy, requisites, warehouses } from "@/content/company";
import { site } from "@/content/site";
import { cityById } from "@/lib/routes";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: copy.title, description: copy.description, path: "/contacts" });

const localBusinesses = warehouses.map((item) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: `${site.legalName}, склад ${cityById(item.city).name}`,
  url: absoluteUrl("/contacts"),
  telephone: site.phone,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: cityById(item.city).name,
    streetAddress: item.address,
    addressCountry: "RU",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: cityById(item.city).latitude,
    longitude: cityById(item.city).longitude,
  },
  parentOrganization: { "@type": "Organization", name: site.legalName },
}));

export default function ContactsPage() {
  const tel = site.phone.replace(/\D/g, "");
  return (
    <>
      <JsonLd data={localBusinesses} />
      <PageHero crumbs={[{ name: copy.title, path: "/contacts" }]} title={copy.title} lead={copy.lead} />
      <section className="page-section" aria-labelledby="contact-form-title">
        <Container wide>
          <div className="contacts-layout">
            <div className="contacts-info">
              <dl className="contacts-list">
                <div>
                  <dt>
                    <Phone size={18} aria-hidden="true" />
                    {copy.phoneLabel}
                  </dt>
                  <dd>
                    <a href={`tel:${tel}`}>{site.phone}</a>
                  </dd>
                </div>
                <div>
                  <dt>
                    <Mail size={18} aria-hidden="true" />
                    {copy.emailLabel}
                  </dt>
                  <dd>
                    <a href={`mailto:${site.email}`}>{site.email}</a>
                  </dd>
                </div>
                <div>
                  <dt>
                    <MapPin size={18} aria-hidden="true" />
                    {copy.addressLabel}
                  </dt>
                  <dd>{copy.address}</dd>
                </div>
              </dl>
              <h2 className="h3-text">{copy.hoursLabel}</h2>
              <dl className="hours-list">
                {copy.hours.map((row) => (
                  <div key={row.days}>
                    <dt>{row.days}</dt>
                    <dd>{row.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="contacts-form">
              <h2 id="contact-form-title">{copy.formTitle}</h2>
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
      <PageSection id="map" title={copy.mapTitle} lead={copy.mapNote} tone="surface">
        <MapExplorer />
        <ul className="warehouse-grid">
          {warehouses.map((item) => (
            <li key={item.city}>
              <h3>{cityById(item.city).name}</h3>
              <p>{item.address}</p>
              <p className="muted">{item.hours}</p>
            </li>
          ))}
        </ul>
      </PageSection>
      <PageSection id="requisites" title={copy.requisitesTitle}>
        <dl className="requisites">
          {requisites.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </PageSection>
    </>
  );
}
