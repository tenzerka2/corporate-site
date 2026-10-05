"use client";
import { useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Check, CircleCheck } from "lucide-react";
import { Button, Field } from "@/components/ui";
import { contactsPage as copy } from "@/content/company";
import { orderCopy } from "@/content/logistics";
import { formatPhone, validateOrder, type OrderErrors } from "@/lib/order";

export function ContactForm() {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [fields, setFields] = useState({ name: "", phone: "", message: "", consent: false });
  const [errors, setErrors] = useState<OrderErrors>({});
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    const found = validateOrder({ ...fields, company: "", inn: "", comment: fields.message });
    setErrors(found);
    const first = (["name", "phone", "consent"] as const).find((key) => found[key]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setSent(true);
  }

  if (sent)
    return (
      <div className="contact-success" role="status">
        <CircleCheck size={36} aria-hidden="true" />
        <h3>{copy.successTitle}</h3>
        <p>{copy.successText}</p>
        <p className="dialog-demo">{orderCopy.demo}</p>
      </div>
    );

  const described = (key: keyof OrderErrors) => (errors[key] ? `${id}-${key}-error` : undefined);
  return (
    <form ref={formRef} className="contact-form" onSubmit={submit} noValidate>
      <Field label={orderCopy.name} htmlFor={`${id}-name`} error={errors.name}>
        <input
          id={`${id}-name`}
          name="name"
          className="input"
          autoComplete="name"
          value={fields.name}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={described("name")}
          onChange={(e) => setFields({ ...fields, name: e.target.value })}
        />
      </Field>
      <Field label={orderCopy.phone} htmlFor={`${id}-phone`} error={errors.phone}>
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
          aria-describedby={described("phone")}
          onChange={(e) => setFields({ ...fields, phone: formatPhone(e.target.value) })}
        />
      </Field>
      <div className="order-wide">
        <Field label={copy.message} htmlFor={`${id}-message`}>
          <textarea
            id={`${id}-message`}
            name="message"
            className="input textarea"
            rows={4}
            placeholder={copy.messagePlaceholder}
            value={fields.message}
            onChange={(e) => setFields({ ...fields, message: e.target.value })}
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
            aria-describedby={described("consent")}
            onChange={(e) => setFields({ ...fields, consent: e.target.checked })}
          />
          <span className="checkbox-box" aria-hidden="true">
            <Check size={14} />
          </span>
          <span className="checkbox-label">
            {orderCopy.consent}.{" "}
            <Link href="/privacy" className="inline-link">
              {orderCopy.consentLink}
            </Link>
          </span>
        </label>
        {errors.consent && (
          <span className="field-error" id={`${id}-consent-error`} role="alert">
            {errors.consent}
          </span>
        )}
      </div>
      <div className="order-wide order-actions">
        <Button type="submit">{copy.submit}</Button>
        <p className="dialog-demo">{orderCopy.demo}</p>
      </div>
    </form>
  );
}
