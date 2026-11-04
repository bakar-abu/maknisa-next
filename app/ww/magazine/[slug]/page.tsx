import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MagazineArticlePage } from "@/components/magazine/MagazineArticlePage";
import {
  recordToArticleDetail,
  recordToListArticle,
} from "@/lib/cms/magazine";
import {
  fetchPublicMagazineArticleBySlug,
  fetchPublicMagazineArticles,
} from "@/lib/cms/fetch-magazine";
import {
  getMagazineArticleBySlug,
  getMagazineListArticles,
  getMagazineSlugs,
} from "@/lib/magazine";
import { site } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const records = await fetchPublicMagazineArticles();
  if (records.length > 0) {
    return records.map((article) => ({ slug: article.slug }));
  }
  return getMagazineSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const record = await fetchPublicMagazineArticleBySlug(slug);
  if (record) {
    return {
      title: record.metaTitle || `${record.title} | Magazine | ${site.name}`,
      description: record.metaDescription || record.excerpt,
      robots: {
        index: !record.noIndex,
        follow: !record.noFollow,
      },
    };
  }

  const article = getMagazineArticleBySlug(slug);
  if (!article) return { title: site.name };
  return {
    title: `${article.title} | Magazine | ${site.name}`,
    description: article.excerpt,
  };
}

export default async function MagazineArticleRoute({ params }: PageProps) {
  const { slug } = await params;
  const records = await fetchPublicMagazineArticles();
  const record = await fetchPublicMagazineArticleBySlug(slug);

  if (record) {
    const article = recordToArticleDetail(record);
    const relatedArticles = records.map(recordToListArticle);
    return <MagazineArticlePage article={article} relatedArticles={relatedArticles} />;
  }

  const article = getMagazineArticleBySlug(slug);
  if (!article) notFound();

  return (
    <MagazineArticlePage
      article={article}
      relatedArticles={getMagazineListArticles()}
    />
  );
}
