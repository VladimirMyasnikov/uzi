# UZI — витрина УЗИ-оборудования

Витринный сайт для каталога УЗИ-оборудования и сервисных услуг (поставка, ремонт). Ориентирован на медицинские и ветеринарные клиники, сбор лидов через формы запроса КП.

**Репозиторий:** [github.com/VladimirMyasnikov/uzi](https://github.com/VladimirMyasnikov/uzi)  
_Последнее обновление репозитория: 2026-03-07_

---

## Состав проекта

| Часть | Описание |
|-------|----------|
| **echo-site/** | Next.js 16 приложение — основной сайт (каталог, услуги, контакты) |
| **echo-site/catalog-data/** | Данные каталога: категории, товары (JSON + изображения) |
| Корень | Зависимости для скрипта парсинга (axios, cheerio), конфиги Cursor |

---

## Быстрый старт

1. **Node.js 18+** — [nodejs.org](https://nodejs.org/) (LTS).
2. Запуск сайта:
   ```bash
   cd echo-site
   npm install
   npm run dev
   ```
3. В браузере: **http://localhost:3000**

Подробнее: [echo-site/README.md](echo-site/README.md).

---

## Стек

- **Сайт:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4.
- **Данные:** локальные JSON в `catalog-data`, чтение через fs (SSR).
- **Скрапер:** Node.js (axios, cheerio) — скрипт в `echo-site/scrape-catalog.js`.

---

## CI и pre-push

При каждом **push** (и в PR):

1. **GitHub Actions** (`.github/workflows/ci.yml`): установка зависимостей → `lint:fix` → `lint` → `typecheck` → `build` → проверка документации (`scripts/docs-check.js`).
2. **Локально (Husky)** перед push: скрипт `npm run prepush` — подчистка кода (eslint --fix), обновление даты в README, проверки lint/typecheck/build. Если после подчистки появились изменения — push блокируется, нужно закоммитить правки и пушить снова.

В корне один раз: `npm install` (подтянет Husky и повесит pre-push).

---

## Лицензия

Private. Использование по согласованию с правообладателем.
