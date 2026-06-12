import { getCollectionGridData } from "./collections";
import {
  isServiceCatalogPage,
  isServiceCollectionPage,
  SERVICE_PAGES,
  servicePageHref,
  type ServicePageConfig,
} from "./services";

export const SERVICES_LANDING_HREF = "/services";

export type ServiceLandingCard = {
  slug: string;
  label: string;
  href: string;
  image: string;
  hoverImage: string;
};

type ServiceCardImages = {
  image: string;
  hoverImage: string;
};

function pickCardImages(
  products: { images: string[] }[],
): ServiceCardImages {
  const withImages = products.filter((product) => product.images[0]);
  const primary = withImages[0];
  const secondary = withImages[1] ?? primary;

  const image = primary?.images[0] ?? "";
  const hoverImage =
    primary?.images[1] ??
    secondary?.images[0] ??
    primary?.images[0] ??
    "";

  return { image, hoverImage };
}

async function imagesForService(page: ServicePageConfig): Promise<ServiceCardImages> {
  if (isServiceCollectionPage(page)) {
    const data = await getCollectionGridData(page.dataSlug);
    return pickCardImages(data.products);
  }

  if (isServiceCatalogPage(page)) {
    const slug = page.catalogRoomSlugs?.[0] ?? "living";
    const data = await getCollectionGridData(slug);
    return pickCardImages(data.products);
  }

  return { image: "", hoverImage: "" };
}

export async function getServicesLandingCards(): Promise<ServiceLandingCard[]> {
  const cards = await Promise.all(
    SERVICE_PAGES.map(async (page) => {
      const { image, hoverImage } = await imagesForService(page);
      return {
        slug: page.slug,
        label: page.label,
        href: servicePageHref(page.slug),
        image,
        hoverImage,
      };
    }),
  );

  return cards;
}
