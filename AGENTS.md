# Контекст проекта для агента (Cursor)

## Что это за проект

**uzi** — витринный сайт для каталога УЗИ-оборудования и сервисных услуг (поставка, ремонт). Целевая аудитория: медицинские и ветеринарные клиники. Сбор лидов через формы запроса КП.

- Основное приложение: **echo-site/** (Next.js 16, App Router, React 19, TypeScript, Tailwind CSS 4).
- Данные каталога: **echo-site/catalog-data/** — папки категорий и товаров, в каждой товара папке `data.json` и изображения (jpg/png/webp).
- Изображения отдаются через маршрут `/images/[...path]` (Route Handler, fs).

## Где что лежит

- **Страницы:** `echo-site/src/app/` (главная, каталог, услуги, контакты, FAQ, новости, спецпредложения).
- **Компоненты:** `echo-site/src/components/` (header, footer, галерея товара, theme-provider).
- **Конфиги:** `echo-site/src/config/` (site, data, themes).
- **Логика каталога:** `echo-site/src/lib/catalog-loader.ts` (resolveCatalogRoot, getCatalogCategories, getProductsByCategory, getProduct; изображения — по пути категория/товар/файл).
- **Скрапер каталога:** `echo-site/scrape-catalog.js` (зависимости в корневом package.json: axios, cheerio).

## Как запустить

```bash
cd echo-site
npm install
npm run dev
```

Открыть http://localhost:3000.

## Стиль кода и соглашения

- Алиасы импорта: `@/` от `echo-site/src`.
- Файлы/папки маршрутов: kebab-case; компоненты: PascalCase; переменные/функции: camelCase.
- Клиентские компоненты: первая строка `"use client"`.
- Типы для пропсов и данных, без `any`. Tailwind + CSS-переменные для тем.

Подробные правила — в `.cursorrules` и `.cursor/rules/rull.mdc`.
