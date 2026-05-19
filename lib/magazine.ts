import raw from "./magazine-data.json";
import { magazineSection } from "./homeSections";

export type MagazineCategory = {
  href: string;
  title: string;
  label: string;
};

export type MagazineListArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  href: string;
  category: { href?: string; label?: string };
  image?: string;
  large?: boolean;
};

export type MagazineArticleDetail = MagazineListArticle & {
  subtitle?: string;
  breadcrumbs: { label: string; href?: string }[];
  bodyHtml: string;
  heroImage?: string;
};

const categories: MagazineCategory[] = raw.categories.map((c) => ({
  ...c,
  label: c.label.replace(/&amp;/g, "&"),
  title: c.title.replace(/&amp;/g, "&"),
}));

const listArticles: MagazineListArticle[] = raw.articles.map((a) => {
  const label = a.category.label?.replace(/&amp;/g, "&");
  const cat = a.category as { label?: string; href?: string };
  return {
    ...a,
    category: {
      label,
      href: cat.href ?? guessCategoryHref(label),
    },
  };
});

/** Homepage magazine strip articles (root /ww/ paths). */
const featuredArticles: MagazineListArticle[] = magazineSection.articles.map(
  (a) => ({
    id: a.id,
    slug: a.href.replace(/^\/ww\//, ""),
    title: a.title,
    excerpt: a.abstract,
    href: a.href,
    category: a.category,
    image: a.image,
    large: false,
  }),
);

function guessCategoryHref(label?: string): string | undefined {
  if (!label) return undefined;
  const slug = label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `/ww/magazine/${slug}`;
}

export function getMagazineCategories() {
  return categories;
}

export function getMagazineListArticles() {
  return listArticles;
}

export function getAllMagazineArticles(): MagazineListArticle[] {
  const byHref = new Map<string, MagazineListArticle>();
  for (const a of [...featuredArticles, ...listArticles]) {
    byHref.set(a.href, a);
  }
  return [...byHref.values()];
}

export function getMagazineArticleBySlug(slug: string): MagazineArticleDetail | null {
  const normalized = slug.replace(/^\/+|\/+$/g, "");
  const article = getAllMagazineArticles().find((a) => {
    const s = a.slug.replace(/^magazine\//, "");
    const hrefSlug = a.href.replace(/^\/ww\//, "");
    return (
      s === normalized ||
      hrefSlug === normalized ||
      hrefSlug === `magazine/${normalized}` ||
      a.slug === normalized
    );
  });

  if (!article) return null;

  const detail = ARTICLE_DETAILS[article.slug] ?? ARTICLE_DETAILS[article.href];
  const categoryHref = article.category.href ?? guessCategoryHref(article.category.label);

  return {
    ...article,
    subtitle: detail?.subtitle ?? article.excerpt,
    heroImage: detail?.heroImage ?? article.image,
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Magazine", href: "/ww/magazine" },
      ...(article.category.label
        ? [{ label: article.category.label, href: categoryHref }]
        : []),
      { label: article.title },
    ],
    bodyHtml:
      detail?.bodyHtml ??
      `<p>${article.excerpt}</p><p>Full article content is available on the Maknisa Magazine.</p>`,
  };
}

export function getMagazineSlugs(): string[] {
  const slugs = new Set<string>();
  for (const a of listArticles) {
    slugs.add(a.slug.replace(/^magazine\//, ""));
  }
  return [...slugs];
}

export function getRootArticleSlugs(): string[] {
  return featuredArticles
    .map((a) => a.slug)
    .filter((s) => !s.startsWith("magazine/"));
}

const ARTICLE_DETAILS: Record<
  string,
  { subtitle?: string; heroImage?: string; bodyHtml: string }
> = {
  "furnishing-the-kitchen-and-bathroom-in-the-same-colour": {
    subtitle: "3 trendy colours for a matching kitchen and bathroom",
    bodyHtml: `
      <p>Are you refurbishing and finding yourself inundated with colour samples? Choosing among all the finishes can seem like an impossible task, but there's a solution: opting for the same colour to furnish both your kitchen and bathroom, a trend also known as colour drenching.</p>
      <h3>Why choose a matching kitchen and bathroom?</h3>
      <p>Matching the furnishings of your kitchen and bathroom isn't just about aesthetics; it also helps to create a leitmotif between different rooms, simplify the selection of materials, and expand the perception of space.</p>
      <h3>Terracotta coloured kitchen and bathroom</h3>
      <p>Terracotta is among the most popular colours in recent years. This warm, enveloping shade is perfect for those who love natural and inviting atmospheres.</p>
      <h3>Blue kitchen and bathroom</h3>
      <p>Do you prefer a more vibrant yet still chic shade? Blue instils tranquillity into spaces, dressing them with character without sacrificing elegance.</p>
      <h3>Grey kitchen and bathroom</h3>
      <p>If you're drawn to industrial and minimalist styles, grey is just what you need. This neutral shade goes with everything, from the warmth of wood to the reflections of metal and glass.</p>
    `,
  },
};
