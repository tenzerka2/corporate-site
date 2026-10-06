import styles from "./Stats.module.css";

export type Stat = { value: string; label: string };

export function Stats({ items, floating = false }: { items: readonly Stat[]; floating?: boolean }) {
  return (
    <dl className={`${styles.stats} ${floating ? styles.floating : ""}`} style={{ "--count": items.length } as React.CSSProperties}>
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
