import { NextResponse } from "next/server";
import { requireSession } from "@/lib/admin/auth-utils";
import { resolveCatalogRoot } from "@/lib/catalog-loader";
import fs from "fs/promises";
import path from "path";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ error: "Slug не указан" }, { status: 400 });
  }

  try {
    const root = await resolveCatalogRoot();
    const categoryDir = path.join(root, slug);
    await fs.rm(categoryDir, { recursive: true });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ошибка удаления категории";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
