import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui";
import { labels } from "@/content/labels";
import { breadcrumbJsonLd, serializeJsonLd, type Crumb } from "@/lib/seo";

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}

/** Dark first screen of inner pages with breadcrumbs and their JSON-LD. */
export function PageHero({
  crumbs,
  title,
  lead,
  actions,
  aside,
}: {
  crumbs: Crumb[];
  title: string;
  lead?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
}) {
  const trail: Crumb[] = [{ name: labels.glavnaya, path: "/" }, ...crumbs];
  return (
    <section className="industrial-hero page-hero">
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <Container wide>
        <nav className="breadcrumbs page-breadcrumbs" aria-label={labels.hlebnyeKroshki}>
          <ol>
            {trail.map((crumb, index) => (
              <li key={crumb.path}>
                {index < trail.length - 1 ? (
                  <Link href={crumb.path}>{crumb.name}</Link>
                ) : (
                  <span aria-current="page">{crumb.name}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <div className={`page-hero-layout ${aside ? "has-aside" : ""}`}>
          <div className="page-hero-copy">
            <h1>{title}</h1>
            {lead && <p className="page-hero-lead">{lead}</p>}
            {actions && <div className="hero-actions">{actions}</div>}
          </div>
          {aside && <div className="page-hero-aside">{aside}</div>}
        </div>
      </Container>
    </section>
  );
}

export function HeroFacts({ facts }: { facts: { value: string; label: string }[] }) {
  return (
    <dl className="hero-facts">
      {facts.map((fact) => (
        <div key={fact.label}>
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function PageSection({
  id,
  title,
  lead,
  children,
  tone,
}: {
  id: string;
  title: string;
  lead?: string;
  children: ReactNode;
  tone?: "surface";
}) {
  return (
    <section
      className={tone === "surface" ? "page-section page-section-surface" : "page-section"}
      aria-labelledby={`${id}-title`}
      id={id}
    >
      <Container wide>
        <div className="section-heading">
          <div>
            <h2 id={`${id}-title`}>{title}</h2>
            {lead && <p className="lead muted measure">{lead}</p>}
          </div>
        </div>
        {children}
      </Container>
    </section>
  );
}

/** Generic table with a visible caption; first column is a row header. */
export function DataTable({
  caption,
  head,
  rows,
}: {
  caption: string;
  head: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="table-scroll" role="region" aria-label={caption} tabIndex={0}>
      <table className="data-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            {head.map((cell) => (
              <th key={cell} scope="col">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) =>
                cellIndex === 0 ? (
                  <th key={cellIndex} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={cellIndex} data-label={head[cellIndex]}>
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
