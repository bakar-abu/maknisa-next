import type { CollectionProduct } from "./collection-types";
import type { GridCollectionSlug } from "./collections";
import {
  getServiceCollectionPages,
  serviceProductDetailHref,
  serviceRouteSlug,
  SERVICE_PDP_DATA_SLUGS,
} from "./services";

export function productDetailHref(
  collectionSlug: string,
  productId: string,
): string {
  if (isServicePdpCollectionSlug(collectionSlug)) {
    const service = getServiceCollectionPages().find(
      (page) => page.dataSlug === collectionSlug,
    );
    if (service) {
      return serviceProductDetailHref(service.slug, productId);
    }
  }
  return `/ww/${collectionSlug}/${productId}`;
}

export function enrichCollectionProducts(
  collectionSlug: string,
  products: CollectionProduct[],
): CollectionProduct[] {
  return products.map((product) => ({
    ...product,
    href: productDetailHref(collectionSlug, product.id),
  }));
}

export function enrichServiceCollectionProducts(
  servicePageSlug: string,
  products: CollectionProduct[],
): CollectionProduct[] {
  return products.map((product) => ({
    ...product,
    href: serviceProductDetailHref(servicePageSlug, product.id),
  }));
}

/** Rewrite PDP links for products belonging to a service collection's data source. */
export function mapProductsForServicePage(
  products: CollectionProduct[],
  servicePageSlug: string,
  dataSlug: GridCollectionSlug,
): CollectionProduct[] {
  const legacyPrefix = `/ww/${dataSlug}/`;
  const servicePrefixes = getServiceCollectionPages()
    .filter((page) => page.dataSlug === dataSlug)
    .map((page) => `/ww/services/${serviceRouteSlug(page.slug)}/`);

  return products.map((product) => {
    const belongsToData =
      product.href.startsWith(legacyPrefix) ||
      servicePrefixes.some((prefix) => product.href.startsWith(prefix));

    return belongsToData
      ? {
          ...product,
          href: serviceProductDetailHref(servicePageSlug, product.id),
        }
      : product;
  });
}

export function isServicePdpCollectionSlug(
  slug: string,
): slug is GridCollectionSlug {
  return SERVICE_PDP_DATA_SLUGS.has(slug as GridCollectionSlug);
}

export function isGridCollectionRoute(slug: string): slug is GridCollectionSlug {
  return [
    "kitchens",
    "bathrooms",
    "living",
    "bedroom-furniture",
    "tables-chairs-stools",
    "multi-functional-modules",
    "marble-tiles",
    "lighting",
  ].includes(slug);
}
