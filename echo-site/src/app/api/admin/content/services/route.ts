import { NextResponse } from "next/server";
import { requireSession } from "@/lib/admin/auth-utils";
import { getServicesList, ensureContentRootForWrite } from "@/lib/content-loader";
import type { ServiceItem } from "@/types/content";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  try {
    const list = await getServicesList();
    return NextResponse.json(list);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ошибка загрузки услуг";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  let body: ServiceItem[];
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Неверное тело запроса" }, { status: 400 });
  }

  if (!Array.isArray(body) || !body.every((x) => x?.slug != null && x?.title != null)) {
    return NextResponse.json({ error: "Ожидается массив { slug, title, ... }" }, { status: 400 });
  }

  try {
    const root = await ensureContentRootForWrite();
    const filePath = path.join(root, "services.json");
    await fs.writeFile(filePath, JSON.stringify(body, null, 2), "utf8");
    return NextResponse.json(body);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ошибка сохранения";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
