import type { Metadata } from "next";
import { CustomizeOrderPage } from "@/components/customize/CustomizeOrderPage";
import { customizeOrderContent } from "@/lib/customize-order";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${customizeOrderContent.title} | ${site.name}`,
  description: customizeOrderContent.metaDescription,
};

export default function CustomizeYourOrderRoute() {
  return <CustomizeOrderPage />;
}
