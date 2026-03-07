import { getCatalogCategories, getProductsByCategory } from "@/lib/catalog-loader";
import AdminProductEditClient from "./AdminProductEditClient";

export async function generateStaticParams() {
  const categories = await getCatalogCategories();
  const params: { category: string; product: string }[] = [];
  for (const cat of categories) {
    const products = await getProductsByCategory(cat.slug);
    for (const p of products) {
      params.push({ category: cat.slug, product: p.productSlug });
    }
  }
  return params;
}

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}) {
  return <AdminProductEditClient params={params} />;
}
