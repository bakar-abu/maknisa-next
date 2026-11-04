import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/product/ProductDetailPage";
import { isGridCollectionSlug } from "@/lib/collections";
import { isServicePdpCollectionSlug } from "@/lib/product-routes";
import {
  getAllProductStaticParams,
  getProductDetail,
} from "@/lib/product-detail";
import { site } from "@/lib/site";

import "@/app/styles/maknisa-product.css";
import "@/app/styles/woodwork-pdp-sections.css";

type PageProps = {
  params: Promise<{ slug: string; productSlug: string }>;
};

export async function generateStaticParams() {
  return getAllProductStaticParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, productSlug } = await params;
  if (!isGridCollectionSlug(slug)) return { title: site.name };

  const detail = await getProductDetail(slug, productSlug);
  if (!detail) return { title: site.name };

  return {
    title: `${detail.product.title} | ${detail.collectionTitle} | ${site.name}`,
    description: detail.intro,
  };
}

export default async function ProductDetailRoute({ params }: PageProps) {
  const { slug, productSlug } = await params;

  if (!isGridCollectionSlug(slug) || isServicePdpCollectionSlug(slug)) notFound();

  const detail = await getProductDetail(slug, productSlug);
  if (!detail) notFound();

  return <ProductDetailPage data={detail} />;
}
