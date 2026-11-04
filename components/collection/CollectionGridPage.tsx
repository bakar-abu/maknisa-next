"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { CollectionGridHero } from "@/components/collection/CollectionGridHero";
import { CollectionProductCard } from "@/components/collection/CollectionProductCard";
import { MagazineBreadcrumbs } from "@/components/magazine/MagazineBreadcrumbs";
import type {
  CollectionGridData,
  CollectionProduct,
  CollectionTag,
} from "@/lib/collection-types";
import {
  buildServiceFiltersWithImages,
  productMatchesServiceFilter,
  type CollectionServiceFilter,
  type ServiceFilterSetId,
} from "@/lib/collection-service-filters";
import { CUSTOMIZE_ORDER_HREF } from "@/lib/routes";
import { site } from "@/lib/site";

import "@/app/styles/collection-grid-hero.css";

type CollectionGridPageProps = {
  data: CollectionGridData;
  allProducts: CollectionProduct[];
  useServiceHero?: boolean;
  heroTitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  filterSetId?: ServiceFilterSetId;
  serviceFilters?: CollectionServiceFilter[];
  /** product id → service category slug (from CMS) */
  productCategoryById?: Record<string, string | null>;
};

function productMatchesCategories(
  product: CollectionProduct,
  categoryIds: number[],
) {
  if (categoryIds.length === 0) return true;
  return product.categoryIds.some((id) => categoryIds.includes(id));
}

