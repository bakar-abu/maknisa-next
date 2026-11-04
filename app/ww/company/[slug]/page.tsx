import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompanyPageRenderer } from "@/components/company/CompanyPageRenderer";
import {
  asCompanyMainContent,
  COMPANY_MAIN_SECTION,
} from "@/lib/cms/company-page";
import { fetchPublicCompanyPageContent } from "@/lib/cms/fetch-company-page";
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

  const cms = await fetchPublicCompanyPageContent(slug as CompanySlug);
  const robots = {
    index: !cms.seo.noIndex,
    follow: !cms.seo.noFollow,
  };

  return {
    title: cms.seo.metaTitle || `${page.title} | ${site.name}`,
    description: cms.seo.metaDescription || page.metaDescription,
    robots,
  };
}

export default async function CompanySlugPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getCompanyPage(slug);
  if (!page) notFound();

  const cms = await fetchPublicCompanyPageContent(slug as CompanySlug);
  const content = asCompanyMainContent(
    slug as CompanySlug,
    cms.sections[COMPANY_MAIN_SECTION],
  );

  return <CompanyPageRenderer slug={slug as CompanySlug} content={content} />;
}
