import {
  cataloguePageDefaults,
  getDefaultCatalogueCards,
  type CataloguePageContent,
} from "@/lib/catalogue-page";
import type { CatalogueListingCard } from "@/lib/catalogue";
import type { PageContent, PageSeoContent } from "@/lib/cms/page-content";

export const CATALOGUE_PAGE_SLUG = "catalogue";

export type CatalogueSectionDefinition = {
  id: string;
  label: string;
  description: string;
};

export type CatalogueIntroContent = {
  title: string;
  intro: string;
};

export type CatalogueServiceCardsContent = {
  cards: CatalogueListingCard[];
};

export type CatalogueAppointmentCtaContent = {
  lead: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
};

export type CatalogueRelatedSectionContent = {
  enabled: boolean;
  title: string;
  subtitle: string;
  viewAllLabel: string;
  viewAllHref: string;
};

export const CATALOGUE_SECTION_DEFINITIONS: CatalogueSectionDefinition[] = [
  {
    id: "page-intro",
    label: "Page intro",
    description: "Page title and introductory paragraph.",
  },
  {
    id: "service-cards",
    label: "Service catalogue cards",
    description: "Download cards for kitchens, tiles, woodwork, and other services.",
  },
  {
    id: "appointment-cta",
    label: "Appointment call-to-action",
    description: "Prompt visitors to book a personalised appointment.",
  },
  {
    id: "related-section",
    label: "Related inspiration",
    description: "Magazine strip heading and view-all link below the cards.",
  },
];

export type CatalogueSectionId = (typeof CATALOGUE_SECTION_DEFINITIONS)[number]["id"];

export function getCataloguePageDefaults(): PageContent {
  return {
    seo: {
      metaTitle: `Catalogue | Maknisa`,
      metaDescription: cataloguePageDefaults.metaDescription,
      noIndex: false,
      noFollow: false,
    },
    sections: {
      "page-intro": getDefaultSectionContent("page-intro"),
      "service-cards": getDefaultSectionContent("service-cards"),
      "appointment-cta": getDefaultSectionContent("appointment-cta"),
      "related-section": getDefaultSectionContent("related-section"),
    },
  };
}

export function getDefaultSectionContent(sectionId: string): unknown {
  switch (sectionId) {
    case "page-intro":
      return {
        title: cataloguePageDefaults.title,
        intro: cataloguePageDefaults.intro,
      } satisfies CatalogueIntroContent;
    case "service-cards":
      return { cards: getDefaultCatalogueCards() } satisfies CatalogueServiceCardsContent;
    case "appointment-cta":
      return {
        lead: cataloguePageDefaults.appointmentLead,
        text: cataloguePageDefaults.appointmentText,
        ctaLabel: cataloguePageDefaults.appointmentCtaLabel,
        ctaHref: cataloguePageDefaults.appointmentCtaHref,
      } satisfies CatalogueAppointmentCtaContent;
    case "related-section":
      return {
        enabled: cataloguePageDefaults.relatedEnabled,
        title: cataloguePageDefaults.relatedTitle,
        subtitle: cataloguePageDefaults.relatedSubtitle,
        viewAllLabel: cataloguePageDefaults.relatedViewAllLabel,
        viewAllHref: cataloguePageDefaults.relatedViewAllHref,
      } satisfies CatalogueRelatedSectionContent;
    default:
      return {};
  }
}

export function asCatalogueIntroContent(value: unknown): CatalogueIntroContent {
  const defaults = getDefaultSectionContent("page-intro") as CatalogueIntroContent;
  const data = (value ?? {}) as Partial<CatalogueIntroContent>;
  return {
    title: data.title ?? defaults.title,
    intro: data.intro ?? defaults.intro,
  };
}

export function asCatalogueServiceCardsContent(
  value: unknown,
): CatalogueServiceCardsContent {
  const defaults = getDefaultSectionContent("service-cards") as CatalogueServiceCardsContent;
  const data = (value ?? {}) as Partial<CatalogueServiceCardsContent>;
  return {
    cards:
      Array.isArray(data.cards) && data.cards.length > 0 ? data.cards : defaults.cards,
  };
}

export function asCatalogueAppointmentCtaContent(
  value: unknown,
): CatalogueAppointmentCtaContent {
  const defaults = getDefaultSectionContent("appointment-cta") as CatalogueAppointmentCtaContent;
  const data = (value ?? {}) as Partial<CatalogueAppointmentCtaContent>;
  return {
    lead: data.lead ?? defaults.lead,
    text: data.text ?? defaults.text,
    ctaLabel: data.ctaLabel ?? defaults.ctaLabel,
    ctaHref: data.ctaHref ?? defaults.ctaHref,
  };
}

export function asCatalogueRelatedSectionContent(
  value: unknown,
): CatalogueRelatedSectionContent {
  const defaults = getDefaultSectionContent("related-section") as CatalogueRelatedSectionContent;
  const data = (value ?? {}) as Partial<CatalogueRelatedSectionContent>;
  return {
    enabled: data.enabled ?? defaults.enabled,
    title: data.title ?? defaults.title,
    subtitle: data.subtitle ?? defaults.subtitle,
    viewAllLabel: data.viewAllLabel ?? defaults.viewAllLabel,
    viewAllHref: data.viewAllHref ?? defaults.viewAllHref,
  };
}

export function asCatalogueSectionContent(sectionId: string, value: unknown): unknown {
  switch (sectionId) {
    case "page-intro":
      return asCatalogueIntroContent(value);
    case "service-cards":
      return asCatalogueServiceCardsContent(value);
    case "appointment-cta":
      return asCatalogueAppointmentCtaContent(value);
    case "related-section":
      return asCatalogueRelatedSectionContent(value);
    default:
      return value;
  }
}

export function buildCataloguePageContent(
  sections: Record<string, unknown>,
): Omit<CataloguePageContent, "metaDescription"> & { cards: CatalogueListingCard[] } {
  const intro = asCatalogueIntroContent(sections["page-intro"]);
  const serviceCards = asCatalogueServiceCardsContent(sections["service-cards"]);
  const appointment = asCatalogueAppointmentCtaContent(sections["appointment-cta"]);
  const related = asCatalogueRelatedSectionContent(sections["related-section"]);

  return {
    title: intro.title,
    intro: intro.intro,
    appointmentLead: appointment.lead,
    appointmentText: appointment.text,
    appointmentCtaLabel: appointment.ctaLabel,
    appointmentCtaHref: appointment.ctaHref,
    relatedTitle: related.title,
    relatedSubtitle: related.subtitle,
    relatedViewAllLabel: related.viewAllLabel,
    relatedViewAllHref: related.viewAllHref,
    relatedEnabled: related.enabled,
    cards: serviceCards.cards,
  };
}

export type CataloguePageSeoContent = PageSeoContent;
