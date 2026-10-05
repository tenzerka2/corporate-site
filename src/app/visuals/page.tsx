import Image from "next/image";
import { Container } from "@/components/ui";
import { RussiaMap } from "@/components/RussiaMap";
import {
  visualCopy as copy,
  renderAssets,
  industryAssets,
  photoAssets,
} from "@/content/visuals";
export const metadata = { title: copy.title };
export default function Visuals() {
  return (
    <Container wide>
      <div className="visuals-page">
        <h1>{copy.title}</h1>
        <p className="lead muted">{copy.description}</p>
        <section className="section">
          <h2>{copy.renders}</h2>
          <div className="asset-grid asset-renders">
            {renderAssets.map((asset) => (
              <figure key={asset.slug}>
                <Image
                  unoptimized
                  src={`/images/renders/${asset.slug}.webp`}
                  alt={asset.alt}
                  width={1600}
                  height={1200}
                  sizes="(max-width: 767px) 100vw, 45vw"
                />
                <figcaption>{asset.title}</figcaption>
              </figure>
            ))}
          </div>
        </section>
        <section className="section">
          <h2>{copy.industries}</h2>
          <div className="industry-grid">
            {industryAssets.map((asset) => (
              <div key={asset.slug}>
                <Image
                  src={`/images/industries/${asset.slug}.svg`}
                  alt=""
                  width={48}
                  height={48}
                />
                <span>{asset.title}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="section">
          <h2>{copy.geography}</h2>
          <RussiaMap />
        </section>
        <section className="section">
          <h2>{copy.photos}</h2>
          <div className="asset-grid photo-grid">
            {photoAssets.map((asset) => (
              <figure key={asset.slug}>
                <picture>
                  <source
                    media="(max-width: 767px)"
                    srcSet={`/images/photos/${asset.slug}-portrait.webp`}
                  />
                  <Image
                    src={`/images/photos/${asset.slug}.webp`}
                    alt={asset.title}
                    width={1920}
                    height={1080}
                    unoptimized
                  />
                </picture>
                <figcaption>{asset.title}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      </div>
    </Container>
  );
}
