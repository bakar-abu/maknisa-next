"use client";

import { useId } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductSliderShell } from "@/components/product/ProductSliderShell";
import { usePdpSwiperPagination } from "@/components/product/usePdpSwiperPagination";

import "swiper/css";
import "swiper/css/pagination";

type ProductHeroSliderProps = {
  images: string[];
  title: string;
};

export function ProductHeroSlider({ images, title }: ProductHeroSliderProps) {
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
  } = usePdpSwiperPagination({ slideCount: images.length });

  if (images.length === 0) return null;

  return (
    <ProductSliderShell
      dotsRef={dotsRef}
      dotsClassName={dotsClassName}
      ariaLabel="Hero slides"
      showDots={showDots}
    >
      <Swiper
        className="mk-pdp__hero-swiper swiper"
        modules={modules}
        slidesPerView={1}
        spaceBetween={0}
        loop={loop}
        speed={600}
        onBeforeInit={onBeforeInit}
        onInit={onInit}
        onSlideChange={onSlideChange}
      >
        {images.map((src, index) => (
          <SwiperSlide key={`${uid}-hero-${index}`}>
            <div className="mk-pdp__hero">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={title} loading={index === 0 ? "eager" : "lazy"} />
              <p className="mk-pdp__hero-title" aria-hidden="true">
                {title}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </ProductSliderShell>
  );
}
