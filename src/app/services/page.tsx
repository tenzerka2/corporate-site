import type { Metadata } from "next";
import { ContactCard } from "@/components/ui/ContactCard";
import { Features } from "@/components/ui/Features";
import { Hero } from "@/components/ui/Hero";
import { ServiceCards } from "@/components/ui/ServiceCards";
import { Steps } from "@/components/ui/Steps";
import { services, servicesHub } from "@/content/services";
import { company, steps } from "@/content/site";

export const metadata: Metadata = { title: servicesHub.title, description: servicesHub.lead };

export default function ServicesPage() {
  return (
    <>
      <Hero
        crumbs={[{ label: servicesHub.title }]}
        title={servicesHub.h1}
        lead={servicesHub.lead}
        actions={[
          { label: "Рассчитать стоимость", href: "/calculator", icon: "calc" },
          { label: company.phone, href: company.phoneHref, icon: "phone", secondary: true },
        ]}
        photo={{ image: servicesHub.heroImage, alt: servicesHub.heroAlt }}
      />

      <section className="section" aria-labelledby="list-title">
        <div className="container">
          <div className="head-center">
            <h2 id="list-title">Основные услуги</h2>
            <p>Выберите услугу, чтобы посмотреть условия, тарифы и примеры клиентов.</p>
          </div>
          <ServiceCards items={services} />
        </div>
      </section>

      <section className="block" aria-labelledby="extras-title">
        <div className="container">
          <div className="head-left">
            <h2 id="extras-title">{servicesHub.extrasTitle}</h2>
            <p>Добавляются к любой перевозке. Цены в калькуляторе и в разделе «Тарифы».</p>
          </div>
          <Features items={servicesHub.extras} columns={3} />
        </div>
      </section>

      <section className="section" aria-labelledby="how-title">
        <div className="container">
          <div className="head-center">
            <h2 id="how-title">{steps.title}</h2>
            <p>{steps.text}</p>
          </div>
          <Steps items={steps.items} />
        </div>
      </section>

      <ContactCard />
    </>
  );
}
