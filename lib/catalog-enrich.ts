import type { CollectionProduct, CollectionTag } from "./collection-types";
import type { CatalogProduct, PriceTier } from "./catalog-types";
import { PRICE_TIER_BOUNDS } from "./catalog-types";
import { getCatalogCardImage } from "./catalog-images";
import type { GridCollectionSlug } from "./collections";

const TYPE = {
  CHAIR: 101,
  STOOL: 103,
  SOFA: 105,
  DINING_TABLE: 201,
  COFFEE_TABLE: 202,
  SIDE_TABLE: 203,
  CONSOLE_TABLE: 204,
  DESK: 205,
  BED: 301,
  WARDROBE: 303,
  WALK_IN: 304,
  WALL_UNIT: 401,
  MODULAR: 404,
  KITCHEN: 501,
  BATHROOM: 502,
  TILE: 601,
  MARBLE: 602,
  PENDANT: 701,
  CHANDELIER: 702,
  WALL_LIGHT: 703,
  TABLE_LAMP: 705,
} as const;

const SLUG_TIER: Record<GridCollectionSlug, PriceTier> = {
  kitchens: "luxury",
  bathrooms: "premium",
  living: "premium",
  "bedroom-furniture": "mid",
  "tables-chairs-stools": "mid",
  "multi-functional-modules": "mid",
  "marble-tiles": "entry",
  lighting: "entry",
};

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function derivePrice(id: string, tier: PriceTier): number {
  const bounds = PRICE_TIER_BOUNDS[tier];
  const span = bounds.max - bounds.min;
  const offset = hashString(id) % span;
  return bounds.min + offset;
}

function tagLabelIncludes(tags: CollectionTag[], tagIds: number[], needle: string) {
  const lower = needle.toLowerCase();
  return tagIds.some((id) => {
    const tag = tags.find((t) => t.id === id);
    return tag?.label.toLowerCase().includes(lower);
  });
}

function inferProductTypes(
  product: CollectionProduct,
  slug: GridCollectionSlug,
  tags: CollectionTag[],
): number[] {
  const title = product.title.toLowerCase();

  if (slug === "tables-chairs-stools") {
    if (product.categoryIds.includes(230) || title.includes("chair")) {
      return [TYPE.CHAIR];
    }
    if (product.categoryIds.includes(231) || title.includes("stool")) {
      return [TYPE.STOOL];
    }
    if (title.includes("coffee")) return [TYPE.COFFEE_TABLE];
    if (title.includes("console")) return [TYPE.CONSOLE_TABLE];
    if (title.includes("side")) return [TYPE.SIDE_TABLE];
    if (title.includes("desk")) return [TYPE.DESK];
    return [TYPE.DINING_TABLE];
  }

  if (slug === "bedroom-furniture") {
    if (title.includes("walk-in") || title.includes("walk in")) {
      return [TYPE.WALK_IN];
    }
    if (title.includes("wardrobe")) return [TYPE.WARDROBE];
    return [TYPE.BED];
  }

  if (slug === "kitchens") return [TYPE.KITCHEN];
  if (slug === "bathrooms") return [TYPE.BATHROOM];

  if (slug === "living") {
    if (title.includes("sofa")) return [TYPE.SOFA];
    return [TYPE.WALL_UNIT];
  }

  if (slug === "multi-functional-modules") return [TYPE.MODULAR];

  if (slug === "marble-tiles") {
    if (title.includes("marble")) return [TYPE.MARBLE];
    return [TYPE.TILE];
  }

  if (slug === "lighting") {
    if (tagLabelIncludes(tags, product.tagIds, "chandelier")) {
      return [TYPE.CHANDELIER];
    }
    if (tagLabelIncludes(tags, product.tagIds, "pendant")) {
      return [TYPE.PENDANT];
    }
    if (tagLabelIncludes(tags, product.tagIds, "wall")) {
      return [TYPE.WALL_LIGHT];
    }
    if (tagLabelIncludes(tags, product.tagIds, "table")) {
      return [TYPE.TABLE_LAMP];
    }
    return [TYPE.PENDANT];
  }

  return [TYPE.WALL_UNIT];
}

export function enrichCatalogProduct(
  product: CollectionProduct,
  collectionSlug: GridCollectionSlug,
  tags: CollectionTag[],
): CatalogProduct {
  const priceTier = SLUG_TIER[collectionSlug];
  const price = derivePrice(product.id, priceTier);
  const productTypeIds = inferProductTypes(product, collectionSlug, tags);

  return {
    ...product,
    collectionSlug,
    productTypeIds,
    primaryProductTypeId: productTypeIds[0],
    price,
    priceBefore: null,
    fromPrice: null,
    priceTier,
    catalogImage: getCatalogCardImage(product),
  };
}
