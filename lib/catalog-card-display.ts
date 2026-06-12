import type { CatalogProduct } from "./catalog-types";
import { PRODUCT_TYPE_BY_ID } from "./product-types";

export type ProductCardBadge = {
  id: "new" | "sale" | "bestseller";
  label: string;
};

export type ProductCardSwatch = {
  color: string;
  title: string;
};

const MATERIAL_PAIRS: Record<string, [string, string?]> = {
  Seating: ["Fabric", "Wood"],
  Tables: ["Wood", "Oak"],
  Bedroom: ["Fabric", "Wood"],
  Storage: ["Wood", "Lacquered"],
  Lighting: ["Metal", "Glass"],
  Outdoor: ["Wood", "Aluminium"],
  "Kitchen & Bath": ["Lacquered", "Marble"],
  Surfaces: ["Marble", "Ceramic"],
};

const FINISH_OPTIONS = [
  "Oak",
  "Walnut",
  "Metal",
  "Steel",
  "Ceramic",
  "Polyester",
  "Leather",
  "Glass",
  "Marble",
];

const SWATCH_PALETTE: ProductCardSwatch[] = [
  { title: "Brown", color: "#5E3E34" },
  { title: "Beige", color: "#C6B8A3" },
  { title: "Blue", color: "#152D81" },
  { title: "Red", color: "#980909" },
  { title: "White", color: "#ffffff" },
  { title: "Grey", color: "#737272" },
  { title: "Green", color: "#204F3D" },
  { title: "Yellow", color: "#F1D858" },
  { title: "Orange", color: "#E29D35" },
  { title: "Black", color: "#1d1d1b" },
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getProductCardBadges(product: CatalogProduct): ProductCardBadge[] {
  const hash = hashString(product.id);
  const badges: ProductCardBadge[] = [];

  if (hash % 11 === 0) {
    badges.push({ id: "bestseller", label: "Bestseller" });
  }
  if (hash % 7 === 0) {
    badges.push({ id: "sale", label: "%" });
  }
  if (hash % 5 === 0 || hash % 5 === 1) {
    badges.push({ id: "new", label: "New" });
  }

  return badges;
}

export function getProductCardMaterials(product: CatalogProduct): string[] {
  const type = PRODUCT_TYPE_BY_ID.get(product.primaryProductTypeId);
  const pair = MATERIAL_PAIRS[type?.group ?? "Tables"] ?? ["Wood", "Oak"];
  const hash = hashString(product.id);
  const secondary = FINISH_OPTIONS[hash % FINISH_OPTIONS.length];

  if (pair[1] && pair[1] !== secondary) {
    return [pair[0], pair[1]];
  }
  return pair[1] ? [pair[0], pair[1]] : [pair[0], secondary];
}

export function getProductCardSwatches(product: CatalogProduct): ProductCardSwatch[] {
  const hash = hashString(product.id);
  const count = 2 + (hash % 3);
  const swatches: ProductCardSwatch[] = [];
  const used = new Set<number>();

  for (let i = 0; i < count && swatches.length < 4; i++) {
    const idx = (hash + i * 7) % SWATCH_PALETTE.length;
    if (used.has(idx)) continue;
    used.add(idx);
    swatches.push(SWATCH_PALETTE[idx]);
  }

  return swatches;
}

export function hasMoreSwatchOptions(product: CatalogProduct): boolean {
  return hashString(product.id) % 3 === 0;
}

export function getProductCardPricing(product: CatalogProduct): {
  price: number | null;
  beforePrice: number | null;
  fromPrice: number | null;
} {
  if (product.price === null) {
    return { price: null, beforePrice: null, fromPrice: null };
  }

  const hash = hashString(product.id);
  const badges = getProductCardBadges(product);
  const onSale = badges.some((b) => b.id === "sale");
  const beforePrice = onSale ? Math.round(product.price / 0.85) : null;
  const fromPrice = hash % 13 === 0 ? Math.round(product.price * 0.72) : null;

  return {
    price: product.price,
    beforePrice,
    fromPrice,
  };
}
