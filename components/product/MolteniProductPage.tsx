"use client";

import Link from "next/link";
import { useCallback, useId, useRef, useState } from "react";
import { BOOK_APPOINTMENT_HREF } from "@/lib/appointment";
import { customizeOrderHref } from "@/lib/customize-order";
import type { ProductDetailView } from "@/lib/product-detail";
import { WoodworkColourProposalsSection } from "@/components/product/WoodworkColourProposalsSection";
import { WoodworkMustHavesSection } from "@/components/product/WoodworkMustHavesSection";
import { buildMolteniGalleryBlocks } from "@/lib/molteni-gallery-blocks";
import {
  getWoodworkColourProposals,
  getWoodworkMustHaves,
  isWoodworkPdp,
} from "@/lib/woodwork-pdp-content";

type MolteniProductPageProps = {
  data: ProductDetailView;
};

function ConfigureIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      className="molt-cta-icon"
    >
      <path
        fill="currentColor"
        d="M12 2l9 5v10l-9 5-9-5V7l9-5zm0 2.2L5 7.5v9l7 3.8 7-3.8v-9L12 4.2z"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M11 5h2v14h-2V5zm-7 7h14v2H4v-2z"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3l5 5h-3v6h-4V8H7l5-5zm-7 16h14v2H5v-2z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.5l.5-3H13V9c0-.6.4-1 1-1z"
      />
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2C6.5 2 2 6.5 2 12c0 4.1 2.5 7.6 6 9.1-.1-.9-.2-2.3 0-3.3.2-.9 1.3-5.8 1.3-5.8s-.3-.6-.3-1.5c0-1.4.8-2.5 1.9-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.3-.9 3.6-.3 1 .6 1.9 1.6 1.9 1.9 0 3.2-2.4 3.2-5.9 0-2.4-1.6-4.2-4.6-4.2-3.4 0-5.5 2.5-5.5 5.2 0 .9.3 1.8 1 2.1.1 0 .2 0 .2-.2l.2-.7c0-.1 0-.2-.1-.3-.3-.7-.4-1.3-.4-2 0-1.9 1.4-3.6 3.7-3.6 2 0 3.2 1.5 3.2 3.5 0 2.2-1.1 4-2.7 4-.9 0-1.5-.7-1.3-1.6.3-1 .8-2.1.8-2.8 0-.7-.4-1.2-1.1-1.2-.9 0-1.6.9-1.6 2.1 0 .8.3 1.3.3 1.3l-1.1 4.7c-.3 1.3-.1 2.9-.1 3.2 0 .1 0 .1.1.1.1 0 .5-.6.7-1.2.1-.3.6-2.2.6-2.2.3.6 1.2 1.1 2.1 1.1 2.8 0 4.7-2.5 4.7-5.9C17.9 5.8 15.4 2 12 2z"
      />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.9 4H22l-6.8 7.8L22.7 20H16l-4.2-5.5L6.5 20H3.4l7.3-8.4L2.3 4h6.9l3.8 5 4.9-5zm-1.2 14.3h1.5L7.1 5.6H5.5l12.2 12.7z"
      />
    </svg>
  );
}

