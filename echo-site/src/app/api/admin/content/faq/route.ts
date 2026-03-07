import { NextResponse } from "next/server";
import { requireSession } from "@/lib/admin/auth-utils";
import { getFaqList, ensureContentRootForWrite } from "@/lib/content-loader";
import type { FaqItem } from "@/types/content";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  try {
    const list = await getFaqList();
    return NextResponse.json(list);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ошибка загрузки FAQ";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  let body: FaqItem[];
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Неверное тело запроса" }, { status: 400 });
  }

  if (!Array.isArray(body) || !body.every((x) => x?.q != null && x?.a != null)) {
    return NextResponse.json({ error: "Ожидается массив { q, a }" }, { status: 400 });
  }

  try {
    const root = await ensureContentRootForWrite();
    const filePath = path.join(root, "faq.json");
    await fs.writeFile(filePath, JSON.stringify(body, null, 2), "utf8");
    return NextResponse.json(body);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ошибка сохранения";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
