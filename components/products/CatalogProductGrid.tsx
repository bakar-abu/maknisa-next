"use client";

import { useMemo } from "react";
import { CatalogPromoCard } from "@/components/products/CatalogPromoCard";
import { ProductCatalogCard } from "@/components/products/ProductCatalogCard";
import { buildCatalogGridCells } from "@/lib/catalog-grid-layout";
import { getCatalogPromoCards } from "@/lib/catalog-promo-cards";
import type { CatalogProduct } from "@/lib/catalog-types";

type CatalogProductGridProps = {
  products: CatalogProduct[];
  serviceSlug: string;
  tagLabelById: Map<number, string>;
};

export function CatalogProductGrid({
  products,
  serviceSlug,
  tagLabelById,
}: CatalogProductGridProps) {
  const promos = useMemo(
    () => getCatalogPromoCards(serviceSlug, products),
    [products, serviceSlug],
  );

  const cells = useMemo(
    () => buildCatalogGridCells(products, promos),
    [products, promos],
  );

  return (
    <div className="mk-bc-product-list" role="list">
      {cells.map((cell) => {
        if (cell.kind === "promo") {
          return (
            <CatalogPromoCard
              key={`promo-${cell.promo.id}-${cell.align}`}
              promo={cell.promo}
              align={cell.align}
            />
          );
        }

        const styleLabels = cell.product.tagIds
          .map((id) => tagLabelById.get(id))
          .filter((label): label is string => Boolean(label));

        return (
          <ProductCatalogCard
            key={`${cell.product.collectionSlug}-${cell.product.id}-${cell.placement}`}
            product={cell.product}
            styleLabels={styleLabels}
            variant="service"
            placement={cell.placement}
          />
        );
      })}
    </div>
  );
}
