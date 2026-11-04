import { CollectionGridPage } from "@/components/collection/CollectionGridPage";
import { fetchPublicServiceBundle } from "@/lib/cms/fetch-catalog";
import { getCollectionGridData } from "@/lib/collections";
import { getAllCollectionProducts } from "@/lib/get-all-collection-products";
import type { CollectionServiceFilter } from "@/lib/collection-service-filters";
import {
  enrichServiceCollectionProducts,
  mapProductsForServicePage,
} from "@/lib/product-routes";
import { customizeOrderHref } from "@/lib/customize-order";
import type { ServicePageConfig } from "@/lib/services";
import { isServiceCollectionPage } from "@/lib/services";

type ServiceCollectionGridRouteProps = {
  service: ServicePageConfig;
};

function buildFiltersFromApi(
  categories: {
    slug: string;
    label: string;
    imageUrl: string | null;
    filterTagIds: number[];
  }[],
  products: { id: string; images: string[] }[],
): CollectionServiceFilter[] {
  return categories.map((category) => {
    const match = products.find((product) => product.images[0]);
    return {
      id: category.slug,
      label: category.label,
      image: category.imageUrl ?? match?.images[0] ?? "",
      tagIds: category.filterTagIds,
    };
  });
}

export async function ServiceCollectionGridRoute({
  service,
}: ServiceCollectionGridRouteProps) {
  if (!isServiceCollectionPage(service)) {
    throw new Error("ServiceCollectionGridRoute requires a collection-grid service");
  }

  const bundle = await fetchPublicServiceBundle(service.slug);
  const [data, allProducts] = await Promise.all([
    getCollectionGridData(service.dataSlug),
    getAllCollectionProducts(),
  ]);

  const apiOverrides = bundle?.service;
  const useApiProducts = Boolean(bundle);
  const basePageData = {
    ...data,
    ...(apiOverrides
      ? {
          title: apiOverrides.title,
          h1: apiOverrides.h1,
          intro: apiOverrides.intro,
          breadcrumbLabel: apiOverrides.breadcrumbLabel,
        }
      : service.overrides ?? {}),
    slug: service.dataSlug,
    products: useApiProducts
      ? enrichServiceCollectionProducts(
          service.slug,
          bundle!.products.map((product) => ({
            id: product.id,
            title: product.title,
            href: product.href,
            onlineShop: product.onlineShop,
            images: product.images,
            tagIds: product.tagIds,
            categoryIds: product.categoryIds,
          })),
        )
      : data.products,
  };

  const pageData = {
    ...basePageData,
    products: enrichServiceCollectionProducts(service.slug, basePageData.products),
  };

  const serviceProducts = mapProductsForServicePage(
    allProducts,
    service.slug,
    service.dataSlug,
  );

  const serviceFilters =
    bundle && bundle.categories.length > 0
      ? buildFiltersFromApi(bundle.categories, pageData.products)
      : undefined;

  const productCategoryById = useApiProducts
    ? Object.fromEntries(
        bundle!.products.map((product) => [
          product.id,
          product.serviceCategorySlug ?? null,
        ]),
      )
    : undefined;

  return (
    <CollectionGridPage
      data={pageData}
      allProducts={serviceProducts}
      useServiceHero
      heroTitle={apiOverrides?.title ?? service.overrides?.title ?? service.label}
      ctaLabel={apiOverrides?.ctaLabel ?? service.ctaLabel}
      ctaHref={
        apiOverrides?.ctaHref ??
        service.ctaHref ??
        customizeOrderHref({ service: service.slug })
      }
      filterSetId={service.filterSetId}
      serviceFilters={serviceFilters}
      productCategoryById={productCategoryById}
    />
  );
}
