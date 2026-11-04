import { site } from "@/lib/site";
import {
  homeVideoSections,
  type HomeVideoSection,
} from "@/lib/homeSliders";
import {
  actionsSiteItems,
  designColumns,
  environmentVideoSection,
  launchBoxes,
  magazineSection,
  newsScrollingSection,
  type ActionSiteItem,
  type DesignColumn,
  type LaunchBox,
  type MagazineArticle,
  type NewsScrollItem,
} from "@/lib/homeSections";

export type HomeSeoContent = {
  metaTitle: string;
  metaDescription: string;
  noIndex: boolean;
  noFollow: boolean;
};

export type HeroIntroContent = {
  heroImage: string;
  heroImageAlt: string;
  ctaHref: string;
  ctaLabel: string;
};

export type IntroTextContent = {
  headingHtml: string;
  paragraph: string;
};

export type BespokeTextContent = {
  titleHtml: string;
  subtitle: string;
};

export type VideoSlidersContent = {
  sections: HomeVideoSection[];
};

export type LaunchBoxesContent = {
  boxes: LaunchBox[];
};

export type DesignColumnsContent = {
  columns: DesignColumn[];
};

export type NewsScrollingContent = {
  eyebrow: string;
  title: string;
  introHtml: string;
  items: NewsScrollItem[];
};

export type EnvironmentVideoKeyPhrase = {
  className: string;
  text: string;
};

export type EnvironmentVideoContent = {
  desktopVideo: string;
  mobileVideo: string;
  title: string;
  subtitle: string;
  cta: { href: string; label: string };
  keyPhrases: EnvironmentVideoKeyPhrase[];
};

export type ActionsSiteContent = {
  items: ActionSiteItem[];
};

export type MagazineContent = {
  title: string;
  introHtml: string;
  allArticlesCta: { href: string; label: string };
  articles: MagazineArticle[];
};

export type HomePageContent = {
  seo: HomeSeoContent;
  sections: Record<string, unknown>;
};

export const HOME_PAGE_SLUG = "home";

export const HOME_SECTION_DEFINITIONS = [
  { id: "hero-intro", label: "Hero section", description: "Background image and main call-to-action." },
  { id: "intro-text", label: "Intro text", description: "Headline and supporting paragraph below the hero." },
  { id: "video-sliders", label: "Video sliders", description: "Kitchens, living rooms, bathrooms, and matching furniture carousels." },
  { id: "bespoke-text", label: "Bespoke furniture", description: "Bespoke furniture headline block." },
  { id: "launch-boxes", label: "Launch boxes", description: "Walk-in wardrobes, multi-functional systems, and outdoor kitchens." },
  { id: "design-columns", label: "Design columns", description: "Budget, ideas, and dealer expertise columns." },
  { id: "news-scrolling", label: "News scrolling", description: "Quality, assistance, and guarantees carousel." },
  { id: "environment-video", label: "Environment video", description: "Sustainability video section with key phrases." },
  { id: "actions-site", label: "Site actions", description: "Appointment, catalogue, and newsletter cards." },
  { id: "magazine", label: "Magazine strip", description: "Featured magazine articles on the homepage." },
] as const;

export type HomeSectionId = (typeof HOME_SECTION_DEFINITIONS)[number]["id"];

