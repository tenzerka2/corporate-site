import styles from "./Features.module.css";

/** Short title and text in columns, separated by a top rule. */
export function Features({ items, columns = 4 }: { items: readonly { title: string; text: string }[]; columns?: 2 | 3 | 4 }) {
  return (
    <ul className={`plain-list ${styles.grid}`} data-cols={columns}>
      {items.map((item) => (
        <li key={item.title}>
          <h3>{item.title}</h3>
          <p className="muted">{item.text}</p>
        </li>
      ))}
    </ul>
  );
}
