import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { requireSession } from "@/lib/admin/auth-utils";
import { getSpecialsList, ensureContentRootForWrite } from "@/lib/content-loader";
import type { SpecialItem } from "@/types/content";

function isValidSpecialsList(body: unknown): body is SpecialItem[] {
  if (!Array.isArray(body)) return false;
  return body.every(
    (x) =>
      x &&
      typeof x === "object" &&
      typeof (x as SpecialItem).title === "string" &&
      typeof (x as SpecialItem).badge === "string"
  );
}

export async function GET() {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;
  try {
    const list = await getSpecialsList();
    return NextResponse.json(list);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load specials" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;
  try {
    const body = await request.json();
    if (!isValidSpecialsList(body)) {
      return NextResponse.json(
        { error: "Invalid body: array of { title, badge }" },
        { status: 400 }
      );
    }
    const root = await ensureContentRootForWrite();
    await fs.writeFile(
      path.join(root, "specials.json"),
      JSON.stringify(body, null, 2),
      "utf8"
    );
    return NextResponse.json(body);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to save specials" },
      { status: 500 }
    );
  }
}
