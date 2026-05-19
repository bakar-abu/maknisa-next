import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MagazineArticlePage } from "@/components/magazine/MagazineArticlePage";
import {
  getMagazineArticleBySlug,
  getMagazineSlugs,
} from "@/lib/magazine";
import { site } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getMagazineSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getMagazineArticleBySlug(slug);
  if (!article) return { title: site.name };
  return {
    title: `${article.title} | Magazine | ${site.name}`,
    description: article.excerpt,
  };
}

export default async function MagazineArticleRoute({ params }: PageProps) {
  const { slug } = await params;
  const article = getMagazineArticleBySlug(slug);
  if (!article) notFound();
  return <MagazineArticlePage article={article} />;
}
