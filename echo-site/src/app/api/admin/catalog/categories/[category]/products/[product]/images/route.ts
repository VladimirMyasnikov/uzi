import { NextResponse } from "next/server";
import { requireSession } from "@/lib/admin/auth-utils";
import { uploadProductImage } from "@/lib/admin/catalog-fs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ category: string; product: string }> }
) {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;
  const { category, product } = await params;
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing file" },
        { status: 400 }
      );
    }
    const url = await uploadProductImage(category, product, file);
    return NextResponse.json({ url });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to upload image" },
      { status: 500 }
    );
  }
}
