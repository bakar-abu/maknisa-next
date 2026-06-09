"use client";

import type { CatalogFilters, CatalogPageData } from "@/lib/catalog-types";
import { PRODUCT_TYPE_BY_ID } from "@/lib/product-types";

type ProductsActiveFiltersProps = {
  data: CatalogPageData;
  filters: CatalogFilters;
  onChange: (next: CatalogFilters) => void;
};

export function ProductsActiveFilters({
  data,
  filters,
  onChange,
}: ProductsActiveFiltersProps) {
  const chips: { key: string; label: string; remove: () => void }[] = [];

  for (const id of filters.productTypeIds) {
    const type = PRODUCT_TYPE_BY_ID.get(id);
    if (!type) continue;
    chips.push({
      key: `type-${id}`,
      label: type.label,
      remove: () =>
        onChange({
          ...filters,
          productTypeIds: filters.productTypeIds.filter((v) => v !== id),
          page: 1,
        }),
    });
  }

  for (const slug of filters.roomSlugs) {
    const room = data.rooms.find((r) => r.slug === slug);
    if (!room) continue;
    chips.push({
      key: `room-${slug}`,
      label: room.label,
      remove: () =>
        onChange({
          ...filters,
          roomSlugs: filters.roomSlugs.filter((v) => v !== slug),
          page: 1,
        }),
    });
  }

  for (const id of filters.tagIds) {
    const tag = data.tags.find((t) => t.id === id);
    if (!tag) continue;
    chips.push({
      key: `tag-${id}`,
      label: tag.label,
      remove: () =>
        onChange({
          ...filters,
          tagIds: filters.tagIds.filter((v) => v !== id),
          page: 1,
        }),
    });
  }

  if (filters.onlineOnly) {
    chips.push({
      key: "online",
      label: "Online only",
      remove: () => onChange({ ...filters, onlineOnly: false, page: 1 }),
    });
  }

  if (
    filters.priceMin > data.priceRange.min ||
    filters.priceMax < data.priceRange.max
  ) {
    chips.push({
      key: "price",
      label: "Price range",
      remove: () =>
        onChange({
          ...filters,
          priceMin: data.priceRange.min,
          priceMax: data.priceRange.max,
          page: 1,
        }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="mk-products__chips" aria-label="Active filters">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          className="mk-products__chip"
          onClick={chip.remove}
        >
          {chip.label}
          <span aria-hidden="true">×</span>
        </button>
      ))}
    </div>
  );
}
