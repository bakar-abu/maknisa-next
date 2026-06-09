export type ProductTypeGroup =
  | "Seating"
  | "Tables"
  | "Bedroom"
  | "Storage"
  | "Kitchen & Bath"
  | "Surfaces"
  | "Lighting"
  | "Outdoor";

export type ProductType = {
  id: number;
  slug: string;
  label: string;
  group: ProductTypeGroup;
};

export const PRODUCT_TYPES: ProductType[] = [
  { id: 101, slug: "chair", label: "Chair", group: "Seating" },
  { id: 102, slug: "armchair", label: "Armchair", group: "Seating" },
  { id: 103, slug: "stool", label: "Stool", group: "Seating" },
  { id: 104, slug: "bar-stool", label: "Bar stool", group: "Seating" },
  { id: 105, slug: "sofa", label: "Sofa", group: "Seating" },
  { id: 106, slug: "sofa-bed", label: "Sofa bed", group: "Seating" },
  { id: 107, slug: "bench", label: "Bench", group: "Seating" },
  { id: 201, slug: "dining-table", label: "Dining table", group: "Tables" },
  { id: 202, slug: "coffee-table", label: "Coffee table", group: "Tables" },
  { id: 203, slug: "side-table", label: "Side table", group: "Tables" },
  { id: 204, slug: "console-table", label: "Console table", group: "Tables" },
  { id: 205, slug: "desk", label: "Desk", group: "Tables" },
  { id: 206, slug: "kitchen-island", label: "Kitchen island", group: "Tables" },
  { id: 301, slug: "bed", label: "Bed", group: "Bedroom" },
  { id: 302, slug: "nightstand", label: "Nightstand", group: "Bedroom" },
  { id: 303, slug: "wardrobe", label: "Wardrobe", group: "Bedroom" },
  { id: 304, slug: "walk-in-wardrobe", label: "Walk-in wardrobe", group: "Bedroom" },
  { id: 305, slug: "dresser", label: "Dresser", group: "Bedroom" },
  { id: 401, slug: "wall-unit", label: "Wall unit", group: "Storage" },
  { id: 402, slug: "bookcase", label: "Bookcase", group: "Storage" },
  { id: 403, slug: "tv-unit", label: "TV unit", group: "Storage" },
  { id: 404, slug: "modular-system", label: "Modular system", group: "Storage" },
  { id: 501, slug: "kitchen-line", label: "Kitchen cabinet", group: "Kitchen & Bath" },
  { id: 502, slug: "bathroom-line", label: "Bathroom vanity", group: "Kitchen & Bath" },
  { id: 503, slug: "vanity", label: "Vanity unit", group: "Kitchen & Bath" },
  { id: 504, slug: "mirror", label: "Mirror", group: "Kitchen & Bath" },
  { id: 601, slug: "tile", label: "Tile", group: "Surfaces" },
  { id: 602, slug: "marble", label: "Marble", group: "Surfaces" },
  { id: 701, slug: "pendant", label: "Pendant", group: "Lighting" },
  { id: 702, slug: "chandelier", label: "Chandelier", group: "Lighting" },
  { id: 703, slug: "wall-light", label: "Wall light", group: "Lighting" },
  { id: 704, slug: "floor-lamp", label: "Floor lamp", group: "Lighting" },
  { id: 705, slug: "table-lamp", label: "Table lamp", group: "Lighting" },
  { id: 801, slug: "outdoor-table", label: "Outdoor table", group: "Outdoor" },
  { id: 802, slug: "outdoor-chair", label: "Outdoor chair", group: "Outdoor" },
  { id: 803, slug: "outdoor-sofa", label: "Outdoor sofa", group: "Outdoor" },
];

export const PRODUCT_TYPE_BY_ID = new Map(PRODUCT_TYPES.map((t) => [t.id, t]));
export const PRODUCT_TYPE_BY_SLUG = new Map(PRODUCT_TYPES.map((t) => [t.slug, t]));

export const PRODUCT_TYPE_GROUPS: ProductTypeGroup[] = [
  "Seating",
  "Tables",
  "Bedroom",
  "Storage",
  "Kitchen & Bath",
  "Surfaces",
  "Lighting",
  "Outdoor",
];

export function getProductTypesByGroup(): Map<ProductTypeGroup, ProductType[]> {
  const map = new Map<ProductTypeGroup, ProductType[]>();
  for (const group of PRODUCT_TYPE_GROUPS) {
    map.set(
      group,
      PRODUCT_TYPES.filter((t) => t.group === group),
    );
  }
  return map;
}
