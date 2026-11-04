import type { MagazineArticleDetail, MagazineListArticle } from "@/lib/magazine";
import { MAGAZINE_HREF } from "@/lib/magazine";

export type MagazineArticleRecord = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string;
  bodyHtml: string;
  categoryLabel: string | null;
  categoryHref: string | null;
  cardImage: string | null;
  heroImage: string | null;
  large: boolean;
  published: boolean;
  sortOrder: number;
  metaTitle: string;
  metaDescription: string;
  noIndex: boolean;
  noFollow: boolean;
  href: string;
  createdAt: string;
  updatedAt: string;
};

export type MagazineArticleDraft = {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  bodyHtml: string;
  categoryLabel: string;
  categoryHref: string;
  cardImage: string;
  heroImage: string;
  large: boolean;
  published: boolean;
  sortOrder: number;
  metaTitle: string;
  metaDescription: string;
  noIndex: boolean;
  noFollow: boolean;
};

export function slugifyMagazineTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function recordToListArticle(record: MagazineArticleRecord): MagazineListArticle {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    excerpt: record.excerpt,
    href: record.href,
    category: {
      label: record.categoryLabel ?? undefined,
      href: record.categoryHref ?? undefined,
    },
    image: record.cardImage ?? undefined,
    large: record.large,
  };
}

export function recordToArticleDetail(record: MagazineArticleRecord): MagazineArticleDetail {
  const categoryLabel = record.categoryLabel ?? undefined;
  const categoryHref = record.categoryHref ?? undefined;

  return {
    ...recordToListArticle(record),
    subtitle: record.subtitle ?? record.excerpt,
    heroImage: record.heroImage ?? record.cardImage ?? undefined,
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Magazine", href: MAGAZINE_HREF },
      ...(categoryLabel ? [{ label: categoryLabel, href: categoryHref }] : []),
      { label: record.title },
    ],
    bodyHtml: record.bodyHtml,
  };
}

export function emptyMagazineDraft(): MagazineArticleDraft {
  return {
    slug: "",
    title: "",
    subtitle: "",
    excerpt: "",
    bodyHtml: "<p></p>",
    categoryLabel: "",
    categoryHref: "",
    cardImage: "",
    heroImage: "",
    large: false,
    published: true,
    sortOrder: 0,
    metaTitle: "",
    metaDescription: "",
    noIndex: false,
    noFollow: false,
  };
}

export function draftFromRecord(record: MagazineArticleRecord): MagazineArticleDraft {
  return {
    slug: record.slug,
    title: record.title,
    subtitle: record.subtitle ?? "",
    excerpt: record.excerpt,
    bodyHtml: record.bodyHtml || "<p></p>",
    categoryLabel: record.categoryLabel ?? "",
    categoryHref: record.categoryHref ?? "",
    cardImage: record.cardImage ?? "",
    heroImage: record.heroImage ?? "",
    large: record.large,
    published: record.published,
    sortOrder: record.sortOrder,
    metaTitle: record.metaTitle,
    metaDescription: record.metaDescription,
    noIndex: record.noIndex,
    noFollow: record.noFollow,
  };
}

export function draftToPayload(draft: MagazineArticleDraft) {
  return {
    slug: draft.slug,
    title: draft.title,
    subtitle: draft.subtitle || null,
    excerpt: draft.excerpt,
    bodyHtml: draft.bodyHtml,
    categoryLabel: draft.categoryLabel || null,
    categoryHref: draft.categoryHref || null,
    cardImage: draft.cardImage || null,
    heroImage: draft.heroImage || null,
    large: draft.large,
    published: draft.published,
    sortOrder: draft.sortOrder,
    metaTitle: draft.metaTitle,
    metaDescription: draft.metaDescription,
    noIndex: draft.noIndex,
    noFollow: draft.noFollow,
  };
}
