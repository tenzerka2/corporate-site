import type { StaticImageData } from "next/image";
import Link from "next/link";
import { Icon } from "../Icon";
import styles from "./Steps.module.css";

export type Step = {
  title: string;
  text: string;
  image?: StaticImageData;
  alt?: string;
  link?: { label: string; href: string };
};

/** Numbering represents the actual order of the delivery process. */
export function Steps({ items }: { items: readonly Step[] }) {
  return (
    <ol className={`plain-list ${styles.steps}`} data-count={items.length}>
      {items.map((step, index) => (
        <li key={step.title} className={styles.step}>
          <span className={styles.num} aria-hidden="true">{index + 1}</span>
          <div className={styles.body}>
            <h3>{step.title}</h3>
            <p className="muted">{step.text}</p>
            {step.link && (
              <Link className="link" href={step.link.href}>
                {step.link.label}
                <Icon name="arrow" size={16} />
              </Link>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
