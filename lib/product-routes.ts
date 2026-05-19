import type { CollectionProduct } from "./collection-types";
import type { GridCollectionSlug } from "./collections";

export function productDetailHref(
  collectionSlug: string,
  productId: string,
): string {
  return `/ww/${collectionSlug}/${productId}`;
}

export function enrichCollectionProducts(
  collectionSlug: string,
  products: CollectionProduct[],
): CollectionProduct[] {
  return products.map((product) => ({
    ...product,
    href: productDetailHref(collectionSlug, product.id),
  }));
}

export function isGridCollectionRoute(slug: string): slug is GridCollectionSlug {
  return [
    "kitchens",
    "bathrooms",
    "living",
    "bedroom-furniture",
    "tables-chairs-stools",
    "multi-functional-modules",
    "marble-tiles",
    "lighting",
  ].includes(slug);
}
