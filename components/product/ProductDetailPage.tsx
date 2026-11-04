"use client";

import { MaknisaProductPage } from "@/components/product/MaknisaProductPage";
import type { ProductDetailView } from "@/lib/product-detail";

type ProductDetailPageProps = {
  data: ProductDetailView;
};

export function ProductDetailPage({ data }: ProductDetailPageProps) {
  return <MaknisaProductPage data={data} />;
}
