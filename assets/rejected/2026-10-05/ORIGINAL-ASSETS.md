# Визуальная система, этап 2

Готовые материалы: `/visuals`. Компания, люди, парк и сроки доставки вымышлены.

## Изображения

- `public/images/renders/hero.png`: нативный Cycles 3840×2400, прозрачный фон, техническая и предметная половины. WebP 1600 px.
- `public/images/renders/{groupage,ftl,warehouse,marketplaces}.png`: Cycles 1600×1200, прозрачный фон. WebP до 200 000 байт.
- `public/images/illustrations/`: три авторских SVG 480×360.
- `public/images/industries/`: восемь авторских SVG 48×48, линия 1.5 px.
- `public/images/photos/`: 12 сюжетов, каждый в 16:9 и 4:5. WebP 1920 px по длинной стороне, до 350 000 байт.
- `public/images/photos/source/`: неизменённые результаты встроенного image_gen и JPEG-мастера 3840 px. Генератор вернул 1672×941 для горизонтальных изображений и 1122×1402 для двух вертикальных. Мастера увеличены Lanczos, это не нативная генерация 4K. Исходные размеры каждого файла записаны в `artifacts/stage-2/photo-exports.json`.
- Логотипы наложены программно в перспективе, как запрошено в ТЗ. Мобильные варианты команды и автопарка сгенерированы отдельно; остальные аккуратно кадрированы.
- `public/images/og.png`: обложка 1200×630.
- Контактные листы: `public/images/contact-sheet.png`, `public/images/photos/contact-sheet.png`, `public/images/photos/contact-sheet-portrait.png`.

Фотографии созданы встроенным image_gen, без внешнего API. Сохранённые промпты первых четырёх кадров: `artifacts/stage-2/photo-prompts.json`. Промпты руководителя, команды и двух мобильных вариантов лежат рядом в `*-prompt.txt`. Точные промпты шести кадров из прерванной сессии в файлах не сохранились; соответствующие оригиналы сохранены. Общий стиль: editorial commercial photography, natural light, cool tones, navy uniforms, orange reflective strips, no third-party brands.

## Карта

Источник контура: [Natural Earth Admin 0, масштаб 1:50m](https://www.naturalearthdata.com/downloads/50m-cultural-vectors/50m-admin-0-countries-2/).
Координаты городов: [Natural Earth populated places, 1:10m](https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-populated-places/).
Данные [public domain](https://www.naturalearthdata.com/about/terms-of-use/).

Проекция Albers, параллели 50° и 70° с. ш., центральный меридиан 100° в. д., упрощение с допуском 4.2 км. Контур менее 100 КБ. 18 городов, 6 складов, пять дуг от Москвы к остальным складам. Выбранный город получает собственную подсвеченную дугу. Сроки демонстрационные и не являются действующими тарифами.

## Воспроизведение

Blender 5.2 LTS, Cycles CPU. Сначала `scripts/blender/tractor.py`, затем `scripts/blender/services.py`, `scripts/blender/blueprint-4k.py`. Экспорт WebP и контактного листа: `node scripts/export-assets.mjs`.

SVG: `node scripts/vector-assets.mjs`.
Фото: Python с Pillow, NumPy, fonttools и brotli, `scripts/brand-photos.py`. Нужна собранная `.next/static/media` с Inter. Оригиналы image_gen уже лежат в репозитории.
Карта: Python с pyproj и shapely, `scripts/geo/build-map.py`. Входные GeoJSON кэшированы в `artifacts/stage-2/`.

Генерация фотографий не полностью воспроизводима: новая генерация по тому же промпту даст другой кадр. Компоновка, логотипы, кадрирование и экспорт воспроизводимы по сохранённым исходникам.

Готовые WebP рендеров отдаются через `next/image` с `unoptimized`: они уже сжаты офлайн и не требуют повторного кодирования сервером. Это также устраняет зависавшие запросы к оптимизатору при смене размеров галереи в проверочном Chromium. Фото галереи используют отдельный мобильный источник через `picture`.

После визуального замечания пользователя изометрические рисунки процесса отклонены. На главной вместо них используются `logistics-office.webp`, `loading.webp` и `customer-handover.webp`. Рисунки сняты с галереи и общего контактного листа; исходные SVG сохранены как история разработки.
