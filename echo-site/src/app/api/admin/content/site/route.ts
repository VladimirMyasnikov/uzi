import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { requireSession } from "@/lib/admin/auth-utils";
import { getSiteConfig, ensureContentRootForWrite } from "@/lib/content-loader";
import type { SiteConfig } from "@/types/content";

function isValidSiteConfig(body: unknown): body is SiteConfig {
  if (!body || typeof body !== "object") return false;
  const o = body as Record<string, unknown>;
  const c = o.contacts as Record<string, unknown> | undefined;
  return Boolean(
    typeof o.name === "string" &&
    typeof o.title === "string" &&
    typeof o.description === "string" &&
    c &&
    typeof c.phoneMain === "string" &&
    typeof c.phoneTollFree === "string" &&
    typeof c.phoneTollFreeHref === "string" &&
    typeof c.email === "string" &&
    typeof c.address === "string" &&
    typeof c.requisites === "string"
  );
}

export async function GET() {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;
  try {
    const config = await getSiteConfig();
    return NextResponse.json(config);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load site config" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;
  try {
    const body = await request.json();
    if (!isValidSiteConfig(body)) {
      return NextResponse.json(
        { error: "Invalid body: name, title, description, contacts (phoneMain, phoneTollFree, phoneTollFreeHref, email, address, requisites)" },
        { status: 400 }
      );
    }
    const root = await ensureContentRootForWrite();
    await fs.writeFile(
      path.join(root, "site.json"),
      JSON.stringify(body, null, 2),
      "utf8"
    );
    return NextResponse.json(body);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to save site config" },
      { status: 500 }
    );
  }
}
