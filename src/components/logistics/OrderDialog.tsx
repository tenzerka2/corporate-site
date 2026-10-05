"use client";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { Check, CircleCheck, X } from "lucide-react";
import { Button, Field } from "@/components/ui";
import { calculatorCopy, orderCopy as copy } from "@/content/logistics";
import { cityById } from "@/lib/routes";
import { formatDays, formatRoubles, type TariffResult } from "@/lib/tariff";
import {
  createOrderNumber,
  formatPhone,
  validateOrder,
  type OrderErrors,
  type OrderFields,
} from "@/lib/order";
import type { CalculatorState } from "./Calculator";

const emptyFields: OrderFields = {
  name: "",
  phone: "",
  company: "",
  inn: "",
  comment: "",
  consent: false,
};
const fieldOrder = ["name", "phone", "inn", "consent"] as const;

export function OrderDialog({
  open,
  onOpenChange,
  state,
  result,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  state: CalculatorState;
  result: TariffResult | null;
}) {
  const id = useId();
  const [fields, setFields] = useState<OrderFields>(emptyFields);
  const [errors, setErrors] = useState<OrderErrors>({});
  const [status, setStatus] = useState<"form" | "sending" | "done">("form");
  const [orderNumber, setOrderNumber] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const { refs, context } = useFloating({ open, onOpenChange });
  const setFloating = refs.setFloating;
  const { getFloatingProps } = useInteractions([
    useDismiss(context, { outsidePressEvent: "mousedown" }),
    useRole(context, { role: "dialog" }),
  ]);

  // A fresh form after a finished order; an unfinished draft is kept.
  useEffect(() => {
    if (open || status !== "done") return;
    const frame = requestAnimationFrame(() => {
      setFields(emptyFields);
      setErrors({});
      setStatus("form");
    });
    return () => cancelAnimationFrame(frame);
  }, [open, status]);

  const set = <K extends keyof OrderFields>(key: K, value: OrderFields[K]) => {
    setFields((current) => ({ ...current, [key]: value }));
    if (key in errors)
      setErrors((current) => {
        const next = { ...current };
        delete next[key as keyof OrderErrors];
        return next;
      });
  };

  function submit(event: FormEvent) {
    event.preventDefault();
    const found = validateOrder(fields);
    setErrors(found);
    const first = fieldOrder.find((key) => found[key]);
    if (first) {
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${first}"]`)
        ?.focus();
      return;
    }
    setStatus("sending");
    window.setTimeout(() => {
      setOrderNumber(createOrderNumber());
      setStatus("done");
    }, 700);
  }

  const from = cityById(state.from).name;
  const to = cityById(state.to).name;
  const describedBy = (key: keyof OrderErrors) =>
    errors[key] ? `${id}-${key}-error` : undefined;

  if (!open) return null;
  return (
    <FloatingPortal>
      <FloatingOverlay className="dialog-overlay" lockScroll>
        <FloatingFocusManager context={context} modal returnFocus>
          <div
            ref={(node) => setFloating(node)}
            className="dialog"
            aria-labelledby={`${id}-title`}
            {...getFloatingProps()}
          >
            <div className="dialog-header">
              <h2 id={`${id}-title`}>
                {status === "done" ? copy.successTitle : copy.title}
              </h2>
              <button
                type="button"
                className="icon-button"
                aria-label={copy.close}
                onClick={() => onOpenChange(false)}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            {status === "done" ? (
              <div className="order-success" role="status">
                <CircleCheck size={40} aria-hidden="true" />
                <p className="order-number">
                  {copy.successNumber} <strong>{orderNumber}</strong>
                </p>
                <p>{copy.successText}</p>
                <p className="dialog-demo">{copy.demo}</p>
                <Button type="button" onClick={() => onOpenChange(false)}>
                  {copy.done}
                </Button>
              </div>
            ) : (
              <>
                <section className="order-summary" aria-label={copy.summary}>
                  <p className="order-route">
                    {from} → {to}
                  </p>
                  <p>
                    {calculatorCopy.modes[state.mode]},{" "}
                    {copy.cargo(state.weight || "0", state.volume || "0")}
                    {result?.vehicle &&
                      `, ${calculatorCopy.vehicles[result.vehicle]}`}
                  </p>
                  {(state.pickup || state.delivery || state.packaging) && (
                    <p>
                      {[
                        state.pickup && calculatorCopy.pickup,
                        state.delivery && calculatorCopy.delivery,
                        state.packaging && calculatorCopy.packaging,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                  {result && (
                    <p className="order-price">
                      {calculatorCopy.from_} {formatRoubles(result.total)},{" "}
                      {formatDays(result.days)}
                    </p>
                  )}
                  <p className="order-edit">{copy.edit}</p>
                </section>
                <form
                  ref={formRef}
                  className="order-form"
                  onSubmit={submit}
                  noValidate
                >
                  <Field label={copy.name} htmlFor={`${id}-name`} error={errors.name}>
                    <input
                      id={`${id}-name`}
                      name="name"
                      className="input"
                      autoComplete="name"
                      value={fields.name}
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={describedBy("name")}
                      onChange={(event) => set("name", event.target.value)}
                    />
                  </Field>
                  <Field label={copy.phone} htmlFor={`${id}-phone`} error={errors.phone}>
                    <input
                      id={`${id}-phone`}
                      name="phone"
                      className="input"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+7 (900) 000-00-00"
                      value={fields.phone}
                      aria-invalid={errors.phone ? true : undefined}
                      aria-describedby={describedBy("phone")}
                      onChange={(event) =>
                        set("phone", formatPhone(event.target.value))
                      }
                    />
                  </Field>
                  <Field label={copy.company} htmlFor={`${id}-company`}>
                    <input
                      id={`${id}-company`}
                      name="company"
                      className="input"
                      autoComplete="organization"
                      value={fields.company}
                      onChange={(event) => set("company", event.target.value)}
                    />
                  </Field>
                  <Field
                    label={`${copy.inn}, ${copy.optional}`}
                    htmlFor={`${id}-inn`}
                    error={errors.inn}
                  >
                    <input
                      id={`${id}-inn`}
                      name="inn"
                      className="input"
                      inputMode="numeric"
                      maxLength={12}
                      value={fields.inn}
                      aria-invalid={errors.inn ? true : undefined}
                      aria-describedby={describedBy("inn")}
                      onChange={(event) =>
                        set("inn", event.target.value.replace(/\D/g, ""))
                      }
                    />
                  </Field>
                  <div className="order-wide">
                    <Field label={copy.comment} htmlFor={`${id}-comment`}>
                      <textarea
                        id={`${id}-comment`}
                        name="comment"
                        className="input textarea"
                        rows={3}
                        placeholder={copy.commentPlaceholder}
                        value={fields.comment}
                        onChange={(event) => set("comment", event.target.value)}
                      />
                    </Field>
                  </div>
                  <div className="order-wide">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        name="consent"
                        checked={fields.consent}
                        aria-invalid={errors.consent ? true : undefined}
                        aria-describedby={describedBy("consent")}
                        onChange={(event) => set("consent", event.target.checked)}
                      />
                      <span className="checkbox-box" aria-hidden="true">
                        <Check size={14} />
                      </span>
                      <span className="checkbox-label">
                        {copy.consent}.{" "}
                        <Link href="/privacy" className="inline-link">
                          {copy.consentLink}
                        </Link>
                      </span>
                    </label>
                    {errors.consent && (
                      <span
                        className="field-error"
                        id={`${id}-consent-error`}
                        role="alert"
                      >
                        {errors.consent}
                      </span>
                    )}
                  </div>
                  <div className="order-wide order-actions">
                    <Button type="submit" disabled={status === "sending"}>
                      {status === "sending" ? copy.sending : copy.submit}
                    </Button>
                    <p className="dialog-demo">{copy.demo}</p>
                  </div>
                </form>
              </>
            )}
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
}
