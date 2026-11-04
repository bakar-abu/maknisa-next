import type { Metadata } from "next";
import { CatalogueListingPage } from "@/components/catalogue/CatalogueListingPage";
import { buildCataloguePageContent } from "@/lib/cms/catalogue-page";
import { fetchPublicCataloguePageContent } from "@/lib/cms/fetch-catalogue-page";
import { fetchPublicMagazineArticles } from "@/lib/cms/fetch-magazine";
import { recordToListArticle } from "@/lib/cms/magazine";
import { resolveCatalogueListingCards } from "@/lib/catalogue";
import { cataloguePageDefaults } from "@/lib/catalogue-page";
import { getMagazineListArticles } from "@/lib/magazine";
import { site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const cms = await fetchPublicCataloguePageContent();
  const robots = {
    index: !cms.seo.noIndex,
    follow: !cms.seo.noFollow,
  };

  return {
    title: cms.seo.metaTitle || `Catalogue | ${site.name}`,
    description: cms.seo.metaDescription || cataloguePageDefaults.metaDescription,
    robots,
  };
}

export default async function CataloguePage() {
  const cms = await fetchPublicCataloguePageContent();
  const content = buildCataloguePageContent(cms.sections);
  const cards = await resolveCatalogueListingCards(content.cards);

  const magazineRecords = await fetchPublicMagazineArticles();
  const relatedArticles =
    magazineRecords.length > 0
      ? magazineRecords
          .map(recordToListArticle)
          .filter((article) => article.image)
          .slice(0, 3)
      : getMagazineListArticles()
          .filter((article) => article.image)
          .slice(0, 3);

  return (
    <CatalogueListingPage
      cards={cards}
      content={content}
      relatedArticles={relatedArticles}
    />
  );
}
