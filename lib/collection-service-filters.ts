import type { CollectionProduct } from "./collection-types";

export type ServiceFilterSetId =
  | "kitchens"
  | "marble-tiles"
  | "woodwork"
  | "interior-design";

export type CollectionServiceFilter = {
  id: string;
  label: string;
  image: string;
  tagIds: number[];
};

type FilterDefinition = Omit<CollectionServiceFilter, "image">;

export const SERVICE_FILTER_SETS: Record<ServiceFilterSetId, FilterDefinition[]> = {
  kitchens: [
    {
      id: "modern",
      label: "Modern",
      tagIds: [186, 506, 499, 539, 547, 550],
    },
    {
      id: "spanish",
      label: "Spanish",
      tagIds: [528, 556, 551, 557],
    },
    {
      id: "classic",
      label: "Classic",
      tagIds: [291, 525, 542, 545],
    },
    {
      id: "semi-classic",
      label: "Semi Classic",
      tagIds: [498, 509, 537, 544],
    },
    {
      id: "italian",
      label: "Italian",
      tagIds: [510, 518, 538, 532],
    },
  ],
  "marble-tiles": [
    {
      id: "marble",
      label: "Marble",
      tagIds: [9001],
    },
    {
      id: "porcelain",
      label: "Porcelain",
      tagIds: [9002],
    },
    {
      id: "floor",
      label: "Floor Tiles",
      tagIds: [9003],
    },
    {
      id: "wall",
      label: "Wall Tiles",
      tagIds: [9004],
    },
    {
      id: "kitchen-bath",
      label: "Kitchen & Bath",
      tagIds: [9005, 9006],
    },
  ],
  woodwork: [
    {
      id: "wardrobe",
      label: "Wardrobe",
      tagIds: [],
    },
    {
      id: "media-wall",
      label: "Media Wall",
      tagIds: [],
    },
    {
      id: "doors",
      label: "Doors",
      tagIds: [],
    },
    {
      id: "paneling",
      label: "Paneling",
      tagIds: [],
    },
    {
      id: "custom-joinery",
      label: "Custom Joinery",
      tagIds: [],
    },
  ],
  "interior-design": [
    {
      id: "living-room",
      label: "Living Room",
      tagIds: [],
    },
    {
      id: "bedroom",
      label: "Bedroom",
      tagIds: [],
    },
    {
      id: "kitchen",
      label: "Kitchen",
      tagIds: [],
    },
    {
      id: "bathroom",
      label: "Bathroom",
      tagIds: [],
    },
    {
      id: "full-home",
      label: "Full Home",
      tagIds: [],
    },
  ],
};

/** Maps each service page slug to its filter profile. */
export const SERVICE_SLUG_FILTER_SET: Record<string, ServiceFilterSetId> = {
  Kitchens: "kitchens",
  "Marbels-Tiles": "marble-tiles",
  woodwork: "woodwork",
  "interior-design": "interior-design",
};

export function resolveFilterSetId(serviceSlug: string): ServiceFilterSetId {
  return SERVICE_SLUG_FILTER_SET[serviceSlug] ?? "kitchens";
}

function hashProductId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function getFilterDefinitions(filterSetId: ServiceFilterSetId): FilterDefinition[] {
  return SERVICE_FILTER_SETS[filterSetId];
}

export function getProductFilterId(
  product: CollectionProduct,
  filterSetId: ServiceFilterSetId,
): string {
  const filters = getFilterDefinitions(filterSetId);

  for (const filter of filters) {
    if (
      filter.tagIds.length > 0 &&
      product.tagIds.some((tagId) => filter.tagIds.includes(tagId))
    ) {
      return filter.id;
    }
  }

  return filters[hashProductId(product.id) % filters.length].id;
}

export function productMatchesServiceFilter(
  product: CollectionProduct,
  filterSetId: ServiceFilterSetId,
  filterId: string | null,
): boolean {
  if (!filterId) return true;
  return getProductFilterId(product, filterSetId) === filterId;
}

export function buildServiceFiltersWithImages(
  products: CollectionProduct[],
  filterSetId: ServiceFilterSetId,
): CollectionServiceFilter[] {
  const definitions = getFilterDefinitions(filterSetId);

  return definitions.map((filter) => {
    const match = products.find(
      (product) =>
        getProductFilterId(product, filterSetId) === filter.id && product.images[0],
    );
    const fallback = products.find((product) => product.images[0]);
    return {
      ...filter,
      image: match?.images[0] ?? fallback?.images[0] ?? "",
    };
  });
}
