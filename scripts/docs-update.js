#!/usr/bin/env node
/**
 * Обновляет мета-информацию в документации (дата последнего обновления).
 * Вызывается из pre-push; изменения нужно закоммитить.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const README_PATH = path.join(ROOT, "README.md");

const DATE_PATTERN = /_Последнее обновление репозитория: \d{4}-\d{2}-\d{2}_/;
const NEW_LINE = `_Последнее обновление репозитория: ${new Date().toISOString().slice(0, 10)}_`;

function main() {
  if (!fs.existsSync(README_PATH)) return;

  let content = fs.readFileSync(README_PATH, "utf8");
  if (DATE_PATTERN.test(content)) {
    content = content.replace(DATE_PATTERN, NEW_LINE);
    fs.writeFileSync(README_PATH, content, "utf8");
    console.log("[docs-update] README: обновлена дата.");
  }
}

main();
