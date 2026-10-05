import { Container } from "@/components/ui";
import { MapExplorer } from "@/components/logistics/StandaloneCalculator";
import { Logo } from "@/components/Logo";
import { visualCopy as copy } from "@/content/visuals";
import { site } from "@/content/site";
export const metadata = { title: copy.title };
export default function Visuals() {
  return (
    <Container wide>
      <div className="visuals-page">
        <h1>{copy.title}</h1>
        <p className="lead muted">{copy.description}</p>
        <section className="section brand-specimen" aria-label={site.name}>
          <Logo />
          <p className="h2-text">{site.description}</p>
        </section>
        <section className="section">
          <h2>{copy.geography}</h2>
          <MapExplorer />
        </section>
      </div>
    </Container>
  );
}
