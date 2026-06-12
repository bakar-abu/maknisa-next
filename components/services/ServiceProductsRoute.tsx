import { ServiceCatalogPage } from "@/components/products/ServiceCatalogPage";
import { buildServiceCategories } from "@/lib/catalog-service-categories";
import { getCatalogPageData } from "@/lib/catalog-products";
import type { ServicePageConfig } from "@/lib/services";
import {
  isServiceCatalogPage,
  serviceCatalogProductDetailHref,
} from "@/lib/services";

type ServiceProductsRouteProps = {
  service: ServicePageConfig;
};

export async function ServiceProductsRoute({ service }: ServiceProductsRouteProps) {
  if (!isServiceCatalogPage(service)) {
    throw new Error("ServiceProductsRoute requires a products-catalog service");
  }

  const pageData = await getCatalogPageData({
    roomSlugs: service.catalogRoomSlugs,
    ...service.overrides,
  });

  const data = {
    ...pageData,
    products: pageData.products.map((product) => ({
      ...product,
      href: serviceCatalogProductDetailHref(service.slug, product.id),
    })),
  };

  const categories = buildServiceCategories(service.slug, data.products);

  return (
    <ServiceCatalogPage
      data={data}
      serviceSlug={service.slug}
      serviceLabel={service.overrides?.title ?? service.label}
      categories={categories}
    />
  );
}
