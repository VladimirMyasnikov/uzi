// Скрипт парсит внешний каталог и складывает данные/картинки в папку catalog-data
// Зависимости: axios, cheerio (установите: npm install axios cheerio)
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs/promises");
const path = require("path");

const ROOT = "https://example.com";
const START_URL = `${ROOT}/catalog/`;
const OUT_DIR = path.join(__dirname, "catalog-data");

async function fetchHtml(url) {
  const res = await axios.get(url, { timeout: 20000 });
  return res.data;
}

async function downloadFile(url, destPath) {
  const res = await axios.get(url, { responseType: "arraybuffer", timeout: 30000 });
  await fs.mkdir(path.dirname(destPath), { recursive: true });
  await fs.writeFile(destPath, res.data);
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9а-яё\-_\s]/gi, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "item";
}

async function scrapeCategoryLinks() {
  const html = await fetchHtml(START_URL);
  const $ = cheerio.load(html);
  const links = new Set();

  $("a").each((_, el) => {
    const href = $(el).attr("href");
    const text = $(el).text().trim();
    if (!href || !href.includes("/catalog/")) return;
    // исключаем якоря/почту/тел
    if (href.startsWith("mailto:") || href.startsWith("tel:")) return;
    const full = href.startsWith("http") ? href : ROOT + href;
    const parts = full.split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    // пропускаем сам корневой каталог
    if (!last || last === "catalog") return;
    links.add(JSON.stringify({ url: full, title: text || last }));
  });

  return Array.from(links).map((s) => JSON.parse(s));
}

async function scrapeProductList(catUrl) {
  const html = await fetchHtml(catUrl);
  const $ = cheerio.load(html);
  const products = new Set();

  $("a").each((_, el) => {
    const href = $(el).attr("href");
    const text = $(el).text().trim();
    if (!href || !href.includes("/catalog/")) return;
    if (href.startsWith("mailto:") || href.startsWith("tel:")) return;
    const full = href.startsWith("http") ? href : ROOT + href;
    // фильтруем страницы самой категории
    if (full === catUrl || full === `${catUrl}/`) return;
    const parts = full.split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    if (!last || last === "catalog") return;
    products.add(JSON.stringify({ url: full, title: text || last }));
  });

  return Array.from(products).map((s) => JSON.parse(s));
}

async function scrapeProduct(productUrl) {
  const html = await fetchHtml(productUrl);
  const $ = cheerio.load(html);
  const title = $("h1").first().text().trim() || productUrl;
  const paragraphs = $("p")
    .map((_, e) => $(e).text().trim())
    .get()
    .filter(Boolean);
  // Собираем таблицы характеристик в виде текстовых строк
  const tables = $("table")
    .map((_, t) => {
      const rows = [];
      $(t)
        .find("tr")
        .each((_, tr) => {
          const cells = $(tr)
            .find("th,td")
            .map((_, c) => $(c).text().trim())
            .get()
            .filter(Boolean);
          if (cells.length) rows.push(cells.join(" | "));
        });
      return rows.join("\n");
    })
    .get()
    .filter(Boolean);
  const desc = [...tables, ...paragraphs].join("\n\n").slice(0, 6000);

  const images = [];
  // Картинки из галереи lightbox
  $('a[data-lightbox="photo"]').each((_, a) => {
    const href = $(a).attr("href");
    if (href && href.includes("/upload/")) {
      const full = href.startsWith("http") ? href : ROOT + href;
      if (!images.includes(full)) images.push(full);
    }
    const style = $(a).attr("style") || "";
    const m = style.match(/url\\(['"]?(.*?)['"]?\\)/i);
    if (m && m[1] && m[1].includes("/upload/")) {
      const full = m[1].startsWith("http") ? m[1] : ROOT + m[1];
      if (!images.includes(full)) images.push(full);
    }
  });
  // Дополнительно берем <img>, но только из /upload/
  $("img").each((_, img) => {
    const src = $(img).attr("src");
    if (!src || src.startsWith("data:")) return;
    if (!src.includes("/upload/")) return;
    const full = src.startsWith("http") ? src : ROOT + src;
    if (!images.includes(full)) images.push(full);
  });

  return { title, desc, images };
}

async function main() {
  console.log("Начинаю парсинг", START_URL);
  await fs.rm(OUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUT_DIR, { recursive: true });

  const categories = await scrapeCategoryLinks();
  console.log("Категорий найдено:", categories.length);

  for (const cat of categories) {
    const catSlug = slugify(cat.title) || slugify(cat.url.split("/").pop());
    const catDir = path.join(OUT_DIR, catSlug);
    await fs.mkdir(catDir, { recursive: true });

    const products = await scrapeProductList(cat.url);
    console.log(`Категория ${catSlug}: товаров найдено ${products.length}`);

    for (const prod of products) {
      const prodSlug = slugify(prod.title) || slugify(prod.url.split("/").pop());
      const prodDir = path.join(catDir, prodSlug);
      await fs.mkdir(prodDir, { recursive: true });
      try {
        const details = await scrapeProduct(prod.url);
        const data = {
          category: cat.title,
          product: details.title,
          url: prod.url,
          desc: details.desc,
          images: details.images,
        };
        await fs.writeFile(path.join(prodDir, "data.json"), JSON.stringify(data, null, 2), "utf8");

        // качаем до 3 картинок
        for (const [idx, imgUrl] of details.images.slice(0, 3).entries()) {
          const u = new URL(imgUrl);
          const ext = path.extname(u.pathname) || ".jpg";
          const filePath = path.join(prodDir, `img-${idx + 1}${ext}`);
          await downloadFile(imgUrl, filePath);
        }
      } catch (err) {
        console.error("Ошибка товара", prod.url, err?.message);
      }
    }
  }

  console.log("Готово. Данные в папке", OUT_DIR);
}

main().catch((err) => {
  console.error("Ошибка парсинга:", err);
  process.exit(1);
});

