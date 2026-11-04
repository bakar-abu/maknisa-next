import { getApiBaseUrl } from "@/lib/admin-auth/session";
import {
  getHomePageDefaults,
  HOME_PAGE_SLUG,
  type HomePageContent,
} from "@/lib/cms/home-page";

export async function fetchPublicHomePageContent(): Promise<HomePageContent> {
  const defaults = getHomePageDefaults();

  try {
    const response = await fetch(
      `${getApiBaseUrl()}/api/content/public/pages/${HOME_PAGE_SLUG}`,
      { next: { revalidate: 30 } },
    );

    if (!response.ok) return defaults;
    return (await response.json()) as HomePageContent;
  } catch {
    return defaults;
  }
}
