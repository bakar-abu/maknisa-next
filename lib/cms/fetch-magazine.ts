import { getApiBaseUrl } from "@/lib/admin-auth/session";
import type { MagazineArticleRecord } from "@/lib/cms/magazine";

export async function fetchPublicMagazineArticles(): Promise<MagazineArticleRecord[]> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/magazine/public/articles`, {
      next: { revalidate: 30 },
    });
    if (!response.ok) return [];
    const data = (await response.json()) as { articles?: MagazineArticleRecord[] };
    return data.articles ?? [];
  } catch {
    return [];
  }
}

export async function fetchPublicMagazineArticleBySlug(
  slug: string,
): Promise<MagazineArticleRecord | null> {
  try {
    const response = await fetch(
      `${getApiBaseUrl()}/api/magazine/public/articles/${encodeURIComponent(slug)}`,
      { next: { revalidate: 30 } },
    );
    if (!response.ok) return null;
    const data = (await response.json()) as { article?: MagazineArticleRecord };
    return data.article ?? null;
  } catch {
    return null;
  }
}
