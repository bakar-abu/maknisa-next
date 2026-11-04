import { afterSalesContent, type WarrantyBlock } from "@/lib/after-sales";
import { appointmentContent } from "@/lib/appointment";
import { customizeOrderContent } from "@/lib/customize-order";
import type { PageContent, PageSeoContent } from "@/lib/cms/page-content";

export const SUPPORT_SLUGS = [
  "after-sales-services",
  "book-an-appointment",
  "customize-your-order",
] as const;

export type SupportSlug = (typeof SUPPORT_SLUGS)[number];

export type SupportSectionDefinition = {
  id: string;
  label: string;
  description: string;
};

export type AfterSalesIntroContent = {
  title: string;
  intro: string;
  customerCareLabel: string;
  customerCareHref: string;
};

export type AfterSalesRegisterBannerContent = {
  title: string;
  body: string;
  cta: { label: string; href: string };
};

export type AfterSalesWarrantyNavContent = {
  anchorQuestion: string;
  anchors: { label: string; anchorId: string }[];
};

export type WarrantyBlockContent = WarrantyBlock;

export type AppointmentIntroContent = {
  title: string;
  intro: string;
};

export type AppointmentAsideContent = {
  title: string;
  items: string[];
};

export type FormMessagesContent = {
  successTitle: string;
  successMessage: string;
};

export type CustomizeIntroContent = {
  title: string;
  intro: string;
};

const AFTER_SALES_SECTION_DEFINITIONS: SupportSectionDefinition[] = [
  {
    id: "intro",
    label: "Page intro",
    description: "Page title, intro copy, and customer care link.",
  },
  {
    id: "register-banner",
    label: "Register product banner",
    description: "Banner encouraging customers to register their purchase.",
  },
  {
    id: "warranty-nav",
    label: "Warranty navigation",
    description: "Anchor question and category jump links.",
  },
  {
    id: "warranty-kitchen-living",
    label: "Kitchen & living warranty",
    description: "Warranty block for kitchens, living, and multi-functional modules.",
  },
  {
    id: "warranty-bathrooms",
    label: "Bathrooms warranty",
    description: "Warranty block and FAQ for bathroom furnishings.",
  },
];

const APPOINTMENT_SECTION_DEFINITIONS: SupportSectionDefinition[] = [
  {
    id: "intro",
    label: "Page intro",
    description: "Page title and introductory paragraph.",
  },
  {
    id: "aside",
    label: "What to expect",
    description: "Sidebar title and bullet points beside the form.",
  },
  {
    id: "form-messages",
    label: "Form messages",
    description: "Success title and message after form submission.",
  },
];

const CUSTOMIZE_SECTION_DEFINITIONS: SupportSectionDefinition[] = [
  {
    id: "intro",
    label: "Page intro",
    description: "Page title and introductory paragraph.",
  },
  {
    id: "form-messages",
    label: "Form messages",
    description: "Success title and message after form submission.",
  },
];

export function supportPageSlug(supportSlug: SupportSlug): string {
  return `support-${supportSlug}`;
}

export function supportSlugFromAdminPath(path: string): SupportSlug | null {
  const normalized = path.replace(/\/$/, "");
  const match = normalized.match(
    /^\/ww\/(after-sales-services|book-an-appointment|customize-your-order)$/,
  );
  if (!match) return null;
  return match[1] as SupportSlug;
}

export function getSupportSectionDefinitions(
  supportSlug: SupportSlug,
): SupportSectionDefinition[] {
  switch (supportSlug) {
    case "after-sales-services":
      return AFTER_SALES_SECTION_DEFINITIONS;
    case "book-an-appointment":
      return APPOINTMENT_SECTION_DEFINITIONS;
    case "customize-your-order":
      return CUSTOMIZE_SECTION_DEFINITIONS;
    default:
      return [];
  }
}

