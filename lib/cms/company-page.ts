import {
  aboutContent,
  communicationContent,
  companyPages,
  contactsContent,
  historicContent,
  policyContent,
  qualityContent,
  storesContent,
  type CompanySlug,
  COMPANY_SLUGS,
} from "@/lib/company-pages";
import type { PageContent, PageSeoContent } from "@/lib/cms/page-content";

export type { CompanySlug };

export type AboutPageContent = typeof aboutContent;
export type CommunicationPageContent = typeof communicationContent;
export type PolicyPageContent = typeof policyContent;
export type QualityPageContent = typeof qualityContent;
export type ContactsOffice = {
  title: string;
  city: string;
  phone: string;
  email: string;
};

export type ContactsPageContent = {
  mapQuery: string;
  headquarters: {
    name: string;
    address: string;
    phone: string;
    email: string;
    emailOfficial: string;
  };
  offices: ContactsOffice[];
};
export type StoresPageContent = typeof storesContent;
export type HistoricPageContent = typeof historicContent;

export const COMPANY_MAIN_SECTION = "main";

export type CompanySectionId = typeof COMPANY_MAIN_SECTION;

const COMPANY_SECTION_DESCRIPTIONS: Record<CompanySlug, string> = {
  company: "Hero image, intro copy, and pillar blocks.",
  communication: "Press room, banner image, and social content.",
  "company-policy": "Quote, values, aims, and closing statement.",
  quality: "Hero, green mind, and quality & safety sections.",
  contacts: "Map query and headquarters contact details.",
  "maknisa-store": "Store locations with images and contact info.",
  "historic-brands": "Intro copy and historic brand slider images.",
};

export type CompanySectionDefinition = {
  id: CompanySectionId;
  label: string;
  description: string;
};

export function getCompanySectionDefinitions(
  companySlug: CompanySlug,
): CompanySectionDefinition[] {
  const page = companyPages[companySlug];

  return [
    {
      id: COMPANY_MAIN_SECTION,
      label: page.title,
      description: COMPANY_SECTION_DESCRIPTIONS[companySlug],
    },
  ];
}

export function companyPageSlug(companySlug: CompanySlug): string {
  return `company-${companySlug}`;
}

export function companySlugFromAdminPath(path: string): CompanySlug | null {
  const match = path.match(/\/ww\/company\/([^/]+)/);
  if (!match) return null;
  const slug = match[1];
  return (COMPANY_SLUGS as readonly string[]).includes(slug)
    ? (slug as CompanySlug)
    : null;
}

export function getCompanyPageDefaults(companySlug: CompanySlug): PageContent {
  const page = companyPages[companySlug];

  return {
    seo: {
      metaTitle: `${page.title} | Maknisa`,
      metaDescription: page.metaDescription,
      noIndex: false,
      noFollow: false,
    },
    sections: {
      [COMPANY_MAIN_SECTION]: getDefaultMainContent(companySlug),
    },
  };
}

function getDefaultMainContent(companySlug: CompanySlug): unknown {
  switch (companySlug) {
    case "company":
      return aboutContent;
    case "communication":
      return communicationContent;
    case "company-policy":
      return policyContent;
    case "quality":
      return qualityContent;
    case "contacts":
      return contactsContent;
    case "maknisa-store":
      return storesContent;
    case "historic-brands":
      return historicContent;
    default:
      return {};
  }
}

export function asAboutPageContent(value: unknown): AboutPageContent {
  const defaults = aboutContent;
  const data = (value ?? {}) as Partial<AboutPageContent>;
  return {
    heroSubtitle: data.heroSubtitle ?? defaults.heroSubtitle,
    verticalLabel: data.verticalLabel ?? defaults.verticalLabel,
    paragraphs:
      Array.isArray(data.paragraphs) && data.paragraphs.length > 0
        ? data.paragraphs
        : defaults.paragraphs,
    pillars:
      Array.isArray(data.pillars) && data.pillars.length > 0
        ? data.pillars
        : defaults.pillars,
    heroImage: data.heroImage ?? defaults.heroImage,
  };
}

export function asCommunicationPageContent(value: unknown): CommunicationPageContent {
  const defaults = communicationContent;
  const data = (value ?? {}) as Partial<CommunicationPageContent>;
  return {
    verticalLabel: data.verticalLabel ?? defaults.verticalLabel,
    subtitle: data.subtitle ?? defaults.subtitle,
    intro: data.intro ?? defaults.intro,
    bannerImage: data.bannerImage ?? defaults.bannerImage,
    pressTitle: data.pressTitle ?? defaults.pressTitle,
    pressIntro: data.pressIntro ?? defaults.pressIntro,
    pressItems:
      Array.isArray(data.pressItems) && data.pressItems.length > 0
        ? data.pressItems
        : defaults.pressItems,
    socialTitle: data.socialTitle ?? defaults.socialTitle,
    socialText: data.socialText ?? defaults.socialText,
  };
}

