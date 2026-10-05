"use client";
import type { ReactNode } from "react";
import type { ShipmentMode } from "@/lib/tariff";
import { CALCULATOR_EVENT, type CalculatorPreset } from "./Planner";

/** Anchor to the calculator that also switches its shipment mode. */
export function PresetLink({
  mode,
  className,
  children,
}: {
  mode?: ShipmentMode | null;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href="#calculator"
      className={className}
      onClick={() => {
        if (mode)
          window.dispatchEvent(
            new CustomEvent<CalculatorPreset>(CALCULATOR_EVENT, {
              detail: { mode },
            }),
          );
      }}
    >
      {children}
    </a>
  );
}