export function getSupportPageDefaults(supportSlug: SupportSlug): PageContent {
  const seo = getSupportSeoDefaults(supportSlug);
  const sections: Record<string, unknown> = {};

  for (const section of getSupportSectionDefinitions(supportSlug)) {
    sections[section.id] = getDefaultSectionContent(supportSlug, section.id);
  }

  return { seo, sections };
}

function getSupportSeoDefaults(supportSlug: SupportSlug): PageSeoContent {
  switch (supportSlug) {
    case "after-sales-services":
      return {
        metaTitle: `${afterSalesContent.title} | Maknisa`,
        metaDescription: afterSalesContent.metaDescription,
        noIndex: false,
        noFollow: false,
      };
    case "book-an-appointment":
      return {
        metaTitle: `${appointmentContent.title} | Maknisa`,
        metaDescription: appointmentContent.metaDescription,
        noIndex: false,
        noFollow: false,
      };
    case "customize-your-order":
      return {
        metaTitle: `${customizeOrderContent.title} | Maknisa`,
        metaDescription: customizeOrderContent.metaDescription,
        noIndex: false,
        noFollow: false,
      };
    default:
      return {
        metaTitle: "Maknisa",
        metaDescription: "",
        noIndex: false,
        noFollow: false,
      };
  }
}

export function getDefaultSectionContent(
  supportSlug: SupportSlug,
  sectionId: string,
): unknown {
  switch (supportSlug) {
    case "after-sales-services":
      return getAfterSalesDefaultSection(sectionId);
    case "book-an-appointment":
      return getAppointmentDefaultSection(sectionId);
    case "customize-your-order":
      return getCustomizeDefaultSection(sectionId);
    default:
      return {};
  }
}

function getAfterSalesDefaultSection(sectionId: string): unknown {
  switch (sectionId) {
    case "intro":
      return {
        title: afterSalesContent.title,
        intro: afterSalesContent.intro,
        customerCareLabel: afterSalesContent.customerCareLabel,
        customerCareHref: afterSalesContent.customerCareHref,
      } satisfies AfterSalesIntroContent;
    case "register-banner":
      return afterSalesContent.registerBanner satisfies AfterSalesRegisterBannerContent;
    case "warranty-nav":
      return {
        anchorQuestion: afterSalesContent.anchorQuestion,
        anchors: [...afterSalesContent.anchors],
      } satisfies AfterSalesWarrantyNavContent;
    case "warranty-kitchen-living":
      return afterSalesContent.warranties[0];
    case "warranty-bathrooms":
      return afterSalesContent.warranties[1];
    default:
      return {};
  }
}

function getAppointmentDefaultSection(sectionId: string): unknown {
  switch (sectionId) {
    case "intro":
      return {
        title: appointmentContent.title,
        intro: appointmentContent.intro,
      } satisfies AppointmentIntroContent;
    case "aside":
      return {
        title: "What to expect",
        items: [
          "One-to-one consultation with a Maknisa design specialist",
          "Guidance on materials, layouts, and collections for your space",
          "Showroom visit or follow-up tailored to your project",
        ],
      } satisfies AppointmentAsideContent;
    case "form-messages":
      return {
        successTitle: appointmentContent.successTitle,
        successMessage: appointmentContent.successMessage,
      } satisfies FormMessagesContent;
    default:
      return {};
  }
}

function getCustomizeDefaultSection(sectionId: string): unknown {
  switch (sectionId) {
    case "intro":
      return {
        title: customizeOrderContent.title,
        intro: customizeOrderContent.intro,
      } satisfies CustomizeIntroContent;
    case "form-messages":
      return {
        successTitle: customizeOrderContent.successTitle,
        successMessage: customizeOrderContent.successMessage,
      } satisfies FormMessagesContent;
    default:
      return {};
  }
}

