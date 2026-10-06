// Site photography. Generated for the demo in the brand colours, checked for logos and text.
import terminalDock from "@/assets/photos/terminal-dock.webp";
import highway from "@/assets/photos/highway.webp";
import warehouseRacks from "@/assets/photos/warehouse-racks.webp";
import pallets from "@/assets/photos/pallets.webp";
import loading from "@/assets/photos/loading.webp";

export const photos = {
  terminal: {
    code: "F01",
    image: terminalDock,
    alt: "Тягач Онеги с полуприцепом у погрузочных ворот складского терминала",
    caption: ["Терминал Онеги", "Москва · Складской проезд, 7", "12 000 м² · 24 ворот"],
  },
  highway: {
    code: "F03",
    image: highway,
    alt: "Тягач Онеги с белым полуприцепом на трассе",
    caption: ["Магистральный рейс", "Москва → Екатеринбург", "1 771 км · 4–5 дней"],
  },
  warehouse: {
    code: "F05",
    image: warehouseRacks,
    alt: "Ричтрак между стеллажами с паллетами на складе Онеги",
    caption: ["Склад Онеги", "Москва · Складской проезд, 7", "Паллетное хранение · 6 ярусов"],
  },
  pallets: {
    code: "F02",
    image: pallets,
    alt: "Паллеты с коробками в стретч-плёнке, стянутые лентами, на складе",
    caption: ["Сборный груз", "Приёмка на складе", "Каждое место маркируется"],
  },
  loading: {
    code: "F04",
    image: loading,
    alt: "Сотрудник Онеги закатывает паллету в полуприцеп гидравлической тележкой",
    caption: ["Погрузка", "Терминал Онеги, Москва", "Пломба и фото груза"],
  },
};

export type PhotoKey = keyof typeof photos;
