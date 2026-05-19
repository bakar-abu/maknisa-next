import { CollectionGridPage } from "@/components/collection/CollectionGridPage";
import {
  getCollectionGridData,
  type GridCollectionSlug,
} from "@/lib/collections";
import { getAllCollectionProducts } from "@/lib/get-all-collection-products";

export async function CollectionGridRoute({
  slug,
}: {
  slug: GridCollectionSlug;
}) {
  const [data, allProducts] = await Promise.all([
    getCollectionGridData(slug),
    getAllCollectionProducts(),
  ]);

  return <CollectionGridPage data={data} allProducts={allProducts} />;
}
