"use client";
import { useId, useMemo, useRef, useState } from "react";
import { cities, city, type CityId } from "@/content/cities";
import { calculator as copy } from "@/content/site";
import { formatDays, formatKm, formatRub, parseNumber, quote, type Mode } from "@/lib/tariff";
import { Icon } from "./Icon";
import { OrderDialog } from "./OrderDialog";
import styles from "./Calculator.module.css";

export type CalcState = {
  from: CityId;
  to: CityId;
  mode: Mode;
  weight: string;
  volume: string;
  pickup: boolean;
  delivery: boolean;
  packaging: boolean;
};

const initial: CalcState = {
  from: "moscow",
  to: "ekaterinburg",
  mode: "groupage",
  weight: "250",
  volume: "1,2",
  pickup: true,
  delivery: false,
  packaging: false,
};

const numeric = (value: string) => value.replace(/[^\d.,\s]/g, "");

export function Calculator() {
  const id = useId();
  const [state, setState] = useState<CalcState>(initial);
  const [moreOpen, setMoreOpen] = useState(false);
  const orderButton = useRef<HTMLButtonElement>(null);
  const [orderOpen, setOrderOpen] = useState(false);
  const set = <K extends keyof CalcState>(key: K, value: CalcState[K]) =>
    setState((current) => ({ ...current, [key]: value }));

  const result = useMemo(
    () =>
      quote({
        from: state.from,
        to: state.to,
        mode: state.mode,
        weightKg: parseNumber(state.weight),
        volumeM3: parseNumber(state.volume),
        pickup: state.pickup,
        delivery: state.delivery,
        packaging: state.packaging,
      }),
    [state],
  );
  const q = result.ok ? result.quote : null;
  const error = result.ok ? null : result.error;

  return (
    <section id="calculator" className={styles.section} aria-labelledby={`${id}-title`}>
      <div className="container">
        <div className={styles.head}>
          <h2 id={`${id}-title`}>{copy.title}</h2>
          <p className="muted">{copy.text}</p>
        </div>

        <div className={styles.grid}>
          <p className={styles.route} data-testid="route">
            <span className="sr-only">{copy.route}: </span>
            {city(state.from).name} <span className={styles.arrow}>→</span> {city(state.to).name}
          </p>
          <div className={styles.cities}>
            <div>
              <label className="label" htmlFor={`${id}-from`}>
                {copy.from}
              </label>
              <select
                id={`${id}-from`}
                className="select"
                value={state.from}
                onChange={(e) => set("from", e.target.value as CityId)}
              >
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className={styles.swap}
              aria-label={copy.swap}
              onClick={() => setState((s) => ({ ...s, from: s.to, to: s.from }))}
            >
              ⇄
            </button>
            <div>
              <label className="label" htmlFor={`${id}-to`}>
                {copy.to}
              </label>
              <select
                id={`${id}-to`}
                className="select"
                value={state.to}
                onChange={(e) => set("to", e.target.value as CityId)}
              >
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.cargo}>
            <div>
              <label className="label" htmlFor={`${id}-weight`}>
                {copy.weight}
              </label>
              <input
                id={`${id}-weight`}
                className="input"
                inputMode="decimal"
                autoComplete="off"
                value={state.weight}
                aria-invalid={error === "weight" || error === "capacity" ? true : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                onChange={(e) => set("weight", numeric(e.target.value))}
              />
            </div>
            <div>
              <label className="label" htmlFor={`${id}-volume`}>
                {copy.volume}
              </label>
              <input
                id={`${id}-volume`}
                className="input"
                inputMode="decimal"
                autoComplete="off"
                value={state.volume}
                aria-invalid={error === "volume" ? true : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                onChange={(e) => set("volume", numeric(e.target.value))}
              />
            </div>
            {error && (
              <p id={`${id}-error`} className={`error ${styles.cargoError}`} role="status">
                {copy.errors[error]}
              </p>
            )}
          </div>

          <button
            type="button"
            className={styles.moreToggle}
            aria-expanded={moreOpen}
            aria-controls={`${id}-more`}
            onClick={() => setMoreOpen((v) => !v)}
          >
            {copy.more}
            <span aria-hidden="true">{moreOpen ? "−" : "+"}</span>
          </button>

          <div id={`${id}-more`} className={`${styles.more} ${moreOpen ? styles.open : ""}`}>
            <fieldset className={styles.mode}>
              <legend className="label">{copy.mode}</legend>
              <div className={styles.segment}>
                {(["groupage", "truck"] as const).map((mode) => (
                  <label key={mode}>
                    <input
                      type="radio"
                      name={`${id}-mode`}
                      value={mode}
                      checked={state.mode === mode}
                      onChange={() => set("mode", mode)}
                    />
                    <span>{copy.modes[mode]}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className={styles.options}>
              <legend className="label">{copy.options}</legend>
              {(
                [
                  ["pickup", copy.pickupHint],
                  ["delivery", copy.deliveryHint],
                  ["packaging", copy.packagingHint],
                ] as const
              ).map(([key, hint]) => (
                <label key={key} className="check">
                  <input type="checkbox" checked={state[key]} onChange={(e) => set(key, e.target.checked)} />
                  <span>
                    {copy[key]} <span className="muted">{hint}</span>
                  </span>
                </label>
              ))}
            </fieldset>
          </div>

          <div className={styles.result} aria-live="polite">
            <p className={styles.resultLabel}>{copy.result}</p>
            <p className={styles.total} data-testid="total">
              {q ? (
                <>
                  <span className={styles.from}>{copy.from_} </span>
                  {formatRub(q.total)}
                </>
              ) : (
                copy.none
              )}
            </p>
            {q && (
              <dl className={styles.lines}>
                <div>
                  <dt>{copy.term}</dt>
                  <dd>{formatDays(q.days)}</dd>
                </div>
                <div>
                  <dt>{copy.distance}</dt>
                  <dd>{formatKm(q.distanceKm)}</dd>
                </div>
                <div className={styles.extra}>
                  <dt>{copy.vehicle}</dt>
                  <dd data-testid="vehicle">{q.vehicle ? q.vehicle.name : copy.shared}</dd>
                </div>
                {(Object.keys(copy.lines) as (keyof typeof copy.lines)[]).map((key) => (
                  <div key={key} className={styles.extra}>
                    <dt>{copy.lines[key]}</dt>
                    <dd>{q.lines[key] ? formatRub(q.lines[key]) : copy.none}</dd>
                  </div>
                ))}
              </dl>
            )}
            <button
              ref={orderButton}
              type="button"
              className={`button ${styles.order}`}
              onClick={() => setOrderOpen(true)}
            >
              {copy.order}
              <Icon name="arrow" size={18} />
            </button>
            <p className={styles.note}>{copy.note}</p>
          </div>
        </div>
      </div>
      <OrderDialog
        open={orderOpen}
        onClose={() => {
          setOrderOpen(false);
          orderButton.current?.focus();
        }}
        summary={`${city(state.from).name} → ${city(state.to).name}, ${state.weight} кг, ${state.volume} м³${q ? `, ${copy.from_} ${formatRub(q.total)}` : ""}`}
      />
    </section>
  );
}
