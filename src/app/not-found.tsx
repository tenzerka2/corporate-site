import Link from "next/link";
import { Hero } from "@/components/ui/Hero";
import { serviceLinks } from "@/content/navigation";

export default function NotFound() {
  return (
    <>
      <Hero
        badge="Ошибка 404"
        title="Такой страницы нет"
        lead="Возможно, адрес изменился. Начните с главной или выберите услугу."
        actions={[{ label: "На главную", href: "/" }, { label: "Калькулятор", href: "/calculator", icon: "calc", secondary: true }]}
      />
      <section className="section">
        <div className="container">
          <ul className="plain-list" style={{ display: "grid", gap: 12 }}>
            {serviceLinks.map((link) => (
              <li key={link.href}>
                <Link className="link" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
