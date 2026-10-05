// Coordinates: Natural Earth populated places 1:10m. Delivery times are calculated in src/lib/routes.ts.
export const cities = [
  {
    "id": "moscow",
    "name": "Москва",
    "latitude": 55.75411,
    "longitude": 37.613577,
    "x": 199.6,
    "y": 274.0,
    "warehouse": true
  },
  {
    "id": "saint-petersburg",
    "name": "Санкт-Петербург",
    "latitude": 59.94096,
    "longitude": 30.314074,
    "x": 220.5,
    "y": 191.3,
    "warehouse": true
  },
  {
    "id": "nizhny-novgorod",
    "name": "Нижний Новгород",
    "latitude": 56.334953,
    "longitude": 43.998149,
    "x": 239.9,
    "y": 309.0,
    "warehouse": false
  },
  {
    "id": "kazan",
    "name": "Казань",
    "latitude": 55.751888,
    "longitude": 49.124399,
    "x": 263.2,
    "y": 345.4,
    "warehouse": true
  },
  {
    "id": "samara",
    "name": "Самара",
    "latitude": 53.196953,
    "longitude": 50.149349,
    "x": 243.5,
    "y": 379.5,
    "warehouse": false
  },
  {
    "id": "voronezh",
    "name": "Воронеж",
    "latitude": 51.731927,
    "longitude": 39.26805,
    "x": 160.5,
    "y": 322.2,
    "warehouse": false
  },
  {
    "id": "rostov",
    "name": "Ростов-на-Дону",
    "latitude": 47.236594,
    "longitude": 39.71071,
    "x": 110.8,
    "y": 367.1,
    "warehouse": false
  },
  {
    "id": "krasnodar",
    "name": "Краснодар",
    "latitude": 45.019977,
    "longitude": 39.000038,
    "x": 80.5,
    "y": 381.5,
    "warehouse": true
  },
  {
    "id": "ekaterinburg",
    "name": "Екатеринбург",
    "latitude": 56.851976,
    "longitude": 60.598014,
    "x": 347.0,
    "y": 390.9,
    "warehouse": true
  },
  {
    "id": "chelyabinsk",
    "name": "Челябинск",
    "latitude": 55.156937,
    "longitude": 61.436722,
    "x": 338.8,
    "y": 416.1,
    "warehouse": false
  },
  {
    "id": "perm",
    "name": "Пермь",
    "latitude": 58.001906,
    "longitude": 56.248047,
    "x": 328.9,
    "y": 356.7,
    "warehouse": false
  },
  {
    "id": "ufa",
    "name": "Уфа",
    "latitude": 54.791921,
    "longitude": 56.038085,
    "x": 298.2,
    "y": 394.2,
    "warehouse": false
  },
  {
    "id": "tyumen",
    "name": "Тюмень",
    "latitude": 57.140012,
    "longitude": 65.529995,
    "x": 383.1,
    "y": 407.9,
    "warehouse": false
  },
  {
    "id": "omsk",
    "name": "Омск",
    "latitude": 54.991934,
    "longitude": 73.398008,
    "x": 427.1,
    "y": 465.5,
    "warehouse": false
  },
  {
    "id": "novosibirsk",
    "name": "Новосибирск",
    "latitude": 55.031906,
    "longitude": 82.958096,
    "x": 504.1,
    "y": 490.7,
    "warehouse": true
  },
  {
    "id": "krasnoyarsk",
    "name": "Красноярск",
    "latitude": 56.015929,
    "longitude": 92.864055,
    "x": 588.3,
    "y": 491.0,
    "warehouse": false
  },
  {
    "id": "irkutsk",
    "name": "Иркутск",
    "latitude": 52.319971,
    "longitude": 104.245048,
    "x": 685.6,
    "y": 548.5,
    "warehouse": false
  },
  {
    "id": "vladivostok",
    "name": "Владивосток",
    "latitude": 43.130015,
    "longitude": 131.910026,
    "x": 988.4,
    "y": 603.1,
    "warehouse": false
  }
] as const;
export type City = (typeof cities)[number];
