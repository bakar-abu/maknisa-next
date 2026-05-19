import type { CollectionProduct, CollectionTag } from "./collection-types";
import {
  getCollectionGridData,
  getCollectionPageTitle,
  type GridCollectionSlug,
} from "./collections";

export type ProductDetailView = {
  product: CollectionProduct;
  collectionSlug: GridCollectionSlug;
  collectionTitle: string;
  breadcrumbLabel: string;
  intro: string;
  tags: CollectionTag[];
  related: CollectionProduct[];
  galleries: PdpGalleries;
};

/** Image groups for each Poliform-style slider block on the PDP. */
export type PdpGalleries = {
  /** Hero banner slider (title overlay, dots below). */
  hero: string[];
  /** Full-width lifestyle slider after intro. */
  lifestyle: string[];
  /** Each slide = two images side by side. */
  duoSlides: [string, string][];
};

function buildIntro(
  product: CollectionProduct,
  collectionTitle: string,
  tagLabels: string[],
): string {
  const styles =
    tagLabels.length > 0
      ? tagLabels.slice(0, 4).join(", ")
      : "contemporary design";
  return `${product.title} is part of our ${collectionTitle.toLowerCase()} collection. Defined by ${styles}, it combines refined materials with practical layouts tailored for modern homes. Explore finishes, configurations, and complementary pieces below—or visit a Maknisa showroom to see it in person.`;
}

/** Build slider image sets from product images (min slides for Poliform-style dots). */
export function buildPdpGalleries(images: string[]): PdpGalleries {
  if (images.length === 0) {
    return { hero: [], lifestyle: [], duoSlides: [] };
  }

  const padTo = (list: string[], min: number): string[] => {
    if (list.length >= min) return list.slice(0, min);
    const out = [...list];
    while (out.length < min && list.length > 0) {
      out.push(list[out.length % list.length]);
    }
    return out;
  };

  const hero = padTo(images, Math.min(4, Math.max(images.length, 2)));
  const lifestyle = padTo([...images], Math.min(5, Math.max(images.length, 2)));

  const duoSlides: [string, string][] = [];
  for (let i = 0; i < images.length; i += 2) {
    duoSlides.push([images[i], images[i + 1] ?? images[0]]);
  }
  if (duoSlides.length < 2 && images.length >= 2) {
    duoSlides.push([images[1], images[2] ?? images[0]]);
  }
  if (duoSlides.length === 0 && images.length === 1) {
    duoSlides.push([images[0], images[0]]);
  }

  return { hero, lifestyle, duoSlides: padToPairs(duoSlides, 2) };
}

function padToPairs(
  pairs: [string, string][],
  min: number,
): [string, string][] {
  if (pairs.length >= min) return pairs;
  const out = [...pairs];
  while (out.length < min && pairs.length > 0) {
    out.push(pairs[out.length % pairs.length]);
  }
  return out;
}

export async function getProductDetail(
  collectionSlug: GridCollectionSlug,
  productId: string,
): Promise<ProductDetailView | null> {
  const data = await getCollectionGridData(collectionSlug);
  const product = data.products.find((p) => p.id === productId);
  if (!product) return null;

  const tagsById = new Map(data.tags.map((t) => [t.id, t]));
  const tagLabels = product.tagIds
    .map((id) => tagsById.get(id)?.label)
    .filter((l): l is string => Boolean(l));

  const related = data.products
    .filter((p) => p.id !== product.id)
    .slice(0, 12);

  return {
    product,
    collectionSlug,
    collectionTitle: getCollectionPageTitle(collectionSlug),
    breadcrumbLabel: data.breadcrumbLabel,
    intro: buildIntro(product, data.title, tagLabels),
    tags: product.tagIds
      .map((id) => tagsById.get(id))
      .filter((t): t is CollectionTag => Boolean(t)),
    related,
    galleries: buildPdpGalleries(product.images),
  };
}

export async function getAllProductStaticParams(): Promise<
  { slug: string; productSlug: string }[]
> {
  const { GRID_COLLECTION_SLUGS } = await import("./collections");
  const params: { slug: string; productSlug: string }[] = [];

  for (const slug of GRID_COLLECTION_SLUGS) {
    const data = await getCollectionGridData(slug);
    for (const product of data.products) {
      params.push({ slug, productSlug: product.id });
    }
  }

  return params;
}

/** Split intro into two centered paragraphs (Poliform-style). */
export function splitIntroText(intro: string): [string, string | null] {
  const sentences = intro.match(/[^.!?]+[.!?]+/g);
  if (!sentences || sentences.length < 2) return [intro, null];
  const mid = Math.ceil(sentences.length / 2);
  return [
    sentences.slice(0, mid).join(" ").trim(),
    sentences.slice(mid).join(" ").trim(),
  ];
}
