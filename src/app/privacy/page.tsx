import { LegalPage } from "@/components/page/LegalPage";
import { legalPages } from "@/content/company";
import { pageMetadata } from "@/lib/seo";

const page = legalPages.privacy;
export const metadata = pageMetadata({ title: page.title, description: page.description, path: "/privacy" });

export default function Page() {
  return <LegalPage path="/privacy" page={page} />;
}
