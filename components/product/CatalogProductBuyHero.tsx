"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { CatalogOptionModal } from "@/components/product/CatalogOptionModal";
import { useCart } from "@/components/cart/CartProvider";
import {
  getProductCardPricing,
  getProductCardSwatches,
  hasMoreSwatchOptions,
} from "@/lib/catalog-card-display";
import type { CatalogProduct } from "@/lib/catalog-types";
import type { ProductOrderLineItem } from "@/lib/cart/types";
import { customizeOrderHref } from "@/lib/customize-order";
import { formatPkr } from "@/lib/format-price";
import { upscaleCatalogImage } from "@/lib/catalog-images";
import { usePdpSwiperPagination } from "@/components/product/usePdpSwiperPagination";

import "swiper/css";

const SIZE_OPTIONS = [
  "W90 × L190 cm",
  "W140 × L190 cm",
  "W152.5 × L190 cm",
  "W160 × L200 cm",
  "W180 × L200 cm",
  "W193 × L203 cm",
];

const PIECES_BY_FURNITURE_TYPE = {
  sofa: ["1 Seater", "2 Seater", "3 Seater", "L-Shape", "Sectional (5+ Seater)"],
  chair: ["Single Chair", "Set of 2", "Set of 4", "Set of 6"],
  table: ["2 Seater", "4 Seater", "6 Seater", "8 Seater", "10 Seater"],
  bed: ["Single", "Queen", "King", "Super King"],
  storage: ["2 Door", "3 Door", "4 Door", "6 Door"],
  default: ["Single Piece", "Set of 2", "Set of 4", "Custom Quantity"],
} as const;

function resolvePiecesOptions(product: CatalogProduct, categoryLabel: string): string[] {
  const haystack = `${product.title} ${categoryLabel}`.toLowerCase();

  if (/(sofa|couch|loveseat|sectional|recliner)/.test(haystack)) {
    return [...PIECES_BY_FURNITURE_TYPE.sofa];
  }
  if (/(chair|stool|bench)/.test(haystack)) {
    return [...PIECES_BY_FURNITURE_TYPE.chair];
  }
  if (/(table|dining|coffee table|side table|desk)/.test(haystack)) {
    return [...PIECES_BY_FURNITURE_TYPE.table];
  }
  if (/(bed|headboard)/.test(haystack)) {
    return [...PIECES_BY_FURNITURE_TYPE.bed];
  }
  if (/(wardrobe|cabinet|closet|storage)/.test(haystack)) {
    return [...PIECES_BY_FURNITURE_TYPE.storage];
  }

  return [...PIECES_BY_FURNITURE_TYPE.default];
}

