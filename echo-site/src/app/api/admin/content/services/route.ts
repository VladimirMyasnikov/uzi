import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { requireSession } from "@/lib/admin/auth-utils";
import { getServicesList, ensureContentRootForWrite } from "@/lib/content-loader";
import type { ServiceItem } from "@/types/content";

function isValidServicesList(body: unknown): body is ServiceItem[] {
  if (!Array.isArray(body)) return false;
  return body.every(
    (x) =>
      x &&
      typeof x === "object" &&
      typeof (x as ServiceItem).slug === "string" &&
      typeof (x as ServiceItem).title === "string" &&
      typeof (x as ServiceItem).desc === "string" &&
      Array.isArray((x as ServiceItem).steps) &&
      (x as ServiceItem).steps.every((s) => typeof s === "string")
  );
}

export async function GET() {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;
  try {
    const list = await getServicesList();
    return NextResponse.json(list);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load services" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;
  try {
    const body = await request.json();
    if (!isValidServicesList(body)) {
      return NextResponse.json(
        { error: "Invalid body: array of { slug, title, desc, steps: string[] }" },
        { status: 400 }
      );
    }
    const root = await ensureContentRootForWrite();
    await fs.writeFile(
      path.join(root, "services.json"),
      JSON.stringify(body, null, 2),
      "utf8"
    );
    return NextResponse.json(body);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to save services" },
      { status: 500 }
    );
  }
}
