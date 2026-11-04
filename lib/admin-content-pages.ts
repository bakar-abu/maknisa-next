import { CATALOGUE_HREF } from "./catalogue";
import { companyMenu, serviceLinks } from "./navigation";
import { CUSTOMIZE_ORDER_HREF } from "./routes";

export type ContentSubTab = {
  id: string;
  label: string;
  path: string;
};

export type ContentTab = {
  id: string;
  label: string;
  path: string;
  children?: ContentSubTab[];
};

export function getAdminContentTabs(): ContentTab[] {
  const companyChildren: ContentSubTab[] = companyMenu.links.map((link) => ({
    id: link.href,
    label: link.label,
    path: link.href,
  }));

  const supportChildren: ContentSubTab[] = [
    ...serviceLinks.map((link) => ({
      id: link.href,
      label: link.label,
      path: link.href,
    })),
    {
      id: "customize-order",
      label: "Customize Your Order",
      path: CUSTOMIZE_ORDER_HREF,
    },
  ];

  return [
    { id: "home", label: "Home", path: "/" },
    {
      id: "company",
      label: "Company",
      path: companyChildren[0]?.path ?? "/ww/company/company",
      children: companyChildren,
    },
    { id: "catalogue", label: "Catalogue", path: CATALOGUE_HREF },
    {
      id: "inspire-me",
      label: "Inspire Me",
      path: "/ww/inspire-me",
    },
    {
      id: "magazine",
      label: "Magazine",
      path: "/ww/magazine",
    },
    {
      id: "support",
      label: "Support",
      path: supportChildren[0]?.path ?? "/ww/after-sales-services",
      children: supportChildren,
    },
  ];
}

export const DEFAULT_CONTENT_TAB_ID = "home";
