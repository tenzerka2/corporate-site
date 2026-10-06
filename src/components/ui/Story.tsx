import type { Fact } from "@/content/services";
import styles from "./Story.module.css";

/** Client case on deep navy: what changed, in three figures. */
export function Story({ label, title, text, figures }: { label: string; title: string; text: string; figures: Fact[] }) {
  return (
    <article className={styles.story}>
      <div>
        <p className={styles.label}>{label}</p>
        <h2>{title}</h2>
        <p className={styles.text}>{text}</p>
      </div>
      <dl className={styles.figures}>
        {figures.map((figure) => (
          <div key={figure.label}>
            <dt>{figure.label}</dt>
            <dd>{figure.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
