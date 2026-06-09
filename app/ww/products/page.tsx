import type { Metadata } from "next";
import { ProductsPageRoute } from "@/components/collection/ProductsPageRoute";
import { getCatalogPageData } from "@/lib/catalog-products";
import { site } from "@/lib/site";

import "@/app/styles/products-catalog.css";
export async function generateMetadata(): Promise<Metadata> {
  const data = await getCatalogPageData();  return {
    title: `${data.title} | ${site.name}`,
    description: data.intro,
  };
}

export default function Page() {
  return <ProductsPageRoute />;
}
