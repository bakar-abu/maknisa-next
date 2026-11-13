import { getCataloguePageDefaults, CATALOGUE_PAGE_SLUG } from "@/lib/cms/catalogue-page";
import type { PageContent } from "@/lib/cms/page-content";
import { fetchPublicJson } from "@/lib/cms/public-fetch";

export async function fetchPublicCataloguePageContent(): Promise<PageContent> {
  const defaults = getCataloguePageDefaults();
  const data = await fetchPublicJson<PageContent>(
    `/api/content/public/pages/${CATALOGUE_PAGE_SLUG}`,
    { revalidate: 30 },
  );
  return data ?? defaults;
}
