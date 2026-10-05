"use client";
import { useEffect, useState } from "react";
import { RussiaMap } from "@/components/RussiaMap";
import type { CityId } from "@/lib/routes";
import { Calculator, initialCalculator, type CalculatorState } from "./Calculator";

// Header links pass ?service=truck|packages|warehouse|box.
const serviceModes: Record<string, CalculatorState["mode"]> = {
  truck: "ftl",
  packages: "groupage",
  warehouse: "groupage",
  box: "groupage",
};

export function StandaloneCalculator() {
  const [state, setState] = useState<CalculatorState>(initialCalculator);
  useEffect(() => {
    const service = new URLSearchParams(window.location.search).get("service");
    const mode = service ? serviceModes[service] : undefined;
    if (!mode) return;
    const frame = requestAnimationFrame(() =>
      setState((current) => ({ ...current, mode })),
    );
    return () => cancelAnimationFrame(frame);
  }, []);
  return <Calculator state={state} setState={setState} headingLevel={1} />;
}

export function MapExplorer() {
  const [to, setTo] = useState<CityId>("ekaterinburg");
  return (
    <RussiaMap
      route={{ from: "moscow", to }}
      onCitySelect={(city) => {
        if (city !== "moscow") setTo(city);
      }}
    />
  );
}
