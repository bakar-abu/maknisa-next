"use client";

import { useId } from "react";
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
      ariaLabel="Gallery slides"
      showDots={showDots}
    >
      <Swiper
        className="mk-pdp__gallery swiper"
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
