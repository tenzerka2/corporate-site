import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderButton } from "@/components/OrderButton";
import { ContactCard } from "@/components/ui/ContactCard";
import { Faq } from "@/components/ui/Faq";
import { Features } from "@/components/ui/Features";
import { Hero } from "@/components/ui/Hero";
import { ServiceCards } from "@/components/ui/ServiceCards";
import { Steps } from "@/components/ui/Steps";
import { Story } from "@/components/ui/Story";
import { Tabs } from "@/components/ui/Tabs";
import { serviceBySlug, services } from "@/content/services";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = serviceBySlug((await params).slug);
  return service ? { title: service.title, description: service.lead } : {};
}

export default async function ServicePage({ params }: Props) {
  const service = serviceBySlug((await params).slug);
  if (!service) notFound();
  const others = services.filter((item) => item.slug !== service.slug);

  return (
    <>
      <Hero
        crumbs={[{ label: "Услуги", href: "/services" }, { label: service.title }]}
        badge={service.badge}
        title={service.h1}
        lead={service.lead}
        points={service.points}
        actions={[{ label: "Рассчитать стоимость", href: "/calculator", icon: "calc" }]}
        extraAction={<OrderButton label="Оставить заявку" summary={service.title} className="button button-secondary" />}
        photo={{ image: service.heroImage, alt: service.heroAlt }}
        stats={service.stats}
      />

      <section className="section" aria-labelledby="benefits-title">
        <div className="container">
          <div className="head-left">
            <h2 id="benefits-title">{service.benefitsTitle}</h2>
          </div>
          <Features items={service.benefits} />
        </div>
      </section>

      <section className="block" aria-labelledby="offer-title">
        <div className="container">
          <div className="head-left">
            <h2 id="offer-title">{service.offer.title}</h2>
            <p>{service.offer.text}</p>
          </div>
          <Tabs tabs={service.offer.tabs} label={service.offer.title} action={{ label: "Рассчитать стоимость", href: "/calculator" }} />
        </div>
      </section>

      <section className="section" aria-labelledby="steps-title">
        <div className="container">
          <div className="head-center">
            <h2 id="steps-title">Как это работает</h2>
          </div>
          <Steps items={service.steps} />
        </div>
      </section>

      <section className="section" aria-label={service.story.label}>
        <div className="container">
          <Story {...service.story} />
        </div>
      </section>

      <section className="section" aria-labelledby="faq-title">
        <div className="container">
          <div className="head-center">
            <h2 id="faq-title">Частые вопросы</h2>
          </div>
          <Faq items={service.faq} />
        </div>
      </section>

      <section className="block" aria-labelledby="others-title">
        <div className="container">
          <div className="head-center">
            <h2 id="others-title">Другие услуги</h2>
          </div>
          <ServiceCards items={others} />
        </div>
      </section>

      <ContactCard summary={service.title} />
    </>
  );
}
