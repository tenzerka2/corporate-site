import { labels } from "@/content/labels";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "@/styles/globals.css";
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
  robots: { index: false, follow: false },
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
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
