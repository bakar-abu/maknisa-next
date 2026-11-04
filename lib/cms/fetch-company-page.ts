import { getApiBaseUrl } from "@/lib/admin-auth/session";
import {
  companyPageSlug,
  getCompanyPageDefaults,
  type CompanySlug,
} from "@/lib/cms/company-page";
import type { PageContent } from "@/lib/cms/page-content";

export async function fetchPublicCompanyPageContent(
  companySlug: CompanySlug,
): Promise<PageContent> {
  const defaults = getCompanyPageDefaults(companySlug);
  const slug = companyPageSlug(companySlug);

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
