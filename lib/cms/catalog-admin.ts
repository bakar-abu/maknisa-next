import type { CatalogServiceRecord, CatalogServiceCategoryRecord } from "./fetch-catalog";

export type CatalogProductAdminRecord = {
  id: string;
  slug: string;
  title: string;
  collectionSlug: string;
  onlineShop: boolean;
  primaryProductTypeId: number | null;
  price: number | null;
  priceBefore: number | null;
  fromPrice: number | null;
  isPublished: boolean;
  images: {
    id: string;
    url: string;
    altText: string | null;
    role: string;
    sortOrder: number;
  }[];
  tagLegacyIds: number[];
  categoryLegacyIds: number[];
  content: {
    productId: string;
    intro: string | null;
    detailParagraph: string | null;
    craftedParagraph: string | null;
    quoteText: string | null;
    quoteAuthor: string | null;
    designerName: string | null;
    designerBio: string | null;
    designerQuote: string | null;
    extras: Record<string, unknown> | null;
    metaTitle: string | null;
    metaDescription: string | null;
  } | null;
  serviceAssignments: {
    serviceId: string;
    serviceSlug: string;
    serviceLabel: string;
    primaryCategoryId: string | null;
    primaryCategorySlug: string | null;
    primaryCategoryLabel: string | null;
  }[];
};

export type CatalogServiceBundle = {
  service: CatalogServiceRecord;
  categories: CatalogServiceCategoryRecord[];
  products: CatalogProductAdminRecord[];
};

export type { CatalogServiceRecord, CatalogServiceCategoryRecord };
