import type { Metadata } from "next";
import Link from "next/link";
import { Calculator } from "@/components/Calculator";
import { Icon } from "@/components/Icon";
import { ContactCard } from "@/components/ui/ContactCard";
import { Features } from "@/components/ui/Features";
import { Hero } from "@/components/ui/Hero";
import { calculatorPage as copy } from "@/content/pages";

export const metadata: Metadata = { title: copy.title, description: copy.lead };

export default function CalculatorPage() {
  return (
    <>
      <Hero crumbs={[{ label: copy.title }]} title={copy.h1} lead={copy.lead} />
      <Calculator heading={false} />
      <section className="section" aria-labelledby="how-title">
        <div className="container">
          <div className="head-left">
            <h2 id="how-title">{copy.howTitle}</h2>
          </div>
          <Features items={copy.how} columns={3} />
          <p style={{ marginTop: 40 }}>
            <Link className="link" href="/tariffs">
              Все тарифы
              <Icon name="arrow" size={16} />
            </Link>
          </p>
        </div>
      </section>
      <ContactCard text="Груз больше 20 тонн, негабарит или особые условия? Менеджер рассчитает вручную в течение часа." />
    </>
  );
}
