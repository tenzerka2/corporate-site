"use client";
import Link from "next/link";
import { publicAsset } from "@/lib/paths";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { menu, type NavLink } from "@/content/navigation";
import { company } from "@/content/site";
import { Icon } from "./Icon";
import styles from "./Header.module.css";

const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

export function Header() {
  const pathname = usePathname();
  const [panel, setPanel] = useState(false);
  const [dropdown, setDropdown] = useState<number | null>(null);
  const bar = useRef<HTMLDivElement>(null);
  const burger = useRef<HTMLButtonElement>(null);
  const mobile = useRef<HTMLDivElement>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

  // Escape and a click outside close whatever is open; Escape returns focus to the trigger.
  useEffect(() => {
    if (!panel && dropdown === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (dropdown !== null) triggers.current[dropdown]?.focus();
      else burger.current?.focus();
      setDropdown(null);
      setPanel(false);
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (bar.current?.contains(target) || mobile.current?.contains(target)) return;
      setDropdown(null);
      setPanel(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [panel, dropdown]);

  const closeAll = () => {
    setDropdown(null);
    setPanel(false);
  };
  const linkProps = (link: NavLink) => ({
    href: link.href,
    "aria-current": pathname === link.href ? ("page" as const) : undefined,
    onClick: closeAll,
  });

  return (
    <header className={styles.header}>
      <div ref={bar} className={`container ${styles.bar}`}>
        <button
          ref={burger}
          type="button"
          className={styles.burger}
          aria-label="Меню"
          aria-expanded={panel}
          aria-controls="site-menu"
          onClick={() => setPanel((value) => !value)}
        >
          <Icon name="menu" size={24} />
        </button>
        <Link href="/" className={styles.logo} aria-label="Онега, на главную" onClick={closeAll}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={publicAsset("/logo.svg")} alt="" width="132" height="32" />
        </Link>
        <nav className={styles.nav} aria-label="Основное меню">
          <ul className="plain-list">
            {menu.map((item, index) =>
              "items" in item ? (
                <li key={item.label} className={styles.group}>
                  <button
                    ref={(el) => {
                      triggers.current[index] = el;
                    }}
                    type="button"
                    className={`${styles.trigger} ${item.items.some((l) => isActive(pathname, l.href)) || (item.all && isActive(pathname, item.all.href)) ? styles.current : ""}`}
                    aria-expanded={dropdown === index}
                    aria-controls={`menu-${index}`}
                    onClick={() => setDropdown(dropdown === index ? null : index)}
                  >
                    {item.label}
                    <Icon name="chevron" size={18} />
                  </button>
                  <div id={`menu-${index}`} className={styles.dropdown} hidden={dropdown !== index} data-wide={item.items.length > 3 || undefined}>
                    <ul className="plain-list">
                      {item.items.map((link) => (
                        <li key={link.href}>
                          <Link {...linkProps(link)} className={styles.dropLink}>
                            <strong>{link.label}</strong>
                            {link.text && <span>{link.text}</span>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {item.all && (
                      <Link {...linkProps(item.all)} className={`link ${styles.all}`}>
                        {item.all.label}
                        <Icon name="arrow" size={16} />
                      </Link>
                    )}
                  </div>
                </li>
              ) : (
                <li key={item.href}>
                  <Link {...linkProps(item)} className={`${styles.top} ${isActive(pathname, item.href) ? styles.current : ""}`}>
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>
        <div className={styles.actions}>
          <Link className={`button button-secondary button-small ${styles.cta}`} href="/calculator" onClick={closeAll}>
            <Icon name="calc" />
            <span className={styles.ctaLong}>Рассчитать доставку</span>
            <span className={styles.ctaShort} aria-hidden="true">
              Расчёт
            </span>
          </Link>
          <span className={styles.divider} aria-hidden="true" />
          <Link className={styles.iconLink} href="/tracking" onClick={closeAll}>
            <Icon name="search" size={22} />
            <span>Отследить</span>
          </Link>
          <Link className={styles.iconLink} href={company.phoneHref}>
            <Icon name="phone" size={22} />
            <span>{company.phone}</span>
          </Link>
        </div>
      </div>
      <div ref={mobile} id="site-menu" className={styles.panel} hidden={!panel}>
        <nav className="container" aria-label="Меню">
          {menu.map((item) =>
            "items" in item ? (
              <div key={item.label} className={styles.panelGroup}>
                <p className={styles.panelTitle}>{item.label}</p>
                {[...item.items, ...(item.all ? [item.all] : [])].map((link) => (
                  <Link key={link.href} {...linkProps(link)}>
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link key={item.href} {...linkProps(item)} className={styles.panelTop}>
                {item.label}
              </Link>
            ),
          )}
          <Link {...linkProps({ label: "Отследить груз", href: "/tracking" })} className={styles.panelTop}>
            Отследить груз
          </Link>
          <Link href={company.phoneHref} className={styles.panelPhone}>
            <Icon name="phone" />
            {company.phone}
          </Link>
        </nav>
      </div>
    </header>
  );
}
