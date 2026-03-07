# Контекст проекта для агента (Cursor)

## Что это за проект

**uzi** — витринный сайт для каталога УЗИ-оборудования и сервисных услуг (поставка, ремонт). Целевая аудитория: медицинские и ветеринарные клиники. Сбор лидов через формы запроса КП.

- Основное приложение: **echo-site/** (Next.js 16, App Router, React 19, TypeScript, Tailwind CSS 4).
- Данные каталога: **echo-site/catalog-data/** — папки категорий и товаров, в каждой товара папке `data.json` и изображения (jpg/png/webp).
- Изображения отдаются через маршрут `/images/[...path]` (Route Handler, fs).
- **Админ-панель:** маршруты `/admin`, `/admin/login`, `/admin/catalog` (категории, товары, изображения), `/admin/content` (Контакты, Услуги, Акции, FAQ). Авторизация: Auth.js v5 Credentials, переменные `AUTH_SECRET` и `ADMIN_PASSWORD` в `.env.local`. Контент сайта хранится в `echo-site/content-data/*.json`; при отсутствии файлов используется fallback из `config/site.ts` и `config/data.ts` (загрузчик: `src/lib/content-loader.ts`).

## Где что лежит

- **Страницы:** `echo-site/src/app/` (главная, каталог, услуги, контакты, FAQ, новости, спецпредложения).
- **Админка:** `echo-site/src/app/(admin)/admin/` — дашборд, вход (`/admin/login`), каталог (категории → товары → редактирование), контент (`/admin/content` → Контакты, Услуги, Акции, FAQ). Вход через server action `loginAction` + `useFormState`; выход — `signOutAction`. API: `src/app/api/admin/catalog/`, `src/app/api/admin/content/` (site, services, specials, faq), авторизация: `src/app/api/auth/[...nextauth]/`. На маршрутах `/admin/*` хедер/футер сайта не показываются (`LayoutContent` по `usePathname()`).
- **Компоненты:** `echo-site/src/components/` (header, footer, галерея товара, theme-provider, layout-content).
- **Конфиги:** `echo-site/src/config/` (site, data, themes).
- **Логика каталога:** `echo-site/src/lib/catalog-loader.ts` (чтение). Запись из админки: `echo-site/src/lib/admin/catalog-fs.ts`, валидация slug: `lib/admin/slug.ts`, защита API: `lib/admin/auth-utils.ts`.
- **Контент сайта:** `echo-site/src/lib/content-loader.ts` — чтение из `content-data/*.json` с fallback на `config/site.ts` и `config/data.ts`. Типы: `src/types/content.ts`. Запись через API `PUT /api/admin/content/site|services|specials|faq`.
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