export function asAfterSalesIntroContent(value: unknown): AfterSalesIntroContent {
  const defaults = getAfterSalesDefaultSection("intro") as AfterSalesIntroContent;
  const data = (value ?? {}) as Partial<AfterSalesIntroContent>;
  return {
    title: data.title ?? defaults.title,
    intro: data.intro ?? defaults.intro,
    customerCareLabel: data.customerCareLabel ?? defaults.customerCareLabel,
    customerCareHref: data.customerCareHref ?? defaults.customerCareHref,
  };
}

export function asAfterSalesRegisterBannerContent(
  value: unknown,
): AfterSalesRegisterBannerContent {
  const defaults = getAfterSalesDefaultSection(
    "register-banner",
  ) as AfterSalesRegisterBannerContent;
  const data = (value ?? {}) as Partial<AfterSalesRegisterBannerContent>;
  return {
    title: data.title ?? defaults.title,
    body: data.body ?? defaults.body,
    cta: {
      label: data.cta?.label ?? defaults.cta.label,
      href: data.cta?.href ?? defaults.cta.href,
    },
  };
}

export function asAfterSalesWarrantyNavContent(
  value: unknown,
): AfterSalesWarrantyNavContent {
  const defaults = getAfterSalesDefaultSection("warranty-nav") as AfterSalesWarrantyNavContent;
  const data = (value ?? {}) as Partial<AfterSalesWarrantyNavContent>;
  return {
    anchorQuestion: data.anchorQuestion ?? defaults.anchorQuestion,
    anchors:
      Array.isArray(data.anchors) && data.anchors.length > 0
        ? data.anchors
        : defaults.anchors,
  };
}

export function asWarrantyBlockContent(
  value: unknown,
  fallback: WarrantyBlock,
): WarrantyBlockContent {
  const data = (value ?? {}) as Partial<WarrantyBlock>;
  return {
    anchorId: data.anchorId ?? fallback.anchorId,
    align: data.align ?? fallback.align,
    bgLight: data.bgLight ?? fallback.bgLight,
    image: data.image ?? fallback.image,
    title: data.title ?? fallback.title,
    categories:
      Array.isArray(data.categories) && data.categories.length > 0
        ? data.categories
        : fallback.categories,
    intro: data.intro ?? fallback.intro,
    peaceTitle: data.peaceTitle ?? fallback.peaceTitle,
    columns:
      Array.isArray(data.columns) && data.columns.length > 0
        ? data.columns
        : fallback.columns,
    faq: Array.isArray(data.faq) && data.faq.length > 0 ? data.faq : fallback.faq,
    accordionId: data.accordionId ?? fallback.accordionId,
  };
}

export function asAppointmentIntroContent(value: unknown): AppointmentIntroContent {
  const defaults = getAppointmentDefaultSection("intro") as AppointmentIntroContent;
  const data = (value ?? {}) as Partial<AppointmentIntroContent>;
  return {
    title: data.title ?? defaults.title,
    intro: data.intro ?? defaults.intro,
  };
}

export function asAppointmentAsideContent(value: unknown): AppointmentAsideContent {
  const defaults = getAppointmentDefaultSection("aside") as AppointmentAsideContent;
  const data = (value ?? {}) as Partial<AppointmentAsideContent>;
  return {
    title: data.title ?? defaults.title,
    items:
      Array.isArray(data.items) && data.items.length > 0 ? data.items : defaults.items,
  };
}

export function asFormMessagesContent(value: unknown): FormMessagesContent {
  const data = (value ?? {}) as Partial<FormMessagesContent>;
  const defaults = {
    successTitle: "",
    successMessage: "",
  };
  return {
    successTitle: data.successTitle ?? defaults.successTitle,
    successMessage: data.successMessage ?? defaults.successMessage,
  };
}

export function asCustomizeIntroContent(value: unknown): CustomizeIntroContent {
  const defaults = getCustomizeDefaultSection("intro") as CustomizeIntroContent;
  const data = (value ?? {}) as Partial<CustomizeIntroContent>;
  return {
    title: data.title ?? defaults.title,
    intro: data.intro ?? defaults.intro,
  };
}

