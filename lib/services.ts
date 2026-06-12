import type { CollectionGridData } from "./collection-types";
import type { ServiceFilterSetId } from "./collection-service-filters";
import type { GridCollectionSlug } from "./collections";

/** Shared kitchen-style grid template — edit one config block to retarget later. */
export type ServiceCollectionOverrides = Partial<
  Pick<CollectionGridData, "title" | "h1" | "intro" | "breadcrumbLabel">
>;

export type ServiceCatalogOverrides = Partial<
  Pick<import("./catalog-types").CatalogPageData, "title" | "h1" | "intro">
>;

type ServiceCollectionPage = {
  slug: string;
  label: string;
  template: "collection-grid";
  dataSlug: GridCollectionSlug;
  filterSetId: ServiceFilterSetId;
  ctaLabel: string;
  ctaHref?: string;
  overrides?: ServiceCollectionOverrides;
};

export type ServiceCatalogPage = {
  slug: string;
  label: string;
  template: "products-catalog";
  catalogRoomSlugs?: GridCollectionSlug[];
  overrides?: ServiceCatalogOverrides;
};

export type ServicePageConfig = ServiceCollectionPage | ServiceCatalogPage;

/**
 * Central registry for Services menu pages.
 * - collection-grid pages share CollectionGridPage (kitchen-style UI)
 * - products-catalog pages share ProductsCatalogPage (products UI)
 */
export const SERVICE_PAGES: ServicePageConfig[] = [
  {
    slug: "Kitchens",
    label: "Kitchens",
    template: "collection-grid",
    dataSlug: "kitchens",
    filterSetId: "kitchens",
    ctaLabel: "Customize your kitchen",
  },
  {
    slug: "Marbels-Tiles",
    label: "Marble & Tiles",
    template: "collection-grid",
    dataSlug: "marble-tiles",
    filterSetId: "marble-tiles",
    ctaLabel: "Customize your tiles",
  },
  {
    slug: "woodwork",
    label: "Woodwork",
    template: "collection-grid",
    dataSlug: "kitchens",
    filterSetId: "woodwork",
    ctaLabel: "Customize your woodwork",
    overrides: {
      title: "Woodwork",
      h1: "Looking for custom woodwork?",
      intro:
        "Explore Maknisa woodwork solutions — crafted cabinetry, paneling, and bespoke timber finishes for your home.",
      breadcrumbLabel: "Woodwork",
    },
  },
  {
    slug: "interior-design",
    label: "Interior Design",
    template: "collection-grid",
    dataSlug: "kitchens",
    filterSetId: "interior-design",
    ctaLabel: "Start your interior design",
    overrides: {
      title: "Interior Design",
      h1: "Looking for interior design?",
      intro:
        "Discover Maknisa interior design services — from concept to completion, tailored spaces that reflect your style.",
      breadcrumbLabel: "Interior Design",
    },
  },
  {
    slug: "furniture",
    label: "Furniture",
    template: "products-catalog",
  },
  {
    slug: "Lights",
    label: "Lights",
    template: "products-catalog",
    catalogRoomSlugs: ["lighting"],
    overrides: {
      title: "Lights",
      h1: "Our Lights",
      intro:
        "Browse lighting for every room — pendants, wall lights, and architectural fixtures curated by Maknisa.",
    },
  },
];

export const SERVICE_PAGE_SLUGS = SERVICE_PAGES.map((page) => page.slug);

/** URL segment for `/ww/services/{slug}` detail routes (lowercase). */
export function serviceRouteSlug(pageSlug: string): string {
  return pageSlug.toLowerCase();
}

export const SERVICES_INDEX_HREF = "/services";

export function servicePageHref(slug: string): string {
  return `/services/${slug}`;
}

export function serviceProductDetailHref(
  servicePageSlug: string,
  productId: string,
): string {
  return `/ww/services/${serviceRouteSlug(servicePageSlug)}/${productId}`;
}

/** PDP for furniture / lights catalog under `/services/{slug}/{productId}`. */
export function serviceCatalogProductDetailHref(
  servicePageSlug: string,
  productId: string,
): string {
  return `/services/${servicePageSlug}/${productId}`;
}

export function getServiceCatalogPages(): ServiceCatalogPage[] {
  return SERVICE_PAGES.filter(isServiceCatalogPage);
}

export function resolveServiceCatalogRoute(
  urlSlug: string,
): ServiceCatalogPage | undefined {
  const page = resolveServicePage(urlSlug);
  if (!page || !isServiceCatalogPage(page)) return undefined;
  return page;
}

export function resolveServicePage(urlSlug: string): ServicePageConfig | undefined {
  const normalized = urlSlug.toLowerCase();
  return SERVICE_PAGES.find((page) => page.slug.toLowerCase() === normalized);
}

export function isServiceCollectionPage(
  page: ServicePageConfig,
): page is ServiceCollectionPage {
  return page.template === "collection-grid";
}

export function isServiceCatalogPage(
  page: ServicePageConfig,
): page is ServiceCatalogPage {
  return page.template === "products-catalog";
}

export function getServiceCollectionPages(): ServiceCollectionPage[] {
  return SERVICE_PAGES.filter(isServiceCollectionPage);
}

/** Data slugs whose PDPs live under `/ww/services/…` (not `/ww/{slug}/…`). */
export const SERVICE_PDP_DATA_SLUGS = new Set<GridCollectionSlug>(
  getServiceCollectionPages().map((page) => page.dataSlug),
);

export function resolveServiceCollectionRoute(
  urlSlug: string,
): ServiceCollectionPage | undefined {
  const page = resolveServicePage(urlSlug);
  if (!page || !isServiceCollectionPage(page)) return undefined;
  return page;
}
