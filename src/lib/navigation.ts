import { routes } from "../content/site";
export function findPage(slug: string[]) {
  return routes.find((route) => route.href === `/${slug.join("/")}`);
}
export function getPageSlugs() {
  return [...new Set(routes.map((route) => route.href))].map((href) => ({
    slug: href.slice(1).split("/"),
  }));
}
