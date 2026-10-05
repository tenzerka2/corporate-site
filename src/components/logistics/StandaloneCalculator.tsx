"use client";
import { useEffect, useState } from "react";
import { RussiaMap } from "@/components/RussiaMap";
import type { CityId } from "@/lib/routes";
import { Calculator, initialCalculator, type CalculatorState } from "./Calculator";
import { usePresetListener } from "./Planner";

// Header links pass ?service=truck|packages|warehouse|box.
const serviceModes: Record<string, CalculatorState["mode"]> = {
  truck: "ftl",
  packages: "groupage",
  warehouse: "groupage",
  box: "groupage",
};

export function StandaloneCalculator({
  initial,
  headingLevel = 1,
  readQuery = true,
}: {
  initial?: Partial<CalculatorState>;
  headingLevel?: 1 | 2;
  readQuery?: boolean;
}) {
  const [state, setState] = useState<CalculatorState>({
    ...initialCalculator,
    ...initial,
  });
  usePresetListener(setState);
  useEffect(() => {
    if (!readQuery) return;
    const service = new URLSearchParams(window.location.search).get("service");
    const mode = service ? serviceModes[service] : undefined;
    if (!mode) return;
    const frame = requestAnimationFrame(() =>
      setState((current) => ({ ...current, mode })),
    );
    return () => cancelAnimationFrame(frame);
  }, [readQuery]);
  return (
    <Calculator state={state} setState={setState} headingLevel={headingLevel} />
  );
}

export function MapExplorer({
  from = "moscow",
  to: initialTo = "ekaterinburg",
  network = true,
  interactive = true,
  current,
}: {
  from?: CityId;
  to?: CityId;
  network?: boolean;
  interactive?: boolean;
  current?: CityId;
}) {
  const [to, setTo] = useState<CityId>(initialTo);
  return (
    <RussiaMap
      route={{ from, to }}
      network={network}
      current={current}
      onCitySelect={
        interactive
          ? (city) => {
              if (city !== from) setTo(city);
            }
          : undefined
      }
    />
  );
}
