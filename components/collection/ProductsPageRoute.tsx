import { ProductsCatalogPage } from "@/components/products/ProductsCatalogPage";
import { getCatalogPageData } from "@/lib/catalog-products";

export async function ProductsPageRoute() {
  const data = await getCatalogPageData();
  return <ProductsCatalogPage data={data} />;
}
