import {
  companyPageSlug,
  getCompanyPageDefaults,
  type CompanySlug,
} from "@/lib/cms/company-page";
import type { PageContent } from "@/lib/cms/page-content";
import { fetchPublicJson } from "@/lib/cms/public-fetch";

export async function fetchPublicCompanyPageContent(
  companySlug: CompanySlug,
): Promise<PageContent> {
  const defaults = getCompanyPageDefaults(companySlug);
  const slug = companyPageSlug(companySlug);
  const data = await fetchPublicJson<PageContent>(
    `/api/content/public/pages/${slug}`,
    { revalidate: 30 },
  );
  return data ?? defaults;
}
