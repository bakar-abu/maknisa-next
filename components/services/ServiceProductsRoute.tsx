import { ServiceCatalogPage } from "@/components/products/ServiceCatalogPage";
import { buildServiceCategories } from "@/lib/catalog-service-categories";
import {
  buildCatalogPageDataFromProducts,
  getCatalogPageData,
} from "@/lib/catalog-products";
import { fetchPublicServiceBundle } from "@/lib/cms/fetch-catalog";
import { mapApiProductsToCatalogProducts } from "@/lib/cms/map-catalog-products";
import type { ServicePageConfig } from "@/lib/services";
import {
  isServiceCatalogPage,
  serviceCatalogProductDetailHref,
} from "@/lib/services";

type ServiceProductsRouteProps = {
  service: ServicePageConfig;
};

function buildCategoriesFromBundle(
  categories: {
    slug: string;
    label: string;
    heading: string | null;
    exploreLabel: string | null;
    imageUrl: string | null;
    productTypeIds: number[];
  }[],
  products: { id: string; images: string[] }[],
) {
  return categories.map((category) => {
    const match = products.find((product) => product.images[0]);
    return {
      id: category.slug,
      label: category.label,
      heading: category.heading ?? category.label,
      exploreLabel: category.exploreLabel ?? "Customize your order",
      productTypeIds: category.productTypeIds,
      image: category.imageUrl ?? match?.images[0] ?? "",
    };
  });
}

export async function ServiceProductsRoute({ service }: ServiceProductsRouteProps) {
  if (!isServiceCatalogPage(service)) {
    throw new Error("ServiceProductsRoute requires a products-catalog service");
  }

  const bundle = await fetchPublicServiceBundle(service.slug);

  if (bundle) {
    const products = await mapApiProductsToCatalogProducts(bundle.products, service.slug);
    const data = await buildCatalogPageDataFromProducts(products, {
      title: bundle.service.title,
      h1: bundle.service.h1,
      intro: bundle.service.intro,
    });

    const categories =
      bundle.categories.length > 0
        ? buildCategoriesFromBundle(bundle.categories, data.products)
        : buildServiceCategories(service.slug, data.products);

    const productCategoryById = Object.fromEntries(
      bundle.products.map((product) => [
        product.id,
        product.serviceCategorySlug ?? null,
      ]),
    );

    return (
      <ServiceCatalogPage
        data={data}
        serviceSlug={service.slug}
        serviceLabel={bundle.service.title}
        categories={categories}
        productCategoryById={productCategoryById}
      />
    );
  }

  const pageData = await getCatalogPageData({
    roomSlugs: service.catalogRoomSlugs,
    ...service.overrides,
  });

  const products = pageData.products.map((product) => ({
    ...product,
    href: serviceCatalogProductDetailHref(service.slug, product.id),
  }));

  return (
    <ServiceCatalogPage
      data={{ ...pageData, products }}
      serviceSlug={service.slug}
      serviceLabel={service.overrides?.title ?? service.label}
      categories={buildServiceCategories(service.slug, products)}
    />
  );
}
