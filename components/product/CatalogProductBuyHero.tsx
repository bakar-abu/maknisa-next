"use client";

import Link from "next/link";
import { useId, useMemo, useRef, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { CatalogOptionModal } from "@/components/product/CatalogOptionModal";
import { usePdpSwiperPagination } from "@/components/product/usePdpSwiperPagination";
import {
  getProductCardPricing,
  getProductCardSwatches,
  hasMoreSwatchOptions,
} from "@/lib/catalog-card-display";
import type { CatalogProduct } from "@/lib/catalog-types";
import { BOOK_APPOINTMENT_HREF } from "@/lib/appointment";
import { customizeOrderHref } from "@/lib/customize-order";
import { formatPkr } from "@/lib/format-price";
import { upscaleScavoliniImage } from "@/lib/catalog-images";

import "swiper/css";
import "swiper/css/navigation";

const SIZE_OPTIONS = [
  "W90 × L190 cm",
  "W140 × L190 cm",
  "W152.5 × L190 cm",
  "W160 × L200 cm",
  "W180 × L200 cm",
  "W193 × L203 cm",
];

type CatalogProductBuyHeroProps = {
  product: CatalogProduct;
  serviceSlug: string;
  categoryLabel: string;
  description?: string;
  materials?: string;
};

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="mk-catalog-pdp-buy__rating"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={
            index < rating
              ? "mk-catalog-pdp-buy__star is-filled"
              : "mk-catalog-pdp-buy__star"
          }
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
}

function productStarRating(productId: string): number {
  let hash = 0;
  for (const char of productId) {
    hash += char.charCodeAt(0);
  }
  return 3 + (hash % 3);
}

