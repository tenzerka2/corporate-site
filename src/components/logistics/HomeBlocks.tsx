import { Container } from "@/components/ui";
import { Accordion } from "@/components/ui/interactive";
import { site } from "@/content/site";
import { faqBlock, finalBlock } from "@/content/logistics";
import { PresetLink } from "./PresetLink";

export function FaqBlock({
  id = "faq",
  title = faqBlock.title,
  description = faqBlock.description,
  items = faqBlock.items,
}: {
  title?: string;
  description?: string;
  items?: readonly { title: string; content: string }[];
  id?: string;
}) {
  return (
    <section className="section faq-block" id={id} aria-labelledby={`${id}-title`}>
      <Container wide>
        <div className="faq-layout">
          <div>
            <h2 id={`${id}-title`}>{title}</h2>
            <p className="lead muted">{description}</p>
          </div>
          <Accordion items={[...items]} />
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
              {finalBlock.calculate}
            </PresetLink>
            <a
              className="button button-secondary button-regular"
              href={`tel:${site.phone.replace(/\D/g, "")}`}
            >
              {finalBlock.call}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
