import { getCollectionGridData } from "./collections";
import {
  isServiceCatalogPage,
  isServiceCollectionPage,
  SERVICE_PAGES,
  servicePageHref,
  type ServicePageConfig,
} from "./services";

/** Main catalogue listing route (navbar “Catalogue”). */
export const CATALOGUE_HREF = "/ww/catalogue";

export const REQUEST_CATALOGUE_HREF = "/ww/request-catalogue";

export { BOOK_APPOINTMENT_HREF } from "./routes";

export type CatalogueListingCard = {
  slug: string;
  label: string;
  href: string;
  image: string;
  hoverImage: string;
  downloadHref: string;
};

export function serviceCatalogueDownloadHref(serviceSlug: string): string {
  const params = new URLSearchParams({ service: serviceSlug });
  return `${REQUEST_CATALOGUE_HREF}?${params.toString()}`;
}

function pickCardImages(products: { images: string[] }[]): {
  image: string;
  hoverImage: string;
} {
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

async function imagesForService(page: ServicePageConfig): Promise<{
  image: string;
  hoverImage: string;
}> {
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

export async function getCatalogueListingCards(): Promise<CatalogueListingCard[]> {
  return Promise.all(
    SERVICE_PAGES.map(async (page) => {
      const { image, hoverImage } = await imagesForService(page);
      return {
        slug: page.slug,
        label: page.label,
        href: servicePageHref(page.slug),
        image,
        hoverImage,
        downloadHref: serviceCatalogueDownloadHref(page.slug),
      };
    }),
  );
}
