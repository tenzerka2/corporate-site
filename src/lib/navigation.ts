import { routes } from "../content/site";
export function findPage(slug: string[]) {
  return routes.find((route) => route.href === `/${slug.join("/")}`);
}
/** Sections that have their own page and no longer need a placeholder. */
export const implementedPages = new Set(["/calculator"]);
export function getPageSlugs() {
  return [...new Set(routes.map((route) => route.href))]
    .filter((href) => !implementedPages.has(href))
    .map((href) => ({
    slug: href.slice(1).split("/"),
  }));
}
