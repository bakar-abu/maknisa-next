import { enrichCatalogProduct } from "./catalog-enrich";
import type { CollectionProduct, CollectionTag } from "./collection-types";
import {
  getCollectionGridData,
  getCollectionPageTitle,
  type GridCollectionSlug,
} from "./collections";
import { upscaleScavoliniImage } from "./catalog-images";
import { PRODUCT_TYPE_BY_ID } from "./product-types";

export type MolteniDesignerBlock = {
  name: string;
  bio: string;
  quote: string;
};

export type MolteniQuoteBlock = {
  text: string;
  author: string;
};

export type ProductDetailView = {
  product: CollectionProduct;
  collectionSlug: GridCollectionSlug;
  collectionTitle: string;
  breadcrumbLabel: string;
  productTypeLabel: string;
  intro: string;
  detailParagraph: string;
  craftedParagraph: string;
  quote: MolteniQuoteBlock;
  designer: MolteniDesignerBlock;
  tags: CollectionTag[];
  related: CollectionProduct[];
  galleries: PdpGalleries;
  heroImages: string[];
  galleryImages: string[];
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
  productTypeLabel: string,
  tagLabels: string[],
): string {
  const styles =
    tagLabels.length > 0
      ? tagLabels.slice(0, 4).join(", ")
      : "contemporary design";
  return `${product.title} brings together ${styles.toLowerCase()} and refined craftsmanship. Part of our ${productTypeLabel.toLowerCase()} range, it is designed to adapt to contemporary living with balanced proportions, quality materials, and a timeless Maknisa signature.`;
}

function buildDetailParagraph(
  product: CollectionProduct,
  collectionTitle: string,
): string {
  return `At its core, ${product.title} embodies the concept of "divided but united." Its modular nature allows for a range of configurations, each offering a seamless balance between intimacy and openness. Designed for ${collectionTitle.toLowerCase()} projects, it adapts to different layouts while maintaining a coherent visual language throughout the home.`;
}

function buildCraftedParagraph(product: CollectionProduct): string {
  return `Crafted with precision and available in a curated selection of finishes from the Maknisa collection, ${product.title} is designed for spaces that embrace both movement and tranquility.`;
}

function buildQuote(): MolteniQuoteBlock {
  return {
    text: "I enjoy thinking about how we will settle in. We are going to occupy a space, and I work a lot on centrality. I like elements that live in the middle of a room and help to build the space.",
    author: "Maknisa Design Studio",
  };
}

function buildDesignerBlock(collectionTitle: string): MolteniDesignerBlock {
  return {
    name: "Maknisa Design Studio",
    bio: `Maknisa Design Studio shapes kitchens, bathrooms, and living systems for homes across Pakistan — combining Italian manufacturing heritage with local expertise. Each ${collectionTitle.toLowerCase()} line is developed with attention to materials, ergonomics, and long-term performance.`,
    quote:
      "Furniture should feel inevitable in a space: proportion, light, and material working together so the room feels complete.",
  };
}

function upscaleImages(images: string[]): string[] {
  return images
    .filter((url) => url && url !== "#" && url.startsWith("http"))
    .map((url) => upscaleScavoliniImage(url, 1600));
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

  const collectionTitle = getCollectionPageTitle(collectionSlug);
  const catalog = enrichCatalogProduct(product, collectionSlug, data.tags);
  const productTypeLabel =
    PRODUCT_TYPE_BY_ID.get(catalog.primaryProductTypeId)?.label ??
    collectionTitle;
  const upscaled = upscaleImages(product.images);

  return {
    product,
    collectionSlug,
    collectionTitle,
    breadcrumbLabel: data.breadcrumbLabel,
    productTypeLabel,
    intro: buildIntro(product, productTypeLabel, tagLabels),
    detailParagraph: buildDetailParagraph(product, collectionTitle),
    craftedParagraph: buildCraftedParagraph(product),
    quote: buildQuote(),
    designer: buildDesignerBlock(collectionTitle),
    tags: product.tagIds
      .map((id) => tagsById.get(id))
      .filter((t): t is CollectionTag => Boolean(t)),
    related,
    galleries: buildPdpGalleries(upscaled),
    heroImages: upscaled.slice(0, Math.min(4, upscaled.length)),
    galleryImages: upscaled,
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
