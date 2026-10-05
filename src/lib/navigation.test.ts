import { describe, expect, it } from "vitest";
import { findPage, getPageSlugs, implementedPages } from "./navigation";
import { routes } from "../content/site";
describe("Навигация", () => {
  it("каждая ссылка ведёт на готовую страницу или известную заглушку", () => {
    for (const route of routes) {
      if (implementedPages.has(route.href)) continue;
      expect(findPage(route.href.slice(1).split("/"))?.title).toBe(route.title);
    }
  });
  it("неизвестные и вложенные адреса не маскируются под существующие страницы", () => {
    expect(findPage(["unknown"])).toBeUndefined();
    expect(findPage(["about", "unknown"])).toBeUndefined();
  });
  it("генерирует уникальные пути и сохраняет вложенность услуг", () => {
    const paths = getPageSlugs().map(({ slug }) => slug.join("/"));
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths).toContain("careers");
    expect(paths).not.toContain("calculator");
    expect(paths).not.toContain("services/groupage");
  });
});
