import { labels } from "@/content/labels";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge, ButtonLink, Container } from "@/components/ui";
import { copy } from "@/content/site";
import { findPage, getPageSlugs } from "@/lib/navigation";
export function generateStaticParams() {
  return getPageSlugs();
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  return { title: findPage(slug)?.title ?? labels.razdelNeNayden };
}
export default async function Placeholder({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const page = findPage(slug);
  if (!page) notFound();
  return (
    <Container>
      <section className="placeholder-page">
        <nav className="breadcrumbs" aria-label={labels.hlebnyeKroshki}>
          <Link href="/">{labels.glavnaya}</Link>
          <span>/</span>
          <span aria-current="page">{page.title}</span>
        </nav>
        <Badge>{labels.razdelVRazrabotke}</Badge>
        <h1>{page.title}</h1>
        <p className="lead measure">{copy.placeholder}</p>
        <ButtonLink href="/" variant="secondary" icon={<ArrowLeft size={18} />}>
          {labels.naGlavnuyu}
        </ButtonLink>
      </section>
    </Container>
  );
}
