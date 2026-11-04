import { getApiBaseUrl } from "@/lib/admin-auth/session";
import {
  getSupportPageDefaults,
  supportPageSlug,
  type SupportSlug,
} from "@/lib/cms/support-page";
import type { PageContent } from "@/lib/cms/page-content";

export async function fetchPublicSupportPageContent(
  supportSlug: SupportSlug,
): Promise<PageContent> {
  const defaults = getSupportPageDefaults(supportSlug);
  const slug = supportPageSlug(supportSlug);

  try {
    const response = await fetch(
      `${getApiBaseUrl()}/api/content/public/pages/${slug}`,
      { next: { revalidate: 30 } },
    );

    if (!response.ok) return defaults;
    return (await response.json()) as PageContent;
  } catch {
    return defaults;
  }
}
