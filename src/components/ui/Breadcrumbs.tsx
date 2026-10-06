import Link from "next/link";
import styles from "./Breadcrumbs.module.css";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail: Crumb[] = [{ label: "Главная", href: "/" }, ...items];
  return (
    <nav aria-label="Навигационная цепочка" className={styles.crumbs}>
      <ol>
        {trail.map((item, index) => (
          <li key={item.label}>
            {item.href && index < trail.length - 1 ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
