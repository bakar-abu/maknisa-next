import { BOOK_APPOINTMENT_HREF } from "@/lib/appointment";
import {
  CATALOGUE_HREF,
  REQUEST_CATALOGUE_HREF,
  serviceCatalogueDownloadHref,
  type CatalogueListingCard,
} from "@/lib/catalogue";
import { MAGAZINE_HREF } from "@/lib/magazine";
import { SERVICE_PAGES, servicePageHref } from "@/lib/services";

export const cataloguePageDefaults = {
  title: "Catalogue",
  metaDescription:
    "Browse Maknisa service catalogues — kitchens, marble & tiles, woodwork, interior design, furniture, and lighting.",
  intro:
    "Browse Maknisa catalogues by service — kitchens, surfaces, woodwork, interior design, furniture, and lighting. Hover a card to preview, then click the image to download that service catalogue.",
  appointmentLead: "Can't find what you're looking for?",
  appointmentText:
    "Book a personalised appointment with our team to customise your project — from layout and materials to finishes and installation.",
  appointmentCtaLabel: "Book an appointment",
  appointmentCtaHref: BOOK_APPOINTMENT_HREF,
  relatedTitle: "Related inspiration",
  relatedSubtitle:
    "Ideas and guides from the Maknisa Magazine to help you plan your project.",
  relatedViewAllLabel: "View all articles",
  relatedViewAllHref: MAGAZINE_HREF,
  relatedEnabled: true,
};

export type CataloguePageContent = typeof cataloguePageDefaults & {
  cards: CatalogueListingCard[];
};

export function getDefaultCatalogueCards(): CatalogueListingCard[] {
  return SERVICE_PAGES.map((page) => ({
    slug: page.slug,
    label: page.label,
    href: servicePageHref(page.slug),
    image: "",
    hoverImage: "",
    downloadHref: serviceCatalogueDownloadHref(page.slug),
  }));
}

export { CATALOGUE_HREF, REQUEST_CATALOGUE_HREF };