export function MolteniProductPage({ data }: MolteniProductPageProps) {
  const uid = useId();
  const specsRef = useRef<HTMLElement>(null);
  const [specPanel, setSpecPanel] = useState<
    "finishes" | "downloads" | "sheet" | null
  >(null);
  const [drawingsExpanded, setDrawingsExpanded] = useState(false);

  const heroImage =
    data.heroImages[0] ?? data.galleryImages[0] ?? data.product.images[0] ?? "";

  const galleryBlocks = buildMolteniGalleryBlocks(
    data.galleryImages,
    {
      detail: data.detailParagraph,
      crafted: data.craftedParagraph,
    },
    data.quote,
  );

  const scrollToSpecs = useCallback(() => {
    specsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : data.product.href;

  const drawingItems = data.galleryImages.map((src, index) => {
    const code = `${data.product.title.slice(0, 2).toUpperCase()}${String(1209 + index)}`;
    return {
      src,
      code,
      label: `${data.product.title} ${code}`,
    };
  });

  const visibleDrawings = drawingsExpanded
    ? drawingItems
    : drawingItems.slice(0, 3);

  const designerPortrait =
    data.galleryImages[1] ?? data.galleryImages[0] ?? heroImage;

  const showWoodworkSections = isWoodworkPdp(data.servicePageSlug);
  const woodworkImages = Array.from(
    new Set(
      [heroImage, ...data.galleryImages, ...data.heroImages, ...data.product.images].filter(
        Boolean,
      ),
    ),
  );
  const woodworkMustHaves = showWoodworkSections
    ? getWoodworkMustHaves(woodworkImages)
    : [];
  const woodworkColourProposals = showWoodworkSections
    ? getWoodworkColourProposals(woodworkImages)
    : [];

  return (
    <div className="molt-product">
      {/* Hero — split image left, product info right */}
      <section className="molt-content-block molt-content-block--hero">
        <div className="molt-wrapper-content molt-wrapper-content--medium">
          <article className="molt-block-text-img molt-block-text-img--text-right">
            <div className="molt-block-text-img__media">
              {heroImage ? (
                <div className="molt-hero-image">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroImage}
                    alt={data.product.title}
                    loading="eager"
                  />
                </div>
              ) : null}

              <div className="molt-product-share is-product">
                <p>share:</p>
                <ul className="molt-social-menu">
                  <li>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on Facebook"
                    >
                      <FacebookIcon />
                    </a>
                  </li>
                  <li>
                    <a
                      href={`https://pinterest.com/pin/create/link/?url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on Pinterest"
                    >
                      <PinterestIcon />
                    </a>
                  </li>
                  <li>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on Twitter"
                    >
                      <TwitterIcon />
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="molt-block-text-img__text">
              <div className="molt-block-info-product">
                <h1 className="molt-serif-title molt-to-upper">
                  {data.product.title}
                </h1>

                <h3 className="molt-category-label molt-to-upper">
                  {data.productTypeLabel}
                </h3>

                <p className="molt-generic-text molt-lead">{data.intro}</p>

                <div className="molt-design-line">
                  <span className="molt-design-by">Design</span>
                  <strong className="molt-designer-name molt-to-upper">
                    {data.designer.name}
                  </strong>
                </div>

                <div className="molt-ctas-product">
                  <Link
                    href={customizeOrderHref({
                      service: data.servicePageSlug ?? "Kitchens",
                      product: data.product.id,
                    })}
                    className="molt-generic-cta molt-generic-cta--black molt-generic-cta--product"
                  >
                    Configure
                    <ConfigureIcon />
                  </Link>
                </div>

                <div className="molt-ctas-product">
                  <Link
                    href={BOOK_APPOINTMENT_HREF}
                    className="molt-generic-cta molt-generic-cta--bordered"
                  >
                    Find the nearest store
                  </Link>
                </div>

                <button
                  type="button"
                  className="molt-scroll-specs"
                  onClick={scrollToSpecs}
                >
                  <svg
                    viewBox="0 0 13.7 24.2"
                    width="14"
                    height="24"
                    aria-hidden="true"
                  >
                    <polygon
                      fill="currentColor"
                      points="12.3,16 7.9,20.4 7.9,0 5.9,0 5.9,20.4 1.4,16 0,17.4 6.9,24.2 13.7,17.4"
                    />
                  </svg>
                  <span>Technical Details</span>
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      {showWoodworkSections ? (
        <>
          <WoodworkMustHavesSection
            productTitle={data.product.title}
            items={woodworkMustHaves}
          />
          <WoodworkColourProposalsSection
            productTitle={data.product.title}
            proposals={woodworkColourProposals}
          />
        </>
      ) : null}

      {/* Gallery blocks 0–9 (Molteni sequence) */}
      {galleryBlocks.map((block, index) => {
        if (block.type === "full") {
          return (
            <section
              key={`${uid}-full-${index}`}
              className="molt-content-block molt-content-block--gallery"
            >
              <div className="molt-wrapper-content">
                <div className="molt-row">
                  <div className="molt-col-12 molt-block-caption molt-block-caption--center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={block.image} alt="" loading="lazy" />
                  </div>
                </div>
              </div>
            </section>
          );
        }

        if (block.type === "split") {
          return (
            <section
              key={`${uid}-split-${index}`}
              className="molt-content-block molt-content-block--gallery"
            >
              <div className="molt-wrapper-content">
                <div className="molt-row molt-row--split molt-block-two-img">
                  <div
                    className={
                      block.wideLeft
                        ? "molt-col-7 molt-block-caption"
                        : "molt-col-5 molt-block-caption"
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={block.left} alt="" loading="lazy" />
                  </div>
                  <div
                    className={
                      block.wideLeft
                        ? "molt-col-5 molt-block-caption"
                        : "molt-col-7 molt-block-caption"
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={block.right} alt="" loading="lazy" />
                  </div>
                </div>
              </div>
            </section>
          );
        }

        if (block.type === "triple") {
          return (
            <section
              key={`${uid}-triple-${index}`}
              className="molt-content-block molt-content-block--gallery"
            >
              <div className="molt-wrapper-content">
                <div className="molt-row molt-row--triple">
                  {block.images.map((src, imgIndex) => (
                    <div
                      key={`${uid}-triple-${index}-${imgIndex}`}
                      className="molt-col-4 molt-block-caption"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (block.type === "textLeft") {
          return (
            <section
              key={`${uid}-text-${index}`}
              className="molt-content-block molt-content-block--text"
            >
              <div className="molt-wrapper-content">
                <div className="molt-block-text molt-block-text--left">
                  <p className="molt-generic-text">{block.paragraph}</p>
                </div>
              </div>
            </section>
          );
        }

        return (
          <section
            key={`${uid}-quote-${index}`}
            className="molt-content-block molt-content-block--text"
          >
            <div className="molt-wrapper-content">
              <div className="molt-block-text molt-block-text--center">
                <p className="molt-generic-text-serif">
                  &ldquo;{block.text}&rdquo;
                </p>
                <p className="molt-quote-attribution">— {block.author}</p>
              </div>
            </div>
          </section>
        );
      })}

      {/* Designer block */}
      <section className="molt-content-block molt-content-block--designer">
        <div className="molt-wrapper-content">
          <div className="molt-designer-flex">
            <div className="molt-designer-text">
              <span className="molt-design-by">Design</span>
              <h2 className="molt-designer-heading">{data.designer.name}</h2>
              <div className="molt-designer-line">
                <p className="molt-generic-text">{data.designer.bio}</p>
                <Link
                  href="/ww/company/company"
                  className="molt-generic-cta molt-generic-cta--outline-box"
                >
                  Complete biography
                </Link>
              </div>
            </div>

            <div className="molt-designer-image">
              {designerPortrait ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={designerPortrait}
                  alt={data.designer.name}
                  loading="lazy"
                />
              ) : null}
            </div>

            <div className="molt-block-square-quote">
              <div className="molt-block-quote-content">
                <p className="molt-block-quote-text">
                  &ldquo;{data.designer.quote}&rdquo;
                </p>
                <p className="molt-block-quote-name">{data.designer.name}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical specs band */}
      <section
        ref={specsRef}
        id="specs"
        className="molt-content-block molt-product-specs"
      >
        <div className="molt-wrapper-content molt-wrapper-content--specs">
          <div className="molt-product-specs-intro">
            <p className="molt-sans-title molt-to-upper">{data.product.title}</p>
            <h2 className="molt-serif-title molt-to-upper">Technical Details</h2>
          </div>

          <div className="molt-product-specs-row">
            <button
              type="button"
              className={`molt-product-specs-box${specPanel === "finishes" ? " is-active" : ""}`}
              onClick={() =>
                setSpecPanel((c) => (c === "finishes" ? null : "finishes"))
              }
            >
              <span>Finishes</span>
              <PlusIcon />
            </button>
            <button
              type="button"
              className={`molt-product-specs-box${specPanel === "downloads" ? " is-active" : ""}`}
              onClick={() =>
                setSpecPanel((c) => (c === "downloads" ? null : "downloads"))
              }
            >
              <span>Download</span>
              <PlusIcon />
            </button>
            <button
              type="button"
              className={`molt-product-specs-box${specPanel === "sheet" ? " is-active" : ""}`}
              onClick={() =>
                setSpecPanel((c) => (c === "sheet" ? null : "sheet"))
              }
            >
              <span>Product Sheet</span>
              <DownloadIcon />
            </button>
          </div>

          {specPanel === "finishes" ? (
            <div className="molt-specs-panel">
              {data.tags.length > 0 ? (
                <ul className="molt-finishes-list">
                  {data.tags.map((tag) => (
                    <li key={tag.id}>{tag.label}</li>
                  ))}
                </ul>
              ) : (
                <p className="molt-generic-text molt-specs-panel-text">
                  Contact Maknisa for available finishes and material samples.
                </p>
              )}
            </div>
          ) : null}

          {specPanel === "downloads" ? (
            <div className="molt-specs-panel">
              <Link
                href="/ww/request-catalogue"
                className="molt-generic-cta molt-generic-cta--black"
              >
                Download catalogue
              </Link>
            </div>
          ) : null}

          {specPanel === "sheet" ? (
            <div className="molt-specs-panel">
              <Link
                href="/ww/request-catalogue"
                className="molt-generic-cta molt-generic-cta--black"
              >
                Product Sheet
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      {/* Technical drawings */}
      <section className="molt-content-block molt-content-block--drawings">
        <div className="molt-wrapper-content">
          <h3 className="molt-drawings-title molt-to-upper">
            Technical drawings 2d (.jpg)
          </h3>
          <div className="molt-drawings-grid">
            {visibleDrawings.map((item) => (
              <a
                key={item.code}
                href={item.src}
                target="_blank"
                rel="noopener noreferrer"
                className="molt-drawing-card"
              >
                <span className="molt-drawing-card__code">{item.code}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt={item.label} loading="lazy" />
                <div className="molt-drawing-card__caption">
                  <span className="molt-drawing-card__line" aria-hidden="true" />
                  <span>{item.label}</span>
                  <span>{item.label}</span>
                </div>
              </a>
            ))}
          </div>
          {drawingItems.length > 3 ? (
            <button
              type="button"
              className="molt-generic-cta molt-generic-cta--outline-box molt-see-all"
              onClick={() => setDrawingsExpanded((v) => !v)}
            >
              {drawingsExpanded ? "Close" : "See all"}
            </button>
          ) : null}
        </div>
      </section>

      <section className="molt-content-block molt-back-bar">
        <div className="molt-wrapper-content">
          <Link
            href={data.serviceListHref ?? "/ww/products"}
            className="molt-generic-cta molt-generic-cta--text"
          >
            ← Back to {data.serviceListHref ? data.breadcrumbLabel : "products"}
          </Link>
        </div>
      </section>
    </div>
  );
}
