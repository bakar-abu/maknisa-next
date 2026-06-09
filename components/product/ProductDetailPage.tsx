"use client";

import { MolteniProductPage } from "@/components/product/MolteniProductPage";
import type { ProductDetailView } from "@/lib/product-detail";

type ProductDetailPageProps = {
  data: ProductDetailView;
};

export function ProductDetailPage({ data }: ProductDetailPageProps) {
  return <MolteniProductPage data={data} />;
}
