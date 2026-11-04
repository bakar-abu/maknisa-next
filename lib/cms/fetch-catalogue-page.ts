import { getApiBaseUrl } from "@/lib/admin-auth/session";
import { getCataloguePageDefaults, CATALOGUE_PAGE_SLUG } from "@/lib/cms/catalogue-page";
import type { PageContent } from "@/lib/cms/page-content";

export async function fetchPublicCataloguePageContent(): Promise<PageContent> {
  const defaults = getCataloguePageDefaults();

  try {
    const response = await fetch(
      `${getApiBaseUrl()}/api/content/public/pages/${CATALOGUE_PAGE_SLUG}`,
      { next: { revalidate: 30 } },
    );

    if (!response.ok) return defaults;
    return (await response.json()) as PageContent;
  } catch {
    return defaults;
  }
}
