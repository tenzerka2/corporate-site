import Image, { type StaticImageData } from "next/image";
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

/** Numbered cards. With photos the number is cut into the photo corner. */
export function Steps({ items }: { items: readonly Step[] }) {
  return (
    <ol className={`plain-list ${styles.steps}`} data-count={items.length}>
      {items.map((step, index) => (
        <li key={step.title} className={styles.step}>
          {step.image ? (
            <div className={styles.photo}>
              <Image src={step.image} alt={step.alt ?? ""} sizes="(min-width: 1024px) 360px, 100vw" placeholder="blur" />
              <span className={styles.cut} aria-hidden="true">
                {index + 1}
              </span>
            </div>
          ) : (
            <span className={styles.num} aria-hidden="true">
              {index + 1}
            </span>
          )}
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