export function asPolicyPageContent(value: unknown): PolicyPageContent {
  const defaults = policyContent;
  const data = (value ?? {}) as Partial<PolicyPageContent>;
  return {
    quote: data.quote ?? defaults.quote,
    quoteBody: data.quoteBody ?? defaults.quoteBody,
    valuesIntro: data.valuesIntro ?? defaults.valuesIntro,
    values:
      Array.isArray(data.values) && data.values.length > 0
        ? data.values
        : defaults.values,
    aimsIntro: data.aimsIntro ?? defaults.aimsIntro,
    aims:
      Array.isArray(data.aims) && data.aims.length > 0 ? data.aims : defaults.aims,
    closing: data.closing ?? defaults.closing,
  };
}

export function asQualityPageContent(value: unknown): QualityPageContent {
  const defaults = qualityContent;
  const data = (value ?? {}) as Partial<QualityPageContent>;
  return {
    heroImage: data.heroImage ?? defaults.heroImage,
    heroIntro: data.heroIntro ?? defaults.heroIntro,
    anchors:
      Array.isArray(data.anchors) && data.anchors.length > 0
        ? data.anchors
        : defaults.anchors,
    greenMind: {
      title: data.greenMind?.title ?? defaults.greenMind.title,
      intro: data.greenMind?.intro ?? defaults.greenMind.intro,
      rows:
        Array.isArray(data.greenMind?.rows) && data.greenMind.rows.length > 0
          ? data.greenMind.rows
          : defaults.greenMind.rows,
    },
    qualitySafety: {
      title: data.qualitySafety?.title ?? defaults.qualitySafety.title,
      intro: data.qualitySafety?.intro ?? defaults.qualitySafety.intro,
      rows:
        Array.isArray(data.qualitySafety?.rows) && data.qualitySafety.rows.length > 0
          ? data.qualitySafety.rows
          : defaults.qualitySafety.rows,
    },
  };
}

export function asContactsPageContent(value: unknown): ContactsPageContent {
  const defaults = contactsContent;
  const data = (value ?? {}) as Partial<ContactsPageContent>;
  return {
    mapQuery: data.mapQuery ?? defaults.mapQuery,
    headquarters: {
      name: data.headquarters?.name ?? defaults.headquarters.name,
      address: data.headquarters?.address ?? defaults.headquarters.address,
      phone: data.headquarters?.phone ?? defaults.headquarters.phone,
      email: data.headquarters?.email ?? defaults.headquarters.email,
      emailOfficial:
        data.headquarters?.emailOfficial ?? defaults.headquarters.emailOfficial,
    },
    offices:
      Array.isArray(data.offices) && data.offices.length > 0
        ? data.offices
        : defaults.offices,
  };
}

export function asStoresPageContent(value: unknown): StoresPageContent {
  const data = value as StoresPageContent | undefined;
  if (Array.isArray(data) && data.length > 0) return data;
  return storesContent;
}

export function asHistoricPageContent(value: unknown): HistoricPageContent {
  const defaults = historicContent;
  const data = (value ?? {}) as Partial<HistoricPageContent>;
  return {
    verticalLabel: data.verticalLabel ?? defaults.verticalLabel,
    paragraphs:
      Array.isArray(data.paragraphs) && data.paragraphs.length > 0
        ? data.paragraphs
        : defaults.paragraphs,
    sliderImages:
      Array.isArray(data.sliderImages) && data.sliderImages.length > 0
        ? data.sliderImages
        : defaults.sliderImages,
  };
}

export function asCompanyMainContent(
  companySlug: CompanySlug,
  value: unknown,
): unknown {
  switch (companySlug) {
    case "company":
      return asAboutPageContent(value);
    case "communication":
      return asCommunicationPageContent(value);
    case "company-policy":
      return asPolicyPageContent(value);
    case "quality":
      return asQualityPageContent(value);
    case "contacts":
      return asContactsPageContent(value);
    case "maknisa-store":
      return asStoresPageContent(value);
    case "historic-brands":
      return asHistoricPageContent(value);
    default:
      return value;
  }
}

export type CompanyPageSeoContent = PageSeoContent;
