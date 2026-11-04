"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { MagazineBreadcrumbs } from "@/components/magazine/MagazineBreadcrumbs";
import type { CatalogServiceCategory } from "@/lib/catalog-service-categories";
import { SERVICES_LANDING_HREF } from "@/lib/services-landing";

import "swiper/css";

type CatalogCategoryHeroProps = {
  serviceLabel: string;
  heading: string;
  exploreLabel: string;
  ctaHref: string;
  categories: CatalogServiceCategory[];
  activeCategoryId: string | null;
  onCategoryChange: (categoryId: string | null) => void;
};

export function CatalogCategoryHero({
  serviceLabel,
  heading,
  exploreLabel,
  ctaHref,
  categories,
  activeCategoryId,
  onCategoryChange,
}: CatalogCategoryHeroProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [canGoPrev, setCanGoPrev] = useState(false);
  const [canGoNext, setCanGoNext] = useState(false);

  const updateNavState = useCallback((swiper: SwiperType) => {
    setCanGoPrev(!swiper.isBeginning);
    setCanGoNext(!swiper.isEnd);
  }, []);

  const handleCategoryClick = useCallback(
    (categoryId: string) => {
      onCategoryChange(activeCategoryId === categoryId ? null : categoryId);
    },
    [activeCategoryId, onCategoryChange],
  );

  const handlePrev = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);

  return (
    <section className="mk-catalog-hero">
      <div className="mk-catalog-hero__container">
        <div className="mk-catalog-hero__top row align-items-center">
          <div className="col-12 col-lg-5 mk-catalog-hero__left">
            <MagazineBreadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Services", href: SERVICES_LANDING_HREF },
                { label: serviceLabel },
              ]}
            />
            <h1 className="mk-catalog-hero__title">{heading}</h1>
            <Link href={ctaHref} className="mk-catalog-hero__cta">
              <span className="mk-catalog-hero__cta-icon" aria-hidden="true">
                →
              </span>
              <span>{exploreLabel}</span>
            </Link>
          </div>

          <div className="col-12 col-lg-7 mk-catalog-hero__right mt-40 mt-lg-0">
            <div className="mk-catalog-hero__slider-wrap">
              <button
                type="button"
                className="mk-catalog-hero__nav mk-catalog-hero__nav--prev"
                aria-label="Previous categories"
                disabled={!canGoPrev}
                onClick={handlePrev}
              >
                ‹
              </button>
              <Swiper
                className="mk-catalog-hero__swiper"
                slidesPerView={1.4}
                spaceBetween={12}
                breakpoints={{
                  576: { slidesPerView: 2.2, spaceBetween: 16 },
                  992: { slidesPerView: 2.4, spaceBetween: 20 },
                }}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                  updateNavState(swiper);
                }}
                onSlideChange={updateNavState}
                onResize={updateNavState}
                onBreakpoint={updateNavState}
              >
                {categories.map((category) => {
                  const isActive = activeCategoryId === category.id;
                  return (
                    <SwiperSlide key={category.id}>
                      <button
                        type="button"
                        className={`mk-catalog-hero__card${isActive ? " is-active" : ""}`}
                        onClick={() => handleCategoryClick(category.id)}
                        aria-pressed={isActive}
                      >
                        <span className="mk-catalog-hero__card-image">
                          {category.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={category.image} alt="" loading="lazy" />
                          ) : null}
                        </span>
                        <span className="mk-catalog-hero__card-label">
                          {category.label}
                        </span>
                      </button>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              <button
                type="button"
                className="mk-catalog-hero__nav mk-catalog-hero__nav--next"
                aria-label="Next categories"
                disabled={!canGoNext}
                onClick={handleNext}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
