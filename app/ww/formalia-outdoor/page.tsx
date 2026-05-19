import type { Metadata } from "next";
import { OutdoorCollectionPage } from "@/components/collection/OutdoorCollectionPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Outdoor | ${site.name}`,
  description: "Formalia Outdoor kitchens and open-air living by Maknisa.",
};

export default function Page() {
  return <OutdoorCollectionPage />;
}
