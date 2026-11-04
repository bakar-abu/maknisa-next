"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { MagazineBreadcrumbs } from "@/components/magazine/MagazineBreadcrumbs";
import type { CollectionServiceFilter } from "@/lib/collection-service-filters";
import { SERVICES_LANDING_HREF } from "@/lib/services-landing";

import "swiper/css";

type CollectionGridHeroProps = {
  heroTitle: string;
  ctaLabel: string;
  ctaHref: string;
  breadcrumbLabel: string;
  styleFilters: CollectionServiceFilter[];
  activeStyleId: string | null;
  onStyleChange: (styleId: string | null) => void;
};

export function CollectionGridHero({
  heroTitle,
  ctaLabel,
  ctaHref,
  breadcrumbLabel,
  styleFilters,
  activeStyleId,
  onStyleChange,
}: CollectionGridHeroProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [canGoPrev, setCanGoPrev] = useState(false);
  const [canGoNext, setCanGoNext] = useState(false);

  const updateNavState = useCallback((swiper: SwiperType) => {
    setCanGoPrev(!swiper.isBeginning);
    setCanGoNext(!swiper.isEnd);
  }, []);

  const scrollToStyle = useCallback(
    (styleId: string) => {
      const index = styleFilters.findIndex((filter) => filter.id === styleId);
      if (index >= 0) {
        swiperRef.current?.slideTo(index);
      }
    },
    [styleFilters],
  );

  const handleStyleSelect = useCallback(
    (styleId: string | null) => {
      onStyleChange(styleId);
      if (styleId) scrollToStyle(styleId);
    },
    [onStyleChange, scrollToStyle],
  );

  const handlePrev = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);

  return (
    <div className="mk-grid-hero mb-50 mb-xl-80">
      <div className="container-fluid">
        <div className="mk-grid-hero__top row align-items-center">
          <div className="col-12 col-lg-5 mk-grid-hero__left">
            <MagazineBreadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Services", href: SERVICES_LANDING_HREF },
                { label: breadcrumbLabel },
              ]}
            />
            <h1 className="mk-grid-hero__title">{heroTitle}</h1>
            <Link href={ctaHref} className="mk-grid-hero__cta">
              <span className="mk-grid-hero__cta-icon" aria-hidden="true">
                →
              </span>
              <span>{ctaLabel}</span>
            </Link>
          </div>

          <div className="col-12 col-lg-7 mk-grid-hero__right mt-40 mt-lg-0">
            <div className="mk-grid-hero__slider-wrap">
              <button
                type="button"
                className="mk-grid-hero__nav mk-grid-hero__nav--prev"
                aria-label="Previous styles"
                disabled={!canGoPrev}
                onClick={handlePrev}
              >
                ‹
              </button>
              <Swiper
                className="mk-grid-hero__swiper"
                slidesPerView={1.35}
                spaceBetween={16}
                centeredSlides={false}
                breakpoints={{
                  576: { slidesPerView: 2.1, spaceBetween: 20 },
                  992: { slidesPerView: 2.4, spaceBetween: 24 },
                }}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                  updateNavState(swiper);
                }}
                onSlideChange={updateNavState}
                onResize={updateNavState}
                onBreakpoint={updateNavState}
              >
                {styleFilters.map((filter) => {
                  const isActive = activeStyleId === filter.id;
                  return (
                    <SwiperSlide key={filter.id}>
                      <button
                        type="button"
                        className={`mk-grid-hero__card${isActive ? " is-active" : ""}`}
                        onClick={() =>
                          handleStyleSelect(isActive ? null : filter.id)
                        }
                        aria-pressed={isActive}
                      >
                        <span className="mk-grid-hero__card-image">
                          {filter.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={filter.image} alt="" loading="lazy" />
                          ) : null}
                        </span>
                        <span className="mk-grid-hero__card-label">{filter.label}</span>
                      </button>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              <button
                type="button"
                className="mk-grid-hero__nav mk-grid-hero__nav--next"
                aria-label="Next styles"
                disabled={!canGoNext}
                onClick={handleNext}
              >
                ›
              </button>
            </div>
          </div>
        </div>

        <div className="mk-grid-hero__show-me">
          <span className="mk-grid-hero__show-me-label">Show me</span>
          <div className="mk-grid-hero__pills" role="group" aria-label="Style filters">
            <button
              type="button"
              className={`mk-grid-hero__pill${activeStyleId === null ? " is-active" : ""}`}
              onClick={() => handleStyleSelect(null)}
              aria-pressed={activeStyleId === null}
            >
              All
            </button>
            {styleFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={`mk-grid-hero__pill${activeStyleId === filter.id ? " is-active" : ""}`}
                onClick={() =>
                  handleStyleSelect(
                    activeStyleId === filter.id ? null : filter.id,
                  )
                }
                aria-pressed={activeStyleId === filter.id}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