const DEFAULT_COLOR_PALETTE = [
  "#F2F2F2",
  "#D9D9D9",
  "#BFBFBF",
  "#9A9A9A",
  "#6E6E6E",
  "#2D2D2D",
  "#DDEFFD",
  "#9BD8FF",
  "#55B4F3",
  "#2688D7",
  "#1A5EA8",
  "#103C77",
  "#F7E7C6",
  "#EFCF8A",
  "#DBAD4A",
  "#BC7D19",
  "#8F5B10",
  "#5F3908",
  "#E9D7DD",
  "#DBA9B9",
  "#C77A93",
  "#A54B71",
  "#762F58",
  "#4F1B3D",
  "#D4EED8",
  "#9BDEAA",
  "#5BCB76",
  "#33A956",
  "#1D7A3D",
  "#11572C",
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function applyShade(hex: string, shade: number): string {
  const normalized = hex.replace("#", "");
  const full = normalized.length === 3
    ? normalized
        .split("")
        .map((char) => `${char}${char}`)
        .join("")
    : normalized;

  if (!/^[\da-fA-F]{6}$/.test(full)) return "#2688EB";

  const channel = (start: number) => parseInt(full.slice(start, start + 2), 16);
  const percent = shade / 100;
  const adjust = (value: number) => {
    if (percent >= 0) return Math.round(value + (255 - value) * percent);
    return Math.round(value * (1 + percent));
  };

  const r = clamp(adjust(channel(0)), 0, 255);
  const g = clamp(adjust(channel(2)), 0, 255);
  const b = clamp(adjust(channel(4)), 0, 255);

  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

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
        .map((url) => upscaleCatalogImage(url, 1200)),
    [product.images],
  );

  const uid = useId();
  const swiperRef = useRef<SwiperType | null>(null);
  const { addItem, openOrderModal } = useCart();
  const [canGoPrev, setCanGoPrev] = useState(false);
  const [canGoNext, setCanGoNext] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [piecesOpen, setPiecesOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [customWidth, setCustomWidth] = useState("");
  const [customLength, setCustomLength] = useState("");
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [cartMessage, setCartMessage] = useState(false);
  const [customBaseColor, setCustomBaseColor] = useState("#2688EB");
  const [shadeValue, setShadeValue] = useState(0);

  const swatches = getProductCardSwatches(product);
  const moreSwatches = hasMoreSwatchOptions(product);
  const pricing = getProductCardPricing(product);
  const starRating = productStarRating(product.id);
  const showCarouselControls = images.length > 1;
  const customPreviewColor = useMemo(
    () => applyShade(customBaseColor, shadeValue),
    [customBaseColor, shadeValue],
  );
  const paletteColors = useMemo(() => {
    const fromProduct = swatches.map((swatch) => swatch.color.toUpperCase());
    return [...new Set([...fromProduct, ...DEFAULT_COLOR_PALETTE])];
  }, [swatches]);

  const { dotsRef, dotsClassName, onBeforeInit, onInit, onSlideChange, showDots } =
    usePdpSwiperPagination({
      slideCount: images.length,
      loop: false,
    });

  const updateNavState = useCallback((swiper: SwiperType) => {
    setCanGoPrev(!swiper.isBeginning);
    setCanGoNext(!swiper.isEnd);
  }, []);

  const handlePrev = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);

  const sizeOptions = useMemo(() => {
    const hash = product.id.length % SIZE_OPTIONS.length;
    return SIZE_OPTIONS.slice(hash, hash + 4)
      .concat(SIZE_OPTIONS.slice(0, Math.max(0, 4 - (SIZE_OPTIONS.length - hash))))
      .slice(0, 4);
  }, [product.id]);
  const pieceOptions = useMemo(
    () => resolvePiecesOptions(product, categoryLabel),
    [product, categoryLabel],
  );

  const customSizeLabel =
    customWidth.trim() && customLength.trim()
      ? `W${customWidth.trim()} × L${customLength.trim()} cm`
      : null;
  const isCustomSizeSelected =
    customSizeLabel !== null && selectedSize === customSizeLabel;

  const applyCustomSize = () => {
    if (!customSizeLabel) return;
    setSelectedSize(customSizeLabel);
    setSizeOpen(false);
  };

  useEffect(() => {
    if (!sizeOpen || !selectedSize) return;
    if (sizeOptions.includes(selectedSize)) {
      setCustomWidth("");
      setCustomLength("");
      return;
    }
    const match = selectedSize.match(/^W([\d.]+)\s*×\s*L([\d.]+)\s*cm$/i);
    if (match) {
      setCustomWidth(match[1]);
      setCustomLength(match[2]);
    }
  }, [sizeOpen, selectedSize, sizeOptions]);

  const buildOrderLine = useCallback((): ProductOrderLineItem => {
    return {
      productId: product.id,
      productTitle: product.title,
      serviceSlug,
      categoryLabel,
      image: images[0] ?? "",
      price: pricing.price,
      quantity: 1,
      color: selectedColor ?? undefined,
      size: selectedSize ?? undefined,
      pieces: selectedPiece ?? undefined,
    };
  }, [
    product.id,
    product.title,
    serviceSlug,
    categoryLabel,
    images,
    pricing.price,
    selectedColor,
    selectedSize,
    selectedPiece,
  ]);

  const handleAddToCart = useCallback(() => {
    const line = buildOrderLine();
    addItem({
      productId: line.productId,
      productTitle: line.productTitle,
      serviceSlug: line.serviceSlug,
      categoryLabel: line.categoryLabel ?? categoryLabel,
      image: line.image ?? "",
      href: product.href,
      price: line.price ?? null,
      color: line.color,
      size: line.size,
      pieces: line.pieces,
      quantity: 1,
    });
    setCartMessage(true);
    window.setTimeout(() => setCartMessage(false), 2000);
  }, [addItem, buildOrderLine, categoryLabel, product.href]);

  const handleBuyNow = useCallback(() => {
    openOrderModal({
      items: [buildOrderLine()],
      orderType: "buy_now",
    });
  }, [buildOrderLine, openOrderModal]);

  return (
    <section className="mk-catalog-pdp-buy" aria-label="Product overview">
      <div className="mk-catalog-pdp-buy__layout">
        <div className="mk-catalog-pdp-buy__media">
          <div className="mk-catalog-pdp-buy__main">
            {showCarouselControls ? (
              <>
                <button
                  type="button"
                  className="mk-catalog-pdp-buy__arrow mk-catalog-pdp-buy__arrow--prev"
                  aria-label="Previous image"
                  disabled={!canGoPrev}
                  onClick={handlePrev}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="mk-catalog-pdp-buy__arrow mk-catalog-pdp-buy__arrow--next"
                  aria-label="Next image"
                  disabled={!canGoNext}
                  onClick={handleNext}
                >
                  ›
                </button>
              </>
            ) : null}

            {images.length > 0 ? (
              <Swiper
                className="mk-catalog-pdp-buy__swiper"
                modules={[Pagination]}
                slidesPerView={1}
                spaceBetween={0}
                loop={false}
                onBeforeInit={onBeforeInit}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                  updateNavState(swiper);
                }}
                onInit={(swiper) => {
                  onInit(swiper);
                  updateNavState(swiper);
                }}
                onSlideChange={(swiper) => {
                  onSlideChange(swiper);
                  updateNavState(swiper);
                }}
                onResize={updateNavState}
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

            {showDots ? (
              <div
                ref={dotsRef}
                className={`mk-catalog-pdp-buy__dots ${dotsClassName}`}
                aria-label="Product image slides"
              />
            ) : null}
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
            <button type="button" className="mk-catalog-pdp-buy__buy" onClick={handleBuyNow}>
              Buy now
            </button>
            <button
              type="button"
              className={
                cartMessage ? "mk-catalog-pdp-buy__cart is-added" : "mk-catalog-pdp-buy__cart"
              }
              onClick={handleAddToCart}
              aria-live="polite"
            >
              {cartMessage ? "Added to cart" : "Add to cart"}
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
            <button
              type="button"
              className="mk-catalog-pdp-buy__option-btn mk-catalog-pdp-buy__option-btn--pieces"
              onClick={() => setPiecesOpen(true)}
            >
              <span className="mk-catalog-pdp-buy__option-label">
                {selectedPiece ? `Pieces: ${selectedPiece}` : "Pieces"}
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
          <section className="mk-catalog-pdp-options__section">
            <h4 className="mk-catalog-pdp-options__section-title">Theme colors</h4>
            <div className="mk-catalog-pdp-options__palette" role="list">
              {paletteColors.map((color) => {
                const isActive = selectedColor === color;
                return (
                  <button
                    key={color}
                    type="button"
                    className={
                      isActive
                        ? "mk-catalog-pdp-options__square is-active"
                        : "mk-catalog-pdp-options__square"
                    }
                    style={{ backgroundColor: color }}
                    title={color}
                    aria-label={`Choose ${color}`}
                    aria-pressed={isActive}
                    onClick={() => setSelectedColor(color)}
                  />
                );
              })}
            </div>
          </section>

          <section className="mk-catalog-pdp-options__section">
            <div className="mk-catalog-pdp-options__custom-head">
              <h4 className="mk-catalog-pdp-options__section-title">My color</h4>
              <label className="mk-catalog-pdp-options__add">
                <span>+ Add</span>
                <input
                  type="color"
                  value={customBaseColor}
                  aria-label="Pick a base color"
                  onChange={(event) => setCustomBaseColor(event.target.value.toUpperCase())}
                />
              </label>
            </div>

            <div className="mk-catalog-pdp-options__custom-preview-row">
              <button
                type="button"
                className={
                  selectedColor === customPreviewColor
                    ? "mk-catalog-pdp-options__custom-preview is-active"
                    : "mk-catalog-pdp-options__custom-preview"
                }
                style={{ backgroundColor: customPreviewColor }}
                title={customPreviewColor}
                aria-label={`Use custom color ${customPreviewColor}`}
                aria-pressed={selectedColor === customPreviewColor}
                onClick={() => setSelectedColor(customPreviewColor)}
              />
              <span className="mk-catalog-pdp-options__hex">{customPreviewColor}</span>
            </div>

            <label className="mk-catalog-pdp-options__range-label" htmlFor={`${uid}-shade`}>
              Shade
            </label>
            <input
              id={`${uid}-shade`}
              type="range"
              min={-45}
              max={45}
              step={1}
              value={shadeValue}
              className="mk-catalog-pdp-options__range"
              onChange={(event) => setShadeValue(Number(event.target.value))}
            />
          </section>

          <button
            type="button"
            className="mk-catalog-pdp-options__confirm"
            onClick={() => setColorOpen(false)}
          >
            Apply color
          </button>

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
        panelClassName="mk-catalog-pdp-modal__panel--wide"
        onClose={() => setSizeOpen(false)}
      >
        <div className="mk-catalog-pdp-size-layout">
          <section className="mk-catalog-pdp-size-layout__col">
            <h3 className="mk-catalog-pdp-size-layout__title">Choose a size</h3>
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
                    setCustomWidth("");
                    setCustomLength("");
                    setSizeOpen(false);
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </section>

          <section className="mk-catalog-pdp-size-layout__col mk-catalog-pdp-size-layout__col--custom">
            <h3 className="mk-catalog-pdp-size-layout__title">Customize size</h3>
            <p className="mk-catalog-pdp-size-layout__hint">
              Enter your preferred dimensions in centimeters.
            </p>
            <div className="mk-catalog-pdp-size-layout__fields">
              <label className="mk-catalog-pdp-size-layout__field" htmlFor={`${uid}-width`}>
                <span className="mk-catalog-pdp-size-layout__label">Width</span>
                <span className="mk-catalog-pdp-size-layout__input-wrap">
                  <input
                    id={`${uid}-width`}
                    type="number"
                    min={1}
                    step={0.5}
                    inputMode="decimal"
                    placeholder="e.g. 180"
                    value={customWidth}
                    onChange={(event) => setCustomWidth(event.target.value)}
                  />
                  <span className="mk-catalog-pdp-size-layout__unit">cm</span>
                </span>
              </label>
              <label className="mk-catalog-pdp-size-layout__field" htmlFor={`${uid}-length`}>
                <span className="mk-catalog-pdp-size-layout__label">Length</span>
                <span className="mk-catalog-pdp-size-layout__input-wrap">
                  <input
                    id={`${uid}-length`}
                    type="number"
                    min={1}
                    step={0.5}
                    inputMode="decimal"
                    placeholder="e.g. 200"
                    value={customLength}
                    onChange={(event) => setCustomLength(event.target.value)}
                  />
                  <span className="mk-catalog-pdp-size-layout__unit">cm</span>
                </span>
              </label>
            </div>
            {customSizeLabel ? (
              <p className="mk-catalog-pdp-size-layout__preview">
                Preview: <strong>{customSizeLabel}</strong>
              </p>
            ) : null}
            <button
              type="button"
              className={
                isCustomSizeSelected
                  ? "mk-catalog-pdp-options__confirm is-active"
                  : "mk-catalog-pdp-options__confirm"
              }
              disabled={!customSizeLabel}
              onClick={applyCustomSize}
            >
              Apply custom size
            </button>
          </section>
        </div>
      </CatalogOptionModal>

      <CatalogOptionModal
        open={piecesOpen}
        title="Choose pieces"
        onClose={() => setPiecesOpen(false)}
      >
        <div className="mk-catalog-pdp-options mk-catalog-pdp-options--sizes">
          {pieceOptions.map((piece) => (
            <button
              key={piece}
              type="button"
              className={
                selectedPiece === piece
                  ? "mk-catalog-pdp-options__size is-active"
                  : "mk-catalog-pdp-options__size"
              }
              onClick={() => {
                setSelectedPiece(piece);
                setPiecesOpen(false);
              }}
            >
              {piece}
            </button>
          ))}
        </div>
      </CatalogOptionModal>
    </section>
  );
}
