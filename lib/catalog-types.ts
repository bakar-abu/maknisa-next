import type { CollectionTag } from "./collection-types";
import type { GridCollectionSlug } from "./collections";
import type { CatalogCardImage } from "./catalog-images";
import type { ProductType } from "./product-types";

export type PriceTier = "entry" | "mid" | "premium" | "luxury";

export type RoomDepartment = {
  slug: GridCollectionSlug;
  label: string;
};

export type CatalogProduct = {
  id: string;
  title: string;
  href: string;
  onlineShop: boolean;
  images: string[];
  tagIds: number[];
  categoryIds: number[];
  collectionSlug: GridCollectionSlug;
  productTypeIds: number[];
  price: number | null;
  priceTier: PriceTier;
  catalogImage: CatalogCardImage | null;
  primaryProductTypeId: number;
};

export type CatalogTag = CollectionTag & {
  count: number;
};

export type CatalogPageData = {
  title: string;
  h1: string;
  intro: string;
  products: CatalogProduct[];
  tags: CatalogTag[];
  productTypes: ProductType[];
  rooms: RoomDepartment[];
  priceRange: { min: number; max: number };
};

export type CatalogSort =
  | "recommended"
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc";

export type DrawerFiltersState = Record<string, string[]>;

export type CatalogFilters = {
  productTypeIds: number[];
  roomSlugs: GridCollectionSlug[];
  tagIds: number[];
  drawerFilters: DrawerFiltersState;
  priceMin: number;
  priceMax: number;
  onlineOnly: boolean;
  sort: CatalogSort;
  page: number;
};

export const ITEMS_PER_PAGE = 24;

export const PRICE_TIER_BOUNDS: Record<
  PriceTier,
  { min: number; max: number; label: string }
> = {
  entry: { min: 50_000, max: 500_000, label: "Entry" },
  mid: { min: 500_000, max: 1_500_000, label: "Mid-range" },
  premium: { min: 1_500_000, max: 3_500_000, label: "Premium" },
  luxury: { min: 3_500_000, max: 10_000_000, label: "Luxury" },
};
