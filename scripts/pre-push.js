#!/usr/bin/env node
/**
 * Pre-push: подчистка (lint --fix), обновление даты в документации,
 * проверка (lint, typecheck, build). При изменённых файлах — напоминание закоммитить.
 */
const { execSync, spawnSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const ROOT = path.resolve(__dirname, "..");
const ECHO_SITE = path.join(ROOT, "echo-site");

function run(cmd, opts = {}) {
  const [script, ...args] = cmd.split(/\s+/);
  const r = spawnSync(script, args, {
    shell: true,
    stdio: "inherit",
    cwd: opts.cwd || ROOT,
    env: { ...process.env, FORCE_COLOR: "1" },
  });
  if (r.status !== 0 && !opts.optional) {
    process.exit(r.status ?? 1);
  }
  return r;
}

function gitStatus() {
  const r = execSync("git status --porcelain", { encoding: "utf8", cwd: ROOT });
  return r.trim();
}

console.log("\n--- Pre-push: подчистка и проверки ---\n");

// 1) Подчистка: eslint --fix
console.log("1/5 Подчистка кода (eslint --fix)...");
run("npm run lint:fix", { cwd: ECHO_SITE });

// 2) Обновление даты в документации
console.log("2/5 Обновление документации (дата в README)...");
run("node scripts/docs-update.js", { cwd: ROOT });

const statusAfterClean = gitStatus();
if (statusAfterClean) {
  console.error("\n[pre-push] Есть незакоммиченные изменения после подчистки/обновления доков.");
  console.error("Закоммитьте их и снова выполните push:\n  git add -A && git commit -m \"chore: lint fix и обновление доков\"\n");
  process.exit(1);
}

// 3) Lint (проверка)
console.log("3/5 Lint (проверка)...");
run("npm run lint", { cwd: ECHO_SITE });

// 4) TypeScript
console.log("4/5 TypeScript (typecheck)...");
run("npm run typecheck", { cwd: ECHO_SITE });

// 5) Build (без GH_PAGES, чтобы не включался output: export и не падало на API)
console.log("5/5 Сборка (build)...");
const buildEnv = { ...process.env, FORCE_COLOR: "1", GH_PAGES: "" };
const rBuild = spawnSync("npm", ["run", "build"], {
  shell: true,
  stdio: "inherit",
  cwd: ECHO_SITE,
  env: buildEnv,
});
if (rBuild.status !== 0) {
  process.exit(rBuild.status ?? 1);
}

console.log("\n--- Pre-push: всё ок, можно пушить ---\n");
