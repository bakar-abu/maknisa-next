import type { Metadata } from "next";
import { AfterSalesPage } from "@/components/after-sales/AfterSalesPage";
import { buildAfterSalesPageContent } from "@/lib/cms/support-page";
import { fetchPublicSupportPageContent } from "@/lib/cms/fetch-support-page";
import { afterSalesContent } from "@/lib/after-sales";
import { site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const cms = await fetchPublicSupportPageContent("after-sales-services");
  const robots = {
    index: !cms.seo.noIndex,
    follow: !cms.seo.noFollow,
  };

  return {
    title: cms.seo.metaTitle || `${afterSalesContent.title} | ${site.name}`,
    description: cms.seo.metaDescription || afterSalesContent.metaDescription,
    robots,
  };
}

export default async function AfterSalesServicesRoute() {
  const cms = await fetchPublicSupportPageContent("after-sales-services");
  const content = buildAfterSalesPageContent(cms.sections);

  return <AfterSalesPage content={content} />;
}
