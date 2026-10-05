import { ArrowLeft, Calculator } from "lucide-react";
import { ButtonLink, Container } from "@/components/ui";
import { notFoundCopy as copy } from "@/content/company";

export const metadata = { title: copy.title };

export default function NotFound() {
  return (
    <section className="industrial-hero not-found">
      <Container wide>
        <div className="not-found-layout">
          <p className="not-found-code" aria-hidden="true">
            {copy.code}
          </p>
          <div>
            <h1>{copy.title}</h1>
            <p className="page-hero-lead">{copy.text}</p>
            <div className="hero-actions">
              <ButtonLink href="/calculator" icon={<Calculator size={19} aria-hidden="true" />}>
                {copy.calculate}
              </ButtonLink>
              <ButtonLink href="/" variant="secondary" icon={<ArrowLeft size={19} aria-hidden="true" />}>
                {copy.home}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
