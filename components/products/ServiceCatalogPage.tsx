"use client";



import { useCallback, useEffect, useMemo, useState } from "react";

import { useBodyClass } from "@/hooks/useBodyClass";

import { CatalogCategoryHero } from "@/components/products/CatalogCategoryHero";

import { CatalogFilterToolbar } from "@/components/products/CatalogFilterToolbar";

import { CatalogFiltersDrawer } from "@/components/products/CatalogFiltersDrawer";

import { CatalogPageFooter } from "@/components/products/CatalogPageFooter";
import { CatalogProductGrid } from "@/components/products/CatalogProductGrid";

import {

  countDrawerFilters,

  productMatchesDrawerFilters,

} from "@/lib/catalog-drawer-filters";

import {

  CATALOG_SERVICE_DEFAULTS,

  getCategoryById,

  productMatchesCategory,

  type CatalogServiceCategory,

} from "@/lib/catalog-service-categories";

import type { CatalogFilters, CatalogPageData } from "@/lib/catalog-types";
import { ITEMS_PER_PAGE } from "@/lib/catalog-types";
import { filterCatalogProducts } from "@/lib/catalog-products";
import { customizeOrderHref } from "@/lib/customize-order";



import "@/app/styles/products-catalog.css";

import "@/app/styles/service-catalog.css";



type ServiceCatalogPageProps = {

  data: CatalogPageData;

  serviceSlug: string;

  serviceLabel: string;

  categories: CatalogServiceCategory[];

};



