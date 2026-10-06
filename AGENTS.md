# Онега

Демо-сайт вымышленной транспортной компании для портфолио Shvetsov Studio. Проект начат заново 06.10.2026; прежняя версия осталась в истории git (коммит 0a7759f).

## Направление

Главная собрана по образцу Craftcloud (craftcloud3d.com): продуктовый корпоративный сайт, понятный с первого экрана. Белая страница, светло-серые скруглённые блоки, синие кнопки, реальные фото.

- Палитра в `src/app/globals.css`: фон белый, серые блоки #F2F4F7, текст #1D2939, вторичный #475467, линии #EAECF0, кнопки и ссылки #0B4A8B, тёмный navy #0B2A4A для финального блока, orange #F26B1D только в стрелке маршрута и логотипе.
- Одна гарнитура Inter, заголовки 600. H1 44 px на десктопе и 32 px на телефоне, H2 36/28 px.
- Контейнер 1140 px. Скругления: кнопки и поля 8 px, карточки и фото 16 px, крупные блоки 32 px (20 px на телефоне).
- Мягкая тень только у «плавающих» карточек: цифры на первом экране, калькулятор.
- Порядок главной: первый экран с бейджем, галочками и двумя кнопками; карточка цифр внахлёст; «Как мы работаем» (3 карточки с номером в углу фото); «Почему Онега» (серый блок, фото и список с галочками); услуги с чередованием фото и текста; калькулятор; отзывы; склады; финальный тёмный блок с контактами.
- Иконки только из `src/components/Icon.tsx`, обводкой.
- Обычные поля с рамками, нативные `<select>` и `<dialog>`.
- Нельзя: реальные логотипы клиентов, отзывы с именами людей, анимации появления, градиенты кроме фона первого экрана.

## Правила

- Тексты на русском, деловой тон от лица компании. Без длинных тире и канцелярита. Компания и цифры вымышлены, плашка «Демо-проект Shvetsov Studio» обязательна.
- Тексты и данные в `src/content`, логика в `src/lib` с тестами Vitest.
- Каждая ссылка ведёт на существующую страницу или якорь (проверяет `tests/site.spec.ts`).
- Доступность: alt у картинок, подписи у полей, видимый фокус, контраст от 4.5:1, Escape и возврат фокуса у всплывающих слоёв.
- Перед коммитом: `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, браузерные тесты и скриншоты.

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.
