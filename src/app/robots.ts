import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/** The demo stays closed to search engines unless ONEGA_INDEX=1 is set. */
export default function robots(): MetadataRoute.Robots {
  const open = process.env.ONEGA_INDEX === "1";
  return {
    rules: open
      ? { userAgent: "*", allow: "/", disallow: ["/ui", "/visuals"] }
      : { userAgent: "*", disallow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
