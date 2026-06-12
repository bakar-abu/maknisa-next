export type CatalogAdviceArticle = {
  id: string;
  title: string;
  excerpt: string;
  href: string;
  image: string;
};

export type CatalogSeoAccordionItem = {
  id: string;
  title: string;
  body: string;
};

export type CatalogFooterContent = {
  adviceHeading: string;
  adviceSubheading: string;
  adviceCta: string;
  adviceCtaHref: string;
  adviceArticles: CatalogAdviceArticle[];
  exploreHeading: string;
  seoTitle: string;
  seoIntro: string;
  seoAccordion: CatalogSeoAccordionItem[];
};

const FURNITURE_FOOTER: CatalogFooterContent = {
  adviceHeading: "Style advice. Buying guides. Expert tips.",
  adviceSubheading:
    "Everything you need to feel confident finding furniture that fits your style and space.",
  adviceCta: "Get inspired",
  adviceCtaHref: "/ww/magazine",
  adviceArticles: [
    {
      id: "sofa-tips",
      title: "5 tips for selecting the perfect sofa",
      excerpt:
        "Choosing the right sofa is about comfort, proportion, and how the piece anchors your living space.",
      href: "/ww/magazine/dove-grey-kitchens",
      image: "",
    },
    {
      id: "dining-chair",
      title: "How do I choose the perfect dining chair?",
      excerpt:
        "Size, material, and ergonomics matter. Use this guide to narrow your options with confidence.",
      href: "/ww/magazine/porcelain-stoneware-kitchen-worktops-pros-and-cons",
      image: "",
    },
    {
      id: "dining-table",
      title: "Dining table buyer's guide",
      excerpt:
        "A dining table is a long-term choice. Learn what to consider before you commit.",
      href: "/ww/magazine/furnishing-a-small-and-cosy-bathroom-the-complete-guide",
      image: "",
    },
  ],
  exploreHeading: "Explore our design collections",
  seoTitle: "Italian design furniture",
  seoIntro:
    "Explore the Maknisa range of contemporary furniture for living, dining, sleeping, and home-office spaces. Almost every piece can be tailored to your project with materials, finishes, and configurations that match your vision. Our consultants are ready to guide you from concept to installation.",
  seoAccordion: [
    {
      id: "discover",
      title: "Discover modern designer furniture at Maknisa",
      body: "Welcome to Maknisa — your destination for refined Italian furniture and interiors. Browse curated collections online and explore kitchens, living spaces, bedrooms, and bespoke woodwork crafted for lasting quality.",
    },
    {
      id: "elevate",
      title: "Elevate your space with thoughtful design",
      body: "Our collections balance form and function with clean lines, warm materials, and details that feel at home in contemporary and classic interiors alike.",
    },
    {
      id: "store",
      title: "A furniture studio like no other",
      body: "From modular storage to statement dining tables, each piece is developed with attention to craftsmanship, durability, and everyday comfort.",
    },
    {
      id: "custom",
      title: "Create your signature look with customisation",
      body: "Choose from a wide palette of finishes, fabrics, and layouts. Personalise dimensions and details so every room reflects your taste.",
    },
    {
      id: "online",
      title: "Convenient online browsing",
      body: "Research collections online, save your favourites, and visit our showroom to experience materials and finishes in person.",
    },
    {
      id: "advice",
      title: "Expert design advice and inspiration",
      body: "Our team shares practical guidance on layout, lighting, and material pairings to help you plan with confidence.",
    },
    {
      id: "shop",
      title: "Shop designer furniture at Maknisa today",
      body: "Discover pieces that elevate how you live. Filter by category, material, and budget to find the right fit for your home.",
    },
  ],
};

const LIGHTS_FOOTER: CatalogFooterContent = {
  ...FURNITURE_FOOTER,
  exploreHeading: "Explore our lighting collections",
  seoTitle: "Designer lighting",
  seoIntro:
    "Discover Maknisa lighting for pendants, chandeliers, wall lights, and lamps. Each collection is designed to layer ambience, task light, and architectural accent across your home.",
  seoAccordion: FURNITURE_FOOTER.seoAccordion.map((item) => ({
    ...item,
    title: item.title.replace("furniture", "lighting").replace("Furniture", "Lighting"),
    body: item.body
      .replace(/furniture/gi, "lighting")
      .replace(/tables/gi, "fixtures"),
  })),
};

export function getCatalogFooterContent(serviceSlug: string): CatalogFooterContent {
  return serviceSlug.toLowerCase() === "lights" ? LIGHTS_FOOTER : FURNITURE_FOOTER;
}

export function hydrateAdviceImages(
  content: CatalogFooterContent,
  productImages: string[],
): CatalogFooterContent {
  const images = productImages.filter((url) => url.startsWith("http"));
  return {
    ...content,
    adviceArticles: content.adviceArticles.map((article, index) => ({
      ...article,
      image: images[index % images.length] ?? "",
    })),
  };
}
