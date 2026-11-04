import type { CollectionProduct } from "./collection-types";

export type CatalogCardImage = {
  src: string;
  srcSet: string;
  alt: string;
};

const CARD_WIDTHS = [700, 1200, 1600, 2000] as const;

/** Upgrade catalog CDN URLs to higher resolutions for catalog cards. */
export function upscaleCatalogImage(
  url: string,
  width: number = 1200,
): string {
  if (!url || url === "#") return "";
  if (url.includes("/std/") && /\/std\/\d+x0\//.test(url)) {
    return url.replace(/\/std\/\d+x0\//, `/std/${width}x0/`);
  }
  return url;
}

function buildSrcSet(url: string): string {
  if (!url) return "";
  return CARD_WIDTHS.map((w) => `${upscaleCatalogImage(url, w)} ${w}w`).join(
    ", ",
  );
}

/** Card image from the product's own catalog photos (not stock placeholders). */
export function getCatalogCardImage(
  product: CollectionProduct,
): CatalogCardImage | null {
  const primary = product.images.find(
    (url) => url && url !== "#" && url.startsWith("http"),
  );
  if (!primary) return null;

  return {
    src: upscaleCatalogImage(primary, 1200),
    srcSet: buildSrcSet(primary),
    alt: product.title,
  };
}
