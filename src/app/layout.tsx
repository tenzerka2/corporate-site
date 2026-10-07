import Link from "next/link";
import type { Metadata } from "next";
import { publicAsset, SITE_URL } from "@/lib/paths";
import { Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  openGraph: { type: "website", locale: "ru_RU", siteName: "Онега Логистик", images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630 }] },
  title: { default: "Онега Логистик: грузоперевозки по России", template: "%s | Онега Логистик" },
  description:
    "Сборные грузы от 1 кг и отдельные машины до 20 т по России. Шесть собственных складов, расчёт стоимости онлайн.",
  robots: { index: false, follow: false },
  icons: { icon: publicAsset("/mark.svg"), apple: publicAsset("/apple-touch-icon.png") },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={inter.variable}>
      <body>
        <Link className="skip" href="#main">
          Перейти к содержимому
        </Link>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
