"use client";

import Link from "next/link";
import { useCallback, useRef } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { MagazineBreadcrumbs } from "@/components/magazine/MagazineBreadcrumbs";
import type { CollectionServiceFilter } from "@/lib/collection-service-filters";
import { SERVICES_LANDING_HREF } from "@/lib/services-landing";

import "swiper/css";
import "swiper/css/navigation";

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
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

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
                ref={prevRef}
                className="mk-grid-hero__nav mk-grid-hero__nav--prev"
                aria-label="Previous styles"
              >
                ‹
              </button>
              <Swiper
                className="mk-grid-hero__swiper"
                modules={[Navigation]}
                slidesPerView={1.35}
                spaceBetween={16}
                centeredSlides={false}
                breakpoints={{
                  576: { slidesPerView: 2.1, spaceBetween: 20 },
                  992: { slidesPerView: 3, spaceBetween: 24 },
                }}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                onBeforeInit={(swiper) => {
                  if (
                    typeof swiper.params.navigation !== "boolean" &&
                    swiper.params.navigation
                  ) {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                  }
                }}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                onInit={(swiper) => {
                  swiper.navigation.init();
                  swiper.navigation.update();
                }}
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
                ref={nextRef}
                className="mk-grid-hero__nav mk-grid-hero__nav--next"
                aria-label="Next styles"
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
