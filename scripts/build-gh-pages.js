#!/usr/bin/env node
/**
 * Сборка статического сайта для GitHub Pages.
 * 1) Копирует изображения каталога в public/uzi/images/
 * 2) Собирает Next.js с output: export (GH_PAGES=1)
 * 3) Копирует out/* в docs/ (корень репо)
 *
 * Запуск: node scripts/build-gh-pages.js (из корня репо)
 * После выполнения: закоммитьте папку docs/ и запушьте. В настройках репо
 * GitHub: Settings → Pages → Source: Deploy from a branch → Branch: main, Folder: /docs
 */
const { execSync, spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const ECHO_SITE = path.join(ROOT, "echo-site");
const CATALOG_DATA = path.join(ECHO_SITE, "catalog-data");
const PUBLIC_IMAGES = path.join(ECHO_SITE, "public", "uzi", "images");
const OUT = path.join(ECHO_SITE, "out");
const DOCS = path.join(ROOT, "docs");
const APP = path.join(ECHO_SITE, "src", "app");
const API_BACKUP = path.join(ROOT, ".gh-pages-api-backup");
const IMAGES_BACKUP = path.join(ROOT, ".gh-pages-images-backup");
const ACTIONS_BACKUP = path.join(ROOT, ".gh-pages-actions-backup");

const LOGIN_ACTIONS = path.join(APP, "(admin)", "admin", "login", "actions.ts");
const DASHBOARD_ACTIONS = path.join(APP, "(admin)", "admin", "(dashboard)", "actions.ts");

const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp"];

function hideApiAndImagesForExport() {
  const apiDir = path.join(APP, "api");
  const imagesDir = path.join(APP, "images");
  if (fs.existsSync(API_BACKUP)) fs.rmSync(API_BACKUP, { recursive: true });
  if (fs.existsSync(IMAGES_BACKUP)) fs.rmSync(IMAGES_BACKUP, { recursive: true });
  if (fs.existsSync(apiDir)) {
    fs.cpSync(apiDir, API_BACKUP, { recursive: true });
    fs.rmSync(apiDir, { recursive: true });
  }
  if (fs.existsSync(imagesDir)) {
    fs.cpSync(imagesDir, IMAGES_BACKUP, { recursive: true });
    fs.rmSync(imagesDir, { recursive: true });
  }
}

function restoreApiAndImages() {
  const apiDir = path.join(APP, "api");
  const imagesDir = path.join(APP, "images");
  if (fs.existsSync(API_BACKUP)) {
    fs.cpSync(API_BACKUP, apiDir, { recursive: true });
    fs.rmSync(API_BACKUP, { recursive: true });
  }
  if (fs.existsSync(IMAGES_BACKUP)) {
    fs.cpSync(IMAGES_BACKUP, imagesDir, { recursive: true });
    fs.rmSync(IMAGES_BACKUP, { recursive: true });
  }
}

function hideServerActionsForExport() {
  if (!fs.existsSync(ACTIONS_BACKUP)) fs.mkdirSync(ACTIONS_BACKUP, { recursive: true });
  if (fs.existsSync(LOGIN_ACTIONS)) {
    fs.copyFileSync(LOGIN_ACTIONS, path.join(ACTIONS_BACKUP, "login-actions.ts"));
    fs.writeFileSync(
      LOGIN_ACTIONS,
      "export type LoginState = { error?: string } | null;\n" +
        "export async function loginAction(_p: LoginState, _f: FormData): Promise<LoginState> { return null; }\n",
      "utf8"
    );
  }
  if (fs.existsSync(DASHBOARD_ACTIONS)) {
    fs.copyFileSync(DASHBOARD_ACTIONS, path.join(ACTIONS_BACKUP, "dashboard-actions.ts"));
    fs.writeFileSync(DASHBOARD_ACTIONS, "export async function signOutAction() {}\n", "utf8");
  }
}

function restoreServerActions() {
  if (fs.existsSync(path.join(ACTIONS_BACKUP, "login-actions.ts"))) {
    fs.copyFileSync(path.join(ACTIONS_BACKUP, "login-actions.ts"), LOGIN_ACTIONS);
  }
  if (fs.existsSync(path.join(ACTIONS_BACKUP, "dashboard-actions.ts"))) {
    fs.copyFileSync(path.join(ACTIONS_BACKUP, "dashboard-actions.ts"), DASHBOARD_ACTIONS);
  }
  if (fs.existsSync(ACTIONS_BACKUP)) {
    fs.rmSync(ACTIONS_BACKUP, { recursive: true });
  }
}

function mkdirp(dir) {
  if (!fs.existsSync(dir)) {
    mkdirp(path.dirname(dir));
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyCatalogImages() {
  if (!fs.existsSync(CATALOG_DATA)) {
    console.warn("Папка catalog-data не найдена, пропуск копирования изображений.");
    return;
  }
  console.log("1/5 Копирование изображений каталога в public/uzi/images/...");
  const categories = fs.readdirSync(CATALOG_DATA, { withFileTypes: true });
  let count = 0;
  for (const cat of categories) {
    if (!cat.isDirectory()) continue;
    const catPath = path.join(CATALOG_DATA, cat.name);
    const products = fs.readdirSync(catPath, { withFileTypes: true });
    for (const prod of products) {
      if (!prod.isDirectory()) continue;
      const prodPath = path.join(catPath, prod.name);
      const files = fs.readdirSync(prodPath);
      for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (!IMAGE_EXT.includes(ext)) continue;
        const destDir = path.join(PUBLIC_IMAGES, cat.name, prod.name);
        mkdirp(destDir);
        fs.copyFileSync(path.join(prodPath, file), path.join(destDir, file));
        count++;
      }
    }
  }
  console.log(`   Скопировано файлов: ${count}`);
}

function runBuild() {
  console.log("2/5 Временно скрываем app/api, app/images и server actions...");
  hideApiAndImagesForExport();
  hideServerActionsForExport();
  const nextDir = path.join(ECHO_SITE, ".next");
  if (fs.existsSync(nextDir)) {
    try {
      fs.rmSync(nextDir, { recursive: true, maxRetries: 3 });
    } catch (e) {
      if (process.platform === "win32") {
        execSync(`rmdir /s /q "${nextDir.replace(/\//g, "\\")}"`, { cwd: ECHO_SITE });
      } else {
        throw e;
      }
    }
  }
  console.log("3/5 Сборка Next.js (output: export)...");
  try {
    execSync("npm run build", {
      cwd: ECHO_SITE,
      stdio: "inherit",
      env: { ...process.env, GH_PAGES: "1", NEXT_PUBLIC_BASE_PATH: "/uzi" },
    });
  } catch (e) {
    restoreServerActions();
    restoreApiAndImages();
    process.exit(e.status ?? 1);
  }
  restoreServerActions();
  restoreApiAndImages();
}

function copyOutToDocs() {
  console.log("4/5 Копирование out/* в docs/...");
  if (!fs.existsSync(OUT)) {
    console.error("Папка out не найдена. Сборка могла завершиться с ошибкой.");
    process.exit(1);
  }
  if (fs.existsSync(DOCS)) {
    fs.rmSync(DOCS, { recursive: true });
  }
  fs.mkdirSync(DOCS, { recursive: true });
  const entries = fs.readdirSync(OUT, { withFileTypes: true });
  for (const e of entries) {
    const src = path.join(OUT, e.name);
    const dest = path.join(DOCS, e.name);
    if (e.isDirectory()) {
      fs.cpSync(src, dest, { recursive: true });
    } else {
      fs.copyFileSync(src, dest);
    }
  }
  // GitHub Pages по умолчанию использует Jekyll и игнорирует папки _*; без .nojekyll не отдаются _next, стили и скрипты
  fs.writeFileSync(path.join(DOCS, ".nojekyll"), "", "utf8");
  console.log("   Готово: docs/index.html, .nojekyll и др.");
}

function main() {
  console.log("\n--- Сборка для GitHub Pages ---\n");
  copyCatalogImages();
  runBuild();
  copyOutToDocs();
  console.log("\n5/5 Готово. Дальше:");
  console.log("   git add docs/");
  console.log("   git commit -m \"chore: обновить статику для GitHub Pages\"");
  console.log("   git push");
  console.log("\nВ репо: Settings → Pages → Source: Deploy from branch → master → /docs\n");
}

main();
