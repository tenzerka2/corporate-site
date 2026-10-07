# Онега

Демо-сайт вымышленной транспортной компании для портфолио Shvetsov Studio. Next.js 16, React 19, TypeScript, CSS Modules.

```sh
npm ci
npm run build
npm run start -- --port 3106
```

Проверки:

```sh
npm run lint
npx tsc --noEmit
npm test                  # тарифы, заявка, отслеживание, карта сайта; Vitest
npm run test:browser      # Playwright + axe, нужен запущенный сервер
```

Страницы: главная, `/services` и четыре услуги `/services/[slug]`, `/tariffs`, `/calculator`, `/tracking`, `/about`, `/warehouses`, `/contacts`, `/privacy`, страница 404.

Публикация: [демо](https://shvetsov.studio/work/onega) · [кейс](https://shvetsov.studio/cases/onega).

Для размещения внутри студии сборка выполняется с `NEXT_PUBLIC_BASE_PATH=/work/onega` и
`NEXT_PUBLIC_SITE_URL=https://shvetsov.studio/work/onega`. Runtime собирается в
`.next/standalone`; рядом нужны `public` и `.next/static`. Конфигурации Nginx и
systemd лежат в `scripts/deployment`. Сервис слушает только 127.0.0.1:3107.

Для проверки такой сборки: `ONEGA_URL=http://127.0.0.1:3107 ONEGA_BASE_PATH=/work/onega npm run test:browser`.

Структура:

- `src/app`: страницы и глобальные стили (`globals.css` с токенами и классами секций).
- `src/components`: шапка с выпадающими меню, подвал, калькулятор, окно заявки, отслеживание.
- `src/components/ui`: общие блоки страниц (Hero, Stats, Tabs, Faq, Story и другие).
- `src/content`: тексты, услуги, карта сайта (`navigation.ts`), города, фото.
- `src/lib`: тарифы (`tariff.ts`), правила заявки (`order.ts`), демо-отслеживание (`tracking.ts`).
- `src/assets/photos`: демонстрационные фотографии, WebP 1672 px.

Тарифы: расстояние по координатам × 1,25; сборный груз по зонам 800 / 2 000 / 4 000 км, большее из цены за кг и за м³, минимум 1 500 ₽; отдельная машина по ставке за км, машина подбирается по весу и объёму; забор и доставка до двери по 900 ₽, упаковка 12 %; срок: день на 600 км, сборному грузу ещё день.

Отслеживание в демо: из формы передаются номер, маршрут, тип перевозки и время создания. Они остаются в ссылке и доступны после обновления страницы. Имя, телефон и комментарий в ссылку не попадают. Для вручную введённых демонстрационных номеров маршрут и статусы вычисляются из номера. Формы не отправляют заявки перевозчику.
