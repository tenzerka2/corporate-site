"use client";
import { useId, useState, type FormEvent } from "react";
import { city } from "@/content/cities";
import { trackingPage as copy } from "@/content/pages";
import { formatKm } from "@/lib/tariff";
import { formatDate, trackShipment, type Shipment, type TrackingContext } from "@/lib/tracking";
import { Icon } from "./Icon";
import styles from "./TrackingForm.module.css";

export function TrackingForm({ initialNumber = "", context = {} }: { initialNumber?: string; context?: TrackingContext }) {
  const id = useId();
  const [value, setValue] = useState(initialNumber);
  const [result, setResult] = useState<Shipment | null | undefined>(() => initialNumber ? trackShipment(initialNumber, new Date(), context) : undefined);

  function submit(event: FormEvent) {
    event.preventDefault();
    setResult(trackShipment(value, new Date(), value === initialNumber ? context : {}));
  }

  return (
    <section className="block" aria-label={copy.title}>
      <div className={`container ${styles.wrap}`}>
        <form className={styles.form} onSubmit={submit} role="search">
          <div className={styles.field}>
            <label className="label" htmlFor={`${id}-number`}>
              {copy.label}
            </label>
            <input
              id={`${id}-number`}
              className="input"
              placeholder={copy.placeholder}
              autoComplete="off"
              value={value}
              aria-describedby={`${id}-hint`}
              aria-invalid={result === null || undefined}
              onChange={(e) => setValue(e.target.value)}
            />
            <p id={`${id}-hint`} className={styles.hint}>
              {copy.hint}
            </p>
          </div>
          <button type="submit" className="button">
            <Icon name="search" />
            {copy.submit}
          </button>
        </form>

        <div aria-live="polite">
          {result === null && <p className={`error ${styles.notFound}`}>{copy.notFound}</p>}
          {result && (
            <article className={styles.card} aria-labelledby={`${id}-result`}>
              <div className={styles.cardHead}>
                <div>
                  <p className={styles.number}>{result.number}</p>
                  <h2 id={`${id}-result`}>
                    {city(result.from).name} <span className={styles.arrow}>→</span> {city(result.to).name}
                  </h2>
                </div>
                <span className={`${styles.status} ${result.delivered ? styles.done : ""}`}>
                  {result.delivered ? copy.delivered : copy.inTransit}
                </span>
              </div>
              <dl className={styles.facts}>
                <div>
                  <dt>{copy.eta}</dt>
                  <dd>{formatDate(result.eta)}</dd>
                </div>
                <div>
                  <dt>{copy.distance}</dt>
                  <dd>{formatKm(result.distanceKm)}</dd>
                </div>
              </dl>
              <h3 className={styles.historyTitle}>{copy.history}</h3>
              <ol className={`plain-list ${styles.events}`}>
                {result.events.map((event) => (
                  <li key={event.status} className={event.done ? styles.passed : styles.pending}>
                    <span className={styles.dot} aria-hidden="true" />
                    <div>
                      <strong>{event.status}</strong>
                      <span>
                        {event.place}, {formatDate(event.date)}
                        {!event.done && " (план)"}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
