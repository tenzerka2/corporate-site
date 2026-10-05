import { describe, expect, it } from "vitest";
import { findPage, getPageSlugs } from "./navigation";
import { routes } from "../content/site";
describe("Навигация первого этапа", () => {
  it("каждая ссылка ведёт на известный раздел", () => {
    for (const route of routes)
      expect(findPage(route.href.slice(1).split("/"))?.title).toBe(route.title);
  });
  it("неизвестные и вложенные адреса не маскируются под существующие страницы", () => {
    expect(findPage(["unknown"])).toBeUndefined();
    expect(findPage(["about", "unknown"])).toBeUndefined();
  });
  it("генерирует уникальные пути и сохраняет вложенность услуг", () => {
    const paths = getPageSlugs().map(({ slug }) => slug.join("/"));
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths).toContain("services/groupage");
  });
});
