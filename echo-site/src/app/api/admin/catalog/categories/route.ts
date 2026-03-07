import { NextResponse } from "next/server";
import { getCatalogCategories, resolveCatalogRoot } from "@/lib/catalog-loader";
import { requireSession } from "@/lib/admin/auth-utils";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  try {
    const categories = await getCatalogCategories();
    return NextResponse.json({ categories });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ошибка загрузки категорий";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  let body: { slug?: string; title?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Неверное тело запроса" }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase().replace(/\s+/g, "-") : "";
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Недопустимый slug" }, { status: 400 });
  }

  try {
    const root = await resolveCatalogRoot();
    const categoryDir = path.join(root, slug);
    await fs.mkdir(categoryDir, { recursive: true });
    return NextResponse.json({ slug, title: body.title ?? slug });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ошибка создания категории";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
