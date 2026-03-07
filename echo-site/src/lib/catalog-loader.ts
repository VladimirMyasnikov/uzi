import fs from "fs/promises";
import path from "path";

export type CatalogProduct = {
  categorySlug: string;
  categoryTitle: string;
  productSlug: string;
  title: string;
  desc: string;
  images: string[];
  badge?: string;
  status?: string;
  thumb?: string;
};

export type CatalogCategory = {
  slug: string;
  title: string;
  productsCount: number;
};

let cachedCatalogRoot: string | null = null;

export async function resolveCatalogRoot(): Promise<string> {
  if (cachedCatalogRoot) return cachedCatalogRoot;

  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, "catalog-data"),
    path.join(cwd, "..", "catalog-data"),
    path.join(cwd, "echo-site", "catalog-data"),
  ];

  for (const candidate of candidates) {
    try {
      const stat = await fs.stat(candidate);
      if (stat.isDirectory()) {
        cachedCatalogRoot = candidate;
        return candidate;
      }
    } catch {
      // ignore missing/invalid path
    }
  }

  throw new Error(
    `Каталог данных не найден. Проверены пути: ${candidates
      .map((c) => `"${c}"`)
      .join(", ")}. Добавьте папку каталога или скорректируйте загрузчик.`
  );
}

async function readJsonSafe(filePath: string) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

async function readLocalImages(categoryDir: string, categorySlug: string, productSlug: string) {
  const productDir = path.join(categoryDir, productSlug);
  try {
    const files = await fs.readdir(productDir);
    return files
      .filter((file) => IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase()))
      .sort()
      .map((file) => `/images/${encodeURIComponent(categorySlug)}/${encodeURIComponent(productSlug)}/${encodeURIComponent(file)}`);
  } catch {
    return [];
  }
}

async function walkProducts(): Promise<CatalogProduct[]> {
  const catalogRoot = await resolveCatalogRoot();
  const categories = await fs.readdir(catalogRoot, { withFileTypes: true });
  const items: CatalogProduct[] = [];

  for (const cat of categories) {
    if (!cat.isDirectory()) continue;
    const categorySlug = cat.name;
    const categoryDir = path.join(catalogRoot, categorySlug);
    // products are nested as category/product/data.json
    const productDirs = await fs.readdir(categoryDir, { withFileTypes: true });
    for (const prodDir of productDirs) {
      if (!prodDir.isDirectory()) continue;
      const productSlug = prodDir.name;
      const dataPath = path.join(categoryDir, productSlug, "data.json");
      try {
        const data = await readJsonSafe(dataPath);
        const localImages = await readLocalImages(categoryDir, categorySlug, productSlug);
        const dataImages = Array.isArray(data.images) ? data.images.filter(Boolean) : [];
        const mergedImages = [...localImages, ...dataImages].filter((src, idx, arr) => arr.indexOf(src) === idx);
        items.push({
          categorySlug,
          categoryTitle: data.category || categorySlug,
          productSlug,
          title: data.product || productSlug,
          desc:
            (data.desc as string | undefined)?.trim() ||
            "Описание будет уточнено. Подготовлено на основе каталога.",
          images: mergedImages,
          thumb: mergedImages.length > 0 ? mergedImages[0] : undefined,
          badge: data.badge,
          status: data.status,
        });
      } catch {
        // skip broken entries
        continue;
      }
    }
  }

  return items;
}

export async function getCatalogCategories(): Promise<CatalogCategory[]> {
  const products = await walkProducts();
  const byCat = new Map<string, { title: string; count: number }>();

  for (const p of products) {
    const entry = byCat.get(p.categorySlug) || { title: p.categoryTitle, count: 0 };
    entry.count += 1;
    entry.title = p.categoryTitle || entry.title;
    byCat.set(p.categorySlug, entry);
  }

  return Array.from(byCat.entries())
    .map(([slug, { title, count }]) => ({
      slug,
      title,
      productsCount: count,
    }))
    .sort((a, b) => a.title.localeCompare(b.title, "ru"));
}

export async function getProductsByCategory(categorySlug: string): Promise<CatalogProduct[]> {
  const products = await walkProducts();
  return products
    .filter((p) => p.categorySlug === categorySlug)
    .map((p) => ({
      ...p,
      desc: `${p.desc}\n\nКраткое описание подготовлено на основе каталога.`,
    }));
}

export async function getProduct(categorySlug: string, productSlug: string): Promise<CatalogProduct | null> {
  const products = await walkProducts();
  const found = products.find((p) => p.categorySlug === categorySlug && p.productSlug === productSlug);
  if (!found) return null;
  return {
    ...found,
    desc: `${found.desc}\n\nИнформация уточняется при запросе КП.`,
  };
}

