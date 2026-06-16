"use client";

import { useEffect, useRef, useState } from "react";
import type { CatalogFilters } from "@/lib/catalog-types";

type DrawerSection = "colour" | "material" | "collection" | "price";

type CatalogFilterToolbarProps = {
  filters: CatalogFilters;
  resultCount: number;
  activeFilterCount: number;
  onOpenDrawer: (section?: DrawerSection) => void;
  onSortChange: (sort: CatalogFilters["sort"]) => void;
};

function getHeaderOffset(): number {
  if (typeof window === "undefined") return 60;
  return window.matchMedia("(min-width: 80em)").matches ? 80 : 60;
}

export function CatalogFilterToolbar({
  filters,
  resultCount,
  activeFilterCount,
  onOpenDrawer,
  onSortChange,
}: CatalogFilterToolbarProps) {
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

  return (
    <>
      <div ref={sentinelRef} className="mk-catalog-toolbar__sentinel" aria-hidden="true" />
      <div
        ref={toolbarRef}
        className={`mk-catalog-toolbar${sticky ? " is-sticky" : ""}`}
        data-sticky={sticky ? "true" : "false"}
      >
        <div className="mk-catalog-toolbar__inner">
          <div className="mk-catalog-toolbar__filters">
            <button
              type="button"
              className="mk-catalog-toolbar__all"
              onClick={() => onOpenDrawer()}
            >
              All filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </button>

            <button
              type="button"
              className="mk-catalog-toolbar__chip"
              onClick={() => onOpenDrawer("colour")}
            >
              Colour
            </button>

            <button
              type="button"
              className="mk-catalog-toolbar__chip"
              onClick={() => onOpenDrawer("material")}
            >
              Material
            </button>

            <button
              type="button"
              className="mk-catalog-toolbar__chip"
              onClick={() => onOpenDrawer("collection")}
            >
              Collection
            </button>

            <button
              type="button"
              className="mk-catalog-toolbar__chip"
              onClick={() => onOpenDrawer("price")}
            >
              Price
            </button>
          </div>

          <div className="mk-catalog-toolbar__meta">
            <span className="mk-catalog-toolbar__count">{resultCount} items</span>
            <label className="mk-catalog-toolbar__sort">
              <span className="sr-only">Sort products</span>
              <select
                value={filters.sort}
                onChange={(event) =>
                  onSortChange(event.target.value as CatalogFilters["sort"])
                }
                aria-label="Sort products"
              >
                <option value="recommended">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name A–Z</option>
                <option value="name-desc">Name Z–A</option>
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
