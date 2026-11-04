import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogProductDetailPage } from "@/components/product/CatalogProductDetailPage";
import {
  getAllCatalogServiceProductStaticParams,
  getCatalogProductDetail,
} from "@/lib/catalog-product-detail";
import { fetchPublicProductContent } from "@/lib/cms/fetch-catalog";
import { resolveServiceCatalogRoute } from "@/lib/services";
import { site } from "@/lib/site";

import "@/app/styles/product-detail.css";
import "@/app/styles/catalog-product-detail.css";

type PageProps = {
  params: Promise<{ slug: string; productSlug: string }>;
};

export async function generateStaticParams() {
  return getAllCatalogServiceProductStaticParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, productSlug } = await params;
  if (!resolveServiceCatalogRoute(slug)) return { title: site.name };

  const storedContent = await fetchPublicProductContent(productSlug);
  const detail = await getCatalogProductDetail(slug, productSlug);
  if (!detail) return { title: site.name };

  return {
    title:
      storedContent?.metaTitle ??
      `${detail.product.title} | ${detail.serviceLabel} | ${site.name}`,
    description: storedContent?.metaDescription ?? detail.intro,
  };
}

export default async function ServiceCatalogProductPage({ params }: PageProps) {
  const { slug, productSlug } = await params;

  if (!resolveServiceCatalogRoute(slug)) notFound();

  const detail = await getCatalogProductDetail(slug, productSlug);
  if (!detail) notFound();

  return <CatalogProductDetailPage data={detail} />;
}
