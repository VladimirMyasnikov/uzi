import { NextResponse } from "next/server";
import { requireSession } from "@/lib/admin/auth-utils";
import { deleteProductImage } from "@/lib/admin/catalog-fs";

export async function DELETE(
  _: Request,
  {
    params,
  }: { params: Promise<{ category: string; product: string; filename: string }> }
) {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;
  const { category, product, filename } = await params;
  const decodedFilename = decodeURIComponent(filename);
  try {
    await deleteProductImage(category, product, decodedFilename);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to delete image" },
      { status: 500 }
    );
  }
}
