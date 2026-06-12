import type { CatalogProduct } from "./catalog-types";

export const CATALOG_CUSTOMIZE_ORDER_LABEL = "Customize your order";

export type CatalogServiceCategory = {
  id: string;
  label: string;
  heading: string;
  exploreLabel: string;
  productTypeIds: number[];
  image: string;
};

type CategoryDefinition = Omit<CatalogServiceCategory, "image">;

const FURNITURE_DEFINITIONS: CategoryDefinition[] = [
  {
    id: "sofas",
    label: "Sofas",
    heading: "Timeless sofas",
    exploreLabel: CATALOG_CUSTOMIZE_ORDER_LABEL,
    productTypeIds: [105, 106],
  },
  {
    id: "chairs",
    label: "Chairs",
    heading: "Iconic seating",
    exploreLabel: CATALOG_CUSTOMIZE_ORDER_LABEL,
    productTypeIds: [101, 102, 103, 104, 107],
  },
  {
    id: "tables",
    label: "Tables",
    heading: "Refined tables",
    exploreLabel: CATALOG_CUSTOMIZE_ORDER_LABEL,
    productTypeIds: [201, 202, 203, 204, 205, 206],
  },
  {
    id: "storage",
    label: "Storage",
    heading: "Smart storage",
    exploreLabel: CATALOG_CUSTOMIZE_ORDER_LABEL,
    productTypeIds: [401, 402, 403, 404],
  },
  {
    id: "bedroom",
    label: "Bedroom",
    heading: "Restful bedrooms",
    exploreLabel: CATALOG_CUSTOMIZE_ORDER_LABEL,
    productTypeIds: [301, 302, 303, 304, 305],
  },
];

const LIGHTS_DEFINITIONS: CategoryDefinition[] = [
  {
    id: "pendants",
    label: "Pendants",
    heading: "Sculptural pendants",
    exploreLabel: CATALOG_CUSTOMIZE_ORDER_LABEL,
    productTypeIds: [701],
  },
  {
    id: "chandeliers",
    label: "Chandeliers",
    heading: "Statement chandeliers",
    exploreLabel: CATALOG_CUSTOMIZE_ORDER_LABEL,
    productTypeIds: [702],
  },
  {
    id: "wall-lights",
    label: "Wall lights",
    heading: "Architectural wall lights",
    exploreLabel: CATALOG_CUSTOMIZE_ORDER_LABEL,
    productTypeIds: [703],
  },
  {
    id: "floor-lamps",
    label: "Floor lamps",
    heading: "Floor lamps",
    exploreLabel: CATALOG_CUSTOMIZE_ORDER_LABEL,
    productTypeIds: [704],
  },
  {
    id: "table-lamps",
    label: "Table lamps",
    heading: "Table lamps",
    exploreLabel: CATALOG_CUSTOMIZE_ORDER_LABEL,
    productTypeIds: [705],
  },
];

export const CATALOG_SERVICE_DEFAULTS: Record<
  string,
  { heading: string; exploreLabel: string }
> = {
  furniture: {
    heading: "Design furniture",
    exploreLabel: CATALOG_CUSTOMIZE_ORDER_LABEL,
  },
  Lights: {
    heading: "Design lighting",
    exploreLabel: CATALOG_CUSTOMIZE_ORDER_LABEL,
  },
  lights: {
    heading: "Design lighting",
    exploreLabel: CATALOG_CUSTOMIZE_ORDER_LABEL,
  },
};

function definitionsForService(serviceSlug: string): CategoryDefinition[] {
  const key = serviceSlug.toLowerCase();
  if (key === "lights") return LIGHTS_DEFINITIONS;
  return FURNITURE_DEFINITIONS;
}

function pickCategoryImage(
  products: CatalogProduct[],
  productTypeIds: number[],
): string {
  const match = products.find(
    (product) =>
      product.images[0] &&
      (productTypeIds.length === 0 ||
        productTypeIds.includes(product.primaryProductTypeId)),
  );
  const fallback = products.find((product) => product.images[0]);
  return match?.images[0] ?? fallback?.images[0] ?? "";
}

export function buildServiceCategories(
  serviceSlug: string,
  products: CatalogProduct[],
): CatalogServiceCategory[] {
  return definitionsForService(serviceSlug).map((definition) => ({
    ...definition,
    image: pickCategoryImage(products, definition.productTypeIds),
  }));
}

export function productMatchesCategory(
  product: CatalogProduct,
  categoryId: string | null,
  categories: CatalogServiceCategory[],
): boolean {
  if (!categoryId) return true;
  const category = categories.find((item) => item.id === categoryId);
  if (!category) return true;
  return category.productTypeIds.includes(product.primaryProductTypeId);
}

export function getCategoryById(
  categories: CatalogServiceCategory[],
  categoryId: string | null,
): CatalogServiceCategory | undefined {
  if (!categoryId) return undefined;
  return categories.find((item) => item.id === categoryId);
}
