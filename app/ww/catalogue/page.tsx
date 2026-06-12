import type { Metadata } from "next";
import { CatalogueListingPage } from "@/components/catalogue/CatalogueListingPage";
import { getCatalogueListingCards } from "@/lib/catalogue";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Catalogue | ${site.name}`,
  description:
    "Browse Maknisa service catalogues — kitchens, marble & tiles, woodwork, interior design, furniture, and lighting.",
};

export default async function CataloguePage() {
  const cards = await getCatalogueListingCards();

  return <CatalogueListingPage cards={cards} />;
}
