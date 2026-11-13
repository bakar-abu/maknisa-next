import {
  getSupportPageDefaults,
  supportPageSlug,
  type SupportSlug,
} from "@/lib/cms/support-page";
import type { PageContent } from "@/lib/cms/page-content";
import { fetchPublicJson } from "@/lib/cms/public-fetch";

export async function fetchPublicSupportPageContent(
  supportSlug: SupportSlug,
): Promise<PageContent> {
  const defaults = getSupportPageDefaults(supportSlug);
  const slug = supportPageSlug(supportSlug);
  const data = await fetchPublicJson<PageContent>(
    `/api/content/public/pages/${slug}`,
    { revalidate: 30 },
  );
  return data ?? defaults;
}
