import { enrichCatalogProduct } from "./catalog-enrich";
import { isEligibleCatalogProduct } from "./catalog-eligibility";
import type {
  CatalogFilters,
  CatalogPageData,
  CatalogProduct,
  CatalogTag,
} from "./catalog-types";
import { ITEMS_PER_PAGE } from "./catalog-types";
import type { CollectionGridData } from "./collection-types";
import {
  getCollectionPageTitle,
  GRID_COLLECTION_SLUGS,
  type GridCollectionSlug,
} from "./collections";
import { PRODUCT_TYPES } from "./product-types";
import { enrichCollectionProducts } from "./product-routes";

let catalogCache: CatalogProduct[] | null = null;

export async function getCatalogProducts(): Promise<CatalogProduct[]> {
  if (catalogCache) return catalogCache;

  const lists = await Promise.all(
    GRID_COLLECTION_SLUGS.map(async (slug) => {
      const mod = await import(`./collection-data/${slug}.json`);
      const data = mod.default as CollectionGridData;
      const products = enrichCollectionProducts(slug, data.products);
      return products
        .filter((product) => isEligibleCatalogProduct(product, slug))
        .map((product) => enrichCatalogProduct(product, slug, data.tags));
    }),
  );

  catalogCache = lists.flat();
  return catalogCache;
}

export async function getCatalogPageData(): Promise<CatalogPageData> {
  const products = await getCatalogProducts();
  const tagCounts = new Map<number, CatalogTag>();

  for (const slug of GRID_COLLECTION_SLUGS) {
    const mod = await import(`./collection-data/${slug}.json`);
    const data = mod.default as CollectionGridData;
    for (const tag of data.tags) {
      const existing = tagCounts.get(tag.id);
      if (existing) continue;
      tagCounts.set(tag.id, { ...tag, count: 0 });
    }
  }

  for (const product of products) {
    for (const tagId of product.tagIds) {
      const tag = tagCounts.get(tagId);
      if (tag) tag.count += 1;
    }
  }

  const tags = [...tagCounts.values()]
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  const prices = products.map((p) => p.price).filter((p): p is number => p !== null);
  const priceRange = {
    min: prices.length ? Math.min(...prices) : 0,
    max: prices.length ? Math.max(...prices) : 10_000_000,
  };

  const usedTypeIds = new Set(products.flatMap((p) => p.productTypeIds));
  const productTypes = PRODUCT_TYPES.filter((t) => usedTypeIds.has(t.id));

  const roomSlugs = new Set(products.map((p) => p.collectionSlug));
  const rooms = GRID_COLLECTION_SLUGS.filter((slug) => roomSlugs.has(slug)).map(
    (slug) => ({
      slug,
      label: getCollectionPageTitle(slug),
    }),
  );

  return {
    title: "Products",
    h1: "Our Products",
    intro:
      "Browse furniture, kitchens, bathrooms, lighting, and surfaces. Filter by product type, room, style, and budget to find the right piece for your project.",
    products,
    tags,
    productTypes,
    rooms,
    priceRange,
  };
}

function sortProducts(products: CatalogProduct[], sort: CatalogFilters["sort"]) {
  const list = [...products];
  switch (sort) {
    case "name-asc":
      return list.sort((a, b) => a.title.localeCompare(b.title));
    case "name-desc":
      return list.sort((a, b) => b.title.localeCompare(a.title));
    case "price-asc":
      return list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    case "price-desc":
      return list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    default:
      return list;
  }
}

export function filterCatalogProducts(
  products: CatalogProduct[],
  filters: CatalogFilters,
): CatalogProduct[] {
  let result = products.filter((product) => {
    if (filters.productTypeIds.length > 0) {
      if (!filters.productTypeIds.includes(product.primaryProductTypeId)) {
        return false;
      }
    }

    if (filters.roomSlugs.length > 0) {
      if (!filters.roomSlugs.includes(product.collectionSlug)) return false;
    }

    if (filters.tagIds.length > 0) {
      const match = product.tagIds.some((id) => filters.tagIds.includes(id));
      if (!match) return false;
    }

    if (filters.onlineOnly && !product.onlineShop) return false;

    if (product.price !== null) {
      if (product.price < filters.priceMin || product.price > filters.priceMax) {
        return false;
      }
    }

    return true;
  });

  result = sortProducts(result, filters.sort);
  return result;
}

export function paginateCatalogProducts(
  products: CatalogProduct[],
  page: number,
): CatalogProduct[] {
  const start = (page - 1) * ITEMS_PER_PAGE;
  return products.slice(start, start + ITEMS_PER_PAGE);
}

export function getCatalogTotalPages(count: number): number {
  return Math.max(1, Math.ceil(count / ITEMS_PER_PAGE));
}

export function countByProductType(
  products: CatalogProduct[],
  typeId: number,
  filters: Omit<CatalogFilters, "productTypeIds">,
): number {
  return filterCatalogProducts(products, {
    ...filters,
    productTypeIds: [typeId],
  }).length;
}

export function countByRoom(
  products: CatalogProduct[],
  slug: GridCollectionSlug,
  filters: Omit<CatalogFilters, "roomSlugs">,
): number {
  return filterCatalogProducts(products, {
    ...filters,
    roomSlugs: [slug],
  }).length;
}

/** Facet count with other active filters applied, plus this style tag. */
export function countByTagFacet(
  products: CatalogProduct[],
  tagId: number,
  filters: CatalogFilters,
): number {
  return filterCatalogProducts(products, {
    ...filters,
    tagIds: [tagId],
    page: 1,
  }).length;
}
