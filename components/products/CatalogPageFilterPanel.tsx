"use client";

import { useEffect, useRef, useState } from "react";
import type { CatalogFilters, CatalogSort } from "@/lib/catalog-types";

const FILTER_CHIPS = [
  { id: "colour", label: "Colour" },
  { id: "material", label: "Material" },
  { id: "collection", label: "Collection" },
  { id: "price", label: "Price" },
] as const;

const SORT_OPTIONS: { value: CatalogSort; label: string }[] = [
  { value: "recommended", label: "Relevance" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

type CatalogPageFilterPanelProps = {
  filters: CatalogFilters;
  activeFilterCount: number;
  resultCount: number;
  onFiltersChange: (next: CatalogFilters) => void;
  onOpenDrawer: (section?: string) => void;
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function getHeaderOffset(): number {
  if (typeof window === "undefined") return 60;
  return window.matchMedia("(min-width: 80em)").matches ? 80 : 60;
}

export function CatalogPageFilterPanel({
  filters,
  activeFilterCount,
  resultCount,
  onFiltersChange,
  onOpenDrawer,
}: CatalogPageFilterPanelProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [sticky, setSticky] = useState(false);
  const [toolbarHeight, setToolbarHeight] = useState(56);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setSticky(!entry.isIntersecting),
      { rootMargin: `-${getHeaderOffset()}px 0px 0px 0px`, threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    if (!toolbar) return;

    const measure = () => setToolbarHeight(toolbar.offsetHeight);
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(toolbar);
    return () => ro.disconnect();
  }, []);

  const itemLabel = resultCount === 1 ? "item" : "items";

  return (
    <>
      <div ref={sentinelRef} className="mk-catalog-toolbar__sentinel" aria-hidden="true" />
      <div
        ref={toolbarRef}
        className={`mk-catalog-toolbar${sticky ? " is-sticky" : ""}`}
        data-sticky={sticky ? "true" : "false"}
      >
        <div className="mk-catalog-toolbar__inner mk-catalog-toolbar__inner--chips">
          <div className="mk-catalog-toolbar__leading">
            <div className="mk-catalog-toolbar__filters">
              <button
                type="button"
                className="mk-catalog-toolbar__all"
                onClick={() => onOpenDrawer()}
              >
                All filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
              </button>
              {FILTER_CHIPS.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  className="mk-catalog-toolbar__chip"
                  onClick={() => onOpenDrawer(chip.id)}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <label className="mk-catalog-toolbar__search" htmlFor="catalog-toolbar-search">
              <span className="mk-catalog-toolbar__search-icon">
                <SearchIcon />
              </span>
              <input
                id="catalog-toolbar-search"
                type="search"
                value={filters.searchQuery}
                placeholder="Search sofas, chairs, tables..."
                onChange={(event) =>
                  onFiltersChange({
                    ...filters,
                    searchQuery: event.target.value,
                    page: 1,
                  })
                }
              />
            </label>
          </div>

          <div className="mk-catalog-toolbar__meta">
            <p className="mk-catalog-toolbar__count">
              {resultCount} {itemLabel}
            </p>
            <label className="mk-catalog-toolbar__sort">
              <span className="sr-only">Sort products</span>
              <select
                value={filters.sort}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    sort: e.target.value as CatalogSort,
                    page: 1,
                  })
                }
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>
      {sticky ? (
        <div
          className="mk-catalog-toolbar__spacer"
          style={{ height: toolbarHeight }}
          aria-hidden="true"
        />
      ) : null}
    </>
  );
}
