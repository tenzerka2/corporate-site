// Site map: header menus, footer columns and the list of every page.
import { services } from "./services";

export type NavLink = { label: string; href: string; text?: string };
export type NavItem = NavLink | { label: string; items: NavLink[]; all?: NavLink };

export const serviceLinks: NavLink[] = services.map((s) => ({
  label: s.title,
  href: `/services/${s.slug}`,
  text: s.short,
}));

export const menu: NavItem[] = [
  { label: "Услуги", items: serviceLinks, all: { label: "Все услуги", href: "/services" } },
  { label: "Тарифы", href: "/tariffs" },
  { label: "Калькулятор", href: "/calculator" },
  {
    label: "Компания",
    items: [
      { label: "О компании", href: "/about", text: "История, парк и принципы работы" },
      { label: "Склады", href: "/warehouses", text: "Шесть складов класса А" },
      { label: "Контакты", href: "/contacts", text: "Телефоны, почта и реквизиты" },
    ],
  },
];

export const footerColumns: { title: string; links: NavLink[] }[] = [
  { title: "Услуги", links: [...serviceLinks, { label: "Все услуги", href: "/services" }] },
  {
    title: "Клиентам",
    links: [
      { label: "Калькулятор", href: "/calculator" },
      { label: "Тарифы", href: "/tariffs" },
      { label: "Отслеживание груза", href: "/tracking" },
      { label: "Политика конфиденциальности", href: "/privacy" },
    ],
  },
  {
    title: "Компания",
    links: [
      { label: "О компании", href: "/about" },
      { label: "Склады", href: "/warehouses" },
      { label: "Контакты", href: "/contacts" },
    ],
  },
];

/** Every page of the site. Tests check that each one renders and links only to these. */
export const routes = [
  "/",
  "/services",
  ...serviceLinks.map((link) => link.href),
  "/tariffs",
  "/calculator",
  "/tracking",
  "/about",
  "/warehouses",
  "/contacts",
  "/privacy",
];