export function asSupportSectionContent(
  supportSlug: SupportSlug,
  sectionId: string,
  value: unknown,
): unknown {
  switch (supportSlug) {
    case "after-sales-services":
      if (sectionId === "intro") return asAfterSalesIntroContent(value);
      if (sectionId === "register-banner") return asAfterSalesRegisterBannerContent(value);
      if (sectionId === "warranty-nav") return asAfterSalesWarrantyNavContent(value);
      if (sectionId === "warranty-kitchen-living") {
        return asWarrantyBlockContent(
          value,
          afterSalesContent.warranties[0],
        );
      }
      if (sectionId === "warranty-bathrooms") {
        return asWarrantyBlockContent(value, afterSalesContent.warranties[1]);
      }
      break;
    case "book-an-appointment":
      if (sectionId === "intro") return asAppointmentIntroContent(value);
      if (sectionId === "aside") return asAppointmentAsideContent(value);
      if (sectionId === "form-messages") {
        const defaults = getAppointmentDefaultSection("form-messages") as FormMessagesContent;
        return {
          ...defaults,
          ...asFormMessagesContent(value),
        };
      }
      break;
    case "customize-your-order":
      if (sectionId === "intro") return asCustomizeIntroContent(value);
      if (sectionId === "form-messages") {
        const defaults = getCustomizeDefaultSection("form-messages") as FormMessagesContent;
        return {
          ...defaults,
          ...asFormMessagesContent(value),
        };
      }
      break;
  }

  return value;
}

export function buildAfterSalesPageContent(
  sections: Record<string, unknown>,
): typeof afterSalesContent {
  const intro = asAfterSalesIntroContent(sections.intro);
  const registerBanner = asAfterSalesRegisterBannerContent(sections["register-banner"]);
  const warrantyNav = asAfterSalesWarrantyNavContent(sections["warranty-nav"]);

  return {
    ...afterSalesContent,
    title: intro.title,
    intro: intro.intro,
    customerCareLabel: intro.customerCareLabel,
    customerCareHref: intro.customerCareHref,
    registerBanner,
    anchorQuestion: warrantyNav.anchorQuestion,
    anchors: warrantyNav.anchors,
    warranties: [
      asWarrantyBlockContent(
        sections["warranty-kitchen-living"],
        afterSalesContent.warranties[0],
      ),
      asWarrantyBlockContent(sections["warranty-bathrooms"], afterSalesContent.warranties[1]),
    ] as typeof afterSalesContent.warranties,
  };
}

export type AppointmentPageContent = {
  title: string;
  intro: string;
  asideTitle: string;
  asideItems: string[];
  successTitle: string;
  successMessage: string;
};

export function buildAppointmentPageContent(
  sections: Record<string, unknown>,
): AppointmentPageContent {
  const intro = asAppointmentIntroContent(sections.intro);
  const aside = asAppointmentAsideContent(sections.aside);
  const messages = {
    ...(getAppointmentDefaultSection("form-messages") as FormMessagesContent),
    ...asFormMessagesContent(sections["form-messages"]),
  };

  return {
    title: intro.title,
    intro: intro.intro,
    asideTitle: aside.title,
    asideItems: aside.items,
    successTitle: messages.successTitle,
    successMessage: messages.successMessage,
  };
}

export type CustomizePageContent = {
  title: string;
  intro: string;
  successTitle: string;
  successMessage: string;
};

export function buildCustomizePageContent(
  sections: Record<string, unknown>,
): CustomizePageContent {
  const intro = asCustomizeIntroContent(sections.intro);
  const messages = {
    ...(getCustomizeDefaultSection("form-messages") as FormMessagesContent),
    ...asFormMessagesContent(sections["form-messages"]),
  };

  return {
    title: intro.title,
    intro: intro.intro,
    successTitle: messages.successTitle,
    successMessage: messages.successMessage,
  };
}

export type SupportPageSeoContent = PageSeoContent;
