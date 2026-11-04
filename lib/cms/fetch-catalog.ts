import { getApiBaseUrl } from "@/lib/api-config";
import type { CollectionGridData } from "@/lib/collection-types";
import type { GridCollectionSlug } from "@/lib/collections";

export type CatalogServiceRecord = {
  id: string;
  slug: string;
  label: string;
  template: "collection_grid" | "products_catalog";
  dataSlug: string | null;
  filterSetId: string | null;
  catalogRoomSlugs: string[] | null;
  title: string;
  h1: string;
  intro: string;
  breadcrumbLabel: string;
  ctaLabel: string | null;
  ctaHref: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  noIndex: boolean;
  noFollow: boolean;
  sortOrder: number;
  isPublished: boolean;
};

export type CatalogServiceCategoryRecord = {
  id: string;
  slug: string;
  label: string;
  heading: string | null;
  exploreLabel: string | null;
  imageUrl: string | null;
  filterTagIds: number[];
  productTypeIds: number[];
  sortOrder: number;
};

export type CatalogProductContentRecord = {
  productId: string;
  intro: string | null;
  detailParagraph: string | null;
  craftedParagraph: string | null;
  quoteText: string | null;
  quoteAuthor: string | null;
  designerName: string | null;
  designerBio: string | null;
  designerQuote: string | null;
  extras: Record<string, unknown> | null;
  metaTitle: string | null;
  metaDescription: string | null;
};

export type CatalogPublicProductRecord = {
  id: string;
  title: string;
  href: string;
  onlineShop: boolean;
  images: string[];
  tagIds: number[];
  categoryIds: number[];
  serviceCategorySlug?: string | null;
  collectionSlug?: string;
  primaryProductTypeId?: number | null;
  price?: number | null;
  priceBefore?: number | null;
  fromPrice?: number | null;
};

const REVALIDATE = 3600;
const FETCH_TIMEOUT_MS = 30000;

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchPublicCollectionGrid(
  slug: GridCollectionSlug,
): Promise<CollectionGridData | null> {
  const data = await fetchJson<{ grid: CollectionGridData }>(
    `/api/catalog/public/collections/${slug}/grid`,
  );
  return data?.grid ?? null;
}

export async function fetchPublicServices(): Promise<CatalogServiceRecord[]> {
  const data = await fetchJson<{ services: CatalogServiceRecord[] }>(
    "/api/catalog/public/services",
  );
  return data?.services ?? [];
}

export async function fetchPublicServiceBundle(slug: string): Promise<{
  service: CatalogServiceRecord;
  categories: CatalogServiceCategoryRecord[];
  products: CatalogPublicProductRecord[];
} | null> {
  const data = await fetchJson<{
    service: CatalogServiceRecord;
    categories: CatalogServiceCategoryRecord[];
    products: CatalogPublicProductRecord[];
  }>(`/api/catalog/public/services/${encodeURIComponent(slug)}`);
  if (!data?.service) return null;
  return data;
}

export async function fetchPublicCatalogProducts(): Promise<
  CatalogPublicProductRecord[]
> {
  const data = await fetchJson<{ products: CatalogPublicProductRecord[] }>(
    "/api/catalog/public/products",
  );
  return data?.products ?? [];
}

export async function fetchPublicProductContent(
  productSlug: string,
): Promise<CatalogProductContentRecord | null> {
  const data = await fetchJson<{ content: CatalogProductContentRecord }>(
    `/api/catalog/public/products/${encodeURIComponent(productSlug)}/content`,
  );
  return data?.content ?? null;
}
