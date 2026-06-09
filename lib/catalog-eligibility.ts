import type { CollectionProduct } from "./collection-types";
import type { GridCollectionSlug } from "./collections";

/**
 * Placeholder collections copied from kitchen data — exclude until real assets exist.
 */
export const CATALOG_EXCLUDED_SLUGS: GridCollectionSlug[] = [
  "lighting",
  "marble-tiles",
];

export function isCatalogCollection(slug: GridCollectionSlug): boolean {
  return !CATALOG_EXCLUDED_SLUGS.includes(slug);
}

/** True when the primary image URL belongs to this product (title appears in CDN path). */
export function productImageMatchesTitle(product: CollectionProduct): boolean {
  const primary = product.images[0];
  if (!primary || primary === "#") return false;

  const url = primary.toLowerCase();
  const title = product.title.toLowerCase();

  const stopWords = new Set([
    "table",
    "living",
    "the",
    "and",
    "for",
    "bedrooms",
    "bedroom",
    "furniture",
  ]);

  const tokens = title
    .split(/[\s-]+/)
    .map((w) => w.replace(/[^a-z0-9]/g, ""))
    .filter((w) => w.length > 2 && !stopWords.has(w));

  if (tokens.length === 0) {
    // Collection-style names (e.g. "Bedrooms") — require a valid CDN image only.
    return true;
  }

  return tokens.some((token) => url.includes(token));
}

export function isEligibleCatalogProduct(
  product: CollectionProduct,
  slug: GridCollectionSlug,
): boolean {
  if (!isCatalogCollection(slug)) return false;
  if (!product.images.some((u) => u && u !== "#" && u.startsWith("http"))) {
    return false;
  }
  return productImageMatchesTitle(product);
}
