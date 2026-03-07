import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { requireSession } from "@/lib/admin/auth-utils";
import { getFaqList, ensureContentRootForWrite } from "@/lib/content-loader";
import type { FaqItem } from "@/types/content";

function isValidFaqList(body: unknown): body is FaqItem[] {
  if (!Array.isArray(body)) return false;
  return body.every(
    (x) =>
      x &&
      typeof x === "object" &&
      typeof (x as FaqItem).q === "string" &&
      typeof (x as FaqItem).a === "string"
  );
}

export async function GET() {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;
  try {
    const list = await getFaqList();
    return NextResponse.json(list);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load FAQ" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;
  try {
    const body = await request.json();
    if (!isValidFaqList(body)) {
      return NextResponse.json(
        { error: "Invalid body: array of { q, a }" },
        { status: 400 }
      );
    }
    const root = await ensureContentRootForWrite();
    await fs.writeFile(
      path.join(root, "faq.json"),
      JSON.stringify(body, null, 2),
      "utf8"
    );
    return NextResponse.json(body);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to save FAQ" },
      { status: 500 }
    );
  }
}
