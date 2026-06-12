import type { CatalogProduct } from "./catalog-types";
import type { CatalogPromoCard } from "./catalog-promo-cards";

export const PRODUCTS_PER_ROW = 4;
export const PRODUCT_ROWS_BEFORE_PROMO = 2;
export const PRODUCTS_BEFORE_PROMO = PRODUCTS_PER_ROW * PRODUCT_ROWS_BEFORE_PROMO;
export const SIDE_PRODUCTS_BESIDE_PROMO = 2;

export type PromoAlign = "left" | "right";

export type CatalogGridProductCell = {
  kind: "product";
  product: CatalogProduct;
  placement: "default" | "promo-side-left" | "promo-side-right";
};

export type CatalogGridPromoCell = {
  kind: "promo";
  promo: CatalogPromoCard;
  align: PromoAlign;
};

export type CatalogGridCell = CatalogGridProductCell | CatalogGridPromoCell;

export function buildCatalogGridCells(
  products: CatalogProduct[],
  promos: CatalogPromoCard[],
): CatalogGridCell[] {
  if (products.length === 0) return [];

  const cells: CatalogGridCell[] = [];
  let index = 0;
  let promoIndex = 0;

  while (index < products.length) {
    const rowChunk = products.slice(index, index + PRODUCTS_BEFORE_PROMO);
    for (const product of rowChunk) {
      cells.push({ kind: "product", product, placement: "default" });
    }
    index += rowChunk.length;

    if (rowChunk.length < PRODUCTS_BEFORE_PROMO || index >= products.length) {
      break;
    }

    if (promos.length > 0) {
      const align: PromoAlign = promoIndex % 2 === 0 ? "left" : "right";
      const promo = promos[promoIndex % promos.length];
      promoIndex += 1;

      const sideChunk = products.slice(index, index + SIDE_PRODUCTS_BESIDE_PROMO);
      const sidePlacement =
        align === "left" ? "promo-side-left" : "promo-side-right";

      if (align === "left") {
        cells.push({ kind: "promo", promo, align });
        for (const product of sideChunk) {
          cells.push({ kind: "product", product, placement: sidePlacement });
        }
      } else {
        for (const product of sideChunk) {
          cells.push({ kind: "product", product, placement: sidePlacement });
        }
        cells.push({ kind: "promo", promo, align });
      }

      index += sideChunk.length;
      continue;
    }

    const sideChunk = products.slice(index, index + SIDE_PRODUCTS_BESIDE_PROMO);
    for (const product of sideChunk) {
      cells.push({ kind: "product", product, placement: "promo-side-left" });
    }
    index += sideChunk.length;
  }

  return cells;
}
