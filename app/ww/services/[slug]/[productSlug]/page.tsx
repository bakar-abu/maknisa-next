import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/product/ProductDetailPage";
import {
  getAllServiceProductStaticParams,
  getServiceProductDetail,
} from "@/lib/product-detail";
import { resolveServiceCollectionRoute } from "@/lib/services";
import { site } from "@/lib/site";

import "@/app/styles/molteni-product.css";

type PageProps = {
  params: Promise<{ slug: string; productSlug: string }>;
};

export async function generateStaticParams() {
  return getAllServiceProductStaticParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, productSlug } = await params;
  if (!resolveServiceCollectionRoute(slug)) return { title: site.name };

  const detail = await getServiceProductDetail(slug, productSlug);
  if (!detail) return { title: site.name };

  return {
    title: `${detail.product.title} | ${detail.collectionTitle} | ${site.name}`,
    description: detail.intro,
  };
}

export default async function ServiceProductDetailRoute({ params }: PageProps) {
  const { slug, productSlug } = await params;

  if (!resolveServiceCollectionRoute(slug)) notFound();

  const detail = await getServiceProductDetail(slug, productSlug);
  if (!detail) notFound();

  return <ProductDetailPage data={detail} />;
}