function buildDefaultFilters(data: CatalogPageData): CatalogFilters {

  return {

    productTypeIds: [],

    roomSlugs: [],

    tagIds: [],

    drawerFilters: {},

    searchQuery: "",

    selectedColors: [],

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

  let count =

    filters.productTypeIds.length +

    filters.roomSlugs.length +

    filters.tagIds.length +

    countDrawerFilters(filters.drawerFilters);

  if (filters.searchQuery.trim()) count += 1;

  if (filters.selectedColors.length) count += filters.selectedColors.length;

  if (filters.onlineOnly) count += 1;

  if (

    filters.priceMin > data.priceRange.min ||

    filters.priceMax < data.priceRange.max

  ) {

    count += 1;

  }

  return count;

}



export function ServiceCatalogPage({

  data,

  serviceSlug,

  serviceLabel,

  categories,

}: ServiceCatalogPageProps) {

  const defaults = CATALOG_SERVICE_DEFAULTS[serviceSlug] ??

    CATALOG_SERVICE_DEFAULTS.furniture;



  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const [filters, setFilters] = useState<CatalogFilters>(() =>

    buildDefaultFilters(data),

  );

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [drawerSection, setDrawerSection] = useState<string | null>(null);

  useBodyClass("h-noscroll", drawerOpen);

  const [draftFilters, setDraftFilters] = useState<CatalogFilters>(() =>

    buildDefaultFilters(data),

  );

  const [loadCount, setLoadCount] = useState(ITEMS_PER_PAGE);



  const activeCategory = getCategoryById(categories, activeCategoryId);

  const heading = activeCategory?.heading ?? defaults.heading;

  const exploreLabel = activeCategory?.exploreLabel ?? defaults.exploreLabel;

  const customizeHref = useMemo(
    () =>
      customizeOrderHref({
        service: serviceSlug,
        category: activeCategoryId ?? undefined,
      }),
    [activeCategoryId, serviceSlug],
  );

  const tagLabelById = useMemo(() => {

    const map = new Map<number, string>();

    for (const tag of data.tags) map.set(tag.id, tag.label);

    return map;

  }, [data.tags]);



  const categoryFiltered = useMemo(

    () =>

      data.products.filter((product) =>

        productMatchesCategory(product, activeCategoryId, categories),

      ),

    [activeCategoryId, categories, data.products],

  );



  const filtered = useMemo(() => {

    const base = filterCatalogProducts(categoryFiltered, filters);

    return base.filter((product) =>

      productMatchesDrawerFilters(product, activeCategoryId, filters.drawerFilters),

    );

  }, [activeCategoryId, categoryFiltered, filters]);



  const visible = useMemo(

    () => filtered.slice(0, loadCount),

    [filtered, loadCount],

  );

  const hasMore = loadCount < filtered.length;

  const productImages = useMemo(

    () => data.products.flatMap((product) => product.images).filter(Boolean),

    [data.products],

  );

  useEffect(() => {

    setLoadCount(ITEMS_PER_PAGE);

  }, [

    activeCategoryId,

    filters.productTypeIds,

    filters.roomSlugs,

    filters.tagIds,

    filters.drawerFilters,

    filters.searchQuery,

    filters.selectedColors,

    filters.priceMin,

    filters.priceMax,

    filters.onlineOnly,

    filters.sort,

  ]);



  const activeCount = countActiveFilters(filters, data);

  const draftResultCount = useMemo(() => {

    const base = filterCatalogProducts(categoryFiltered, draftFilters);

    return base.filter((product) =>

      productMatchesDrawerFilters(

        product,

        activeCategoryId,

        draftFilters.drawerFilters,

      ),

    ).length;

  }, [activeCategoryId, categoryFiltered, draftFilters]);



  const openDrawer = useCallback(

    (section?: string) => {

      setDraftFilters(filters);

      setDrawerSection(section ?? null);

      setDrawerOpen(true);

    },

    [filters],

  );



  const closeDrawer = useCallback(() => setDrawerOpen(false), []);



  const applyDrawer = useCallback(() => {

    setFilters(draftFilters);

    setDrawerOpen(false);

  }, [draftFilters]);



  const handleCategoryChange = useCallback((categoryId: string | null) => {

    setActiveCategoryId(categoryId);

    setFilters((prev) => ({ ...prev, drawerFilters: {}, page: 1 }));

  }, []);



  return (

    <main id="main-content" className="mk-service-catalog" role="main">

      <CatalogCategoryHero

        serviceLabel={serviceLabel}

        heading={heading}

        exploreLabel={exploreLabel}

        ctaHref={customizeHref}

        categories={categories}

        activeCategoryId={activeCategoryId}

        onCategoryChange={handleCategoryChange}

      />



      <div className="mk-service-catalog__body" id="mk-catalog-products">

        <CatalogFilterToolbar

          filters={filters}

          resultCount={filtered.length}

          activeFilterCount={activeCount}

          onOpenDrawer={openDrawer}

          onSortChange={(sort) => setFilters({ ...filters, sort, page: 1 })}

        />



        <div className="mk-service-catalog__main">

          {visible.length > 0 ? (

            <CatalogProductGrid

              products={visible}

              serviceSlug={serviceSlug}

              tagLabelById={tagLabelById}

            />

          ) : (

            <div className="mk-products__empty">

              <p>No products match your filters.</p>

              <button

                type="button"

                className="mk-products__empty-btn"

                onClick={() => {

                  setActiveCategoryId(null);

                  setFilters(buildDefaultFilters(data));

                }}

              >

                Clear all filters

              </button>

            </div>

          )}



          {filtered.length > 0 ? (

            <div className="mk-catalog-load-more">

              <p className="mk-catalog-load-more__count">

                Showing {visible.length} of {filtered.length} products

              </p>

              {hasMore ? (

                <button

                  type="button"

                  className="mk-catalog-load-more__btn"

                  onClick={() => setLoadCount((count) => count + ITEMS_PER_PAGE)}

                >

                  Load more products

                </button>

              ) : null}

            </div>

          ) : null}

        </div>

      </div>



      <CatalogPageFooter

        serviceSlug={serviceSlug}

        categories={categories}

        productImages={productImages}

        onCategorySelect={(categoryId) => handleCategoryChange(categoryId)}

      />



      <CatalogFiltersDrawer

        open={drawerOpen}

        data={data}

        filters={draftFilters}

        activeCategoryId={activeCategoryId}

        resultCount={draftResultCount}

        initialSection={drawerSection}

        onClose={closeDrawer}

        onChange={setDraftFilters}

        onApply={applyDrawer}

      />

    </main>

  );

}

