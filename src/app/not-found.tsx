import { labels } from "@/content/labels";
import { ButtonLink, Container } from "@/components/ui";
export default function NotFound() {
  return (
    <Container>
      <section className="placeholder-page">
        <h1>{labels.stranitsaNeNaydena}</h1>
        <p>{labels.proverteAdresIliPereyditeNaGlavnuyu}</p>
        <ButtonLink href="/" variant="secondary">
          {labels.naGlavnuyu}
        </ButtonLink>
      </section>
    </Container>
  );
}
