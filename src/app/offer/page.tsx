import { LegalPage } from "@/components/page/LegalPage";
import { legalPages } from "@/content/company";
import { pageMetadata } from "@/lib/seo";

const page = legalPages.offer;
export const metadata = pageMetadata({ title: page.title, description: page.description, path: "/offer" });

export default function Page() {
  return <LegalPage path="/offer" page={page} />;
}
