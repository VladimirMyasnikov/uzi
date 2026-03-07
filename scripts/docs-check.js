#!/usr/bin/env node
/**
 * Проверяет наличие и минимальную актуальность документации.
 * В CI при каждом push — обновляет дату в README и проверяет ключевые файлы.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const REQUIRED_FILES = [
  "README.md",
  "AGENTS.md",
  "echo-site/README.md",
];

const REQUIRED_README_SECTIONS = ["Быстрый старт", "Стек", "echo-site"];

function main() {
  let failed = false;

  for (const file of REQUIRED_FILES) {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) {
      console.error(`[docs-check] Отсутствует: ${file}`);
      failed = true;
    }
  }

  const readmePath = path.join(ROOT, "README.md");
  if (fs.existsSync(readmePath)) {
    const content = fs.readFileSync(readmePath, "utf8");
    for (const section of REQUIRED_README_SECTIONS) {
      if (!content.includes(section)) {
        console.error(`[docs-check] В README.md нет упоминания: ${section}`);
        failed = true;
      }
    }
  }

  if (failed) {
    process.exit(1);
  }

  console.log("[docs-check] Документация в порядке.");
}

main();
