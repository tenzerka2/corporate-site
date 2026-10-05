import { JsonLd, PageHero } from "@/components/page/PageParts";
import { FaqBlock, FinalBlock } from "@/components/logistics/HomeBlocks";
import { faqBlock } from "@/content/logistics";
import { servicePages } from "@/content/services";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { faqPage } from "@/content/company";

const title = faqPage.title;
export const metadata = pageMetadata({
  title,
  description: faqPage.description,
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd([...faqBlock.items, ...servicePages.flatMap((p) => p.faq)])} />
      <PageHero crumbs={[{ name: title, path: "/faq" }]} title={title} lead={faqBlock.description} />
      <FaqBlock title={faqPage.general} />
      {servicePages.map((page) => (
        <FaqBlock key={page.slug} id={`faq-${page.slug}`} title={page.title} description={page.subtitle} items={page.faq} />
      ))}
      <FinalBlock />
    </>
  );
}
