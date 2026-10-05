import { labels } from "@/content/labels";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "@/styles/globals.css";
import { JsonLd } from "@/components/page/PageParts";
import { site } from "@/content/site";
import { OG_IMAGE, SITE_URL, absoluteUrl } from "@/lib/seo";

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.legalName,
  alternateName: "Онега",
  url: SITE_URL,
  logo: absoluteUrl("/brand/logo.svg"),
  telephone: site.phone,
  email: site.email,
  description: site.description,
};
const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});
export const metadata: Metadata = {
  title: {
    default: labels.onegaLogistikGruzoperevozkiPoRossii,
    template: labels.sOnegaLogistik,
  },
  description: labels.demonstratsionnyySaytTransportnoyKompaniiOnegaLogistik,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Онега Логистик",
    images: [OG_IMAGE],
  },
  robots:
    process.env.ONEGA_INDEX === "1"
      ? { index: true, follow: true }
      : { index: false, follow: false },
  icons: { icon: "/brand/mark.svg", apple: "/apple-touch-icon.png" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className={inter.variable}>
        <a className="skip-link" href="#main">
          {labels.pereytiKSoderzhimomu}
        </a>
        <JsonLd data={organization} />
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
