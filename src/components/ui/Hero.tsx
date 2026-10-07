import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { Icon, type IconName } from "../Icon";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { Stats, type Stat } from "./Stats";
import styles from "./Hero.module.css";

export type HeroAction = { label: string; href: string; icon?: IconName; secondary?: boolean };

/** Shared corporate page introduction with independently readable copy and imagery. */
export function Hero({
  crumbs,
  badge,
  title,
  lead,
  points,
  actions,
  extraAction,
  promises,
  photo,
  stats,
}: {
  crumbs?: Crumb[];
  badge?: string;
  title: string;
  lead?: string;
  points?: readonly string[];
  actions?: HeroAction[];
  extraAction?: ReactNode;
  promises?: readonly { icon: IconName; text: string }[];
  photo?: { image: StaticImageData; alt: string };
  stats?: readonly Stat[];
}) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.box} ${photo ? "" : styles.compact}`}>
        {photo && (
          <div className={styles.photo}>
            <Image src={photo.image} alt={photo.alt} fill sizes="(min-width: 1400px) 608px, (min-width: 1024px) 44vw, 100vw" placeholder="blur" priority />
          </div>
        )}
        <div className={styles.copy}>
          {crumbs && <Breadcrumbs items={crumbs} />}
          <h1 id="hero-title">{title}</h1>
          {badge && <p className={styles.badge}>{badge}</p>}
          {lead && <p className={styles.lead}>{lead}</p>}
          {points && (
            <ul className={styles.checks}>
              {points.map((point) => (
                <li key={point}>
                  {point}
                </li>
              ))}
            </ul>
          )}
          {(actions || extraAction) && (
            <div className={styles.actions}>
              {actions?.map((action) => (
                <Link key={action.href} className={`button ${action.secondary ? "button-secondary" : ""}`} href={action.href}>
                  {action.icon && <Icon name={action.icon} size={22} />}
                  {action.label}
                </Link>
              ))}
              {extraAction}
            </div>
          )}
          {promises && (
            <ul className={styles.promises}>
              {promises.map((item) => (
                <li key={item.text}>
                  {item.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {stats && (
        <div className={`container ${styles.facts}`}>
          <Stats items={stats} />
        </div>
      )}
    </section>
  );
}
