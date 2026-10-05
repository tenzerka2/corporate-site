import { PageHero } from "@/components/page/PageParts";
import { AccountDemo } from "@/components/sections/AccountDemo";
import { accountPage as copy } from "@/content/sections";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: copy.title, description: copy.description, path: "/account" });

export default function AccountPage() {
  return (
    <>
      <PageHero crumbs={[{ name: copy.title, path: "/account" }]} title={copy.title} lead={copy.lead} />
      <AccountDemo />
    </>
  );
}
