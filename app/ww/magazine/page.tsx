import type { Metadata } from "next";
import { MagazineListingPage } from "@/components/magazine/MagazineListingPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Magazine | ${site.name}`,
  description:
    "Kitchens, living rooms, bathrooms and furnishing trends from the Maknisa Magazine.",
};

export default function MagazinePage() {
  return <MagazineListingPage />;
}
