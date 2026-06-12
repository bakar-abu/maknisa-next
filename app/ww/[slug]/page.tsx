import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MagazineArticlePage } from "@/components/magazine/MagazineArticlePage";
import {
  getMagazineArticleBySlug,
  getRootArticleSlugs,
} from "@/lib/magazine";
import { site } from "@/lib/site";

const RESERVED = new Set([
  "magazine",
  "kitchens",
  "bathrooms",
  "living",
  "bedroom-furniture",
  "tables-chairs-stools",
  "formalia-outdoor",
  "multi-functional-modules",
  "inspire-me",
  "marble-tiles",
  "lighting",
  "products",
  "services",
  "company",
  "find-a-dealer",
  "book-an-appointment",
  "customize-your-order",
  "after-sales-services",
]);

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getRootArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getMagazineArticleBySlug(slug);
  if (!article) return { title: site.name };
  return {
    title: `${article.title} | ${site.name}`,
    description: article.excerpt,
  };
}

export default async function RootArticleRoute({ params }: PageProps) {
  const { slug } = await params;
  if (RESERVED.has(slug)) notFound();

  const article = getMagazineArticleBySlug(slug);
  if (!article) notFound();

  return <MagazineArticlePage article={article} />;
}
