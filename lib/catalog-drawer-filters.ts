import type { CatalogProduct, DrawerFiltersState } from "./catalog-types";

export type DrawerFilterOption = {
  id: string;
  label: string;
  productTypeIds?: number[];
};

export type DrawerFilterSection = {
  id: string;
  label: string;
  options: DrawerFilterOption[];
};

/** Category-specific accordion sections shown in the filter drawer. */
export const CATEGORY_DRAWER_SECTIONS: Record<string, DrawerFilterSection[]> = {
  sofas: [
    {
      id: "sofa-direction",
      label: "Sofa direction",
      options: [
        { id: "left", label: "Left-arm facing" },
        { id: "right", label: "Right-arm facing" },
        { id: "straight", label: "Straight" },
      ],
    },
    {
      id: "seats",
      label: "Seats",
      options: [
        { id: "2-seater", label: "2-seater" },
        { id: "3-seater", label: "3-seater" },
        { id: "modular", label: "Modular" },
      ],
    },
    {
      id: "dimensions",
      label: "Dimensions",
      options: [
        { id: "compact", label: "Compact" },
        { id: "medium", label: "Medium" },
        { id: "large", label: "Large" },
      ],
    },
  ],
  chairs: [
    {
      id: "shape",
      label: "Shape",
      options: [
        { id: "armchair", label: "Armchair", productTypeIds: [102] },
        { id: "dining", label: "Dining chair", productTypeIds: [101] },
        { id: "stool", label: "Stool", productTypeIds: [103, 104] },
        { id: "bench", label: "Bench", productTypeIds: [107] },
      ],
    },
    {
      id: "seats",
      label: "Seats",
      options: [
        { id: "single", label: "Single" },
        { id: "set-of-2", label: "Set of 2" },
        { id: "set-of-4", label: "Set of 4" },
      ],
    },
  ],
  tables: [
    {
      id: "table-type",
      label: "Table type",
      options: [
        { id: "dining", label: "Dining table", productTypeIds: [201] },
        { id: "coffee", label: "Coffee table", productTypeIds: [202] },
        { id: "side", label: "Side table", productTypeIds: [203] },
        { id: "console", label: "Console table", productTypeIds: [204] },
        { id: "desk", label: "Desk", productTypeIds: [205] },
      ],
    },
    {
      id: "shape",
      label: "Shape",
      options: [
        { id: "round", label: "Round" },
        { id: "rectangular", label: "Rectangular" },
        { id: "oval", label: "Oval" },
      ],
    },
  ],
  storage: [
    {
      id: "storage-type",
      label: "Storage type",
      options: [
        { id: "wall-unit", label: "Wall unit", productTypeIds: [401] },
        { id: "bookcase", label: "Bookcase", productTypeIds: [402] },
        { id: "tv-unit", label: "TV unit", productTypeIds: [403] },
        { id: "modular", label: "Modular system", productTypeIds: [404] },
      ],
    },
  ],
  bedroom: [
    {
      id: "mattress-size",
      label: "Mattress size",
      options: [
        { id: "single", label: "Single" },
        { id: "double", label: "Double" },
        { id: "king", label: "King" },
      ],
    },
    {
      id: "bedroom-type",
      label: "Bedroom type",
      options: [
        { id: "bed", label: "Bed", productTypeIds: [301] },
        { id: "wardrobe", label: "Wardrobe", productTypeIds: [303, 304] },
        { id: "nightstand", label: "Nightstand", productTypeIds: [302] },
      ],
    },
  ],
  pendants: [
    {
      id: "light-style",
      label: "Style",
      options: [
        { id: "modern", label: "Modern" },
        { id: "minimal", label: "Minimal" },
        { id: "sculptural", label: "Sculptural" },
      ],
    },
  ],
  chandeliers: [
    {
      id: "light-style",
      label: "Style",
      options: [
        { id: "classic", label: "Classic" },
        { id: "modern", label: "Modern" },
        { id: "statement", label: "Statement" },
      ],
    },
  ],
  "wall-lights": [
    {
      id: "mount-type",
      label: "Mount type",
      options: [
        { id: "up-down", label: "Up / down" },
        { id: "swing-arm", label: "Swing arm" },
        { id: "flush", label: "Flush mount" },
      ],
    },
  ],
  "floor-lamps": [
    {
      id: "lamp-type",
      label: "Lamp type",
      options: [
        { id: "arc", label: "Arc" },
        { id: "tripod", label: "Tripod" },
        { id: "standard", label: "Standard" },
      ],
    },
  ],
  "table-lamps": [
    {
      id: "lamp-size",
      label: "Size",
      options: [
        { id: "small", label: "Small" },
        { id: "medium", label: "Medium" },
        { id: "large", label: "Large" },
      ],
    },
  ],
};

export const QUICK_FILTER_CHIPS = [
  { id: "new", label: "New" },
  { id: "bestseller", label: "Bestseller" },
  { id: "editors", label: "Editor's choice" },
] as const;

function hashProductId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function getProductOptionId(
  product: CatalogProduct,
  section: DrawerFilterSection,
): string {
  for (const option of section.options) {
    if (
      option.productTypeIds?.length &&
      option.productTypeIds.includes(product.primaryProductTypeId)
    ) {
      return option.id;
    }
  }
  return section.options[hashProductId(product.id) % section.options.length].id;
}

export function getDrawerSectionsForCategory(
  categoryId: string | null,
): DrawerFilterSection[] {
  if (!categoryId) return [];
  return CATEGORY_DRAWER_SECTIONS[categoryId] ?? [];
}

export function productMatchesDrawerFilters(
  product: CatalogProduct,
  categoryId: string | null,
  drawerFilters: DrawerFiltersState,
): boolean {
  const sections = getDrawerSectionsForCategory(categoryId);

  for (const section of sections) {
    const selected = drawerFilters[section.id];
    if (!selected?.length) continue;

    const productOption = getProductOptionId(product, section);
    if (!selected.includes(productOption)) return false;
  }

  return true;
}

export function countDrawerFilters(drawerFilters: DrawerFiltersState): number {
  return Object.values(drawerFilters).reduce((sum, ids) => sum + ids.length, 0);
}
