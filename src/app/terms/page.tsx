import { LegalPage } from "@/components/page/LegalPage";
import { legalPages } from "@/content/company";
import { pageMetadata } from "@/lib/seo";

const page = legalPages.terms;
export const metadata = pageMetadata({ title: page.title, description: page.description, path: "/terms" });

export default function Page() {
  return <LegalPage path="/terms" page={page} />;
}
