import { company, nav } from "@/content/site";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Онега" width="132" height="32" className={styles.logo} />
          <p className={styles.legal}>{company.legalName}</p>
        </div>
        <nav aria-label="Разделы">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className={styles.contacts}>
          <a href={company.phoneHref}>{company.phone}</a>
          <a href={`mailto:${company.email}`}>{company.email}</a>
          <span>{company.address}</span>
        </div>
      </div>
      <div className={`container ${styles.bottom}`}>
        <span>© 2026 {company.legalName}. {company.demoNote}</span>
        <span className={styles.demo}>{company.demo}</span>
      </div>
    </footer>
  );
}
