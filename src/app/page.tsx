import Image from "next/image";
import Link from "next/link";
import { Calculator } from "@/components/Calculator";
import { Icon } from "@/components/Icon";
import { CheckList } from "@/components/ui/CheckList";
import { Hero } from "@/components/ui/Hero";
import { Steps } from "@/components/ui/Steps";
import { warehouseList } from "@/content/pages";
import { services } from "@/content/services";
import { company, contacts, hero, reviews, stats, steps, why } from "@/content/site";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <Hero
        badge={hero.badge}
        title={hero.title}
        lead={hero.lead}
        points={hero.points}
        actions={[
          { label: hero.primary.label, href: hero.primary.href, icon: "calc" },
          { label: hero.secondary.label, href: hero.secondary.href, secondary: true },
        ]}
        promises={hero.promises}
        photo={hero.photo}
        stats={stats}
      />

      <section id="how" className="section" aria-labelledby="how-title">
        <div className="container">
          <div className="head-center">
            <h2 id="how-title">{steps.title}</h2>
            <p>{steps.text}</p>
          </div>
          <Steps items={steps.items} />
          <div className={styles.centerAction}>
            <a className="button" href="#calculator">
              <Icon name="calc" />
              {steps.action}
            </a>
          </div>
        </div>
      </section>

      <section id="why" className="block" aria-labelledby="why-title">
        <div className={`container ${styles.why}`}>
          <div className={styles.whyPhoto}>
            <Image src={why.image} alt={why.alt} sizes="(min-width: 1024px) 520px, 100vw" placeholder="blur" />
          </div>
          <div>
            <h2 id="why-title">{why.title}</h2>
            <div className={styles.whyList}>
              <CheckList items={why.items} columns={2} />
            </div>
            <Link className="button" href="/about">
              {why.action}
              <Icon name="arrow" size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section id="services" className="section" aria-labelledby="services-title">
        <div className="container">
          <div className="head-center">
            <h2 id="services-title">Наши услуги</h2>
            <p>Перевозки и хранение для компаний: от одной коробки до регулярных рейсов по графику. Все услуги работают через одного менеджера и один договор.</p>
          </div>
          <ul className={`plain-list ${styles.services}`}>
            {services.map((item) => (
              <li key={item.slug} className={styles.service}>
                <div className={styles.servicePhoto}>
                  <Image src={item.image} alt={item.alt} sizes="(min-width: 1024px) 560px, 100vw" placeholder="blur" />
                </div>
                <div className={styles.serviceBody}>
                  <h3>{item.title}</h3>
                  <p className="muted">{item.summary}</p>
                  <ul className={`plain-list ${styles.tags}`}>
                    {item.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <Link className="button button-secondary" href={`/services/${item.slug}`}>
                    Подробнее
                    <span className="sr-only">: {item.title}</span>
                    <Icon name="arrow" size={18} />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Calculator />

      <section id="reviews" className="section" aria-labelledby="reviews-title">
        <div className="container">
          <div className="head-center">
            <h2 id="reviews-title">{reviews.title}</h2>
            <p>{reviews.text}</p>
          </div>
          <ul className={`plain-list ${styles.reviews}`}>
            {reviews.items.map((item) => (
              <li key={item.company}>
                <blockquote>
                  <p>{item.text}</p>
                </blockquote>
                <p className={styles.reviewWho}>
                  <strong>{item.who}</strong>
                  <span>{item.company}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="warehouses" className="block" aria-labelledby="warehouses-title">
        <div className="container">
          <div className="head-center">
            <h2 id="warehouses-title">Шесть собственных складов</h2>
            <p>Принимаем и отправляем грузы ежедневно с 08:00 до 20:00</p>
          </div>
          <ul className={`plain-list ${styles.warehouses}`}>
            {warehouseList.map((item) => (
              <li key={item.id}>
                <h3>
                  <Link href={`/warehouses#${item.id}`} className={styles.cardLink}>
                    {item.city}
                  </Link>
                </h3>
                <p className="muted">{item.address}</p>
                <p className={styles.area}>{item.area}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="contacts" className="section" aria-labelledby="contacts-title">
        <div className="container">
          <div className={styles.cta}>
            <div>
              <h2 id="contacts-title">{contacts.title}</h2>
              <p>{contacts.text}</p>
            </div>
            <div className={styles.ctaActions}>
              <a className={`button ${styles.ctaPrimary}`} href={company.phoneHref}>
                <Icon name="phone" />
                {company.phone}
              </a>
              <a className={`button ${styles.ctaSecondary}`} href={`mailto:${company.email}`}>
                <Icon name="mail" />
                {company.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
