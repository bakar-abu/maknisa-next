import {
  getInspireMePageDefaults,
  INSPIRE_ME_PAGE_SLUG,
} from "@/lib/cms/inspire-me-page";
import type { PageContent } from "@/lib/cms/page-content";
import { fetchPublicJson } from "@/lib/cms/public-fetch";

export async function fetchPublicInspireMePageContent(): Promise<PageContent> {
  const defaults = getInspireMePageDefaults();
  const data = await fetchPublicJson<PageContent>(
    `/api/content/public/pages/${INSPIRE_ME_PAGE_SLUG}`,
    { revalidate: 30 },
  );
  return data ?? defaults;
}
