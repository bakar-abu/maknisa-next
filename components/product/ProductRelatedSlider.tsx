"use client";

import { useId, useRef } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductRelatedCard } from "@/components/product/ProductRelatedCard";
import { usePdpSwiperPagination } from "@/components/product/usePdpSwiperPagination";
import type { CollectionProduct } from "@/lib/collection-types";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type ProductRelatedSliderProps = {
  products: CollectionProduct[];
  collectionTitle: string;
};

export function ProductRelatedSlider({
  products,
  collectionTitle,
}: ProductRelatedSliderProps) {
  const uid = useId();
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const { dotsRef, dotsClassName, onBeforeInit, onInit, onSlideChange, showDots } =
    usePdpSwiperPagination({
      slideCount: products.length,
      loop: products.length > 4,
    });

  if (products.length === 0) return null;

  const loop = products.length > 4;

  return (
    <section className="mk-pdp__section mk-pdp__section--related">
      <div className="mk-pdp__container mk-pdp__container--bleed">
        <h2 className="mk-pdp__related-title">Related products</h2>

        <div className="mk-pdp__slider mk-pdp__slider--related-track">
          <div className="mk-pdp__slider-media">
            <div className="mk-pdp__related-wrap">
              <button
                ref={prevRef}
                type="button"
                className="mk-pdp__related-arrow mk-pdp__related-arrow--prev"
                aria-label="Previous related products"
              >
                ‹
              </button>

              <Swiper
                className="mk-pdp__related-swiper swiper"
                modules={[Navigation, Pagination]}
                slidesPerView={1.2}
                spaceBetween={12}
                loop={loop}
                breakpoints={{
                  480: { slidesPerView: 1.5, spaceBetween: 16 },
                  576: { slidesPerView: 2.1, spaceBetween: 20 },
                  768: { slidesPerView: 2.6, spaceBetween: 24 },
                  992: { slidesPerView: 3.2, spaceBetween: 32 },
                  1200: { slidesPerView: 4, spaceBetween: 40 },
                }}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                onBeforeInit={(swiper) => {
                  onBeforeInit(swiper);
                  if (
                    typeof swiper.params.navigation !== "boolean" &&
                    swiper.params.navigation
                  ) {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                  }
                }}
                onInit={(swiper) => {
                  onInit(swiper);
                  swiper.navigation.init();
                  swiper.navigation.update();
                }}
                onSlideChange={onSlideChange}
              >
                {products.map((product) => (
                  <SwiperSlide key={`${uid}-${product.id}`}>
                    <ProductRelatedCard
                      product={product}
                      collectionTitle={collectionTitle}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <button
                ref={nextRef}
                type="button"
                className="mk-pdp__related-arrow mk-pdp__related-arrow--next"
                aria-label="Next related products"
              >
                ›
              </button>
            </div>
          </div>

          {showDots ? (
            <div
              ref={dotsRef}
              className={`mk-pdp__slider-dots ${dotsClassName}`}
              aria-label="Related products slides"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
