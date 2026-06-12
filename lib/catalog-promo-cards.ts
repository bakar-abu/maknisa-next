export type CatalogPromoCard = {
  id: string;
  preHeading: string;
  heading: string;
  linkText: string;
  href: string;
  image: string;
  imageAlt: string;
};

const FURNITURE_PROMOS: Omit<CatalogPromoCard, "image">[] = [
  {
    id: "sofas",
    preHeading: "Choose iconic style and comfort",
    heading: "Timeless sofas",
    linkText: "Explore sofas",
    href: "#mk-catalog-products",
    imageAlt: "Living room with a curated sofa setting",
  },
  {
    id: "guide",
    preHeading: "Moving into something new?",
    heading: "Your guide to furnishing a new home",
    linkText: "Explore the guide",
    href: "/ww/inspire-me",
    imageAlt: "Interior planning with fabric samples",
  },
  {
    id: "living",
    preHeading: "Rethink your space with our",
    heading: "Living room ideas",
    linkText: "Get inspired",
    href: "/ww/living",
    imageAlt: "Modern living room interior",
  },
];

const LIGHTS_PROMOS: Omit<CatalogPromoCard, "image">[] = [
  {
    id: "pendants",
    preHeading: "Sculptural forms",
    heading: "Pendant lighting",
    linkText: "Explore pendants",
    href: "#mk-catalog-products",
    imageAlt: "Pendant lights in a dining space",
  },
  {
    id: "ambience",
    preHeading: "Set the mood",
    heading: "Lighting for every room",
    linkText: "Discover lighting",
    href: "/ww/lighting",
    imageAlt: "Ambient interior lighting",
  },
  {
    id: "design",
    preHeading: "Designed to inspire",
    heading: "Statement chandeliers",
    linkText: "Explore chandeliers",
    href: "#mk-catalog-products",
    imageAlt: "Chandelier in an elegant interior",
  },
];

function pickPromoImage(products: { images: string[] }[], index: number): string {
  const withImage = products.filter((p) => p.images[0]?.startsWith("http"));
  if (!withImage.length) return "";
  return withImage[index % withImage.length].images[0];
}

export function getCatalogPromoCards(
  serviceSlug: string,
  products: { images: string[] }[],
): CatalogPromoCard[] {
  const key = serviceSlug.toLowerCase();
  const templates = key === "lights" ? LIGHTS_PROMOS : FURNITURE_PROMOS;

  return templates.map((template, index) => ({
    ...template,
    image: pickPromoImage(products, index * 3 + 1),
  }));
}
