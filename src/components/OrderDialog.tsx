"use client";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { order as copy, company } from "@/content/site";
import { formatPhone, orderNumber, validateOrder, type OrderErrors } from "@/lib/order";
import styles from "./OrderDialog.module.css";

/** Native modal dialog: the browser traps focus and handles Escape. */
export function OrderDialog({
  open,
  onClose,
  summary,
}: {
  open: boolean;
  onClose: () => void;
  summary?: string;
}) {
  const id = useId();
  const ref = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const [fields, setFields] = useState({ name: "", phone: "", company: "", comment: "", consent: false });
  const [errors, setErrors] = useState<OrderErrors>({});
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const found = validateOrder(fields);
    setErrors(found);
    const first = (["name", "phone", "consent"] as const).find((key) => found[key]);
    if (first) {
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setDone(orderNumber());
  }

  function close() {
    onClose();
    if (done) {
      setDone(null);
      setFields({ name: "", phone: "", company: "", comment: "", consent: false });
    }
  }

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby={`${id}-title`}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === ref.current) close();
      }}
    >
      <div className={styles.body}>
        <div className={styles.head}>
          <h2 id={`${id}-title`}>{done ? copy.done : copy.title}</h2>
          <button type="button" className={styles.close} aria-label={copy.close} onClick={close}>
            ×
          </button>
        </div>
        {done ? (
          <div role="status" className={styles.done}>
            <p>{copy.doneText(done)}</p>
            <p className="muted">{company.demoNote}</p>
            <div className={styles.doneActions}>
              <button type="button" className="button" onClick={close}>
                {copy.ok}
              </button>
              <a className="button button-secondary" href="/tracking">
                {copy.track}
              </a>
            </div>
          </div>
        ) : (
          <form ref={form} className={styles.form} onSubmit={submit} noValidate>
            {summary && <p className={styles.summary}>{summary}</p>}
            <div>
              <label className="label" htmlFor={`${id}-name`}>
                {copy.name}
              </label>
              <input
                id={`${id}-name`}
                name="name"
                className="input"
                autoComplete="name"
                value={fields.name}
                aria-invalid={errors.name || undefined}
                aria-describedby={errors.name ? `${id}-name-error` : undefined}
                onChange={(e) => setFields({ ...fields, name: e.target.value })}
              />
              {errors.name && (
                <span id={`${id}-name-error`} className="error">
                  {copy.errors.name}
                </span>
              )}
            </div>
            <div>
              <label className="label" htmlFor={`${id}-phone`}>
                {copy.phone}
              </label>
              <input
                id={`${id}-phone`}
                name="phone"
                className="input"
                type="tel"
                autoComplete="tel"
                placeholder="+7 (900) 000-00-00"
                value={fields.phone}
                aria-invalid={errors.phone || undefined}
                aria-describedby={errors.phone ? `${id}-phone-error` : undefined}
                onChange={(e) => setFields({ ...fields, phone: formatPhone(e.target.value) })}
              />
              {errors.phone && (
                <span id={`${id}-phone-error`} className="error">
                  {copy.errors.phone}
                </span>
              )}
            </div>
            <div className={styles.wide}>
              <label className="label" htmlFor={`${id}-company`}>
                {copy.companyName}
              </label>
              <input
                id={`${id}-company`}
                className="input"
                autoComplete="organization"
                value={fields.company}
                onChange={(e) => setFields({ ...fields, company: e.target.value })}
              />
            </div>
            <div className={styles.wide}>
              <label className="label" htmlFor={`${id}-comment`}>
                {copy.comment}
              </label>
              <textarea
                id={`${id}-comment`}
                className="input"
                rows={3}
                placeholder={copy.commentHint}
                value={fields.comment}
                onChange={(e) => setFields({ ...fields, comment: e.target.value })}
              />
            </div>
            <div className={styles.wide}>
              <label className="check">
                <input
                  type="checkbox"
                  name="consent"
                  checked={fields.consent}
                  aria-invalid={errors.consent || undefined}
                  aria-describedby={errors.consent ? `${id}-consent-error` : undefined}
                  onChange={(e) => setFields({ ...fields, consent: e.target.checked })}
                />
                <span>{copy.consent}</span>
              </label>
              <a className={`link ${styles.policy}`} href="/privacy" target="_blank">
                {copy.policy}
              </a>
              {errors.consent && (
                <span id={`${id}-consent-error`} className="error">
                  {copy.errors.consent}
                </span>
              )}
            </div>
            <div className={styles.wide}>
              <button type="submit" className="button">
                {copy.submit}
              </button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}
