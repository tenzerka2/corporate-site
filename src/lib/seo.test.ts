import { describe, expect, it } from "vitest";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, serializeJsonLd, SITE_URL } from "./seo";
import { directionSlug, directions, findDirection, nearbyDirections } from "./directions";

describe("SEO", () => {
  it("canonical и OG берутся из пути страницы", () => {
    const meta = pageMetadata({ title: "Тарифы", description: "Цены", path: "/tariffs" });
    expect(meta.alternates?.canonical).toBe("/tariffs");
    expect(meta.openGraph?.url).toBe("/tariffs");
  });
  it("хлебные крошки содержат абсолютные адреса по порядку", () => {
    const data = breadcrumbJsonLd([
      { name: "Главная", path: "/" },
      { name: "Тарифы", path: "/tariffs" },
    ]);
    expect(data.itemListElement[0]).toMatchObject({ position: 1, item: SITE_URL });
    expect(data.itemListElement[1].item).toBe(`${SITE_URL}/tariffs`);
  });
  it("FAQPage содержит вопросы и ответы", () => {
    const data = faqJsonLd([{ title: "Вопрос?", content: "Ответ." }]);
    expect(data.mainEntity[0].acceptedAnswer.text).toBe("Ответ.");
  });
  it("экранирует закрывающий тег скрипта", () => {
    expect(serializeJsonLd({ a: "</script>" })).not.toContain("</script>");
  });
});

describe("Направления", () => {
  it("адреса уникальны и находятся обратно", () => {
    const slugs = directions.map(directionSlug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(findDirection(slug)).toBeDefined();
    expect(findDirection("moscow-unknown")).toBeUndefined();
  });
  it("соседние направления не включают текущее и начинаются с общих городов", () => {
    const current = directions[2];
    const nearby = nearbyDirections(current);
    expect(nearby).toHaveLength(4);
    expect(nearby.map(directionSlug)).not.toContain(directionSlug(current));
    expect([nearby[0].from, nearby[0].to]).toContain(current.from);
  });
});
