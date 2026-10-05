"use client";
import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Container, SectionLabel } from "@/components/ui";
import { home } from "@/content/home";
import { RussiaMap } from "@/components/RussiaMap";
import { directionsBlock as copy, mapCopy } from "@/content/logistics";
import { cityById, routeQuote, type CityId } from "@/lib/routes";
import { formatDays, formatRoubles, type ShipmentMode } from "@/lib/tariff";
import { Calculator, initialCalculator, type CalculatorState } from "./Calculator";

const number = new Intl.NumberFormat("ru-RU");

/** Links elsewhere on the page preset the calculator with this event. */
export const CALCULATOR_EVENT = "onega:calculator";
export type CalculatorPreset = Partial<
  Pick<CalculatorState, "from" | "to" | "weight" | "volume">
> & { mode?: ShipmentMode };

export function usePresetListener(
  setState: (update: (current: CalculatorState) => CalculatorState) => void,
) {
  useEffect(() => {
    const listener = (event: Event) => {
      const detail = (event as CustomEvent<CalculatorPreset>).detail ?? {};
      const preset = Object.fromEntries(
        Object.entries(detail).filter(([, value]) => value !== undefined),
      ) as CalculatorPreset;
      if (Object.keys(preset).length)
        setState((current) => ({ ...current, ...preset }));
    };
    window.addEventListener(CALCULATOR_EVENT, listener);
    return () => window.removeEventListener(CALCULATOR_EVENT, listener);
  }, [setState]);
}

function Directions({
  route,
  onRoute,
}: {
  route: { from: CityId; to: CityId };
  onRoute: (from: CityId, to: CityId) => void;
}) {
  const id = useId();
  return (
    <section className="home-section directions" id="geography" aria-labelledby={`${id}-title`}>
      <Container wide>
        <SectionLabel index="03">{home.geographyLabel}</SectionLabel>
        <div className="section-heading">
          <div>
            <h2 id={`${id}-title`}>{copy.title}</h2>
            <p className="lead muted">{copy.description}</p>
          </div>
        </div>
        <div className="directions-layout">
          <div className="directions-map">
            <RussiaMap
              route={route}
              onCitySelect={(city) => {
                if (city !== "moscow") onRoute("moscow", city);
              }}
            />
            <p className="caption muted">{mapCopy.demo}</p>
          </div>
          <div className="directions-list">
            <h3>{copy.listTitle}</h3>
            <p className="directions-hint">{copy.listHint}</p>
            <ul>
              {copy.routes.map((item) => {
                const quote = routeQuote(item.from, item.to);
                const active = item.from === route.from && item.to === route.to;
                return (
                  <li key={`${item.from}-${item.to}`}>
                    <button
                      type="button"
                      aria-pressed={active}
                      className={active ? "is-active" : ""}
                      onClick={() => onRoute(item.from, item.to)}
                    >
                      <span className="direction-name">
                        {cityById(item.from).name} → {cityById(item.to).name}
                      </span>
                      <span className="direction-term">
                        {number.format(quote.distanceKm)} км, {formatDays(quote.days)}
                      </span>
                      <span className="direction-price">
                        {copy.priceFrom} {formatRoubles(quote.price)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="caption muted">{copy.priceNote}</p>
            <Link className="text-link directions-all" href="/directions">
              {copy.allLink}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <a className="text-link directions-to-calculator" href="#calculator">
              {copy.toCalculator(cityById(route.from).name, cityById(route.to).name)}
              <ArrowDown size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Directions and calculator share one route: a click on the map fills the form. */
export function Planner() {
  const [state, setState] = useState<CalculatorState>(initialCalculator);
  usePresetListener(setState);
  return (
    <>
      <Directions
        route={{ from: state.from, to: state.to }}
        onRoute={(from, to) => setState((current) => ({ ...current, from, to }))}
      />
      <Calculator
        state={state}
        setState={setState}
        label={{ index: "04", text: home.calculatorLabel }}
      />
    </>
  );
}
