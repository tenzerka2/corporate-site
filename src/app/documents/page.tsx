import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import { PageHero, PageSection } from "@/components/page/PageParts";
import { documentsPage as copy } from "@/content/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: copy.title, description: copy.description, path: "/documents" });

export default function DocumentsPage() {
  return (
    <>
      <PageHero crumbs={[{ name: copy.title, path: "/documents" }]} title={copy.title} lead={copy.lead} />
      <PageSection id="list" title={copy.listTitle}>
        <ul className="link-grid">
          {copy.items.map((item) => {
            const pdf = item.href.endsWith(".pdf");
            const content = (
              <>
                <span>
                  <FileText size={20} aria-hidden="true" />
                  {item.title}
                </span>
                <ArrowUpRight size={20} aria-hidden="true" />
              </>
            );
            return (
              <li key={item.href}>
                {pdf ? (
                  <a href={item.href} download>
                    {content}
                  </a>
                ) : (
                  <Link href={item.href}>{content}</Link>
                )}
                <p>{item.text}</p>
              </li>
            );
          })}
        </ul>
      </PageSection>
    </>
  );
}
