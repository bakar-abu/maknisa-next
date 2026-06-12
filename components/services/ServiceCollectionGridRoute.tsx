import { CollectionGridPage } from "@/components/collection/CollectionGridPage";
import { getCollectionGridData } from "@/lib/collections";
import { getAllCollectionProducts } from "@/lib/get-all-collection-products";
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

export async function ServiceCollectionGridRoute({
  service,
}: ServiceCollectionGridRouteProps) {
  if (!isServiceCollectionPage(service)) {
    throw new Error("ServiceCollectionGridRoute requires a collection-grid service");
  }

  const [data, allProducts] = await Promise.all([
    getCollectionGridData(service.dataSlug),
    getAllCollectionProducts(),
  ]);

  const basePageData = service.overrides
    ? { ...data, ...service.overrides, slug: service.dataSlug }
    : data;

  const pageData = {
    ...basePageData,
    products: enrichServiceCollectionProducts(service.slug, basePageData.products),
  };

  const serviceProducts = mapProductsForServicePage(
    allProducts,
    service.slug,
    service.dataSlug,
  );

  return (
    <CollectionGridPage
      data={pageData}
      allProducts={serviceProducts}
      useServiceHero
      heroTitle={service.overrides?.title ?? service.label}
      ctaLabel={service.ctaLabel}
      ctaHref={
        service.ctaHref ?? customizeOrderHref({ service: service.slug })
      }
      filterSetId={service.filterSetId}
    />
  );
}
