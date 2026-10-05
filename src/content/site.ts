export const site = {
  name: "Онега",
  legalName: "ООО «Онега Логистик»",
  description: "Грузоперевозки по России для бизнеса",
  phone: "8 800 000-00-00",
  email: "info@onega.example",
  demo: "Демо-проект Shvetsov Studio",
};
export const services = [
  {
    title: "Сборные грузы",
    href: "/services/groupage",
    description:
      "Объединяем небольшие отправления в одной машине. Вы платите только за место вашего груза.",
    action: "Рассчитать доставку",
    icon: "packages",
  },
  {
    title: "Отдельная машина",
    href: "/services/ftl",
    description:
      "Выделяем машину под ваш груз. Согласуем маршрут и время подачи на погрузку.",
    action: "Подобрать машину",
    icon: "truck",
  },
  {
    title: "Склад и хранение",
    href: "/services/warehouse",
    description:
      "Принимаем, храним и комплектуем товары. Готовим партии к следующей отправке.",
    action: "Рассчитать хранение",
    icon: "warehouse",
  },
  {
    title: "Доставка на маркетплейсы",
    href: "/services/marketplaces",
    description:
      "Готовим поставки к приёмке. Доставляем товары на склады в согласованное окно.",
    action: "Рассчитать поставку",
    icon: "box",
  },
] as const;
export const companyLinks = [
  { title: "О нас", href: "/about" },
  { title: "Вакансии", href: "/careers" },
  { title: "Новости", href: "/news" },
  { title: "Реквизиты", href: "/details" },
];
export const clientLinks = [
  { title: "Тарифы", href: "/tariffs" },
  { title: "Направления", href: "/directions" },
  { title: "Документы", href: "/documents" },
  { title: "Вопросы и ответы", href: "/faq" },
  { title: "Отследить груз", href: "/tracking" },
];
export const legalLinks = [
  { title: "Политика конфиденциальности", href: "/privacy" },
  { title: "Пользовательское соглашение", href: "/terms" },
  { title: "Публичная оферта", href: "/offer" },
];
export const socialLinks = ["Telegram", "VK", "MAX"].map((title) => ({
  title,
  href: `/social/${title.toLowerCase()}`,
}));
export const utilityLinks = [
  { title: "Рассчитать доставку", href: "/calculator" },
  { title: "Отследить груз", href: "/tracking" },
  { title: "Личный кабинет", href: "/account" },
  { title: "Вопросы и помощь", href: "/help" },
];
export const routes = [
  ...services,
  ...companyLinks,
  ...clientLinks,
  ...legalLinks,
  ...socialLinks,
  ...utilityLinks,
];
export const copy = {
  home: {
    title: "Доставка грузов\nпо России",
    description:
      "Сборные грузы, отдельные машины и складская логистика. Мы организуем перевозку от отправителя до получателя.",
    calculation: "Рассчитать доставку",
    tracking: "Отследить груз",
    note: "Демо-проект. Компания вымышлена, заявки никуда не отправляются.",
    imageAlt: "Трёхмерная модель магистрального тягача «Онега» с полуприцепом",
    uiLink: "Дизайн-система",
  },
  placeholder:
    "Мы готовим этот раздел. Это демонстрационный сайт вымышленной компании: отслеживание и личный кабинет пока недоступны. Расчёт стоимости уже работает.",
  aboutQuote:
    "«За каждой поставкой стоит чья-то работа. Наша задача: чтобы груз оказался на месте вовремя».",
  quoteCaption: "Руководитель «Онега Логистик», вымышленная цитата",
  photoPlaceholder: "Здесь будет фото нашей команды",
  demoNote: "Компания, контакты и данные вымышлены.",
};