export function getHomePageDefaults(): HomePageContent {
  return {
    seo: {
      metaTitle: site.title,
      metaDescription: site.description,
      noIndex: false,
      noFollow: false,
    },
    sections: {
      "hero-intro": {
        heroImage: "/images/hero-section.png",
        heroImageAlt: "Maknisa luxury kitchen collection",
        ctaHref: "/services/Kitchens",
        ctaLabel: "Discover the story",
      } satisfies HeroIntroContent,
      "intro-text": {
        headingHtml:
          'Endless <strong>furnishing</strong> solutions to suit your <strong>needs</strong>',
        paragraph:
          "Catering to every taste, from intimate projects to grand designs.",
      } satisfies IntroTextContent,
      "bespoke-text": {
        titleHtml: "Bespoke <strong>furniture</strong><br />design.",
        subtitle: "Numerous Maknisa professionals near you",
      } satisfies BespokeTextContent,
      "video-sliders": {
        sections: homeVideoSections,
      } satisfies VideoSlidersContent,
      "launch-boxes": {
        boxes: launchBoxes,
      } satisfies LaunchBoxesContent,
      "design-columns": {
        columns: designColumns,
      } satisfies DesignColumnsContent,
      "news-scrolling": {
        eyebrow: newsScrollingSection.eyebrow,
        title: newsScrollingSection.title,
        introHtml: newsScrollingSection.introHtml,
        items: newsScrollingSection.items,
      } satisfies NewsScrollingContent,
      "environment-video": {
        desktopVideo: environmentVideoSection.desktopVideo,
        mobileVideo: environmentVideoSection.mobileVideo,
        title: environmentVideoSection.title,
        subtitle: environmentVideoSection.subtitle,
        cta: environmentVideoSection.cta,
        keyPhrases: environmentVideoSection.keyPhrases,
      } satisfies EnvironmentVideoContent,
      "actions-site": {
        items: actionsSiteItems,
      } satisfies ActionsSiteContent,
      "magazine": {
        title: magazineSection.title,
        introHtml: magazineSection.introHtml,
        allArticlesCta: magazineSection.allArticlesCta,
        articles: magazineSection.articles,
      } satisfies MagazineContent,
    },
  };
}

export function asHeroContent(value: unknown): HeroIntroContent {
  const defaults = getHomePageDefaults().sections["hero-intro"] as HeroIntroContent;
  const data = (value ?? {}) as Partial<HeroIntroContent>;
  return {
    heroImage: data.heroImage ?? defaults.heroImage,
    heroImageAlt: data.heroImageAlt ?? defaults.heroImageAlt,
    ctaHref: data.ctaHref ?? defaults.ctaHref,
    ctaLabel: data.ctaLabel ?? defaults.ctaLabel,
  };
}

export function asIntroTextContent(value: unknown): IntroTextContent {
  const defaults = getHomePageDefaults().sections["intro-text"] as IntroTextContent;
  const data = (value ?? {}) as Partial<IntroTextContent>;
  return {
    headingHtml: data.headingHtml ?? defaults.headingHtml,
    paragraph: data.paragraph ?? defaults.paragraph,
  };
}

export function asBespokeTextContent(value: unknown): BespokeTextContent {
  const defaults = getHomePageDefaults().sections["bespoke-text"] as BespokeTextContent;
  const data = (value ?? {}) as Partial<BespokeTextContent>;
  return {
    titleHtml: data.titleHtml ?? defaults.titleHtml,
    subtitle: data.subtitle ?? defaults.subtitle,
  };
}

function normalizeHomeSliderHref(href: string): string {
  if (href === "/kitchens") return "/services/Kitchens";
  if (href.startsWith("/kitchens/")) {
    return `/ww/services/kitchens/${href.slice("/kitchens/".length)}`;
  }

  const legacyListing: Record<string, string> = {
    "/living": "/ww/living",
    "/bathrooms": "/ww/bathrooms",
    "/tables-chairs-stools": "/ww/tables-chairs-stools",
  };

  return legacyListing[href] ?? href;
}

function normalizeHomeVideoSections(sections: HomeVideoSection[]): HomeVideoSection[] {
  return sections.map((section) => ({
    ...section,
    ctas: section.ctas.map((cta) => ({
      ...cta,
      href: normalizeHomeSliderHref(cta.href),
    })),
    thumbSlides: section.thumbSlides.map((thumb) => ({
      ...thumb,
      link: normalizeHomeSliderHref(thumb.link),
    })),
  }));
}

export function asVideoSlidersContent(value: unknown): VideoSlidersContent {
  const defaults = getHomePageDefaults().sections["video-sliders"] as VideoSlidersContent;
  const data = value as { sections?: HomeVideoSection[] } | undefined;

  if (Array.isArray(data?.sections) && data.sections.length > 0) {
    return { sections: normalizeHomeVideoSections(data.sections) };
  }

  return defaults;
}

