export type CollectionTag = { id: number; label: string };

export type CollectionCategory = {
  id: number;
  label: string;
  href: string;
};

export type CollectionProduct = {
  id: string;
  title: string;
  href: string;
  onlineShop: boolean;
  images: string[];
  tagIds: number[];
  categoryIds: number[];
};

export type CollectionGridData = {
  slug: string;
  type: "grid";
  title: string;
  h1: string;
  intro: string;
  breadcrumbLabel: string;
  tags: CollectionTag[];
  products: CollectionProduct[];
  categories: CollectionCategory[];
  primaryCategoryIds: number[];
  itemsPerPage: number;
  maxVisibleTags: number;
};
