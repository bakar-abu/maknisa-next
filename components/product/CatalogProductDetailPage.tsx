"use client";

import { useMemo } from "react";
import { MagazineBreadcrumbs } from "@/components/magazine/MagazineBreadcrumbs";
import { CatalogProductBuyHero } from "@/components/product/CatalogProductBuyHero";
import { ProductCatalogBlock } from "@/components/product/ProductCatalogBlock";
import { ProductGalleryDuo } from "@/components/product/ProductGalleryDuo";
import { ProductGallerySlider } from "@/components/product/ProductGallerySlider";
import { ProductHeroSlider } from "@/components/product/ProductHeroSlider";
import { ProductRelatedSlider } from "@/components/product/ProductRelatedSlider";
import type { CatalogProductDetailView } from "@/lib/catalog-product-detail";

type CatalogProductDetailPageProps = {
  data: CatalogProductDetailView;
};

export function CatalogProductDetailPage({ data }: CatalogProductDetailPageProps) {
  const breadcrumbItems = [
    { label: "Services", href: "/services" },
    { label: data.serviceLabel, href: data.serviceListHref },
    { label: data.productTypeLabel, href: data.serviceListHref },
    { label: data.product.title },
  ];

  const coverImage = data.galleryImages[0] ?? data.product.images[0] ?? "";

  const editorialIntro = useMemo(() => {
    const parts = [data.intro, data.introTail, data.detailParagraph].filter(Boolean);
    return parts.join(" ");
  }, [data.detailParagraph, data.intro, data.introTail]);

  const buyDescription = useMemo(() => {
    const parts = [data.intro, data.detailParagraph].filter(Boolean);
    return parts.join(" ");
  }, [data.detailParagraph, data.intro]);

  const buyMaterials = useMemo(() => {
    const labels = data.tags.map((tag) => tag.label);
    if (labels.length === 0) {
      return "Premium finishes — contact us for the full material list.";
    }
    return labels.slice(0, 5).join(", ");
  }, [data.tags]);

  return (
    <div className="mk-catalog-pdp mk-pdp">
      <section className="mk-pdp__section mk-pdp__section--tight">
        <div className="mk-pdp__container">
          <div className="mk-pdp__crumbs">
            <MagazineBreadcrumbs items={breadcrumbItems} />
          </div>
        </div>
      </section>

      <CatalogProductBuyHero
        product={data.product}
        serviceSlug={data.serviceSlug}
        categoryLabel={data.productTypeLabel}
        description={buyDescription}
        materials={buyMaterials}
      />

      {data.galleries.hero.length > 0 ? (
        <section className="mk-pdp__section mk-pdp__section--hero">
          <div className="mk-pdp__container mk-pdp__container--flush">
            <ProductHeroSlider
              images={data.galleries.hero}
              title={data.product.title}
            />
          </div>
        </section>
      ) : null}

      <section className="mk-pdp__section mk-pdp__section--intro">
        <div className="mk-pdp__container mk-pdp__container--narrow">
          <p className="mk-pdp__intro">{editorialIntro}</p>
        </div>
      </section>

      {data.galleries.lifestyle.length > 0 ? (
        <section className="mk-pdp__section mk-pdp__section--gallery">
          <div className="mk-pdp__container mk-pdp__container--flush">
            <ProductGallerySlider
              images={data.galleries.lifestyle}
              title={data.product.title}
            />
          </div>
        </section>
      ) : null}

      {data.galleries.duoSlides.length > 0 ? (
        <section className="mk-pdp__section mk-pdp__section--gallery">
          <div className="mk-pdp__container mk-pdp__container--flush">
            <ProductGalleryDuo
              slides={data.galleries.duoSlides}
              title={data.product.title}
            />
          </div>
        </section>
      ) : null}

      {data.galleries.lifestyleSecondary.length > 0 ? (
        <section className="mk-pdp__section mk-pdp__section--gallery">
          <div className="mk-pdp__container mk-pdp__container--flush">
            <ProductGallerySlider
              images={data.galleries.lifestyleSecondary}
              title={data.product.title}
            />
          </div>
        </section>
      ) : null}

      <section className="mk-pdp__section mk-pdp__section--catalog">
        <div className="mk-pdp__container">
          <ProductCatalogBlock
            productTitle={data.product.title}
            collectionTitle={data.collectionTitle}
            coverImage={coverImage}
            collectionHref="/ww/request-catalogue"
          />
        </div>
      </section>

      <ProductRelatedSlider
        products={data.related}
        collectionTitle={data.productTypeLabel}
      />
    </div>
  );
}
