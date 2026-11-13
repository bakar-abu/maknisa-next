import type { MagazineArticleRecord } from "@/lib/cms/magazine";
import { fetchPublicJson } from "@/lib/cms/public-fetch";

export async function fetchPublicMagazineArticles(): Promise<MagazineArticleRecord[]> {
  const data = await fetchPublicJson<{ articles?: MagazineArticleRecord[] }>(
    "/api/magazine/public/articles",
    { revalidate: 30 },
  );
  return data?.articles ?? [];
}

export async function fetchPublicMagazineArticleBySlug(
  slug: string,
): Promise<MagazineArticleRecord | null> {
  const data = await fetchPublicJson<{ article?: MagazineArticleRecord }>(
    `/api/magazine/public/articles/${encodeURIComponent(slug)}`,
    { revalidate: 30 },
  );
  return data?.article ?? null;
}
