import type { Metadata } from "next";
import { CollectionGridRoute } from "@/components/collection/CollectionGridRoute";
import { getCollectionGridData } from "@/lib/collections";
import { site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getCollectionGridData("living");
  return {
    title: `${data.title} | ${site.name}`,
    description: data.intro,
  };
}

export default function Page() {
  return <CollectionGridRoute slug="living" />;
}
