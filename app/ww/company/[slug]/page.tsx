import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompanyPageRenderer } from "@/components/company/CompanyPageRenderer";
import {
  getAllCompanySlugs,
  getCompanyPage,
  type CompanySlug,
} from "@/lib/company-pages";
import { site } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllCompanySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getCompanyPage(slug);
  if (!page) return { title: site.name };

  return {
    title: `${page.title} | ${site.name}`,
    description: page.metaDescription,
  };
}

export default async function CompanySlugPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getCompanyPage(slug);
  if (!page) notFound();

  return <CompanyPageRenderer slug={slug as CompanySlug} />;
}
