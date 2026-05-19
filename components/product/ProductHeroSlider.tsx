"use client";

import { useId } from "react";
import { Pagination } from "swiper/modules";
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
  const { dotsRef, dotsClassName, onBeforeInit, onInit } = usePdpSwiperPagination();

  if (images.length === 0) return null;

  const loop = images.length > 1;

  return (
    <ProductSliderShell
      dotsRef={dotsRef}
      dotsClassName={dotsClassName}
      ariaLabel="Hero slides"
    >
      <Swiper
        className="mk-pdp__hero-swiper swiper"
        modules={[Pagination]}
        slidesPerView={1}
        spaceBetween={0}
        loop={loop}
        speed={600}
        onBeforeInit={onBeforeInit}
        onInit={onInit}
      >
        {images.map((src, index) => (
          <SwiperSlide key={`${uid}-hero-${index}`}>
            <div className="mk-pdp__hero">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={title} loading={index === 0 ? "eager" : "lazy"} />
              <h1 className="mk-pdp__hero-title">{title}</h1>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </ProductSliderShell>
  );
}

