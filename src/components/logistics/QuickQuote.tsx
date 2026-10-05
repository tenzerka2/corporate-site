"use client";
import { useId, useState } from "react";
import { ArrowDown } from "lucide-react";
import { Select } from "@/components/ui/interactive";
import { cities } from "@/content/cities";
import { home } from "@/content/home";
import { cityById, type CityId } from "@/lib/routes";
import { calculateTariff, formatDays, formatRoubles, parseAmount } from "@/lib/tariff";
import { CALCULATOR_EVENT, type CalculatorPreset } from "./Planner";
import { initialCalculator } from "./Calculator";

const copy = home.quote;
const options = cities.map((city) => ({ value: city.id, label: city.name }));

/** Compact groupage quote for the first screen; hands values to the full calculator. */
export function QuickQuote() {
  const id = useId();
  const [from, setFrom] = useState<CityId>(initialCalculator.from);
  const [to, setTo] = useState<CityId>(initialCalculator.to);
  const [weight, setWeight] = useState(initialCalculator.weight);
  const [volume, setVolume] = useState(initialCalculator.volume);
  const outcome = calculateTariff({
    from: cityById(from),
    to: cityById(to),
    mode: "groupage",
    weightKg: parseAmount(weight),
    volumeM3: parseAmount(volume),
    pickup: false,
    delivery: false,
    packaging: false,
  });
  const clean = (value: string) => value.replace(/[^\d.,\s]/g, "");
  return (
    <section className="quick-quote" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{copy.title}</h2>
      <div className="quick-quote-grid">
        <div className="field">
          <label htmlFor={`${id}-from`}>{copy.from}</label>
          <Select id={`${id}-from`} label={copy.from} value={from} options={options} onChange={(v) => setFrom(v as CityId)} />
        </div>
        <div className="field">
          <label htmlFor={`${id}-to`}>{copy.to}</label>
          <Select id={`${id}-to`} label={copy.to} value={to} options={options} onChange={(v) => setTo(v as CityId)} />
        </div>
        <div className="field">
          <label htmlFor={`${id}-weight`}>{copy.weight}</label>
          <input id={`${id}-weight`} className="input" inputMode="decimal" autoComplete="off" value={weight} onChange={(e) => setWeight(clean(e.target.value))} />
        </div>
        <div className="field">
          <label htmlFor={`${id}-volume`}>{copy.volume}</label>
          <input id={`${id}-volume`} className="input" inputMode="decimal" autoComplete="off" value={volume} onChange={(e) => setVolume(clean(e.target.value))} />
        </div>
      </div>
      <div className="quick-quote-result" aria-live="polite">
        <span className="quick-quote-label">{copy.result}</span>
        {outcome.ok ? (
          <span className="quick-quote-value">
            <strong>от {formatRoubles(outcome.result.total)}</strong>
            <span>{formatDays(outcome.result.days)}</span>
          </span>
        ) : (
          <span className="quick-quote-value">{copy.empty}</span>
        )}
      </div>
      <a
        className="button button-primary button-regular quick-quote-action"
        href="#calculator"
        onClick={() =>
          window.dispatchEvent(
            new CustomEvent<CalculatorPreset>(CALCULATOR_EVENT, {
              detail: { from, to, weight, volume, mode: "groupage" },
            }),
          )
        }
      >
        {copy.detailed}
        <ArrowDown size={18} aria-hidden="true" />
      </a>
      <p className="quick-quote-note">{copy.note}</p>
    </section>
  );
}
