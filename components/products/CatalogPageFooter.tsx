"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CatalogServiceCategory } from "@/lib/catalog-service-categories";
import {
  getCatalogFooterContent,
  hydrateAdviceImages,
  type CatalogSeoAccordionItem,
} from "@/lib/catalog-footer-content";
import { upscaleCatalogImage } from "@/lib/catalog-images";

type CatalogPageFooterProps = {
  serviceSlug: string;
  categories: CatalogServiceCategory[];
  productImages: string[];
  onCategorySelect?: (categoryId: string) => void;
};

export function CatalogPageFooter({
  serviceSlug,
  categories,
  productImages,
  onCategorySelect,
}: CatalogPageFooterProps) {
  const content = useMemo(
    () => hydrateAdviceImages(getCatalogFooterContent(serviceSlug), productImages),
    [productImages, serviceSlug],
  );

  return (
    <div className="mk-catalog-footer">
      <section className="mk-catalog-footer__advice" aria-labelledby="catalog-advice-heading">
        <div className="mk-catalog-footer__advice-head">
          <h2 id="catalog-advice-heading" className="mk-catalog-footer__advice-title">
            {content.adviceHeading}
          </h2>
          <p className="mk-catalog-footer__advice-sub">{content.adviceSubheading}</p>
          <Link href={content.adviceCtaHref} className="mk-catalog-footer__advice-cta">
            {content.adviceCta}
          </Link>
        </div>
        <div className="mk-catalog-footer__advice-grid">
          {content.adviceArticles.map((article) => (
            <Link key={article.id} href={article.href} className="mk-catalog-footer__article">
              <span className="mk-catalog-footer__article-media">
                {article.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={upscaleCatalogImage(article.image, 800)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
              </span>
              <span className="mk-catalog-footer__article-body">
                <span className="mk-catalog-footer__article-title">{article.title}</span>
                <span className="mk-catalog-footer__article-excerpt">{article.excerpt}</span>
                <span className="mk-catalog-footer__article-link">Read more</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section
        className="mk-catalog-footer__explore"
        aria-labelledby="catalog-explore-heading"
      >
        <h2 id="catalog-explore-heading" className="mk-catalog-footer__explore-title">
          {content.exploreHeading}
        </h2>
        <ul className="mk-catalog-footer__explore-grid">
          {categories.map((category) => (
            <li key={category.id}>
              <button
                type="button"
                className="mk-catalog-footer__explore-card"
                onClick={() => {
                  onCategorySelect?.(category.id);
                  document
                    .getElementById("mk-catalog-products")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span className="mk-catalog-footer__explore-media">
                  {category.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={upscaleCatalogImage(category.image, 600)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                </span>
                <span className="mk-catalog-footer__explore-label">{category.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mk-catalog-footer__seo" aria-labelledby="catalog-seo-heading">
        <div className="mk-catalog-footer__seo-layout">
          <div className="mk-catalog-footer__seo-intro">
            <h2 id="catalog-seo-heading" className="mk-catalog-footer__seo-title">
              {content.seoTitle}
            </h2>
            <p>{content.seoIntro}</p>
          </div>
          <CatalogSeoAccordion items={content.seoAccordion} />
        </div>
      </section>
    </div>
  );
}

function CatalogSeoAccordion({ items }: { items: CatalogSeoAccordionItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="mk-catalog-footer__accordion">
      {items.map((item) => {
        const expanded = openId === item.id;
        return (
          <div key={item.id} className="mk-catalog-footer__accordion-item">
            <button
              type="button"
              className="mk-catalog-footer__accordion-head"
              aria-expanded={expanded}
              onClick={() => setOpenId(expanded ? null : item.id)}
            >
              <span>{item.title}</span>
              <span className="mk-catalog-footer__accordion-icon" aria-hidden="true">
                {expanded ? "▴" : "▾"}
              </span>
            </button>
            {expanded ? (
              <div className="mk-catalog-footer__accordion-body">{item.body}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
