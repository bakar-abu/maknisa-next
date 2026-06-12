"use client";

import { useMemo, useState } from "react";
import type { CatalogFilters, CatalogPageData } from "@/lib/catalog-types";
import { PRICE_TIER_BOUNDS } from "@/lib/catalog-types";
import {
  countByProductType,
  countByRoom,
  countByTagFacet,
  filterCatalogProducts,
} from "@/lib/catalog-products";
import { formatPkr } from "@/lib/format-price";
import { getProductTypesByGroup } from "@/lib/product-types";

type ProductsFilterPanelProps = {
  data: CatalogPageData;
  filters: CatalogFilters;
  onChange: (next: CatalogFilters) => void;
  onApply?: () => void;
  showApply?: boolean;
  resultCount?: number;
};

function toggleId(list: number[], id: number): number[] {
  return list.includes(id) ? list.filter((v) => v !== id) : [...list, id];
}

function toggleSlug<T extends string>(list: T[], slug: T): T[] {
  return list.includes(slug) ? list.filter((v) => v !== slug) : [...list, slug];
}

export function ProductsFilterPanel({
  data,
  filters,
  onChange,
  onApply,
  showApply = false,
  resultCount,
}: ProductsFilterPanelProps) {
  const [stylesExpanded, setStylesExpanded] = useState(false);

  const baseFilters = useMemo(
    () => ({
      roomSlugs: filters.roomSlugs,
      tagIds: filters.tagIds,
      drawerFilters: filters.drawerFilters,
      priceMin: filters.priceMin,
      priceMax: filters.priceMax,
      onlineOnly: filters.onlineOnly,
      sort: filters.sort,
      page: 1,
      productTypeIds: [] as number[],
    }),
    [filters],
  );

  const visibleTypes = data.productTypes;
  const typesByGroup = useMemo(() => {
    const ids = new Set(visibleTypes.map((t) => t.id));
    const grouped = getProductTypesByGroup();
    const result = new Map<string, typeof visibleTypes>();
    for (const [group, types] of grouped) {
      const items = types.filter((t) => ids.has(t.id));
      if (items.length > 0) result.set(group, items);
    }
    return result;
  }, [visibleTypes]);

  const facetFilters = useMemo(
    () => ({ ...filters, tagIds: [], page: 1 }),
    [filters],
  );

  const facetTags = useMemo(() => {
    return data.tags
      .map((tag) => ({
        ...tag,
        facetCount: countByTagFacet(data.products, tag.id, facetFilters),
      }))
      .filter((tag) => tag.facetCount > 0);
  }, [data.products, data.tags, facetFilters]);

  const visibleTags = stylesExpanded ? facetTags : facetTags.slice(0, 12);

  const update = (patch: Partial<CatalogFilters>) => {
    onChange({ ...filters, ...patch, page: 1 });
  };

  const clearAll = () => {
    onChange({
      productTypeIds: [],
      roomSlugs: [],
      tagIds: [],
      drawerFilters: {},
      priceMin: data.priceRange.min,
      priceMax: data.priceRange.max,
      onlineOnly: false,
      sort: filters.sort,
      page: 1,
    });
  };

  const activeFilterCount =
    filters.productTypeIds.length +
    filters.roomSlugs.length +
    filters.tagIds.length +
    (filters.onlineOnly ? 1 : 0) +
    (filters.priceMin > data.priceRange.min ||
    filters.priceMax < data.priceRange.max
      ? 1
      : 0);

  return (
    <div className="mk-products__filters">
      <div className="mk-products__filters-head">
        <h2 className="mk-products__filters-title">Filters</h2>
        {activeFilterCount > 0 ? (
          <button
            type="button"
            className="mk-products__filters-clear"
            onClick={clearAll}
          >
            Clear all
          </button>
        ) : null}
      </div>

      <section className="mk-products__filter-section">
        <h3 className="mk-products__filter-label">Product type</h3>
        <div className="mk-products__filter-groups">
          {[...typesByGroup.entries()].map(([group, types]) => (
            <div key={group} className="mk-products__filter-group">
              <p className="mk-products__filter-group-title">{group}</p>
              <ul className="mk-products__filter-list">
                {types.map((type) => {
                  const count = countByProductType(
                    data.products,
                    type.id,
                    baseFilters,
                  );
                  if (count === 0) return null;
                  const checked = filters.productTypeIds.includes(type.id);
                  return (
                    <li key={type.id}>
                      <label className="mk-products__filter-check">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            update({
                              productTypeIds: toggleId(
                                filters.productTypeIds,
                                type.id,
                              ),
                            })
                          }
                        />
                        <span>{type.label}</span>
                        <span className="mk-products__filter-count">{count}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mk-products__filter-section">
        <h3 className="mk-products__filter-label">Room</h3>
        <ul className="mk-products__filter-list">
          {data.rooms.map((room) => {
            const count = countByRoom(data.products, room.slug, {
              ...baseFilters,
              productTypeIds: filters.productTypeIds,
            });
            if (count === 0) return null;
            const checked = filters.roomSlugs.includes(room.slug);
            return (
              <li key={room.slug}>
                <label className="mk-products__filter-check">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      update({
                        roomSlugs: toggleSlug(filters.roomSlugs, room.slug),
                      })
                    }
                  />
                  <span>{room.label}</span>
                  <span className="mk-products__filter-count">{count}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </section>

      {facetTags.length > 0 ? (
        <section className="mk-products__filter-section">
          <h3 className="mk-products__filter-label">Style</h3>
          <ul className="mk-products__filter-list">
            {visibleTags.map((tag) => {
              const checked = filters.tagIds.includes(tag.id);
              return (
                <li key={tag.id}>
                  <label className="mk-products__filter-check">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        update({
                          tagIds: toggleId(filters.tagIds, tag.id),
                        })
                      }
                    />
                    <span>{tag.label}</span>
                    <span className="mk-products__filter-count">
                      {tag.facetCount}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
          {facetTags.length > 12 ? (
            <button
              type="button"
              className="mk-products__filter-more"
              onClick={() => setStylesExpanded((v) => !v)}
            >
              {stylesExpanded ? "Show fewer styles" : "Show more styles"}
            </button>
          ) : null}
        </section>
      ) : null}

      <section className="mk-products__filter-section">
        <h3 className="mk-products__filter-label">Price range</h3>
        <div className="mk-products__price-range">
          <div className="mk-products__price-inputs">
            <label>
              <span>Min</span>
              <input
                type="range"
                min={data.priceRange.min}
                max={data.priceRange.max}
                step={50_000}
                value={filters.priceMin}
                onChange={(e) =>
                  update({
                    priceMin: Math.min(
                      Number(e.target.value),
                      filters.priceMax - 50_000,
                    ),
                  })
                }
              />
            </label>
            <label>
              <span>Max</span>
              <input
                type="range"
                min={data.priceRange.min}
                max={data.priceRange.max}
                step={50_000}
                value={filters.priceMax}
                onChange={(e) =>
                  update({
                    priceMax: Math.max(
                      Number(e.target.value),
                      filters.priceMin + 50_000,
                    ),
                  })
                }
              />
            </label>
          </div>
          <p className="mk-products__price-values">
            {formatPkr(filters.priceMin)} – {formatPkr(filters.priceMax)}
          </p>
          <div className="mk-products__price-tiers">
            {(
              Object.entries(PRICE_TIER_BOUNDS) as [
                keyof typeof PRICE_TIER_BOUNDS,
                (typeof PRICE_TIER_BOUNDS)[keyof typeof PRICE_TIER_BOUNDS],
              ][]
            ).map(([, tier]) => (
              <button
                key={tier.label}
                type="button"
                className="mk-products__price-tier"
                onClick={() =>
                  update({ priceMin: tier.min, priceMax: tier.max })
                }
              >
                {tier.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mk-products__filter-section">
        <label className="mk-products__filter-check mk-products__filter-check--solo">
          <input
            type="checkbox"
            checked={filters.onlineOnly}
            onChange={(e) => update({ onlineOnly: e.target.checked })}
          />
          <span>Available online only</span>
        </label>
      </section>

      {showApply ? (
        <div className="mk-products__filters-footer">
          <button
            type="button"
            className="mk-products__apply-btn"
            onClick={onApply}
          >
            Show {resultCount ?? filterCatalogProducts(data.products, filters).length}{" "}
            products
          </button>
        </div>
      ) : null}
    </div>
  );
}