function normalizeLaunchBoxHref(href: string): string {
  const legacyListing: Record<string, string> = {
    "/night": "/ww/bedroom-furniture",
    "/ww/night": "/ww/bedroom-furniture",
    "/multi-functional-modules": "/ww/multi-functional-modules",
    "/ww/services/kitchens/kitchen-cabinet-formalia": "/ww/formalia-outdoor",
    "/kitchens/kitchen-cabinet-formalia": "/ww/formalia-outdoor",
    "/formalia-outdoor": "/ww/formalia-outdoor",
  };

  return legacyListing[href] ?? href;
}

function normalizeLaunchBoxes(boxes: LaunchBox[]): LaunchBox[] {
  return boxes.map((box) => ({
    ...box,
    cta: {
      ...box.cta,
      href: normalizeLaunchBoxHref(box.cta.href),
    },
  }));
}

export function asLaunchBoxesContent(value: unknown): LaunchBoxesContent {
  const defaults = getHomePageDefaults().sections["launch-boxes"] as LaunchBoxesContent;
  const data = value as { boxes?: LaunchBox[] } | undefined;

  if (Array.isArray(data?.boxes) && data.boxes.length > 0) {
    return { boxes: normalizeLaunchBoxes(data.boxes) };
  }

  return defaults;
}

export function asDesignColumnsContent(value: unknown): DesignColumnsContent {
  const defaults = getHomePageDefaults().sections["design-columns"] as DesignColumnsContent;
  const data = value as { columns?: DesignColumn[] } | undefined;

  if (Array.isArray(data?.columns) && data.columns.length > 0) {
    return { columns: data.columns };
  }

  return defaults;
}

export function asNewsScrollingContent(value: unknown): NewsScrollingContent {
  const defaults = getHomePageDefaults().sections["news-scrolling"] as NewsScrollingContent;
  const data = (value ?? {}) as Partial<NewsScrollingContent>;

  if (Array.isArray(data.items) && data.items.length > 0) {
    return {
      eyebrow: data.eyebrow ?? defaults.eyebrow,
      title: data.title ?? defaults.title,
      introHtml: data.introHtml ?? defaults.introHtml,
      items: data.items,
    };
  }

  return defaults;
}

function normalizeEnvironmentVideoCtaHref(href: string): string {
  if (
    href === "/ww/company/quality/environmental-awareness-and-respect" ||
    href === "/company/quality" ||
    href === "/company/quality/environmental-awareness-and-respect"
  ) {
    return "/ww/company/quality";
  }

  return href;
}

export function asEnvironmentVideoContent(value: unknown): EnvironmentVideoContent {
  const defaults = getHomePageDefaults().sections["environment-video"] as EnvironmentVideoContent;
  const data = (value ?? {}) as Partial<EnvironmentVideoContent>;
  const ctaHref = data.cta?.href ?? defaults.cta.href;

  return {
    desktopVideo: data.desktopVideo ?? defaults.desktopVideo,
    mobileVideo: data.mobileVideo ?? defaults.mobileVideo,
    title: data.title ?? defaults.title,
    subtitle: data.subtitle ?? defaults.subtitle,
    cta: {
      href: normalizeEnvironmentVideoCtaHref(ctaHref),
      label: data.cta?.label ?? defaults.cta.label,
    },
    keyPhrases:
      Array.isArray(data.keyPhrases) && data.keyPhrases.length > 0
        ? data.keyPhrases
        : defaults.keyPhrases,
  };
}

export function asActionsSiteContent(value: unknown): ActionsSiteContent {
  const defaults = getHomePageDefaults().sections["actions-site"] as ActionsSiteContent;
  const data = value as { items?: ActionSiteItem[] } | undefined;

  if (Array.isArray(data?.items) && data.items.length > 0) {
    return { items: data.items };
  }

  return defaults;
}

export function asMagazineContent(value: unknown): MagazineContent {
  const defaults = getHomePageDefaults().sections["magazine"] as MagazineContent;
  const data = (value ?? {}) as Partial<MagazineContent>;

  if (Array.isArray(data.articles) && data.articles.length > 0) {
    return {
      title: data.title ?? defaults.title,
      introHtml: data.introHtml ?? defaults.introHtml,
      allArticlesCta: {
        href: data.allArticlesCta?.href ?? defaults.allArticlesCta.href,
        label: data.allArticlesCta?.label ?? defaults.allArticlesCta.label,
      },
      articles: data.articles,
    };
  }

  return defaults;
}
