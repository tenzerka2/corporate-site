"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { company, nav } from "@/content/site";
import { Icon } from "./Icon";
import styles from "./Header.module.css";

export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (returnFocus: boolean) => {
      setOpen(false);
      if (returnFocus) toggle.current?.focus();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(true);
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!panel.current?.contains(target) && !toggle.current?.contains(target)) close(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <button
          ref={toggle}
          type="button"
          className={styles.burger}
          aria-label="Меню"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <Icon name="menu" size={24} />
        </button>
        <Link href="/" className={styles.logo} aria-label="Онега, на главную">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" width="132" height="32" />
        </Link>
        <nav className={styles.nav} aria-label="Основное меню">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className={styles.actions}>
          <a className={`button button-secondary button-small ${styles.cta}`} href="#calculator">
            <Icon name="calc" />
            <span className={styles.ctaLong}>Рассчитать доставку</span>
            <span className={styles.ctaShort} aria-hidden="true">
              Расчёт
            </span>
          </a>
          <span className={styles.divider} aria-hidden="true" />
          <a className={styles.iconLink} href={company.phoneHref}>
            <Icon name="phone" size={22} />
            <span>{company.phone}</span>
          </a>
          <a className={styles.iconLink} href={`mailto:${company.email}`}>
            <Icon name="mail" size={22} />
            <span>Написать</span>
          </a>
        </div>
      </div>
      <div
        ref={panel}
        id="site-menu"
        className={styles.panel}
        hidden={!open}
      >
        <nav className="container" aria-label="Меню">
          {nav.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <a href={company.phoneHref} className={styles.panelPhone}>
            {company.phone}
          </a>
        </nav>
      </div>
    </header>
  );
}
