"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { upscaleCatalogImage } from "@/lib/catalog-images";

type ProductCardCarouselProps = {
  images: string[];
  alt: string;
  href: string;
};

const CARD_SIZES =
  "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, (max-width: 2399px) 25vw, 500px";

function getImageSrc(url: string): string {
  return upscaleCatalogImage(url, 1200);
}

export function ProductCardCarousel({
  images,
  alt,
  href,
}: ProductCardCarouselProps) {
  const slides = images.filter((url) => url && url !== "#" && url.startsWith("http"));
  const [index, setIndex] = useState(0);
  const hasMultiple = slides.length > 1;
  const current = slides[index] ?? slides[0];

  const goPrev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
    },
    [slides.length],
  );

  const goNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIndex((i) => (i === slides.length - 1 ? 0 : i + 1));
    },
    [slides.length],
  );

  if (!current) {
    return <div className="mk-bc-card__placeholder" aria-hidden="true" />;
  }

  return (
    <div className="mk-bc-card__carousel">
      <Link
        href={href}
        className="mk-bc-card__image-link"
        aria-label={alt}
        draggable={false}
      >
        <div className="mk-bc-card__scroller">
          <div className="mk-bc-card__slide">
            <div className="mk-bc-card__image mk-bc-card__image--packshot">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getImageSrc(current)}
                alt={index === 0 ? alt : ""}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                sizes={CARD_SIZES}
                className="mk-bc-card__img"
              />
            </div>
          </div>
        </div>
      </Link>
      {hasMultiple ? (
        <div className="mk-bc-card__controls">
          <button
            type="button"
            className="mk-bc-card__control"
            aria-label="Show previous image"
            onClick={goPrev}
          >
            <svg viewBox="0 0 30 30" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 3 9 15l12 12" />
            </svg>
          </button>
          <button
            type="button"
            className="mk-bc-card__control"
            aria-label="Show next image"
            onClick={goNext}
          >
            <svg viewBox="0 0 31 30" fill="none" stroke="currentColor" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                d="m9.25 27 12-12-12-12"
              />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}
