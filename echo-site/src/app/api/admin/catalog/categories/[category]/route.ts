import { NextResponse } from "next/server";
import { requireSession } from "@/lib/admin/auth-utils";
import { deleteCategory } from "@/lib/admin/catalog-fs";

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;
  const { category: rawCategory } = await params;
  const category = decodeURIComponent(rawCategory);
  try {
    await deleteCategory(category);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to delete category" },
      { status: 500 }
    );
  }
}
