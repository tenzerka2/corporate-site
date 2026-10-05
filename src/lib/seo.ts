import type { Metadata } from "next";

/** Set NEXT_PUBLIC_SITE_URL on deploy; Vercel provides its production host. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://onega.example")
).replace(/\/$/, "");

export const OG_IMAGE = { url: "/og.png", width: 1200, height: 630 };

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      siteName: "Онега Логистик",
      title,
      description,
      url: path,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function faqJsonLd(items: { title: string; content: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.title,
      acceptedAnswer: { "@type": "Answer", text: item.content },
    })),
  };
}

/** Serialises JSON-LD safely for an inline script. */
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
