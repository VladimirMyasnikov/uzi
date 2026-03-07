# Как опубликовать сайт на GitHub Pages

## Шаг 1. Собрать статику

В **корне репозитория** (папка `uzi`, не `echo-site`) выполните:

```bash
node scripts/build-gh-pages.js
```

Скрипт создаст папку **`docs`** с готовым сайтом.

## Шаг 2. Закоммитить и запушить

```bash
git add docs/
git commit -m "chore: статика для GitHub Pages"
git push
```

## Шаг 3. Включить GitHub Pages на GitHub

1. Откройте репозиторий на GitHub.
2. **Settings** → **Pages** (в левом меню).
3. В блоке **Build and deployment**:
   - **Source:** Deploy from a branch
   - **Branch:** `master` (или `main`, если у вас основная ветка так называется)
   - **Folder:** **docs** (обязательно выберите папку `/docs`, не root).
4. Нажмите **Save**.

Через 1–2 минуты сайт будет доступен по адресу:

**https://vladimirmyasnikov.github.io/uzi/**

(замените `vladimirmyasnikov` на ваш логин GitHub, если репозиторий называется `uzi`).

---

При следующих изменениях сайта снова выполните шаги 1 и 2 (сборка → коммит `docs/` → пуш).
