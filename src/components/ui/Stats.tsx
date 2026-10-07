import styles from "./Stats.module.css";

export type Stat = { value: string; label: string };

/** Facts remain in ordinary reading flow rather than promotional counters. */
export function Stats({ items }: { items: readonly Stat[] }) {
  return <p className={styles.stats}>{items.map((item) => `${item.value} ${item.label}`).join("; ") + "."}</p>;
}
