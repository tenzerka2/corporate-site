import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { routes } from "../content/site";
import { servicePages } from "../content/services";

// Every link in the header and footer must lead to a real page, never to a stub.
function pageFile(href: string) {
  const path = href.split("#")[0];
  if (path.startsWith("/services/")) {
    const slug = path.split("/")[2];
    return servicePages.some((page) => page.slug === slug)
      ? "src/app/services/[slug]/page.tsx"
      : null;
  }
  return `src/app${path}/page.tsx`;
}

describe("Навигация", () => {
  it("у каждой ссылки меню и подвала есть страница", () => {
    for (const route of routes) {
      const file = pageFile(route.href);
      expect(file, route.href).not.toBeNull();
      expect(existsSync(file!), `${route.href} → ${file}`).toBe(true);
    }
  });
  it("заглушек и внутренних страниц соцсетей нет", () => {
    expect(existsSync("src/app/[...slug]")).toBe(false);
    expect(routes.some((route) => route.href.startsWith("/social"))).toBe(false);
  });
});
