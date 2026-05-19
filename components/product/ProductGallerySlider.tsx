"use client";

import { useId } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductSliderShell } from "@/components/product/ProductSliderShell";
import { usePdpSwiperPagination } from "@/components/product/usePdpSwiperPagination";

import "swiper/css";
import "swiper/css/pagination";

type ProductGallerySliderProps = {
  images: string[];
  title: string;
  showInfo?: boolean;
};

export function ProductGallerySlider({
  images,
  title,
  showInfo = true,
}: ProductGallerySliderProps) {
  const uid = useId();
  const { dotsRef, dotsClassName, onBeforeInit, onInit } = usePdpSwiperPagination();

  if (images.length === 0) return null;

  const loop = images.length > 1;

  return (
    <ProductSliderShell
      dotsRef={dotsRef}
      dotsClassName={dotsClassName}
      ariaLabel="Gallery slides"
    >
      <Swiper
        className="mk-pdp__gallery swiper"
        modules={[Pagination]}
        slidesPerView={1}
        spaceBetween={0}
        loop={loop}
        speed={600}
        onBeforeInit={onBeforeInit}
        onInit={onInit}
      >
        {images.map((src, index) => (
          <SwiperSlide key={`${uid}-gal-${index}`}>
            <div className="mk-pdp__slide-frame mk-pdp__slide-frame--16x9">
              {showInfo ? (
                <span className="mk-pdp__slide-info" aria-hidden title="Product info">
                  i
                </span>
              ) : null}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${title} — view ${index + 1}`}
                loading="lazy"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </ProductSliderShell>
  );
}
