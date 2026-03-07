import { NextResponse } from "next/server";
import { getProductsByCategory } from "@/lib/catalog-loader";
import { requireSession } from "@/lib/admin/auth-utils";
import { createProduct } from "@/lib/admin/catalog-fs";
import { isValidSlug } from "@/lib/admin/slug";
import type { ProductDataJson } from "@/types/catalog";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;
  const { category: rawCategory } = await params;
  const category = decodeURIComponent(rawCategory);
  try {
    const products = await getProductsByCategory(category);
    return NextResponse.json({ products });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load products" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;
  const { category: rawCategory } = await params;
  const category = decodeURIComponent(rawCategory);
  try {
    const body = await request.json();
    const slug = typeof body.slug === "string" ? body.slug.trim() : "";
    if (!isValidSlug(category) || !isValidSlug(slug)) {
      return NextResponse.json(
        { error: "Invalid category or product slug" },
        { status: 400 }
      );
    }
    const data: ProductDataJson = {
      category: typeof body.category === "string" ? body.category : slug,
      product: typeof body.product === "string" ? body.product : slug,
      desc: typeof body.desc === "string" ? body.desc : "",
      url: typeof body.url === "string" ? body.url : undefined,
      images: Array.isArray(body.images) ? body.images : undefined,
      badge: typeof body.badge === "string" ? body.badge : undefined,
      status: typeof body.status === "string" ? body.status : undefined,
    };
    await createProduct(category, slug, data);
    return NextResponse.json({ slug, ...data });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create product" },
      { status: 500 }
    );
  }
}
