import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { resolveCatalogRoot } from "@/lib/catalog-loader";

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const catalogRoot = await resolveCatalogRoot();
  const { path: pathSegments } = await params;
  const segments = pathSegments ?? [];
  const unsafePath = path.join(catalogRoot, ...segments.map((s) => decodeURIComponent(s)));
  const normalized = path.normalize(unsafePath);

  if (!normalized.startsWith(catalogRoot)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const stat = await fs.stat(normalized);
    if (!stat.isFile()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const ext = path.extname(normalized).toLowerCase();
    const mime = MIME_BY_EXT[ext] || "application/octet-stream";
    const buffer = await fs.readFile(normalized);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "content-type": mime,
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}





