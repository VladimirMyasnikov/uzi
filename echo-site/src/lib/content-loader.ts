import fs from "fs/promises";
import path from "path";
import { siteConfig } from "@/config/site";
import {
  servicesList as servicesFallback,
  specialsList as specialsFallback,
  faqList as faqFallback,
} from "@/config/data";
import type { SiteConfig, ServiceItem, SpecialItem, FaqItem } from "@/types/content";

let cachedContentRoot: string | null | undefined = undefined;

/** Возвращает путь к content-data или null, если папки нет (fallback на TS). */
export async function resolveContentRoot(): Promise<string | null> {
  if (cachedContentRoot !== undefined) return cachedContentRoot;

  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, "content-data"),
    path.join(cwd, "..", "content-data"),
    path.join(cwd, "echo-site", "content-data"),
  ];

  for (const candidate of candidates) {
    try {
      const stat = await fs.stat(candidate);
      if (stat.isDirectory()) {
        cachedContentRoot = candidate;
        return candidate;
      }
    } catch {
      // ignore
    }
  }

  cachedContentRoot = null;
  return null;
}

/** Путь к content-data для записи; создаёт папку при отсутствии. */
export async function ensureContentRootForWrite(): Promise<string> {
  const root = await resolveContentRoot();
  const dir = root ?? path.join(process.cwd(), "content-data");
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

async function readJsonSafe<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const root = await resolveContentRoot();
  if (root) {
    const data = await readJsonSafe<SiteConfig>(path.join(root, "site.json"));
    if (data?.name && data?.title && data?.description && data?.contacts) {
      return data;
    }
  }
  return {
    name: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    contacts: { ...siteConfig.contacts },
  };
}

export async function getServicesList(): Promise<ServiceItem[]> {
  const root = await resolveContentRoot();
  if (root) {
    const data = await readJsonSafe<ServiceItem[]>(path.join(root, "services.json"));
    if (Array.isArray(data) && data.every((x) => x?.slug && x?.title != null)) {
      return data;
    }
  }
  return servicesFallback.map((s) => ({
    slug: s.slug,
    title: s.title,
    desc: s.desc,
    steps: [...s.steps],
  }));
}

export async function getSpecialsList(): Promise<SpecialItem[]> {
  const root = await resolveContentRoot();
  if (root) {
    const data = await readJsonSafe<SpecialItem[]>(path.join(root, "specials.json"));
    if (Array.isArray(data) && data.every((x) => x?.title != null && x?.badge != null)) {
      return data;
    }
  }
  return specialsFallback.map((s) => ({ title: s.title, badge: s.badge }));
}

export async function getFaqList(): Promise<FaqItem[]> {
  const root = await resolveContentRoot();
  if (root) {
    const data = await readJsonSafe<FaqItem[]>(path.join(root, "faq.json"));
    if (Array.isArray(data) && data.every((x) => x?.q != null && x?.a != null)) {
      return data;
    }
  }
  return faqFallback.map((f) => ({ q: f.q, a: f.a }));
}
