import type { CollectionGridData } from "./collection-types";
import { enrichCollectionProducts } from "./product-routes";
import { fetchPublicCollectionGrid } from "./cms/fetch-catalog";

export const GRID_COLLECTION_SLUGS = [
  "kitchens",
  "bathrooms",
  "living",
  "bedroom-furniture",
  "tables-chairs-stools",
  "multi-functional-modules",
  "marble-tiles",
  "lighting",
] as const;

export const LANDING_COLLECTION_SLUGS = ["formalia-outdoor"] as const;

export const INSPIRE_SLUG = "inspire-me" as const;

export type GridCollectionSlug = (typeof GRID_COLLECTION_SLUGS)[number];
export type CollectionSlug =
  | GridCollectionSlug
  | (typeof LANDING_COLLECTION_SLUGS)[number]
  | typeof INSPIRE_SLUG;

export const ALL_COLLECTION_ROUTES: CollectionSlug[] = [
  ...GRID_COLLECTION_SLUGS,
  ...LANDING_COLLECTION_SLUGS,
  INSPIRE_SLUG,
];

export function isGridCollectionSlug(slug: string): slug is GridCollectionSlug {
  return (GRID_COLLECTION_SLUGS as readonly string[]).includes(slug);
}

export async function getCollectionGridData(
  slug: GridCollectionSlug,
): Promise<CollectionGridData> {
  const fromApi = await fetchPublicCollectionGrid(slug);
  if (fromApi) {
    return {
      ...fromApi,
      products: enrichCollectionProducts(slug, fromApi.products),
    };
  }

  const mod = await import(`./collection-data/${slug}.json`);
  const data = mod.default as CollectionGridData;
  return {
    ...data,
    products: enrichCollectionProducts(slug, data.products),
  };
}

export function getCollectionPageTitle(slug: CollectionSlug): string {
  const titles: Record<string, string> = {
    kitchens: "Kitchens",
    bathrooms: "Bathrooms",
    living: "Living",
    "bedroom-furniture": "Night",
    "tables-chairs-stools": "Tables, chairs and stools",
    "formalia-outdoor": "Outdoor",
    "multi-functional-modules": "Multi-functional modules",
    "inspire-me": "Inspire me",
    "marble-tiles": "Marble & Tiles",
    lighting: "Lighting",
  };
  return titles[slug] ?? slug;
}
