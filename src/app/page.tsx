import Image from "next/image";
import { Calculator } from "@/components/Calculator";
import { Icon } from "@/components/Icon";
import { company, contacts, hero, reviews, services, stats, steps, warehouses, why } from "@/content/site";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroBox}>
          <div className={styles.heroPhoto}>
            <Image src={hero.photo.image} alt={hero.photo.alt} fill sizes="(min-width: 1024px) 55vw, 100vw" placeholder="blur" priority />
          </div>
          <div className={`container ${styles.heroCopy}`}>
            <p className={styles.badge}>{hero.badge}</p>
            <h1 id="hero-title">{hero.title}</h1>
            <p className={styles.lead}>{hero.lead}</p>
            <ul className={styles.checks}>
              {hero.points.map((point) => (
                <li key={point}>
                  <Icon name="check" size={18} />
                  {point}
                </li>
              ))}
            </ul>
            <div className={styles.heroActions}>
              <a className="button" href={hero.primary.href}>
                <Icon name="calc" size={22} />
                {hero.primary.label}
              </a>
              <a className="button button-secondary" href={hero.secondary.href}>
                {hero.secondary.label}
              </a>
            </div>
            <ul className={styles.promises}>
              {hero.promises.map((item) => (
                <li key={item.text}>
                  <Icon name={item.icon} size={18} />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="container">
          <dl className={styles.stats}>
            {stats.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="how" className={styles.section} aria-labelledby="how-title">
        <div className="container">
          <div className={styles.center}>
            <h2 id="how-title">{steps.title}</h2>
            <p className="muted">{steps.text}</p>
          </div>
          <ol className={styles.steps}>
            {steps.items.map((step, index) => (
              <li key={step.title} className={styles.step}>
                <div className={styles.stepPhoto}>
                  <Image src={step.image} alt={step.alt} sizes="(min-width: 1024px) 360px, 100vw" placeholder="blur" />
                  <span className={styles.stepNum} aria-hidden="true">
                    {index + 1}
                  </span>
                </div>
                <div className={styles.stepBody}>
                  <h3>{step.title}</h3>
                  <p className="muted">{step.text}</p>
                  <a className="link" href={step.link.href}>
                    {step.link.label}
                    <Icon name="arrow" size={16} />
                  </a>
                </div>
              </li>
            ))}
          </ol>
          <div className={styles.centerAction}>
            <a className="button" href="#calculator">
              <Icon name="calc" />
              {steps.action}
            </a>
          </div>
        </div>
      </section>

      <section id="why" className={styles.block} aria-labelledby="why-title">
        <div className={`container ${styles.why}`}>
          <div className={styles.whyPhoto}>
            <Image src={why.image} alt={why.alt} sizes="(min-width: 1024px) 520px, 100vw" placeholder="blur" />
          </div>
          <div>
            <h2 id="why-title">{why.title}</h2>
            <ul className={styles.whyList}>
              {why.items.map((item) => (
                <li key={item}>
                  <Icon name="check" size={18} />
                  {item}
                </li>
              ))}
            </ul>
            <a className="button" href="#contacts">
              <Icon name="phone" />
              {why.action}
            </a>
          </div>
        </div>
      </section>

      <section id="services" className={styles.section} aria-labelledby="services-title">
        <div className="container">
          <div className={styles.center}>
            <h2 id="services-title">{services.title}</h2>
            <p className="muted">{services.text}</p>
          </div>
          <ul className={styles.services}>
            {services.items.map((item) => (
              <li key={item.id} className={styles.service}>
                <div className={styles.servicePhoto}>
                  <Image src={item.image} alt={item.alt} sizes="(min-width: 1024px) 560px, 100vw" placeholder="blur" />
                </div>
                <div className={styles.serviceBody}>
                  <h3>{item.title}</h3>
                  <p className="muted">{item.text}</p>
                  <ul className={styles.tags}>
                    {item.facts.map((fact) => (
                      <li key={fact}>{fact}</li>
                    ))}
                  </ul>
                  <a className="button button-secondary" href="#calculator">
                    {services.action}
                    <span className="sr-only">: {item.title}</span>
                    <Icon name="arrow" size={18} />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Calculator />

      <section id="reviews" className={styles.section} aria-labelledby="reviews-title">
        <div className="container">
          <div className={styles.center}>
            <h2 id="reviews-title">{reviews.title}</h2>
            <p className="muted">{reviews.text}</p>
          </div>
          <ul className={styles.reviews}>
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

      <section id="warehouses" className={styles.block} aria-labelledby="warehouses-title">
        <div className="container">
          <div className={styles.center}>
            <h2 id="warehouses-title">{warehouses.title}</h2>
            <p className="muted">{warehouses.text}</p>
          </div>
          <ul className={styles.warehouses}>
            {warehouses.items.map((item) => (
              <li key={item.city}>
                <h3>{item.city}</h3>
                <p className="muted">{item.address}</p>
                <p className={styles.area}>{item.area}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="contacts" className={styles.section} aria-labelledby="contacts-title">
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
