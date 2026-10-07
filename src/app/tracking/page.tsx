import type { Metadata } from "next";
import { TrackingForm } from "@/components/TrackingForm";
import { ContactCard } from "@/components/ui/ContactCard";
import { Hero } from "@/components/ui/Hero";
import { trackingPage as copy } from "@/content/pages";

export const metadata: Metadata = { title: copy.title, description: copy.lead };

export default async function TrackingPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const query = Object.fromEntries(Object.entries(params).filter((pair): pair is [string, string] => typeof pair[1] === "string"));
  return (
    <>
      <Hero crumbs={[{ label: copy.title }]} title={copy.h1} lead={copy.lead} />
      <TrackingForm initialNumber={query.number || ""} context={query} />
      <ContactCard text="Груз задерживается или нужно изменить адрес доставки? Позвоните в поддержку, решим в течение дня." />
    </>
  );
}
