"use client";
import { useEffect, useId, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { ArrowLeftRight, Check, FileText } from "lucide-react";
import { Container, Field, Button, SectionLabel } from "@/components/ui";
import { Select } from "@/components/ui/interactive";
import { cities } from "@/content/cities";
import { calculatorCopy as copy } from "@/content/logistics";
import { cityById, type CityId } from "@/lib/routes";
import {
  calculateTariff,
  formatDays,
  formatRoubles,
  parseAmount,
  type ShipmentMode,
  type TariffResult,
} from "@/lib/tariff";
import { AnimatedAmount } from "./AnimatedAmount";
import { OrderDialog } from "./OrderDialog";

export type CalculatorState = {
  from: CityId;
  to: CityId;
  mode: ShipmentMode;
  weight: string;
  volume: string;
  pickup: boolean;
  delivery: boolean;
  packaging: boolean;
};

export const initialCalculator: CalculatorState = {
  from: "moscow",
  to: "ekaterinburg",
  mode: "groupage",
  weight: "250",
  volume: "1,2",
  pickup: true,
  delivery: false,
  packaging: false,
};

const cityOptions = cities.map((city) => ({ value: city.id, label: city.name }));
const number = new Intl.NumberFormat("ru-RU");

export function useCalculation(state: CalculatorState) {
  return useMemo(
    () =>
      calculateTariff({
        from: cityById(state.from),
        to: cityById(state.to),
        mode: state.mode,
        weightKg: parseAmount(state.weight),
        volumeM3: parseAmount(state.volume),
        pickup: state.pickup,
        delivery: state.delivery,
        packaging: state.packaging,
      }),
    [state],
  );
}

function summary(result: TariffResult) {
  return `${copy.resultLabel}: ${copy.from_} ${formatRoubles(result.total)}, ${formatDays(result.days)}`;
}

export function Calculator({
  state,
  setState,
  headingLevel = 2,
  label,
}: {
  state: CalculatorState;
  setState: Dispatch<SetStateAction<CalculatorState>>;
  headingLevel?: 1 | 2;
  label?: { index: string; text: string };
}) {
  const id = useId();
  const outcome = useCalculation(state);
  const [orderOpen, setOrderOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const weightError =
    !outcome.ok && (outcome.error === "weight" || outcome.error === "capacity")
      ? copy.errors[outcome.error]
      : undefined;
  const volumeError =
    !outcome.ok && outcome.error === "volume" ? copy.errors.volume : undefined;
  const update = <K extends keyof CalculatorState>(
    key: K,
    value: CalculatorState[K],
  ) => setState((current) => ({ ...current, [key]: value }));

  // Screen readers hear the result once the user pauses typing.
  const spoken = outcome.ok ? summary(outcome.result) : "";
  useEffect(() => {
    const timer = setTimeout(() => setAnnouncement(spoken), 700);
    return () => clearTimeout(timer);
  }, [spoken]);

  const Heading = headingLevel === 1 ? "h1" : "h2";
  const result = outcome.ok ? outcome.result : null;
  const lines = result
    ? (["transport", "pickup", "delivery", "packaging"] as const).map((key) => ({
        key,
        label: copy.lines[key],
        value: result[key],
      }))
    : [];

  return (
    <section
      className="calculator-section"
      id="calculator"
      aria-labelledby={`${id}-title`}
    >
      <Container wide>
        <div className="calculator-layout">
          <div className="calculator-intro">
            {label && <SectionLabel index={label.index}>{label.text}</SectionLabel>}
            <Heading id={`${id}-title`}>{copy.title}</Heading>
            <p className="lead">{copy.description}</p>
            <ul className="calculator-points">
              {copy.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <div className="calculator-card">
            <form
              className="calculator-form"
              aria-label={copy.formLabel}
              onSubmit={(event) => event.preventDefault()}
              noValidate
            >
              <div className="calculator-cities">
                <Field label={copy.from} htmlFor={`${id}-from`}>
                  <Select
                    id={`${id}-from`}
                    label={copy.from}
                    value={state.from}
                    options={cityOptions}
                    onChange={(value) => update("from", value as CityId)}
                  />
                </Field>
                <button
                  type="button"
                  className="icon-button calculator-swap"
                  aria-label={copy.swap}
                  onClick={() =>
                    setState((current) => ({
                      ...current,
                      from: current.to,
                      to: current.from,
                    }))
                  }
                >
                  <ArrowLeftRight size={18} aria-hidden="true" />
                </button>
                <Field label={copy.to} htmlFor={`${id}-to`}>
                  <Select
                    id={`${id}-to`}
                    label={copy.to}
                    value={state.to}
                    options={cityOptions}
                    onChange={(value) => update("to", value as CityId)}
                  />
                </Field>
              </div>
              <fieldset className="calculator-mode">
                <legend>{copy.mode}</legend>
                {(["groupage", "ftl"] as const).map((mode) => (
                  <label key={mode} className="segment">
                    <input
                      type="radio"
                      name={`${id}-mode`}
                      value={mode}
                      checked={state.mode === mode}
                      onChange={() => update("mode", mode)}
                    />
                    <span>{copy.modes[mode]}</span>
                  </label>
                ))}
              </fieldset>
              <div className="calculator-cargo">
                <Field label={copy.weight} htmlFor={`${id}-weight`} error={weightError}>
                  <input
                    id={`${id}-weight`}
                    className="input"
                    inputMode="decimal"
                    autoComplete="off"
                    value={state.weight}
                    aria-invalid={weightError ? true : undefined}
                    aria-describedby={weightError ? `${id}-weight-error` : undefined}
                    onChange={(event) =>
                      update("weight", event.target.value.replace(/[^\d.,\s]/g, ""))
                    }
                  />
                </Field>
                <Field label={copy.volume} htmlFor={`${id}-volume`} error={volumeError}>
                  <input
                    id={`${id}-volume`}
                    className="input"
                    inputMode="decimal"
                    autoComplete="off"
                    value={state.volume}
                    aria-invalid={volumeError ? true : undefined}
                    aria-describedby={volumeError ? `${id}-volume-error` : undefined}
                    onChange={(event) =>
                      update("volume", event.target.value.replace(/[^\d.,\s]/g, ""))
                    }
                  />
                </Field>
              </div>
              <fieldset className="calculator-options">
                <legend>{copy.options}</legend>
                {(
                  [
                    ["pickup", copy.pickupHint],
                    ["delivery", copy.deliveryHint],
                    ["packaging", copy.packagingHint],
                  ] as const
                ).map(([key, hint]) => (
                  <label key={key} className="checkbox">
                    <input
                      type="checkbox"
                      checked={state[key]}
                      onChange={(event) => update(key, event.target.checked)}
                    />
                    <span className="checkbox-box" aria-hidden="true">
                      <Check size={14} />
                    </span>
                    <span className="checkbox-label">{copy[key]}</span>
                    <span className="checkbox-hint">{hint}</span>
                  </label>
                ))}
              </fieldset>
            </form>
            <section className="calculator-result" aria-labelledby={`${id}-result`}>
              <p className="calculator-result-label" id={`${id}-result`}>
                {copy.resultLabel}
              </p>
              <p className="calculator-total" data-testid="calculator-total">
                {result ? (
                  <>
                    <span className="calculator-from">{copy.from_} </span>
                    <AnimatedAmount value={result.total} format={formatRoubles} />
                  </>
                ) : (
                  <span className="calculator-empty">{copy.noResult}</span>
                )}
              </p>
              <p className="sr-only" aria-live="polite" aria-atomic="true">
                {announcement}
              </p>
              {result && (
                <>
                  <dl className="calculator-facts">
                    <div>
                      <dt>{copy.term}</dt>
                      <dd>{formatDays(result.days)}</dd>
                    </div>
                    <div>
                      <dt>{copy.distance}</dt>
                      <dd>
                        {number.format(result.distanceKm)} {copy.km}
                      </dd>
                    </div>
                    <div className="calculator-vehicle">
                      <dt>{copy.vehicle}</dt>
                      <dd>
                        {result.vehicle
                          ? copy.vehicles[result.vehicle]
                          : copy.groupageVehicle}
                      </dd>
                    </div>
                  </dl>
                  <p className="calculator-breakdown-title">{copy.breakdown}</p>
                  <dl className="calculator-breakdown">
                    {lines.map((line) => (
                      <div key={line.key} className={line.value ? "" : "is-off"}>
                        <dt>{line.label}</dt>
                        <dd>
                          {line.value ? (
                            <AnimatedAmount value={line.value} format={formatRoubles} />
                          ) : (
                            copy.notIncluded
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </>
              )}
              {!outcome.ok && (
                <p className="calculator-error" role="status">
                  {copy.errors[outcome.error]}
                </p>
              )}
              <Button
                type="button"
                className="calculator-order"
                icon={<FileText size={19} aria-hidden="true" />}
                onClick={() => setOrderOpen(true)}
              >
                {copy.order}
              </Button>
              <p className="calculator-note">{copy.note}</p>
            </section>
          </div>
        </div>
      </Container>
      <OrderDialog
        open={orderOpen}
        onOpenChange={setOrderOpen}
        state={state}
        result={result}
      />
    </section>
  );
}
