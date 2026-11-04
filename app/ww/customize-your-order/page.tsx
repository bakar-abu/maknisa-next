import type { Metadata } from "next";
import { CustomizeOrderPage } from "@/components/customize/CustomizeOrderPage";
import { buildCustomizePageContent } from "@/lib/cms/support-page";
import { fetchPublicSupportPageContent } from "@/lib/cms/fetch-support-page";
import { customizeOrderContent } from "@/lib/customize-order";
import { site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const cms = await fetchPublicSupportPageContent("customize-your-order");
  const robots = {
    index: !cms.seo.noIndex,
    follow: !cms.seo.noFollow,
  };

  return {
    title: cms.seo.metaTitle || `${customizeOrderContent.title} | ${site.name}`,
    description: cms.seo.metaDescription || customizeOrderContent.metaDescription,
    robots,
  };
}

export default async function CustomizeYourOrderRoute() {
  const cms = await fetchPublicSupportPageContent("customize-your-order");
  const content = buildCustomizePageContent(cms.sections);

  return <CustomizeOrderPage content={content} />;
}
