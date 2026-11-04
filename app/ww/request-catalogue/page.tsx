import type { Metadata } from "next";
import { RequestCataloguePage } from "@/components/catalogue/RequestCataloguePage";
import { catalogueRequestContent } from "@/lib/request-catalogue";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${catalogueRequestContent.title} | ${site.name}`,
  description: catalogueRequestContent.metaDescription,
};

export default function RequestCatalogueRoute() {
  return <RequestCataloguePage />;
}
