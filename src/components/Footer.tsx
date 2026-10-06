import Link from "next/link";
import { footerColumns } from "@/content/navigation";
import { company } from "@/content/site";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Онега" width="132" height="32" className={styles.logo} />
          <p>Грузоперевозки по России и складская логистика с 2015 года.</p>
          <span className={styles.demo}>{company.demo}</span>
        </div>
        {footerColumns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className={styles.title}>{column.title}</h2>
            <ul className="plain-list">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div>
          <h2 className={styles.title}>Контакты</h2>
          <ul className="plain-list">
            <li>
              <a href={company.phoneHref} className={styles.strong}>
                {company.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </li>
            <li className={styles.muted}>{company.address}</li>
            <li className={styles.muted}>{company.hours}</li>
          </ul>
        </div>
      </div>
      <div className={`container ${styles.bottom}`}>
        <span>© 2015–2026 {company.legalName}</span>
        <span>{company.demoNote}</span>
      </div>
    </footer>
  );
}
