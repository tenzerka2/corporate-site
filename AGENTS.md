# Онега Логистик

Демо-сайт вымышленной транспортной компании для портфолио Shvetsov Studio.
ТЗ: /root/onega-codex-prompts_1.md. Этапы выполняются по одному с браузерной проверкой.

- Все тексты на русском, спокойный деловой тон от лица компании «мы». Без длинных тире, канцелярита, «индивидуального подхода», «команды профессионалов», «широкого спектра услуг».
- Компания, контакты и цифры вымышленные. Не использовать реальные логотипы и отзывы с именами реальных людей. Обязательна плашка «Демо-проект Shvetsov Studio».
- Next.js App Router, TypeScript strict, Tailwind CSS, motion, lucide-react. Шрифт Inter 400/500/600/700, latin и cyrillic, next/font/google. Ресурсы сайта локальные.
- Логика калькулятора, тарифов и сроков в src/lib, покрыта vitest. Тексты и данные в src/content.
- Токены в src/styles/tokens.css. Общие компоненты в src/components/ui. Контейнеры 1172/1472, поля 24/16, адаптив 360–1920 px и шире без горизонтального скролла.
- У картинок alt, у иконок-кнопок aria-label, видимый клавиатурный фокус, контраст текста минимум 4.5:1. Светлые вторичные токены нельзя использовать для мелкого текста без проверки контраста.
- Всплывающие слои через портал с fixed, закрытие по Escape и клику вне, возврат фокуса. Модальные меню удерживают фокус.
- После каждого этапа: npm run lint, npx tsc --noEmit, npm test, npm run build. Проверка браузером и скриншоты обязательны, затем git commit.
- В отчёте список файлов и diff. Не менять соседние проекты.
- На этапе 1 страницы назначения явно помечены заглушками, отправка заявок и расчёт ещё не реализованы.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Уточнение визуального направления от 05.10.2026

Пользователь запросил фундаментальный строгий продукт и прислал Craftcloud и DigitalOcean. Это указание заменяет мягкую пастельную подачу из исходных промптов. Строгая геометрия, контрастная типографика, тёмно-синий предметный первый экран, технические изображения. Скругления контролов 4 px, карточек 8 px, первого экрана 0. Без подъёма карточек и декоративных плашек. Сборка одного предварительного рендера тягача перенесена вперёд для проверки направления, весь этап 2 этим не считается выполненным.
