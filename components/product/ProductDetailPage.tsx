"use client";

import { useMemo, useState } from "react";
import { MagazineBreadcrumbs } from "@/components/magazine/MagazineBreadcrumbs";
import { ProductActionTiles } from "@/components/product/ProductActionTiles";
import { ProductCatalogBlock } from "@/components/product/ProductCatalogBlock";
import { ProductGalleryDuo } from "@/components/product/ProductGalleryDuo";
import { ProductGallerySlider } from "@/components/product/ProductGallerySlider";
import { ProductHeroSlider } from "@/components/product/ProductHeroSlider";
import { ProductRelatedSlider } from "@/components/product/ProductRelatedSlider";
import {
  ProductTechModal,
  type TechModalTab,
} from "@/components/product/ProductTechModal";
import type { ProductDetailView } from "@/lib/product-detail";
import { splitIntroText } from "@/lib/product-detail";
import { site } from "@/lib/site";

type ProductDetailPageProps = {
  data: ProductDetailView;
};

export function ProductDetailPage({ data }: ProductDetailPageProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<TechModalTab>("technical");

  const [introLead, introTail] = useMemo(
    () => splitIntroText(data.intro),
    [data.intro],
  );

  const openModal = (tab: TechModalTab) => {
    setModalTab(tab);
    setModalOpen(true);
  };

  const collectionHref = `/ww/${data.collectionSlug}`;
  const coverImage = data.product.images[0] ?? "";

  return (
    <article className="mk-pdp">
      <section className="mk-pdp__section mk-pdp__section--tight mk-pdp__crumbs">
        <div className="mk-pdp__container">
          <MagazineBreadcrumbs
            items={[
              { label: data.collectionTitle, href: collectionHref },
              { label: data.collectionTitle, href: collectionHref },
              { label: data.product.title },
            ]}
          />
        </div>
      </section>

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
          <p className="mk-pdp__intro">{introLead}</p>
        </div>
      </section>

      {data.galleries.lifestyle.length > 0 ? (
        <section className="mk-pdp__section mk-pdp__section--gallery">
          <div className="mk-pdp__container mk-pdp__container--flush">
            <ProductGallerySlider
              images={data.galleries.lifestyle}
              title={data.product.title}
              showInfo
            />
          </div>
        </section>
      ) : null}

      {introTail ? (
        <section className="mk-pdp__section mk-pdp__section--intro-tail">
          <div className="mk-pdp__container mk-pdp__container--narrow">
            <p className="mk-pdp__intro">{introTail}</p>
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

      <section className="mk-pdp__section mk-pdp__section--actions">
        <div className="mk-pdp__container">
          <ProductActionTiles onOpen={openModal} />
        </div>
      </section>

      <section className="mk-pdp__section mk-pdp__section--catalog">
        <div className="mk-pdp__container">
          <ProductCatalogBlock
            productTitle={data.product.title}
            collectionTitle={data.collectionTitle}
            coverImage={coverImage}
            collectionHref={collectionHref}
          />
        </div>
      </section>

      <ProductRelatedSlider
        products={data.related}
        collectionTitle={data.collectionTitle}
      />

      <section className="mk-pdp__section mk-pdp__section--footer-crumbs">
        <div className="mk-pdp__container">
          <MagazineBreadcrumbs
            items={[
              { label: site.name, href: "/" },
              { label: data.collectionTitle, href: collectionHref },
              { label: data.collectionTitle, href: collectionHref },
              { label: data.product.title },
            ]}
          />
        </div>
      </section>

      <ProductTechModal
        open={modalOpen}
        tab={modalTab}
        productTitle={data.product.title}
        collectionTitle={data.collectionTitle}
        tags={data.tags}
        onClose={() => setModalOpen(false)}
        onTabChange={setModalTab}
      />
    </article>
  );
}
