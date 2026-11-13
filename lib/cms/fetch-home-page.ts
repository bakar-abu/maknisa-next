import {
  getHomePageDefaults,
  HOME_PAGE_SLUG,
  type HomePageContent,
} from "@/lib/cms/home-page";
import { fetchPublicJson } from "@/lib/cms/public-fetch";

export async function fetchPublicHomePageContent(): Promise<HomePageContent> {
  const defaults = getHomePageDefaults();
  const data = await fetchPublicJson<HomePageContent>(
    `/api/content/public/pages/${HOME_PAGE_SLUG}`,
    { revalidate: 30 },
  );
  return data ?? defaults;
}
