import type { MetadataRoute } from "next";
import { servicePages } from "@/content/services";
import { directionSlug, directions } from "@/lib/directions";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, number][] = [
    ["/", 1],
    ["/calculator", 0.9],
    ...servicePages.map((page): [string, number] => [`/services/${page.slug}`, 0.9]),
    ["/directions", 0.8],
    ...directions.map((d): [string, number] => [`/directions/${directionSlug(d)}`, 0.7]),
    ["/tariffs", 0.8],
    ["/tracking", 0.6],
    ["/about", 0.6],
    ["/contacts", 0.7],
    ["/faq", 0.6],
    ["/documents", 0.4],
    ["/privacy", 0.2],
    ["/terms", 0.2],
    ["/offer", 0.2],
  ];
  return pages.map(([path, priority]) => ({
    url: absoluteUrl(path),
    changeFrequency: "monthly",
    priority,
  }));
}
