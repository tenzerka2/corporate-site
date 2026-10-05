"use client";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CircleCheck, Circle, Download, Search } from "lucide-react";
import { Button, Container } from "@/components/ui";
import { MapExplorer } from "@/components/logistics/StandaloneCalculator";
import { trackingPage as copy } from "@/content/company";
import { cityById } from "@/lib/routes";
import {
  DEMO_TRACKING_NUMBER,
  currentStageIndex,
  findShipment,
  formatStageTime,
  type TrackingLookup,
} from "@/lib/tracking";

export function Tracking() {
  const id = useId();
  const [value, setValue] = useState("");
  const [lookup, setLookup] = useState<TrackingLookup | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function search(number: string) {
    const found = findShipment(number);
    setLookup(found);
    if (found.status === "found")
      requestAnimationFrame(() => resultRef.current?.focus());
    else inputRef.current?.focus();
  }

  // Links from the account page pass the number: /tracking?number=ON-2026-104733.
  useEffect(() => {
    const number = new URLSearchParams(window.location.search).get("number");
    if (!number) return;
    const frame = requestAnimationFrame(() => {
      setValue(number);
      setLookup(findShipment(number));
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  function submit(event: FormEvent) {
    event.preventDefault();
    search(value);
  }

  const error =
    lookup?.status === "invalid"
      ? copy.invalid
      : lookup?.status === "missing"
        ? copy.missing(lookup.number)
        : null;
  const shipment = lookup?.status === "found" ? lookup.shipment : null;
  const current = shipment ? currentStageIndex(shipment) : -1;

  return (
    <section className="page-section tracking" aria-label={copy.title}>
      <Container wide>
        <form className="tracking-form" onSubmit={submit} noValidate role="search">
          <div className="field">
            <label htmlFor={`${id}-number`}>{copy.label}</label>
            <div className="tracking-input">
              <input
                ref={inputRef}
                id={`${id}-number`}
                className="input"
                autoComplete="off"
                spellCheck={false}
                placeholder={copy.placeholder}
                value={value}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : `${id}-hint`}
                onChange={(event) => setValue(event.target.value)}
              />
              <Button type="submit" icon={<Search size={19} aria-hidden="true" />}>
                {copy.submit}
              </Button>
            </div>
            {error ? (
              <span className="field-error" id={`${id}-error`} role="alert">
                {error}
              </span>
            ) : (
              <span className="tracking-hint" id={`${id}-hint`}>
                {copy.demoHint}{" "}
                <button
                  type="button"
                  className="inline-link"
                  onClick={() => {
                    setValue(DEMO_TRACKING_NUMBER);
                    search(DEMO_TRACKING_NUMBER);
                  }}
                >
                  {DEMO_TRACKING_NUMBER}
                </button>
              </span>
            )}
          </div>
        </form>
        {shipment && (
          <div
            className="tracking-result"
            ref={resultRef}
            tabIndex={-1}
            aria-labelledby={`${id}-result`}
            role="region"
          >
            <div className="tracking-summary">
              <h2 id={`${id}-result`}>{shipment.number}</h2>
              <dl>
                <div>
                  <dt>{copy.route}</dt>
                  <dd>
                    {cityById(shipment.from).name} → {cityById(shipment.to).name}
                  </dd>
                </div>
                <div>
                  <dt>{copy.cargo}</dt>
                  <dd>{shipment.cargo}</dd>
                </div>
                <div>
                  <dt>{copy.status}</dt>
                  <dd className="tracking-status">{shipment.stages[current].title}</dd>
                </div>
              </dl>
              <a
                className="button button-secondary button-regular"
                href={shipment.document}
                download
              >
                <Download size={19} aria-hidden="true" />
                {copy.download}
              </a>
              <p className="caption muted">{copy.downloadNote}</p>
            </div>
            <div className="tracking-timeline">
              <h3>{copy.timeline}</h3>
              <ol>
                {shipment.stages.map((stage, index) => (
                  <li
                    key={stage.id}
                    className={
                      index < current ? "is-done" : index === current ? "is-current" : "is-pending"
                    }
                    aria-current={index === current ? "step" : undefined}
                  >
                    {stage.at ? (
                      <CircleCheck size={22} aria-hidden="true" />
                    ) : (
                      <Circle size={22} aria-hidden="true" />
                    )}
                    <div>
                      <p className="tracking-stage">{stage.title}</p>
                      <p className="tracking-place">{stage.place}</p>
                      <p className="tracking-time">
                        {stage.at ? formatStageTime(stage.at) : copy.pending}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="tracking-map">
              <h3>{copy.mapTitle}</h3>
              <MapExplorer
                from={shipment.from}
                to={shipment.to}
                network={false}
                interactive={false}
                current={shipment.current}
              />
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
