import type { CollectionTag } from "./collection-types";
import { getCollectionGridData } from "./collections";
import { getCatalogPageData } from "./catalog-products";
import { upscaleCatalogImage } from "./catalog-images";
import type { CatalogProduct } from "./catalog-types";
import { SERVICE_DEMO_PRODUCTS } from "./cms/catalog-demo-fixtures";
import {
  fetchPublicProductContent,
  fetchPublicServiceBundle,
} from "./cms/fetch-catalog";
import { mapApiProductsToCatalogProducts } from "./cms/map-catalog-products";
import { splitIntroText, type PdpGalleries } from "./product-detail";
import { PRODUCT_TYPE_BY_ID } from "./product-types";
import {
  getServiceCatalogPages,
  resolveServiceCatalogRoute,
  serviceCatalogProductDetailHref,
  type ServiceCatalogPage,
} from "./services";

export type CatalogPdpGalleries = PdpGalleries & {
  lifestyleSecondary: string[];
};

export type CatalogProductDetailView = {
  product: CatalogProduct;
  serviceSlug: string;
  serviceLabel: string;
  serviceListHref: string;
  productTypeLabel: string;
  collectionTitle: string;
  intro: string;
  introTail: string | null;
  detailParagraph: string;
  tags: CollectionTag[];
  related: CatalogProduct[];
  galleries: CatalogPdpGalleries;
  heroImages: string[];
  galleryImages: string[];
};

function buildGalleryPool(
  product: CatalogProduct,
  collectionImageUrls: string[],
): string[] {
  const own = upscaleImages(product.images);
  const extras = collectionImageUrls
    .filter((url) => url && !own.includes(url))
    .map((url) => upscaleCatalogImage(url, 1600));
  const merged = [...own];
  for (const url of extras) {
    if (!merged.includes(url)) merged.push(url);
  }
  return merged;
}

function buildCatalogPdpGalleries(images: string[]): CatalogPdpGalleries {
  if (images.length === 0) {
    return { hero: [], lifestyle: [], duoSlides: [], lifestyleSecondary: [] };
  }

  const slideCount = (start: number, count: number) =>
    Array.from({ length: count }, (_, index) => images[(start + index) % images.length]);

  const heroSlides = Math.min(4, Math.max(2, images.length));
  const lifestyleSlides = Math.min(5, Math.max(2, images.length));
  const duoCount = Math.min(5, Math.max(2, Math.ceil(images.length / 2)));

  const hero = slideCount(0, heroSlides);
  const lifestyle = slideCount(1, lifestyleSlides);
  const lifestyleSecondary = slideCount(
    Math.max(2, Math.floor(images.length / 2)),
    lifestyleSlides,
  );

  const duoSlides: [string, string][] = [];
  const rightOffset = Math.max(1, Math.floor(images.length / 2));
  for (let i = 0; i < duoCount; i++) {
    duoSlides.push([
      images[i % images.length],
      images[(i + rightOffset) % images.length],
    ]);
  }

  return { hero, lifestyle, duoSlides, lifestyleSecondary };
}

function upscaleImages(images: string[]): string[] {
  return images
    .filter((url) => url && url !== "#" && url.startsWith("http"))
    .map((url) => upscaleCatalogImage(url, 1600));
}

function buildDetailParagraph(product: CatalogProduct, label: string): string {
  return `At its core, ${product.title} embodies refined Italian craftsmanship. Designed for ${label.toLowerCase()} projects, it adapts to different layouts while maintaining balanced proportions, quality materials, and a timeless Maknisa signature.`;
}

function mapProductsForService(
  products: CatalogProduct[],
  service: ServiceCatalogPage,
): CatalogProduct[] {
  return products.map((product) => ({
    ...product,
    href: serviceCatalogProductDetailHref(service.slug, product.id),
  }));
}

async function getCmsCatalogProductDetail(
  service: ServiceCatalogPage,
  productId: string,
): Promise<CatalogProductDetailView | null> {
  const bundle = await fetchPublicServiceBundle(service.slug);
  if (!bundle) return null;

  const apiProduct = bundle.products.find((item) => item.id === productId);
  if (!apiProduct) return null;

  const [catalogProduct] = await mapApiProductsToCatalogProducts([apiProduct], service.slug);
  const allProducts = await mapApiProductsToCatalogProducts(bundle.products, service.slug);
  const products = mapProductsForService(allProducts, service);
  const product = products.find((item) => item.id === productId) ?? catalogProduct;

  const collectionData = await getCollectionGridData(product.collectionSlug);
  const tagsById = new Map(collectionData.tags.map((tag) => [tag.id, tag]));
  const tagLabels = product.tagIds
    .map((id) => tagsById.get(id)?.label)
    .filter((label): label is string => Boolean(label));

  const productTypeLabel =
    PRODUCT_TYPE_BY_ID.get(product.primaryProductTypeId)?.label ??
    collectionData.breadcrumbLabel;

  const serviceLabel = bundle.service.title ?? service.overrides?.title ?? service.label;
  const storedContent = await fetchPublicProductContent(product.id);

  const intro =
    storedContent?.intro ??
    `${product.title} brings together ${tagLabels.length > 0 ? tagLabels.slice(0, 4).join(", ").toLowerCase() : "contemporary design"} and refined craftsmanship. Part of our ${productTypeLabel.toLowerCase()} range, it is designed to adapt to contemporary living with balanced proportions, quality materials, and a timeless Maknisa signature.`;

  const [introLead, introTail] = splitIntroText(intro);
  const collectionPool = collectionData.products.flatMap((item) => item.images);
  const galleryPool = buildGalleryPool(product, collectionPool);

  const related = products
    .filter((item) => item.id !== product.id)
    .slice(0, 14);

  return {
    product,
    serviceSlug: service.slug,
    serviceLabel,
    serviceListHref: `/services/${service.slug}`,
    productTypeLabel,
    collectionTitle: collectionData.breadcrumbLabel,
    intro: introLead,
    introTail,
    detailParagraph:
      storedContent?.detailParagraph ?? buildDetailParagraph(product, productTypeLabel),
    tags: product.tagIds
      .map((id) => tagsById.get(id))
      .filter((tag): tag is CollectionTag => Boolean(tag)),
    related,
    galleries: buildCatalogPdpGalleries(galleryPool),
    heroImages: galleryPool.slice(0, Math.min(4, galleryPool.length)),
    galleryImages: galleryPool,
  };
}

