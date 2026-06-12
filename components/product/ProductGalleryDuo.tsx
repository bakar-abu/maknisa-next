"use client";

import { useId } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductSliderShell } from "@/components/product/ProductSliderShell";
import { usePdpSwiperPagination } from "@/components/product/usePdpSwiperPagination";

import "swiper/css";
import "swiper/css/pagination";

type ProductGalleryDuoProps = {
  slides: [string, string][];
  title: string;
};

export function ProductGalleryDuo({ slides, title }: ProductGalleryDuoProps) {
  const uid = useId();
  const {
    dotsRef,
    dotsClassName,
    modules,
    showDots,
    loop,
    onBeforeInit,
    onInit,
    onSlideChange,
    autoplay,
  } = usePdpSwiperPagination({
    slideCount: slides.length,
    autoplay: true,
    autoplayDelay: 3000,
  });

  if (slides.length === 0) return null;

  return (
    <ProductSliderShell
      dotsRef={dotsRef}
      dotsClassName={dotsClassName}
      ariaLabel="Detail gallery slides"
      showDots={showDots}
    >
      <Swiper
        className="mk-pdp__duo-swiper swiper"
        modules={modules}
        slidesPerView={1}
        spaceBetween={0}
        loop={loop}
        speed={600}
        autoplay={autoplay}
        onBeforeInit={onBeforeInit}
        onInit={onInit}
        onSlideChange={onSlideChange}
      >
        {slides.map(([left, right], slideIndex) => (
          <SwiperSlide key={`${uid}-duo-${slideIndex}`}>
            <div className="mk-pdp__duo-grid">
              <div className="mk-pdp__duo-cell">
                <div className="mk-pdp__slide-frame mk-pdp__slide-frame--portrait">
                  <span className="mk-pdp__slide-info" aria-hidden>
                    i
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={left}
                    alt={`${title} — view ${slideIndex * 2 + 1}`}
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="mk-pdp__duo-cell">
                <div className="mk-pdp__slide-frame mk-pdp__slide-frame--portrait mk-pdp__slide-frame--dark">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={right}
                    alt={`${title} — view ${slideIndex * 2 + 2}`}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </ProductSliderShell>
  );
}
