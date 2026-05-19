import type { Metadata } from "next";
import { InspireMePage } from "@/components/collection/InspireMePage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Inspire me | ${site.name}`,
  description: "Find your interior style with the Maknisa Inspire me wizard.",
};

export default function Page() {
  return <InspireMePage />;
}
