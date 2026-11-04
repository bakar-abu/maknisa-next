import type { CatalogPublicProductRecord } from "./fetch-catalog";
import type { CollectionGridData } from "../collection-types";
import type { CatalogProduct } from "../catalog-types";
import { enrichCatalogProduct } from "../catalog-enrich";
import type { GridCollectionSlug } from "../collections";
import { serviceCatalogProductDetailHref } from "../services";

const tagCache = new Map<GridCollectionSlug, CollectionGridData["tags"]>();

async function tagsForCollection(slug: GridCollectionSlug) {
  const cached = tagCache.get(slug);
  if (cached) return cached;
  const mod = await import(`../collection-data/${slug}.json`);
  const data = mod.default as CollectionGridData;
  tagCache.set(slug, data.tags);
  return data.tags;
}

export async function mapApiProductsToCatalogProducts(
  products: CatalogPublicProductRecord[],
  serviceSlug: string,
): Promise<CatalogProduct[]> {
  const result: CatalogProduct[] = [];

  for (const product of products) {
    const collectionSlug = (product.collectionSlug ?? "living") as GridCollectionSlug;
    const tags = await tagsForCollection(collectionSlug);
    const base = {
      id: product.id,
      title: product.title,
      href: serviceCatalogProductDetailHref(serviceSlug, product.id),
      onlineShop: product.onlineShop,
      images: product.images,
      tagIds: product.tagIds,
      categoryIds: product.categoryIds,
    };
    let enriched = enrichCatalogProduct(base, collectionSlug, tags);
    if (product.primaryProductTypeId) {
      enriched = {
        ...enriched,
        primaryProductTypeId: product.primaryProductTypeId,
        productTypeIds: [product.primaryProductTypeId],
      };
    }
    if (product.price !== undefined && product.price !== null) {
      enriched = {
        ...enriched,
        price: product.price,
        priceBefore: product.priceBefore ?? null,
        fromPrice: product.fromPrice ?? null,
      };
    }
    result.push(enriched);
  }

  return result;
}
