import { Icon } from "../Icon";
import styles from "./Faq.module.css";

export function Faq({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <div className={styles.faq}>
      {items.map((item) => (
        <details key={item.q} className={styles.item}>
          <summary>
            {item.q}
            <Icon name="chevron" />
          </summary>
          <p className="muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
