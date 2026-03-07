import fs from "fs/promises";
import path from "path";
import { resolveCatalogRoot } from "@/lib/catalog-loader";
import type { ProductDataJson } from "@/types/catalog";
import { isValidSlug, sanitizeFileName, isAllowedImageExt } from "./slug";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

function assertInsideCatalogRoot(resolved: string, catalogRoot: string): void {
  const normalized = path.normalize(resolved);
  if (!normalized.startsWith(path.normalize(catalogRoot))) {
    throw new Error("Path outside catalog root");
  }
}

export async function resolveCategoryDir(categorySlug: string): Promise<string> {
  if (!isValidSlug(categorySlug)) throw new Error("Invalid category slug");
  const root = await resolveCatalogRoot();
  const dir = path.join(root, categorySlug);
  assertInsideCatalogRoot(dir, root);
  return path.normalize(dir);
}

export async function resolveProductDir(
  categorySlug: string,
  productSlug: string
): Promise<string> {
  if (!isValidSlug(categorySlug) || !isValidSlug(productSlug)) {
    throw new Error("Invalid category or product slug");
  }
  const root = await resolveCatalogRoot();
  const dir = path.join(root, categorySlug, productSlug);
  assertInsideCatalogRoot(dir, root);
  return path.normalize(dir);
}

export async function readProductData(
  categorySlug: string,
  productSlug: string
): Promise<ProductDataJson | null> {
  const productDir = await resolveProductDir(categorySlug, productSlug);
  const dataPath = path.join(productDir, "data.json");
  try {
    const raw = await fs.readFile(dataPath, "utf8");
    return JSON.parse(raw) as ProductDataJson;
  } catch {
    return null;
  }
}

export async function writeProductData(
  categorySlug: string,
  productSlug: string,
  data: ProductDataJson
): Promise<void> {
  const productDir = await resolveProductDir(categorySlug, productSlug);
  const dataPath = path.join(productDir, "data.json");
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2), "utf8");
}

export async function createCategory(categorySlug: string): Promise<void> {
  const dir = await resolveCategoryDir(categorySlug);
  await fs.mkdir(dir, { recursive: true });
}

export async function deleteCategory(categorySlug: string): Promise<void> {
  const dir = await resolveCategoryDir(categorySlug);
  await fs.rm(dir, { recursive: true });
}

export async function createProduct(
  categorySlug: string,
  productSlug: string,
  data: ProductDataJson
): Promise<void> {
  const productDir = await resolveProductDir(categorySlug, productSlug);
  await fs.mkdir(productDir, { recursive: true });
  await writeProductData(categorySlug, productSlug, data);
}

export async function updateProduct(
  categorySlug: string,
  productSlug: string,
  data: ProductDataJson
): Promise<void> {
  await writeProductData(categorySlug, productSlug, data);
}

export async function deleteProduct(
  categorySlug: string,
  productSlug: string
): Promise<void> {
  const productDir = await resolveProductDir(categorySlug, productSlug);
  await fs.rm(productDir, { recursive: true });
}

export async function listProductImageFiles(
  categorySlug: string,
  productSlug: string
): Promise<string[]> {
  const productDir = await resolveProductDir(categorySlug, productSlug);
  try {
    const files = await fs.readdir(productDir);
    return files.filter((f) =>
      IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase())
    );
  } catch {
    return [];
  }
}

const MAX_IMAGE_SIZE = 8 * 1024 * 1024; // 8 MB

export async function uploadProductImage(
  categorySlug: string,
  productSlug: string,
  file: File
): Promise<string> {
  const name = file.name;
  const ext = path.extname(name).toLowerCase();
  if (!IMAGE_EXTENSIONS.includes(ext)) {
    throw new Error("Invalid image type");
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("File too large");
  }
  const safeName = sanitizeFileName(name) || `image-${Date.now()}${ext}`;
  const productDir = await resolveProductDir(categorySlug, productSlug);
  const filePath = path.join(productDir, safeName);
  assertInsideCatalogRoot(filePath, await resolveCatalogRoot());
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);
  return `/images/${encodeURIComponent(categorySlug)}/${encodeURIComponent(productSlug)}/${encodeURIComponent(safeName)}`;
}

export async function deleteProductImage(
  categorySlug: string,
  productSlug: string,
  filename: string
): Promise<void> {
  if (filename.includes("..") || !isAllowedImageExt(filename)) {
    throw new Error("Invalid filename");
  }
  const safeName = sanitizeFileName(filename) || filename;
  const productDir = await resolveProductDir(categorySlug, productSlug);
  const filePath = path.join(productDir, safeName);
  assertInsideCatalogRoot(filePath, await resolveCatalogRoot());
  await fs.unlink(filePath).catch(() => {});
  const data = await readProductData(categorySlug, productSlug);
  if (data?.images) {
    const urlToRemove = `/images/${encodeURIComponent(categorySlug)}/${encodeURIComponent(productSlug)}/${encodeURIComponent(safeName)}`;
    const next = data.images.filter((u) => u !== urlToRemove);
    await writeProductData(categorySlug, productSlug, {
      ...data,
      images: next.length ? next : undefined,
    });
  }
}
