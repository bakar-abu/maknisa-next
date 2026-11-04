import type { CollectionProduct } from "./collection-types";
import { GRID_COLLECTION_SLUGS, type GridCollectionSlug } from "./collections";
import { enrichCollectionProducts } from "./product-routes";
import { fetchPublicCatalogProducts } from "./cms/fetch-catalog";

let cache: CollectionProduct[] | null = null;

export async function getAllCollectionProducts(): Promise<CollectionProduct[]> {
  if (cache) return cache;

  const fromApi = await fetchPublicCatalogProducts();
  if (fromApi.length > 0) {
    const byCollection = new Map<GridCollectionSlug, CollectionProduct[]>();
    for (const product of fromApi) {
      const slug = product.collectionSlug as GridCollectionSlug;
      const list = byCollection.get(slug) ?? [];
      list.push({
        id: product.id,
        title: product.title,
        href: product.href,
        onlineShop: product.onlineShop,
        images: product.images,
        tagIds: product.tagIds,
        categoryIds: product.categoryIds,
      });
      byCollection.set(slug, list);
    }

    const lists = GRID_COLLECTION_SLUGS.map((slug) =>
      enrichCollectionProducts(slug, byCollection.get(slug) ?? []),
    );
    cache = lists.flat();
    return cache;
  }

  const lists = await Promise.all(
    GRID_COLLECTION_SLUGS.map(async (slug) => {
      const mod = await import(`./collection-data/${slug}.json`);
      const products = (mod.default as { products: CollectionProduct[] }).products;
      return enrichCollectionProducts(slug, products);
    }),
  );
  cache = lists.flat();
  return cache;
}

export async function getProductsForCategories(
  categoryIds: number[],
  primarySlug: GridCollectionSlug,
): Promise<CollectionProduct[]> {
  const all = await getAllCollectionProducts();
  const primary = new Set(
    (await import(`./collection-data/${primarySlug}.json`)).default
      .primaryCategoryIds as number[],
  );
  const selected = new Set(categoryIds);
  const onlyPrimary =
    categoryIds.length === 0 ||
    (categoryIds.length === primary.size &&
      [...primary].every((id) => selected.has(id)));

  if (onlyPrimary) {
    const mod = await import(`./collection-data/${primarySlug}.json`);
    return (mod.default as { products: CollectionProduct[] }).products;
  }

  return all.filter((p) =>
    p.categoryIds.some((cid) => selected.has(cid)),
  );
}