export async function getCatalogProductDetail(
  serviceUrlSlug: string,
  productId: string,
): Promise<CatalogProductDetailView | null> {
  const service = resolveServiceCatalogRoute(serviceUrlSlug);
  if (!service) return null;

  const cmsDetail = await getCmsCatalogProductDetail(service, productId);
  if (cmsDetail) return cmsDetail;

  const pageData = await getCatalogPageData({
    roomSlugs: service.catalogRoomSlugs,
    ...service.overrides,
  });

  const products = mapProductsForService(pageData.products, service);
  const product = products.find((item) => item.id === productId);
  if (!product) return null;

  const collectionData = await getCollectionGridData(product.collectionSlug);
  const tagsById = new Map(collectionData.tags.map((tag) => [tag.id, tag]));
  const tagLabels = product.tagIds
    .map((id) => tagsById.get(id)?.label)
    .filter((label): label is string => Boolean(label));

  const productTypeLabel =
    PRODUCT_TYPE_BY_ID.get(product.primaryProductTypeId)?.label ??
    collectionData.breadcrumbLabel;

  const bundle = await fetchPublicServiceBundle(service.slug);
  const serviceLabel =
    bundle?.service.title ?? service.overrides?.title ?? service.label;
  const storedContent = await fetchPublicProductContent(product.id);
  const intro =
    storedContent?.intro ??
    `${product.title} brings together ${tagLabels.length > 0 ? tagLabels.slice(0, 4).join(", ").toLowerCase() : "contemporary design"} and refined craftsmanship. Part of our ${productTypeLabel.toLowerCase()} range, it is designed to adapt to contemporary living with balanced proportions, quality materials, and a timeless Maknisa signature.`;

  const [introLead, introTail] = splitIntroText(intro);
  const collectionPool = collectionData.products.flatMap((item) => item.images);
  const galleryPool = buildGalleryPool(product, collectionPool);

  const related = products
    .filter((item) => item.id !== product.id)
    .slice(0, 14);

  return {
    product,
    serviceSlug: service.slug,
    serviceLabel,
    serviceListHref: `/services/${service.slug}`,
    productTypeLabel,
    collectionTitle: collectionData.breadcrumbLabel,
    intro: introLead,
    introTail,
    detailParagraph:
      storedContent?.detailParagraph ?? buildDetailParagraph(product, productTypeLabel),
    tags: product.tagIds
      .map((id) => tagsById.get(id))
      .filter((tag): tag is CollectionTag => Boolean(tag)),
    related,
    galleries: buildCatalogPdpGalleries(galleryPool),
    heroImages: galleryPool.slice(0, Math.min(4, galleryPool.length)),
    galleryImages: galleryPool,
  };
}

export async function getAllCatalogServiceProductStaticParams(): Promise<
  { slug: string; productSlug: string }[]
> {
  const params: { slug: string; productSlug: string }[] = [];
  const seen = new Set<string>();

  for (const service of getServiceCatalogPages()) {
    const pageData = await getCatalogPageData({
      roomSlugs: service.catalogRoomSlugs,
    });
    for (const product of pageData.products) {
      const key = `${service.slug}/${product.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      params.push({ slug: service.slug, productSlug: product.id });
    }

    const bundle = await fetchPublicServiceBundle(service.slug);
    if (bundle) {
      for (const product of bundle.products) {
        const key = `${service.slug}/${product.id}`;
        if (seen.has(key)) continue;
        seen.add(key);
        params.push({ slug: service.slug, productSlug: product.id });
      }
    }
  }

  for (const demo of SERVICE_DEMO_PRODUCTS) {
    const service = getServiceCatalogPages().find(
      (page) => page.slug.toLowerCase() === demo.serviceSlug.toLowerCase(),
    );
    if (!service) continue;
    const key = `${service.slug}/${demo.productSlug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    params.push({ slug: service.slug, productSlug: demo.productSlug });
  }

  return params;
}
