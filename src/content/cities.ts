// Cities served by the fictional company. Coordinates are real (WGS 84).
export const cities = [
  { id: "moscow", name: "Москва", lat: 55.7558, lon: 37.6173, warehouse: true },
  { id: "spb", name: "Санкт-Петербург", lat: 59.9386, lon: 30.3141, warehouse: true },
  { id: "kazan", name: "Казань", lat: 55.7963, lon: 49.1088, warehouse: true },
  { id: "krasnodar", name: "Краснодар", lat: 45.0355, lon: 38.9753, warehouse: true },
  { id: "ekaterinburg", name: "Екатеринбург", lat: 56.8389, lon: 60.6057, warehouse: true },
  { id: "novosibirsk", name: "Новосибирск", lat: 55.0302, lon: 82.9204, warehouse: true },
  { id: "nizhny", name: "Нижний Новгород", lat: 56.3269, lon: 44.0059, warehouse: false },
  { id: "samara", name: "Самара", lat: 53.1959, lon: 50.1002, warehouse: false },
  { id: "voronezh", name: "Воронеж", lat: 51.6608, lon: 39.2003, warehouse: false },
  { id: "rostov", name: "Ростов-на-Дону", lat: 47.2357, lon: 39.7015, warehouse: false },
  { id: "ufa", name: "Уфа", lat: 54.7388, lon: 55.9721, warehouse: false },
  { id: "perm", name: "Пермь", lat: 58.0105, lon: 56.2502, warehouse: false },
  { id: "chelyabinsk", name: "Челябинск", lat: 55.1644, lon: 61.4368, warehouse: false },
  { id: "tyumen", name: "Тюмень", lat: 57.1522, lon: 65.5272, warehouse: false },
  { id: "omsk", name: "Омск", lat: 54.9885, lon: 73.3242, warehouse: false },
  { id: "krasnoyarsk", name: "Красноярск", lat: 56.0153, lon: 92.8932, warehouse: false },
  { id: "irkutsk", name: "Иркутск", lat: 52.2869, lon: 104.305, warehouse: false },
  { id: "vladivostok", name: "Владивосток", lat: 43.1155, lon: 131.8855, warehouse: false },
] as const;

export type City = (typeof cities)[number];
export type CityId = City["id"];

export function city(id: CityId): City {
  return cities.find((item) => item.id === id)!;
}
