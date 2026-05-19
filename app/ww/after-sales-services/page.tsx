import type { Metadata } from "next";
import { AfterSalesPage } from "@/components/after-sales/AfterSalesPage";
import { afterSalesContent } from "@/lib/after-sales";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${afterSalesContent.title} | ${site.name}`,
  description: afterSalesContent.metaDescription,
};

export default function AfterSalesServicesRoute() {
  return <AfterSalesPage />;
}
