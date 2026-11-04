import {
  inspireMeDefaults,
  type InspireImage,
  type InspireMePageContent,
} from "@/lib/inspire-me";
import type { CollectionProduct } from "@/lib/collection-types";
import type { PageContent, PageSeoContent } from "@/lib/cms/page-content";

export const INSPIRE_ME_PAGE_SLUG = "inspire-me";

export type InspireMeSectionDefinition = {
  id: string;
  label: string;
  description: string;
};

export type InspireMeIntroContent = {
  title: string;
};

export type InspireMeWizardIntroContent = {
  lines: string[];
};

export type InspireMeStyleImagesContent = {
  images: InspireImage[];
};

export type InspireMeResultsContent = {
  seeResultsLabel: string;
  congratsTitle: string;
  congratsBody: string;
  unsatisfiedTitle: string;
  tryAgainLabel: string;
};

export type InspireMeResultProductsContent = {
  products: CollectionProduct[];
};

export const INSPIRE_ME_SECTION_DEFINITIONS: InspireMeSectionDefinition[] = [
  {
    id: "page-intro",
    label: "Page intro",
    description: "Page title shown below the breadcrumbs.",
  },
  {
    id: "wizard-intro",
    label: "Wizard instructions",
    description: "Intro copy above the style image picker.",
  },
  {
    id: "style-images",
    label: "Style images",
    description: "Swipe cards visitors like or skip to find their style.",
  },
  {
    id: "results",
    label: "Results copy",
    description: "Completion message and try-again labels.",
  },
  {
    id: "result-products",
    label: "Recommended products",
    description: "Products shown after the wizard is completed.",
  },
];

export type InspireMeSectionId = (typeof INSPIRE_ME_SECTION_DEFINITIONS)[number]["id"];

export function getInspireMePageDefaults(): PageContent {
  return {
    seo: {
      metaTitle: `Inspire me | Maknisa`,
      metaDescription: inspireMeDefaults.metaDescription,
      noIndex: false,
      noFollow: false,
    },
    sections: {
      "page-intro": getDefaultSectionContent("page-intro"),
      "wizard-intro": getDefaultSectionContent("wizard-intro"),
      "style-images": getDefaultSectionContent("style-images"),
      results: getDefaultSectionContent("results"),
      "result-products": getDefaultSectionContent("result-products"),
    },
  };
}

export function getDefaultSectionContent(sectionId: string): unknown {
  switch (sectionId) {
    case "page-intro":
      return { title: inspireMeDefaults.title } satisfies InspireMeIntroContent;
    case "wizard-intro":
      return { lines: [...inspireMeDefaults.wizardIntro] } satisfies InspireMeWizardIntroContent;
    case "style-images":
      return { images: inspireMeDefaults.images.map((image) => ({ ...image })) } satisfies InspireMeStyleImagesContent;
    case "results":
      return {
        seeResultsLabel: inspireMeDefaults.seeResultsLabel,
        congratsTitle: inspireMeDefaults.congratsTitle,
        congratsBody: inspireMeDefaults.congratsBody,
        unsatisfiedTitle: inspireMeDefaults.unsatisfiedTitle,
        tryAgainLabel: inspireMeDefaults.tryAgainLabel,
      } satisfies InspireMeResultsContent;
    case "result-products":
      return {
        products: inspireMeDefaults.resultProducts.map((product) => ({
          ...product,
          images: [...product.images],
          tagIds: [...product.tagIds],
          categoryIds: [...product.categoryIds],
        })),
      } satisfies InspireMeResultProductsContent;
    default:
      return {};
  }
}

export function asInspireMeIntroContent(value: unknown): InspireMeIntroContent {
  const defaults = getDefaultSectionContent("page-intro") as InspireMeIntroContent;
  const data = (value ?? {}) as Partial<InspireMeIntroContent>;
  return { title: data.title ?? defaults.title };
}

export function asInspireMeWizardIntroContent(value: unknown): InspireMeWizardIntroContent {
  const defaults = getDefaultSectionContent("wizard-intro") as InspireMeWizardIntroContent;
  const data = (value ?? {}) as Partial<InspireMeWizardIntroContent>;
  return {
    lines:
      Array.isArray(data.lines) && data.lines.length > 0 ? data.lines : defaults.lines,
  };
}

export function asInspireMeStyleImagesContent(value: unknown): InspireMeStyleImagesContent {
  const defaults = getDefaultSectionContent("style-images") as InspireMeStyleImagesContent;
  const data = (value ?? {}) as Partial<InspireMeStyleImagesContent>;
  return {
    images:
      Array.isArray(data.images) && data.images.length > 0 ? data.images : defaults.images,
  };
}

export function asInspireMeResultsContent(value: unknown): InspireMeResultsContent {
  const defaults = getDefaultSectionContent("results") as InspireMeResultsContent;
  const data = (value ?? {}) as Partial<InspireMeResultsContent>;
  return {
    seeResultsLabel: data.seeResultsLabel ?? defaults.seeResultsLabel,
    congratsTitle: data.congratsTitle ?? defaults.congratsTitle,
    congratsBody: data.congratsBody ?? defaults.congratsBody,
    unsatisfiedTitle: data.unsatisfiedTitle ?? defaults.unsatisfiedTitle,
    tryAgainLabel: data.tryAgainLabel ?? defaults.tryAgainLabel,
  };
}

export function asInspireMeResultProductsContent(
  value: unknown,
): InspireMeResultProductsContent {
  const defaults = getDefaultSectionContent("result-products") as InspireMeResultProductsContent;
  const data = (value ?? {}) as Partial<InspireMeResultProductsContent>;
  return {
    products:
      Array.isArray(data.products) && data.products.length > 0
        ? data.products
        : defaults.products,
  };
}

export function asInspireMeSectionContent(sectionId: string, value: unknown): unknown {
  switch (sectionId) {
    case "page-intro":
      return asInspireMeIntroContent(value);
    case "wizard-intro":
      return asInspireMeWizardIntroContent(value);
    case "style-images":
      return asInspireMeStyleImagesContent(value);
    case "results":
      return asInspireMeResultsContent(value);
    case "result-products":
      return asInspireMeResultProductsContent(value);
    default:
      return value;
  }
}

export function buildInspireMePageContent(
  sections: Record<string, unknown>,
): InspireMePageContent {
  const intro = asInspireMeIntroContent(sections["page-intro"]);
  const wizardIntro = asInspireMeWizardIntroContent(sections["wizard-intro"]);
  const styleImages = asInspireMeStyleImagesContent(sections["style-images"]);
  const results = asInspireMeResultsContent(sections.results);
  const resultProducts = asInspireMeResultProductsContent(sections["result-products"]);

  return {
    title: intro.title,
    metaDescription: inspireMeDefaults.metaDescription,
    wizardIntro: wizardIntro.lines,
    seeResultsLabel: results.seeResultsLabel,
    congratsTitle: results.congratsTitle,
    congratsBody: results.congratsBody,
    unsatisfiedTitle: results.unsatisfiedTitle,
    tryAgainLabel: results.tryAgainLabel,
    images: styleImages.images,
    resultProducts: resultProducts.products,
  };
}
