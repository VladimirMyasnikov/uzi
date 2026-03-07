import { NextResponse } from "next/server";
import { getCatalogCategories } from "@/lib/catalog-loader";
import { requireSession } from "@/lib/admin/auth-utils";
import { createCategory } from "@/lib/admin/catalog-fs";
import { isValidSlug } from "@/lib/admin/slug";

export async function GET() {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;
  try {
    const categories = await getCatalogCategories();
    return NextResponse.json({ categories });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;
  try {
    const body = await request.json();
    const slug = typeof body.slug === "string" ? body.slug.trim() : "";
    const title = typeof body.title === "string" ? body.title.trim() : body.slug ?? "";
    if (!isValidSlug(slug)) {
      return NextResponse.json(
        { error: "Invalid slug (use letters, numbers, hyphens)" },
        { status: 400 }
      );
    }
    await createCategory(slug);
    return NextResponse.json({ slug, title });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create category" },
      { status: 500 }
    );
  }
}
