import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/content/services";
import { Icon } from "../Icon";
import styles from "./ServiceCards.module.css";

/** Grid of service cards with a photo; used on the hub and under each service page. */
export function ServiceCards({ items }: { items: Service[] }) {
  return (
    <ul className={`plain-list ${styles.grid}`} data-count={items.length}>
      {items.map((service) => (
        <li key={service.slug} className={styles.card}>
          <Image src={service.image} alt="" sizes="(min-width: 1024px) 540px, 100vw" placeholder="blur" />
          <div className={styles.body}>
            <h3>
              <Link href={`/services/${service.slug}`} className={styles.link}>
                {service.title}
              </Link>
            </h3>
            <p className="muted">{service.summary}</p>
            <ul className={`plain-list ${styles.tags}`}>
              {service.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
            <span className={`link ${styles.more}`} aria-hidden="true">
              Подробнее
              <Icon name="arrow" size={16} />
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
