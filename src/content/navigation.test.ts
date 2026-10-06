import { describe, expect, it } from "vitest";
import { footerColumns, menu, routes } from "./navigation";

describe("карта сайта", () => {
  it("меню и подвал ведут только на существующие страницы", () => {
    const hrefs = [
      ...menu.flatMap((item) => ("items" in item ? [...item.items, ...(item.all ? [item.all] : [])] : [item])),
      ...footerColumns.flatMap((column) => column.links),
    ].map((link) => link.href);
    for (const href of hrefs) expect(routes, href).toContain(href);
  });
  it("адреса без повторов", () => {
    expect(new Set(routes).size).toBe(routes.length);
  });
});
