import { PageHero, PageSection } from "@/components/page/PageParts";
import { newsPage as copy } from "@/content/sections";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: copy.title, description: copy.description, path: "/news" });

const date = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" });

export default function NewsPage() {
  return (
    <>
      <PageHero crumbs={[{ name: copy.title, path: "/news" }]} title={copy.title} lead={copy.lead} />
      <PageSection id="feed" title="2026">
        <ol className="news-list">
          {copy.items.map((item) => (
            <li key={item.date}>
              <article aria-labelledby={`news-${item.date}`}>
                <div className="news-meta">
                  <time dateTime={item.date}>{date.format(new Date(item.date))}</time>
                  <span>{item.tag}</span>
                </div>
                <div>
                  <h3 id={`news-${item.date}`}>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </PageSection>
    </>
  );
}
