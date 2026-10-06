import type { Metadata } from "next";
import { Hero } from "@/components/ui/Hero";
import { privacyPage as copy } from "@/content/pages";

export const metadata: Metadata = { title: copy.title };

export default function PrivacyPage() {
  return (
    <>
      <Hero crumbs={[{ label: copy.title }]} title={copy.h1} lead={copy.updated} />
      <section className="section">
        <div className="container prose">
          <p>
            <strong>{copy.demo}</strong>
          </p>
          {copy.sections.map((section) => (
            <div key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
