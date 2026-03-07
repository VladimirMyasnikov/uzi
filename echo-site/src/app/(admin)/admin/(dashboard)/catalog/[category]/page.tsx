import { getCatalogCategories } from "@/lib/catalog-loader";
import AdminCatalogCategoryClient from "./AdminCatalogCategoryClient";

export async function generateStaticParams() {
  const categories = await getCatalogCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export default async function AdminCatalogCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  return <AdminCatalogCategoryClient params={params} />;
}
