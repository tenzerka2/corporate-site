import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ContactCard } from "@/components/ui/ContactCard";
import { Features } from "@/components/ui/Features";
import { Hero } from "@/components/ui/Hero";
import { Stats } from "@/components/ui/Stats";
import { aboutPage as copy, warehouseList } from "@/content/pages";
import styles from "./page.module.css";

export const metadata: Metadata = { title: copy.title, description: copy.lead };

export default function AboutPage() {
  return (
    <>
      <Hero
        crumbs={[{ label: copy.title }]}
        badge={copy.badge}
        title={copy.h1}
        lead={copy.lead}
        actions={[{ label: "Склады и адреса", href: "/warehouses", icon: "pin" }]}
        photo={{ image: copy.image, alt: copy.alt }}
        stats={copy.stats}
      />

      <section className="section" aria-labelledby="history-title">
        <div className="container">
          <div className="head-left">
            <h2 id="history-title">{copy.historyTitle}</h2>
          </div>
          <ol className={`plain-list ${styles.history}`}>
            {copy.history.map((item) => (
              <li key={item.year}>
                <span className={styles.year}>{item.year}</span>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="block" aria-labelledby="principles-title">
        <div className="container">
          <div className="head-left">
            <h2 id="principles-title">{copy.principlesTitle}</h2>
          </div>
          <Features items={copy.principles} />
        </div>
      </section>

      <section className="section" aria-labelledby="fleet-title">
        <div className={`container ${styles.fleet}`}>
          <div>
            <h2 id="fleet-title">{copy.fleetTitle}</h2>
            <p className={styles.fleetText}>{copy.fleetText}</p>
            <Stats items={copy.fleet} />
            <Link className="link" href="/services/truck">
              Заказать отдельную машину
              <Icon name="arrow" size={16} />
            </Link>
          </div>
          <Image className={styles.fleetPhoto} src={copy.fleetImage} alt={copy.fleetAlt} sizes="(min-width: 1024px) 560px, 100vw" placeholder="blur" />
        </div>
      </section>

      <section className="section" aria-labelledby="network-title">
        <div className="container">
          <div className="head-left">
            <h2 id="network-title">Склады</h2>
            <p>Шесть собственных складов, 35 500 м². Между ними ежедневные рейсы.</p>
          </div>
          <ul className={`plain-list ${styles.cities}`}>
            {warehouseList.map((item) => (
              <li key={item.id}>
                <Link href={`/warehouses#${item.id}`}>
                  <strong>{item.city}</strong>
                  <span>{item.area}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="requisites" className="section" aria-labelledby="requisites-title">
        <div className="container">
          <div className="head-left">
            <h2 id="requisites-title">{copy.requisitesTitle}</h2>
            <p>{copy.requisitesNote}</p>
          </div>
          <dl className={styles.requisites}>
            {copy.requisites.map(([name, value]) => (
              <div key={name}>
                <dt>{name}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <ContactCard />
    </>
  );
}
