"use client";

import { useCallback, useMemo, useState } from "react";
import { useBodyClass } from "@/hooks/useBodyClass";
import { MagazineBreadcrumbs } from "@/components/magazine/MagazineBreadcrumbs";
import { ProductCatalogCard } from "@/components/products/ProductCatalogCard";
import { ProductsActiveFilters } from "@/components/products/ProductsActiveFilters";
import { ProductsFilterPanel } from "@/components/products/ProductsFilterPanel";
import type { CatalogFilters, CatalogPageData } from "@/lib/catalog-types";
import {
  filterCatalogProducts,
  getCatalogTotalPages,
  paginateCatalogProducts,
} from "@/lib/catalog-products";

type ProductsCatalogPageProps = {
  data: CatalogPageData;
};

function buildDefaultFilters(data: CatalogPageData): CatalogFilters {
  return {
    productTypeIds: [],
    roomSlugs: [],
    tagIds: [],
    drawerFilters: {},
    priceMin: data.priceRange.min,
    priceMax: data.priceRange.max,
    onlineOnly: false,
    sort: "recommended",
    page: 1,
  };
}

function countActiveFilters(
  filters: CatalogFilters,
  data: CatalogPageData,
): number {
  let count = filters.productTypeIds.length + filters.roomSlugs.length + filters.tagIds.length;
  if (filters.onlineOnly) count += 1;
  if (
    filters.priceMin > data.priceRange.min ||
    filters.priceMax < data.priceRange.max
  ) {
    count += 1;
  }
  return count;
}

export function ProductsCatalogPage({ data }: ProductsCatalogPageProps) {
  const [filters, setFilters] = useState<CatalogFilters>(() =>
    buildDefaultFilters(data),
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  useBodyClass("h-noscroll", drawerOpen);
  const [draftFilters, setDraftFilters] = useState<CatalogFilters>(() =>
    buildDefaultFilters(data),
  );

  const tagLabelById = useMemo(() => {
    const map = new Map<number, string>();
    for (const tag of data.tags) map.set(tag.id, tag.label);
    return map;
  }, [data.tags]);

  const filtered = useMemo(
    () => filterCatalogProducts(data.products, filters),
    [data.products, filters],
  );

  const totalPages = getCatalogTotalPages(filtered.length);
  const visible = useMemo(
    () => paginateCatalogProducts(filtered, filters.page),
    [filtered, filters.page],
  );

  const activeCount = countActiveFilters(filters, data);
  const draftResultCount = filterCatalogProducts(data.products, draftFilters).length;

  const openDrawer = useCallback(() => {
    setDraftFilters(filters);
    setDrawerOpen(true);
  }, [filters]);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const applyDrawer = useCallback(() => {
    setFilters(draftFilters);
    setDrawerOpen(false);
  }, [draftFilters]);

  return (
    <main id="main-content" className="mk-products" role="main">
      <div className="mk-products__hero">
        <div className="mk-products__container">
          <MagazineBreadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Products" }]}
          />
          <h1 className="mk-products__title">{data.h1}</h1>
          <p className="mk-products__intro">{data.intro}</p>
        </div>
      </div>

      <div className="mk-products__layout">
        <aside className="mk-products__sidebar" aria-label="Product filters">
          <ProductsFilterPanel data={data} filters={filters} onChange={setFilters} />
        </aside>

        <div className="mk-products__main">
          <div className="mk-products__toolbar">
            <div className="mk-products__toolbar-left">
              <button
                type="button"
                className="mk-products__filter-toggle d-lg-none"
                onClick={openDrawer}
                aria-expanded={drawerOpen}
              >
                Filters{activeCount > 0 ? ` (${activeCount})` : ""}
              </button>
              <p className="mk-products__result-count">
                Showing {visible.length} of {filtered.length} products
              </p>
            </div>
            <div className="mk-products__toolbar-right">
              <label className="mk-products__sort">
                <span className="sr-only">Sort products</span>
                <span aria-hidden="true">Sort</span>
                <select
                  value={filters.sort}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      sort: e.target.value as CatalogFilters["sort"],
                      page: 1,
                    })
                  }
                >
                  <option value="recommended">Recommended</option>
                  <option value="name-asc">Name A–Z</option>
                  <option value="name-desc">Name Z–A</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </label>
            </div>
          </div>

          <ProductsActiveFilters data={data} filters={filters} onChange={setFilters} />

          {visible.length > 0 ? (
            <div className="mk-products__grid" role="list">
              {visible.map((product) => {
                const styleLabels = product.tagIds
                  .map((id) => tagLabelById.get(id))
                  .filter((l): l is string => Boolean(l));
                return (
                  <ProductCatalogCard
                    key={`${product.collectionSlug}-${product.id}`}
                    product={product}
                    styleLabels={styleLabels}
                  />
                );
              })}
            </div>
          ) : (
            <div className="mk-products__empty">
              <p>No products match your filters.</p>
              <button
                type="button"
                className="mk-products__empty-btn"
                onClick={() => setFilters(buildDefaultFilters(data))}
              >
                Clear all filters
              </button>
            </div>
          )}

          {totalPages > 1 ? (
            <nav className="mk-products__pagination" aria-label="Products pagination">
              <ul>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <li key={page}>
                    <button
                      type="button"
                      className={
                        page === filters.page
                          ? "mk-products__page is-active"
                          : "mk-products__page"
                      }
                      aria-current={page === filters.page ? "page" : undefined}
                      onClick={() => setFilters({ ...filters, page })}
                    >
                      {page}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </div>

      {drawerOpen ? (
        <div className="mk-products__drawer-root" role="presentation">
          <button
            type="button"
            className="mk-products__drawer-backdrop"
            aria-label="Close filters"
            onClick={closeDrawer}
          />
          <div
            className="mk-products__drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Product filters"
          >
            <div className="mk-products__drawer-head">
              <h2>Filters</h2>
              <button
                type="button"
                className="mk-products__drawer-close"
                onClick={closeDrawer}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="mk-products__drawer-body">
              <ProductsFilterPanel
                data={data}
                filters={draftFilters}
                onChange={setDraftFilters}
                showApply
                resultCount={draftResultCount}
                onApply={applyDrawer}
              />
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
