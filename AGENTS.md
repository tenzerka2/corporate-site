# Онега

Демо-сайт вымышленной транспортной компании для портфолио Shvetsov Studio. Проект начат заново 06.10.2026; прежняя версия осталась в истории git (коммит 0a7759f).

## Направление

Спокойный дорогой сайт крупной транспортной компании. Дизайн почти незаметен: структура, реальный контент и документальные фото. Не SaaS-лендинг и не «дизайнерская» редакционная подача.

- Палитра в `src/app/globals.css`: фон #F4F4F0, белые подложки секций, текст #111111, вторичный #666660, линии #D3D3CC, navy #0B2A4A для кнопок и ссылок, orange #F26B1D только точечно (стрелка маршрута). Navy-фоном только подвал.
- Одна гарнитура Inter. Иерархия размером: заголовок первого экрана 64–76 px на десктопе и 42–48 px на телефоне, вес 500.
- Сетка 12 колонок, контейнер 1392 px. Одна система на тип блока, без новых композиций ради разнообразия.
- Скругления до 3 px, теней нет, фото прямоугольные. Подпись к фото только если она добавляет контекст.
- Обычные поля с рамками, нативные `<select>` и `<dialog>`.
- Запрещено: номера перед каждой секцией, строки метаданных прописными, декоративные линейки, карточки-фичи, чек-листы, ряды иконок, градиенты, тени, анимации появления.

## Правила

- Тексты на русском, деловой тон от лица компании. Без длинных тире и канцелярита. Компания и цифры вымышлены, плашка «Демо-проект Shvetsov Studio» обязательна.
- Тексты и данные в `src/content`, логика в `src/lib` с тестами Vitest.
- Каждая ссылка ведёт на существующую страницу или якорь (проверяет `tests/site.spec.ts`).
- Доступность: alt у картинок, подписи у полей, видимый фокус, контраст от 4.5:1, Escape и возврат фокуса у всплывающих слоёв.
- Перед коммитом: `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, браузерные тесты и скриншоты.

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.
