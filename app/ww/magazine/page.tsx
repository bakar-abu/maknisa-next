import type { Metadata } from "next";
import { MagazineListingPage } from "@/components/magazine/MagazineListingPage";
import { recordToListArticle } from "@/lib/cms/magazine";
import { fetchPublicMagazineArticles } from "@/lib/cms/fetch-magazine";
import { getMagazineListArticles } from "@/lib/magazine";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Magazine | ${site.name}`,
  description:
    "Kitchens, living rooms, bathrooms and furnishing trends from the Maknisa Magazine.",
};

export default async function MagazinePage() {
  const records = await fetchPublicMagazineArticles();
  const articles =
    records.length > 0
      ? records.map(recordToListArticle)
      : getMagazineListArticles();

  return <MagazineListingPage articles={articles} />;
}
