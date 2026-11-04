import { getApiBaseUrl } from "@/lib/admin-auth/session";
import {
  getInspireMePageDefaults,
  INSPIRE_ME_PAGE_SLUG,
} from "@/lib/cms/inspire-me-page";
import type { PageContent } from "@/lib/cms/page-content";

export async function fetchPublicInspireMePageContent(): Promise<PageContent> {
  const defaults = getInspireMePageDefaults();

  try {
    const response = await fetch(
      `${getApiBaseUrl()}/api/content/public/pages/${INSPIRE_ME_PAGE_SLUG}`,
      { next: { revalidate: 30 } },
    );

    if (!response.ok) return defaults;
    return (await response.json()) as PageContent;
  } catch {
    return defaults;
  }
}
