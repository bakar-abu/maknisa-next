import type { Metadata } from "next";
import { ServicesLandingPage } from "@/components/services/ServicesLandingPage";
import { getServicesLandingCards } from "@/lib/services-landing";
import { site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Services | ${site.name}`,
    description:
      "Explore Maknisa services — kitchens, marble & tiles, woodwork, interior design, furniture, and lighting.",
  };
}

export default async function ServicesPage() {
  const cards = await getServicesLandingCards();
  return <ServicesLandingPage cards={cards} />;
}
