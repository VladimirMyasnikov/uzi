/** Допустимые символы: латиница, цифры, дефис. Запрет ".." и пустой строки. */
const SLUG_REGEX = /^[a-z0-9а-яё-]+$/i;

export function isValidSlug(slug: string): boolean {
  if (!slug || slug.length > 200) return false;
  if (slug.includes("..")) return false;
  return SLUG_REGEX.test(slug);
}

/** Безопасное имя файла для загрузки: только basename, допустимые символы. */
export function sanitizeFileName(name: string): string {
  const basename = name.replace(/^.*[/\\]/, "").trim();
  if (!basename) return "";
  const safe = basename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return safe.length > 200 ? safe.slice(0, 200) : safe;
}

const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp"];

export function isAllowedImageExt(filename: string): boolean {
  const i = filename.lastIndexOf(".");
  const ext = i >= 0 ? filename.slice(i).toLowerCase() : "";
  return IMAGE_EXTS.includes(ext);
}
