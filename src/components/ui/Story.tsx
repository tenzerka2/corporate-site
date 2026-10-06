import Image, { type StaticImageData } from "next/image";
import type { Fact } from "@/content/services";
import styles from "./Story.module.css";

/** Client case on deep navy: photo, what changed, and three figures. */
export function Story({
  label,
  title,
  text,
  figures,
  image,
  alt,
}: {
  label: string;
  title: string;
  text: string;
  figures: Fact[];
  image: StaticImageData;
  alt: string;
}) {
  return (
    <article className={styles.story}>
      <Image className={styles.photo} src={image} alt={alt} sizes="(min-width: 1024px) 460px, 100vw" placeholder="blur" />
      <div className={styles.body}>
        <p className={styles.label}>{label}</p>
        <h2>{title}</h2>
        <p className={styles.text}>{text}</p>
        <dl className={styles.figures}>
          {figures.map((figure) => (
            <div key={figure.label}>
              <dt>{figure.label}</dt>
              <dd>{figure.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}
