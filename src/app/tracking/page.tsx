import { PageHero } from "@/components/page/PageParts";
import { Tracking } from "@/components/tracking/Tracking";
import { trackingPage as copy } from "@/content/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: copy.title,
  description: copy.description,
  path: "/tracking",
});

export default function TrackingPage() {
  return (
    <>
      <PageHero crumbs={[{ name: copy.title, path: "/tracking" }]} title={copy.title} lead={copy.lead} />
      <Tracking />
    </>
  );
}
