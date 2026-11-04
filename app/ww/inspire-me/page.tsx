import type { Metadata } from "next";
import { InspireMePage } from "@/components/collection/InspireMePage";
import { buildInspireMePageContent } from "@/lib/cms/inspire-me-page";
import { fetchPublicInspireMePageContent } from "@/lib/cms/fetch-inspire-me-page";
import { inspireMeDefaults } from "@/lib/inspire-me";
import { site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const cms = await fetchPublicInspireMePageContent();
  const robots = {
    index: !cms.seo.noIndex,
    follow: !cms.seo.noFollow,
  };

  return {
    title: cms.seo.metaTitle || `Inspire me | ${site.name}`,
    description: cms.seo.metaDescription || inspireMeDefaults.metaDescription,
    robots,
  };
}

export default async function Page() {
  const cms = await fetchPublicInspireMePageContent();
  const content = buildInspireMePageContent(cms.sections);

  return <InspireMePage content={content} />;
}
