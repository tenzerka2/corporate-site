import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
export function Container({
  children,
  wide = false,
  className = "",
}: {
  children: ReactNode;
  wide?: boolean;
  className?: string;
}) {
  return (
    <div className={`container ${wide ? "container-wide" : ""} ${className}`}>
      {children}
    </div>
  );
}
export function Section({
  title,
  subtitle,
  link,
  children,
  id,
}: {
  title: string;
  subtitle?: string;
  link?: { href: string; label: string };
  children: ReactNode;
  id?: string;
}) {
  return (
    <section className="section" id={id}>
      <Container>
        <div className="section-heading">
          <div>
            <h2>{title}</h2>
            {subtitle && <p className="muted measure">{subtitle}</p>}
          </div>
          {link && (
            <Link className="text-link" href={link.href}>
              {link.label}
              <ArrowUpRight size={18} />
            </Link>
          )}
        </div>
        {children}
      </Container>
    </section>
  );
}
type ButtonStyle = {
  variant?: "primary" | "secondary" | "ghost";
  size?: "regular" | "small";
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};
export function Button({
  variant = "primary",
  size = "regular",
  icon,
  children,
  className = "",
  ...props
}: ButtonStyle & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`button button-${variant} button-${size} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
export function ButtonLink({
  variant = "primary",
  size = "regular",
  icon,
  children,
  className = "",
  ...props
}: ButtonStyle & ComponentProps<typeof Link>) {
  return (
    <Link
      className={`button button-${variant} button-${size} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </Link>
  );
}
export function Badge({ children }: { children: ReactNode }) {
  return <span className="badge">{children}</span>;
}
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`card ${className}`}>{children}</div>;
}
export function CheckItem({ children }: { children: ReactNode }) {
  return (
    <div className="check-item">
      <Check size={20} aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}
export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
export function Input(props: ComponentProps<"input">) {
  return <input className="input" {...props} />;
}
export function Textarea(props: ComponentProps<"textarea">) {
  return <textarea className="input textarea" {...props} />;
}
export function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error && (
        <span className="field-error" id={`${htmlFor}-error`} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
/** Editorial section marker: number and name above a heading, on a rule. */
export function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  return (
    <p className="section-label">
      <span>{index}</span>
      <span aria-hidden="true">/</span>
      {children}
    </p>
  );
}
