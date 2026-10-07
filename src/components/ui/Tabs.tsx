"use client";
import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { OfferTab } from "@/content/services";
import { Icon } from "../Icon";
import styles from "./Tabs.module.css";

/** Vertical tabs: list on the left, details on the right. Arrow keys, Home and End move between tabs. */
export function Tabs({ tabs, label, action }: { tabs: OfferTab[]; label: string; action?: { label: string; href: string } }) {
  const id = useId();
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  function onKey(event: KeyboardEvent) {
    const last = tabs.length - 1;
    const next =
      event.key === "ArrowDown" || event.key === "ArrowRight"
        ? (active + 1) % tabs.length
        : event.key === "ArrowUp" || event.key === "ArrowLeft"
          ? (active - 1 + tabs.length) % tabs.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    buttons.current[next]?.focus();
  }

  return (
    <div className={styles.tabs}>
      <div role="tablist" aria-label={label} aria-orientation="vertical" className={styles.list} onKeyDown={onKey}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => {
              buttons.current[index] = el;
            }}
            role="tab"
            type="button"
            id={`${id}-tab-${tab.id}`}
            aria-selected={index === active}
            aria-controls={`${id}-panel-${tab.id}`}
            tabIndex={index === active ? 0 : -1}
            className={styles.tab}
            onClick={() => setActive(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${id}-panel-${tab.id}`}
          aria-labelledby={`${id}-tab-${tab.id}`}
          hidden={index !== active}
          className={styles.panel}
          tabIndex={0}
        >
          <h3>{tab.title}</h3>
          <p className="muted">{tab.text}</p>
          <dl className={styles.rows}>
            {tab.rows.map(([name, value]) => (
              <div key={name}>
                <dt>{name}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <ul className={styles.features}>
            {tab.features.map((feature) => (
              <li key={feature}>
                <Icon name="check" size={18} />
                {feature}
              </li>
            ))}
          </ul>
          {action && (
            <Link className="button" href={action.href}>
              <Icon name="calc" />
              {action.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