export function CollectionGridPage({
  data,
  allProducts,
  useServiceHero = false,
  heroTitle,
  ctaLabel = "Customize your kitchen",
  ctaHref = CUSTOMIZE_ORDER_HREF,
  filterSetId = "kitchens",
  serviceFilters: serviceFiltersProp,
  productCategoryById,
}: CollectionGridPageProps) {
  const [activeCategoryIds, setActiveCategoryIds] = useState<number[]>(
    data.primaryCategoryIds,
  );
  const [activeStyleId, setActiveStyleId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const serviceFilters = useMemo(
    () =>
      serviceFiltersProp ??
      buildServiceFiltersWithImages(data.products, filterSetId),
    [data.products, filterSetId, serviceFiltersProp],
  );

  const tagsById = useMemo(() => {
    const map = new Map<number, CollectionTag>();
    for (const tag of data.tags) map.set(tag.id, tag);
    for (const product of allProducts) {
      for (const id of product.tagIds) {
        if (!map.has(id)) {
          const found = data.tags.find((t) => t.id === id);
          if (found) map.set(id, found);
        }
      }
    }
    return map;
  }, [allProducts, data.tags]);

  const pool = useMemo(() => {
    if (useServiceHero) {
      const useCmsCategories = Boolean(serviceFiltersProp && productCategoryById);

      return data.products.filter((product) => {
        if (useCmsCategories) {
          if (!activeStyleId) return true;
          return productCategoryById?.[product.id] === activeStyleId;
        }

        return productMatchesServiceFilter(product, filterSetId, activeStyleId);
      });
    }

    const onlyPrimary =
      activeCategoryIds.length === data.primaryCategoryIds.length &&
      data.primaryCategoryIds.every((id) => activeCategoryIds.includes(id));
    const source = onlyPrimary ? data.products : allProducts;
    return source.filter((p) =>
      productMatchesCategories(p, activeCategoryIds),
    );
  }, [
    activeCategoryIds,
    activeStyleId,
    allProducts,
    data.primaryCategoryIds,
    data.products,
    filterSetId,
    useServiceHero,
    serviceFiltersProp,
    productCategoryById,
  ]);

  const totalPages = Math.max(1, Math.ceil(pool.length / data.itemsPerPage));
  const visible = pool.slice(
    (page - 1) * data.itemsPerPage,
    page * data.itemsPerPage,
  );

  const toggleCategory = useCallback(
    (categoryId: number) => {
      setActiveCategoryIds((prev) => {
        const next = prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId)
          : [...prev, categoryId];
        return next.length === 0 ? data.primaryCategoryIds : next;
      });
      setPage(1);
    },
    [data.primaryCategoryIds],
  );

  const handleStyleChange = useCallback((styleId: string | null) => {
    setActiveStyleId(styleId);
    setPage(1);
  }, []);

  const displayTitle = heroTitle ?? data.breadcrumbLabel;

  return (
    <main id="main-content" role="main">
      <section className="sn_kitchens_grid mt-40 mb-90 mt-xl-70 mb-xl-120">
        <form id="frmListingProdotti" onSubmit={(e) => e.preventDefault()}>
          <input type="hidden" name="page" value={page} readOnly />
          <input type="hidden" name="itemsforpage" value={data.itemsPerPage} readOnly />

          {useServiceHero ? (
            <CollectionGridHero
              heroTitle={displayTitle}
              ctaLabel={ctaLabel}
              ctaHref={ctaHref}
              breadcrumbLabel={data.breadcrumbLabel}
              styleFilters={serviceFilters}
              activeStyleId={activeStyleId}
              onStyleChange={handleStyleChange}
            />
          ) : (
            <div className="sn_kitchens_grid_filters mb-70 mb-xl-100">
              <div className="container-fluid text-center mb-30 mb-lg-40">
                <div className="row align-items-end justify-content-center">
                  <div className="col-12 mb-20 mb-lg-30">
                    <MagazineBreadcrumbs
                      items={[
                        { label: "Home", href: "/" },
                        { label: data.breadcrumbLabel },
                      ]}
                    />
                    <h1 className="h4 m-0">{data.h1}</h1>
                  </div>
                  {data.intro ? (
                    <div className="col-12">
                      <p className="sn_paragraph_lg m-0">{data.intro}</p>
                    </div>
                  ) : null}
                </div>
              </div>

              {data.categories.length > 0 ? (
                <div className="sn_kitchens_grid_filters_checks col-12">
                  <div className="row align-items-center justify-content-center">
                    <div className="col-12 col-md-auto text-center text-md-left mb-10 mb-md-0">
                      <div className="sn_kitchens_grid_filters_checks_title">
                        Show me
                      </div>
                    </div>
                    {data.categories.map((cat) => (
                      <div key={cat.id} className="col-auto my-5">
                        <div className="d-flex align-items-center filter-group">
                          <div className="custom-control custom-checkbox mr-2">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id={`filter-cat-${data.slug}-${cat.id}`}
                              name="qsCategorie"
                              value={cat.id}
                              checked={activeCategoryIds.includes(cat.id)}
                              onChange={() => toggleCategory(cat.id)}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor={`filter-cat-${data.slug}-${cat.id}`}
                            />
                          </div>
                          <Link
                            href={cat.href}
                            className="filter-link-label"
                            aria-label={`Go to ${cat.label}`}
                          >
                            {cat.label}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}

          <div className="container-fluid">
            <div className="sn_kitchens_grid_row row" role="list">
              {visible.map((product) => (
                <CollectionProductCard
                  key={product.id}
                  product={product}
                  tagsById={tagsById}
                />
              ))}
            </div>

            {pool.length === 0 ? (
              <div className="text-center py-60">
                <p className="sn_paragraph_lg">
                  No products match your filters. Try a different style.
                </p>
              </div>
            ) : null}

            {totalPages > 1 ? (
              <div className="sn_results_paginator mb-80 mt-30">
                <ul className="sn_results_paginator_list" aria-label="Pagination">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <li
                        key={p}
                        className={`sn_results_paginator_element${p === page ? " current" : ""}`}
                      >
                        <button
                          type="button"
                          className="sn_results_paginator_link"
                          aria-label={`Page ${p}`}
                          aria-current={p === page ? "page" : undefined}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </button>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            ) : null}
          </div>
        </form>

        <div className="sn_kitchens_grid_info">
          <div className="container text-center">
            <div className="row">
              <div className="col-12 col-lg-10 col-xl-8 mx-auto">
                <div className="h5 mb-30">
                  Need help choosing? Contact {site.name} for expert guidance.
                </div>
                <Link
                  href="/ww/company/contacts"
                  className="sn_btn_grow"
                  title="Contact us"
                >
                  <span className="tx">Contact us</span>
                  <span className="sq" aria-hidden="true" data-title="Contact us" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
