/** Формат data.json в папке товара (catalog-data/category/product/data.json) */
export interface ProductDataJson {
  category: string;
  product: string;
  desc: string;
  url?: string;
  images?: string[];
  badge?: string;
  status?: string;
}
