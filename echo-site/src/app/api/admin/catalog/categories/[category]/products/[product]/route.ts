import { NextResponse } from "next/server";
import { getProduct } from "@/lib/catalog-loader";
import { requireSession } from "@/lib/admin/auth-utils";
import { readProductData, updateProduct, deleteProduct } from "@/lib/admin/catalog-fs";
import type { ProductDataJson } from "@/types/catalog";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ category: string; product: string }> }
) {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;
  const { category: rawCat, product: rawProd } = await params;
  const category = decodeURIComponent(rawCat);
  const product = decodeURIComponent(rawProd);
  try {
    const [catalogProduct, data] = await Promise.all([
      getProduct(category, product),
      readProductData(category, product),
    ]);
    if (!catalogProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({
      ...catalogProduct,
      data: data ?? {
        category: catalogProduct.categoryTitle,
        product: catalogProduct.title,
        desc: catalogProduct.desc,
        badge: catalogProduct.badge,
        status: catalogProduct.status,
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ category: string; product: string }> }
) {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;
  const { category: rawCat, product: rawProd } = await params;
  const category = decodeURIComponent(rawCat);
  const product = decodeURIComponent(rawProd);
  try {
    const body = await request.json();
    const data: ProductDataJson = {
      category: typeof body.category === "string" ? body.category : "",
      product: typeof body.product === "string" ? body.product : "",
      desc: typeof body.desc === "string" ? body.desc : "",
      url: typeof body.url === "string" ? body.url : undefined,
      images: Array.isArray(body.images) ? body.images : undefined,
      badge: typeof body.badge === "string" ? body.badge : undefined,
      status: typeof body.status === "string" ? body.status : undefined,
    };
    await updateProduct(category, product, data);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ category: string; product: string }> }
) {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;
  const { category: rawCat, product: rawProd } = await params;
  const category = decodeURIComponent(rawCat);
  const product = decodeURIComponent(rawProd);
  try {
    await deleteProduct(category, product);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to delete product" },
      { status: 500 }
    );
  }
}
