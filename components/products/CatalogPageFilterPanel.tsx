"use client";

import { useEffect, useRef, useState } from "react";
import { CatalogDrawerFilterFields } from "@/components/products/CatalogDrawerFilterFields";
import type { CatalogFilters, CatalogPageData } from "@/lib/catalog-types";

type CatalogPageFilterPanelProps = {
  data: CatalogPageData;
  filters: CatalogFilters;
  activeFilterCount: number;
  onFiltersChange: (next: CatalogFilters) => void;
  onOpenDrawer: () => void;
};

function getHeaderOffset(): number {
  if (typeof window === "undefined") return 60;
  return window.matchMedia("(min-width: 80em)").matches ? 80 : 60;
}

export function CatalogPageFilterPanel({
  data,
  filters,
  activeFilterCount,
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

  return (
    <>
      <div ref={sentinelRef} className="mk-catalog-toolbar__sentinel" aria-hidden="true" />
      <div
        ref={toolbarRef}
        className={`mk-catalog-toolbar${sticky ? " is-sticky" : ""}`}
        data-sticky={sticky ? "true" : "false"}
      >
        <div className="mk-catalog-toolbar__inner mk-catalog-toolbar__inner--filters">
          <CatalogDrawerFilterFields
            filters={filters}
            data={data}
            onChange={onFiltersChange}
            idPrefix="page"
            variant="page"
          />

          <button
            type="button"
            className="mk-catalog-toolbar__all mk-catalog-page-filters__all-btn"
            onClick={onOpenDrawer}
          >
            All filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </button>
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
