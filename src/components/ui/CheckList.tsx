import { Icon } from "../Icon";
import styles from "./CheckList.module.css";

export function CheckList({ items, columns = 1 }: { items: readonly string[]; columns?: 1 | 2 }) {
  return (
    <ul className={`plain-list ${styles.list}`} data-cols={columns}>
      {items.map((item) => (
        <li key={item}>
          <Icon name="check" size={18} />
          {item}
        </li>
      ))}
    </ul>
  );
}
