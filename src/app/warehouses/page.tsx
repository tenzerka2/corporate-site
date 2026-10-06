import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { CheckList } from "@/components/ui/CheckList";
import { ContactCard } from "@/components/ui/ContactCard";
import { Hero } from "@/components/ui/Hero";
import { warehouseList, warehousesPage as copy } from "@/content/pages";
import styles from "./page.module.css";

export const metadata: Metadata = { title: copy.title, description: copy.lead };

const gates = warehouseList.reduce((sum, item) => sum + item.gates, 0);

export default function WarehousesPage() {
  return (
    <>
      <Hero
        crumbs={[{ label: copy.title }]}
        badge={copy.badge}
        title={copy.h1}
        lead={copy.lead}
        actions={[{ label: "Услуги склада", href: "/services/storage" }]}
        photo={{ image: copy.image, alt: copy.alt }}
        stats={[
          { value: String(warehouseList.length), label: "городов" },
          { value: "35 500 м²", label: "площадь" },
          { value: String(gates), label: "погрузочных ворот" },
          { value: "08–20", label: "ежедневно" },
        ]}
      />

      <section className="section" aria-labelledby="list-title">
        <div className="container">
          <div className="head-left">
            <h2 id="list-title">{copy.listTitle}</h2>
          </div>
          <ul className={`plain-list ${styles.grid}`}>
            {warehouseList.map((item) => (
              <li key={item.id} id={item.id} className={styles.card}>
                <div className={styles.cardHead}>
                  <h3>{item.city}</h3>
                  <span className={styles.area}>{item.area}</span>
                </div>
                <p className={styles.note}>{item.note}</p>
                <ul className={`plain-list ${styles.meta}`}>
                  <li>
                    <Icon name="pin" size={18} />
                    {item.address}
                  </li>
                  <li>
                    <Icon name="truck" size={18} />
                    {item.gates} {copy.gates}, {copy.hours.toLowerCase()}
                  </li>
                  <li>
                    <Icon name="phone" size={18} />
                    <a href={`tel:${item.phone.replace(/\D/g, "")}`}>{item.phone}</a>
                  </li>
                </ul>
                <ul className={`plain-list ${styles.tags}`}>
                  {item.services.map((service) => (
                    <li key={service}>{service}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="block" aria-labelledby="standard-title">
        <div className="container">
          <div className="head-left">
            <h2 id="standard-title">{copy.standardTitle}</h2>
          </div>
          <CheckList items={copy.standard} columns={2} />
        </div>
      </section>

      <ContactCard text="Хотите посмотреть склад до заключения договора? Запишем на экскурсию в любом из шести городов." />
    </>
  );
}
