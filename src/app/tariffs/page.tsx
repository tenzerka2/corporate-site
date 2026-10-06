import type { Metadata } from "next";
import { ContactCard } from "@/components/ui/ContactCard";
import { Hero } from "@/components/ui/Hero";
import { tariffsPage as copy } from "@/content/pages";
import { GROUPAGE_MIN, formatDays, formatRub, vehicles, zoneDays, zoneRange, zones } from "@/lib/tariff";
import styles from "./page.module.css";

export const metadata: Metadata = { title: copy.title, description: copy.lead };

const km = (n: number) => n.toLocaleString("ru-RU");

function Rows({ rows }: { rows: [string, string][] }) {
  return (
    <dl className={styles.rows}>
      {rows.map(([name, value]) => (
        <div key={name}>
          <dt>{name}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function TariffsPage() {
  return (
    <>
      <Hero
        crumbs={[{ label: copy.title }]}
        badge={copy.badge}
        title={copy.h1}
        lead={copy.lead}
        actions={[{ label: "Открыть калькулятор", href: "/calculator", icon: "calc" }]}
      />

      <section className="section" aria-labelledby="groupage-title">
        <div className="container">
          <div className="head-left">
            <h2 id="groupage-title">{copy.groupageTitle}</h2>
            <p>
              {copy.groupageText} Минимальная стоимость {formatRub(GROUPAGE_MIN)}.
            </p>
          </div>
          <div className={styles.tableWrap} tabIndex={0} role="region" aria-label={copy.groupageTitle}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {copy.zoneHead.map((cell) => (
                    <th key={cell} scope="col">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {zones.map((zone, index) => (
                  <tr key={zone.upToKm}>
                    <th scope="row">{zoneRange(index)}</th>
                    <td>{formatRub(zone.perKg)}</td>
                    <td>{formatRub(zone.perM3)}</td>
                    <td>{formatDays(zoneDays(index))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="truck-title">
        <div className="container">
          <div className="head-left">
            <h2 id="truck-title">{copy.truckTitle}</h2>
            <p>{copy.truckText}</p>
          </div>
          <div className={styles.tableWrap} tabIndex={0} role="region" aria-label={copy.truckTitle}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {copy.truckHead.map((cell) => (
                    <th key={cell} scope="col">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <th scope="row">{vehicle.name}</th>
                    <td>{km(vehicle.maxKg)} кг</td>
                    <td>{vehicle.maxM3} м³</td>
                    <td>{formatRub(vehicle.perKm)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="block" aria-label="Дополнительные услуги и склад">
        <div className={`container ${styles.pair}`}>
          <div className={styles.panel}>
            <h2>{copy.extrasTitle}</h2>
            <Rows rows={copy.extras} />
          </div>
          <div className={styles.panel}>
            <h2>{copy.storageTitle}</h2>
            <Rows rows={copy.storage} />
          </div>
          <p className={styles.note}>{copy.note}</p>
        </div>
      </section>

      <ContactCard text="Возите больше 10 тонн в месяц? Предложим индивидуальные ставки и отсрочку платежа." />
    </>
  );
}
