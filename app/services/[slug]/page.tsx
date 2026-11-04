import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceCollectionGridRoute } from "@/components/services/ServiceCollectionGridRoute";
import { ServiceProductsRoute } from "@/components/services/ServiceProductsRoute";
import { getCollectionGridData } from "@/lib/collections";
import { getCatalogPageData } from "@/lib/catalog-products";
import { fetchPublicServiceBundle } from "@/lib/cms/fetch-catalog";
import {
  isServiceCatalogPage,
  isServiceCollectionPage,
  resolveServicePage,
  SERVICE_PAGE_SLUGS,
} from "@/lib/services";
import { site } from "@/lib/site";

import "@/app/styles/products-catalog.css";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return SERVICE_PAGE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = resolveServicePage(slug);
  if (!service) return { title: site.name };

  const bundle = await fetchPublicServiceBundle(slug);
  if (bundle?.service) {
    return {
      title: bundle.service.metaTitle ?? `${bundle.service.title} | ${site.name}`,
      description: bundle.service.metaDescription ?? bundle.service.intro,
    };
  }

  if (isServiceCollectionPage(service)) {
    const data = await getCollectionGridData(service.dataSlug);
    const title = service.overrides?.title ?? data.title;
    const description = service.overrides?.intro ?? data.intro;
    return {
      title: `${title} | ${site.name}`,
      description,
    };
  }

  const data = await getCatalogPageData({
    roomSlugs: service.catalogRoomSlugs,
    ...service.overrides,
  });
  return {
    title: `${data.title} | ${site.name}`,
    description: data.intro,
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = resolveServicePage(slug);
  if (!service) notFound();

  if (isServiceCollectionPage(service)) {
    return <ServiceCollectionGridRoute service={service} />;
  }

  if (isServiceCatalogPage(service)) {
    return <ServiceProductsRoute service={service} />;
  }

  notFound();
}
