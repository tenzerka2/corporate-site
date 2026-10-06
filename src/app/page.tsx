import Image from "next/image";
import { Calculator } from "@/components/Calculator";
import { about, company, contacts, hero, services } from "@/content/site";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <h1 id="hero-title">{hero.title}</h1>
            <p className={styles.heroText}>{hero.text}</p>
            <div className={styles.heroActions}>
              <a className="button" href={hero.primary.href}>
                {hero.primary.label}
              </a>
              <a className="link" href={hero.secondary.href}>
                {hero.secondary.label}
              </a>
            </div>
          </div>
          <div className={styles.heroPhoto}>
            <Image src={hero.photo.image} alt={hero.photo.alt} sizes="(min-width: 1024px) 58vw, 100vw" placeholder="blur" priority />
          </div>
        </div>
      </section>

      <section id="services" className={styles.services} aria-labelledby="services-title">
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 id="services-title">{services.title}</h2>
            <p className="muted">{services.text}</p>
          </div>
          <ol className={styles.serviceList}>
            {services.items.map((item, index) => (
              <li key={item.id} className={styles.service}>
                <span className={styles.serviceNum} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{item.title}</h3>
                <p className={styles.serviceText}>{item.text}</p>
                <p className={styles.serviceParam}>
                  <strong>{item.param}</strong>
                  <span>{item.paramLabel}</span>
                </p>
                <a className={`link ${styles.serviceLink}`} href="#calculator">
                  Рассчитать
                  <span className="sr-only">: {item.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
        <figure className={styles.widePhoto}>
          <Image src={services.photo.image} alt={services.photo.alt} sizes="100vw" placeholder="blur" />
          <figcaption className="container">{services.photo.caption}</figcaption>
        </figure>
        <div className={`container ${styles.marketplaces}`}>
          <div>
            <h3>{services.marketplaces.title}</h3>
            <p className="muted">{services.marketplaces.text}</p>
            <a className="link" href="#calculator">
              {services.marketplaces.action}
            </a>
          </div>
          <dl className={styles.facts}>
            {services.marketplaces.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Calculator />

      <section id="company" className={styles.company} aria-labelledby="company-title">
        <div className="container">
          <div className={styles.companyGrid}>
            <div>
              <h2 id="company-title" className="sr-only">
                {about.title}
              </h2>
              <p className={styles.statement}>{about.statement}</p>
            </div>
            <div className={styles.companyText}>
              {about.text.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <dl className={styles.figures}>
            {about.figures.map((figure) => (
              <div key={figure.label}>
                <dt>{figure.label}</dt>
                <dd>{figure.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <figure className={styles.widePhoto}>
          <Image src={about.photo.image} alt={about.photo.alt} sizes="100vw" placeholder="blur" />
        </figure>
        <div className="container">
          <div className={styles.warehouses}>
            <h3>{about.warehousesTitle}</h3>
            <table>
              <caption className="sr-only">{about.warehousesTitle}</caption>
              <tbody>
                {about.warehouses.map((item) => (
                  <tr key={item.city}>
                    <th scope="row">{item.city}</th>
                    <td>{item.address}</td>
                    <td>{item.area}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="contacts" className={styles.contacts} aria-labelledby="contacts-title">
        <div className={`container ${styles.contactsGrid}`}>
          <div>
            <h2 id="contacts-title">{contacts.title}</h2>
            <p className="muted">{contacts.text}</p>
          </div>
          <dl className={styles.contactList}>
            <div>
              <dt>{contacts.phone}</dt>
              <dd>
                <a href={company.phoneHref}>{company.phone}</a>
              </dd>
            </div>
            <div>
              <dt>{contacts.email}</dt>
              <dd>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </dd>
            </div>
            <div>
              <dt>{contacts.address}</dt>
              <dd>{company.address}</dd>
            </div>
            <div>
              <dt>{contacts.hours}</dt>
              <dd>{company.hours}</dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
