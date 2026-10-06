import type { Metadata } from "next";
import { TrackingForm } from "@/components/TrackingForm";
import { ContactCard } from "@/components/ui/ContactCard";
import { Hero } from "@/components/ui/Hero";
import { trackingPage as copy } from "@/content/pages";

export const metadata: Metadata = { title: copy.title, description: copy.lead };

export default function TrackingPage() {
  return (
    <>
      <Hero crumbs={[{ label: copy.title }]} title={copy.h1} lead={copy.lead} />
      <TrackingForm />
      <ContactCard text="Груз задерживается или нужно изменить адрес доставки? Позвоните в поддержку, решим в течение дня." />
    </>
  );
}