export function CatalogProductBuyHero({
  product,
  serviceSlug,
  categoryLabel,
  description,
  materials,
}: CatalogProductBuyHeroProps) {
  const customizeHref = customizeOrderHref({
    service: serviceSlug,
    product: product.id,
    category: categoryLabel,
  });
  const images = useMemo(
    () =>
      product.images
        .filter((url) => url && url.startsWith("http"))
        .map((url) => upscaleScavoliniImage(url, 1200)),
    [product.images],
  );

  const uid = useId();
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [colorOpen, setColorOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const swatches = getProductCardSwatches(product);
  const moreSwatches = hasMoreSwatchOptions(product);
  const pricing = getProductCardPricing(product);
  const starRating = productStarRating(product.id);
  const showCarouselControls = images.length > 1;

  const { dotsRef, dotsClassName, onBeforeInit, onInit, onSlideChange, showDots } =
    usePdpSwiperPagination({
      slideCount: images.length,
      loop: false,
    });

  const sizeOptions = useMemo(() => {
    const hash = product.id.length % SIZE_OPTIONS.length;
    return SIZE_OPTIONS.slice(hash, hash + 4)
      .concat(SIZE_OPTIONS.slice(0, Math.max(0, 4 - (SIZE_OPTIONS.length - hash))))
      .slice(0, 4);
  }, [product.id]);

  return (
    <section className="mk-catalog-pdp-buy" aria-label="Product overview">
      <div className="mk-catalog-pdp-buy__layout">
        <div className="mk-catalog-pdp-buy__media">
          <div className="mk-catalog-pdp-buy__carousel">
            <div className="mk-catalog-pdp-buy__main">
              {showCarouselControls ? (
                <>
                  <button
                    ref={prevRef}
                    type="button"
                    className="mk-catalog-pdp-buy__arrow mk-catalog-pdp-buy__arrow--prev"
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    ref={nextRef}
                    type="button"
                    className="mk-catalog-pdp-buy__arrow mk-catalog-pdp-buy__arrow--next"
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </>
              ) : null}

              <div className="mk-catalog-pdp-buy__stage">
                {images.length > 0 ? (
                  <Swiper
                    className="mk-catalog-pdp-buy__swiper"
                    modules={[Navigation, Pagination]}
                    slidesPerView={1}
                    spaceBetween={0}
                    loop={false}
                    navigation={{
                      prevEl: prevRef.current,
                      nextEl: nextRef.current,
                    }}
                    onBeforeInit={(swiper) => {
                      onBeforeInit(swiper);
                      if (
                        typeof swiper.params.navigation !== "boolean" &&
                        swiper.params.navigation
                      ) {
                        swiper.params.navigation.prevEl = prevRef.current;
                        swiper.params.navigation.nextEl = nextRef.current;
                      }
                    }}
                    onInit={(swiper) => {
                      onInit(swiper);
                      swiper.navigation.init();
                      swiper.navigation.update();
                    }}
                    onSlideChange={onSlideChange}
                  >
                    {images.map((src, index) => (
                      <SwiperSlide key={`${uid}-buy-${index}`}>
                        <div className="mk-catalog-pdp-buy__slide">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt={`${product.title} — view ${index + 1}`}
                            loading={index === 0 ? "eager" : "lazy"}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <div className="mk-catalog-pdp-buy__placeholder" />
                )}
              </div>

              {showDots ? (
                <div
                  ref={dotsRef}
                  className={`mk-catalog-pdp-buy__dots ${dotsClassName}`}
                  aria-label="Product image slides"
                />
              ) : null}
            </div>
          </div>
        </div>

        <div className="mk-catalog-pdp-buy__info">
          <div className="mk-catalog-pdp-buy__head">
            <p className="mk-catalog-pdp-buy__category">{categoryLabel}</p>
            <StarRating rating={starRating} />
          </div>

          <h1 className="mk-catalog-pdp-buy__title">{product.title}</h1>

          <div className="mk-catalog-pdp-buy__price-row">
            <div className="mk-catalog-pdp-buy__price-block">
              <span className="mk-catalog-pdp-buy__price-label">Rec. retail price</span>
              {pricing.price !== null ? (
                <div className="mk-catalog-pdp-buy__prices">
                  <span className="mk-catalog-pdp-buy__price">
                    {formatPkr(pricing.price)}
                  </span>
                  {pricing.beforePrice !== null ? (
                    <span className="mk-catalog-pdp-buy__old-price">
                      {formatPkr(pricing.beforePrice)}
                    </span>
                  ) : null}
                </div>
              ) : (
                <span className="mk-catalog-pdp-buy__price">Price on request</span>
              )}
              {pricing.fromPrice !== null ? (
                <span className="mk-catalog-pdp-buy__from-price">
                  From {formatPkr(pricing.fromPrice)}
                </span>
              ) : null}
            </div>

            <p className="mk-catalog-pdp-buy__availability">
              <span className="mk-catalog-pdp-buy__availability-dot" aria-hidden="true" />
              Available to order
            </p>
          </div>

          <div className="mk-catalog-pdp-buy__actions">
            <Link href={BOOK_APPOINTMENT_HREF} className="mk-catalog-pdp-buy__buy">
              Buy now
            </Link>
            <button
              type="button"
              className={
                addedToCart
                  ? "mk-catalog-pdp-buy__cart is-added"
                  : "mk-catalog-pdp-buy__cart"
              }
              onClick={() => setAddedToCart(true)}
              aria-live="polite"
            >
              {addedToCart ? "Added to cart" : "Add to cart"}
            </button>
          </div>

          <div className="mk-catalog-pdp-buy__option-row">
            <button
              type="button"
              className="mk-catalog-pdp-buy__option-btn"
              onClick={() => setColorOpen(true)}
            >
              <span className="mk-catalog-pdp-buy__option-label">
                {selectedColor ? `Color: ${selectedColor}` : "Color"}
              </span>
              <ChevronDownIcon />
            </button>
            <button
              type="button"
              className="mk-catalog-pdp-buy__option-btn"
              onClick={() => setSizeOpen(true)}
            >
              <span className="mk-catalog-pdp-buy__option-label">
                {selectedSize ? `Sizes: ${selectedSize}` : "Sizes"}
              </span>
              <ChevronDownIcon />
            </button>
          </div>

          {description ? (
            <p className="mk-catalog-pdp-buy__description">{description}</p>
          ) : null}

          {materials ? (
            <p className="mk-catalog-pdp-buy__materials">
              <span className="mk-catalog-pdp-buy__materials-label">Materials:</span>{" "}
              {materials}
            </p>
          ) : null}

          <Link
            href={customizeHref}
            className="mk-catalog-pdp-buy__customize-link"
          >
            Customize {product.title} design
          </Link>
        </div>
      </div>

      <CatalogOptionModal
        open={colorOpen}
        title="Choose a color"
        onClose={() => setColorOpen(false)}
      >
        <div className="mk-catalog-pdp-options">
          {swatches.map((swatch) => (
            <button
              key={swatch.title}
              type="button"
              className={
                selectedColor === swatch.title
                  ? "mk-catalog-pdp-options__swatch is-active"
                  : "mk-catalog-pdp-options__swatch"
              }
              onClick={() => {
                setSelectedColor(swatch.title);
                setColorOpen(false);
              }}
            >
              <span
                className="mk-catalog-pdp-options__dot"
                style={{ backgroundColor: swatch.color }}
              />
              <span>{swatch.title}</span>
            </button>
          ))}
          {moreSwatches ? (
            <p className="mk-catalog-pdp-options__note">
              Additional finishes are available in store. Contact us for the full
              palette.
            </p>
          ) : null}
        </div>
      </CatalogOptionModal>

      <CatalogOptionModal
        open={sizeOpen}
        title="Choose a size"
        onClose={() => setSizeOpen(false)}
      >
        <div className="mk-catalog-pdp-options mk-catalog-pdp-options--sizes">
          {sizeOptions.map((size) => (
            <button
              key={size}
              type="button"
              className={
                selectedSize === size
                  ? "mk-catalog-pdp-options__size is-active"
                  : "mk-catalog-pdp-options__size"
              }
              onClick={() => {
                setSelectedSize(size);
                setSizeOpen(false);
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </CatalogOptionModal>
    </section>
  );
}
