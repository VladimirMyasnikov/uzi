import { NextResponse } from "next/server";
import { requireSession } from "@/lib/admin/auth-utils";
import { getSiteConfig, ensureContentRootForWrite } from "@/lib/content-loader";
import type { SiteConfig } from "@/types/content";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  try {
    const config = await getSiteConfig();
    return NextResponse.json(config);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ошибка загрузки конфига";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  let body: SiteConfig;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Неверное тело запроса" }, { status: 400 });
  }

  if (!body?.name || !body?.title || !body?.description || !body?.contacts) {
    return NextResponse.json({ error: "Неполные данные конфига" }, { status: 400 });
  }

  try {
    const root = await ensureContentRootForWrite();
    const filePath = path.join(root, "site.json");
    await fs.writeFile(filePath, JSON.stringify(body, null, 2), "utf8");
    return NextResponse.json(body);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ошибка сохранения";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
