"use client";
import { useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Download } from "lucide-react";
import { Button, ButtonLink, Container } from "@/components/ui";
import { accountPage as copy } from "@/content/sections";

export function AccountDemo() {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  function enterDemo() {
    setOpen(true);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    setError(true);
  }

  if (!open)
    return (
      <section className="page-section" aria-labelledby={`${id}-login`}>
        <Container wide>
          <div className="contacts-layout">
            <div>
              <h2 id={`${id}-login`}>{copy.login.title}</h2>
              <p className="lead muted account-note">{copy.login.demoNote}</p>
            </div>
            <form className="contacts-form login-form" onSubmit={submit} noValidate>
              <div className="field">
                <label htmlFor={`${id}-user`}>{copy.login.login}</label>
                <input id={`${id}-user`} className="input" autoComplete="username" />
              </div>
              <div className="field">
                <label htmlFor={`${id}-password`}>{copy.login.password}</label>
                <input id={`${id}-password`} className="input" type="password" autoComplete="current-password" />
              </div>
              {error && (
                <p className="field-error" role="alert">
                  {copy.login.error}
                </p>
              )}
              <div className="login-actions">
                <Button type="submit" variant="secondary">
                  {copy.login.submit}
                </Button>
                <Button type="button" onClick={enterDemo}>
                  {copy.login.demo}
                </Button>
              </div>
            </form>
          </div>
        </Container>
      </section>
    );

  return (
    <section className="page-section account" aria-labelledby={`${id}-company`}>
      <Container wide>
        <div className="account-head">
          <div>
            <h2 id={`${id}-company`} ref={headingRef} tabIndex={-1}>
              {copy.company}
            </h2>
            <p className="muted">
              {copy.manager.label}: {copy.manager.name},{" "}
              <a className="inline-link" href={`tel:${copy.manager.phone.replace(/\D/g, "")}`}>
                {copy.manager.phone}
              </a>
            </p>
          </div>
          <div className="account-actions">
            <ButtonLink href="/calculator">{copy.newShipment}</ButtonLink>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              {copy.logout}
            </Button>
          </div>
        </div>
        <dl className="company-stats account-summary">
          {copy.summary.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
        <h3 className="account-title">{copy.shipmentsTitle}</h3>
        <table className="warehouse-table account-table">
          <thead>
            <tr>
              <th scope="col">{copy.shipmentsHead.number}</th>
              <th scope="col">{copy.shipmentsHead.route}</th>
              <th scope="col">{copy.shipmentsHead.cargo}</th>
              <th scope="col">{copy.shipmentsHead.status}</th>
              <th scope="col">{copy.shipmentsHead.sum}</th>
            </tr>
          </thead>
          <tbody>
            {copy.shipments.map((item) => (
              <tr key={item.number}>
                <th scope="row">
                  {item.tracking ? (
                    <Link className="inline-link" href={`/tracking?number=${item.number}`}>
                      {item.number}
                    </Link>
                  ) : (
                    item.number
                  )}
                </th>
                <td data-label={copy.shipmentsHead.route}>{item.route}</td>
                <td data-label={copy.shipmentsHead.cargo}>{item.cargo}</td>
                <td data-label={copy.shipmentsHead.status}>{item.status}</td>
                <td data-label={copy.shipmentsHead.sum}>{item.sum}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3 className="account-title">{copy.documentsTitle}</h3>
        <ul className="document-rows">
          {copy.documents.map((doc) => (
            <li key={doc.title}>
              <a href={doc.href} download>
                <span>{doc.title}</span>
                <span className="muted">{doc.date}</span>
                <Download size={18} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
        <Link className="text-link account-tracking" href="/tracking">
          {copy.trackLink}
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </Container>
    </section>
  );
}
