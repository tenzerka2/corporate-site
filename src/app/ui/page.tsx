import { labels } from "@/content/labels";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui";
import { UiShowcase } from "@/components/UiShowcase";
import { uiContent } from "@/content/ui";
export const metadata: Metadata = { title: uiContent.title };
export default function UiPage() {
  return (
    <>
      <Container>
        <div className="ui-intro">
          <nav className="breadcrumbs" aria-label={labels.hlebnyeKroshki}>
            <Link href="/">{labels.glavnaya}</Link>
            <span>/</span>
            <span aria-current="page">{uiContent.title}</span>
          </nav>
          <h1>{uiContent.title}</h1>
          <p className="lead measure muted">{uiContent.intro}</p>
          <nav className="ui-jump-links" aria-label={labels.komponenty}>
            {[
              ["brand", labels.logotipIPalitra],
              ["type", labels.tipografika],
              ["controls", labels.knopki],
              ["forms", labels.polyaFormy],
              ["cards", labels.kartochki],
              ["disclosure", labels.vkladki],
            ].map(([href, label]) => (
              <a key={href} href={`#${href}`}>
                {label}
              </a>
            ))}
          </nav>
        </div>
      </Container>
      <UiShowcase />
    </>
  );
}
