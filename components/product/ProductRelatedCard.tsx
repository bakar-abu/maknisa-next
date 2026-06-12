"use client";

import Link from "next/link";
import { useId } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductSliderShell } from "@/components/product/ProductSliderShell";
import { usePdpSwiperPagination } from "@/components/product/usePdpSwiperPagination";
import type { CollectionProduct } from "@/lib/collection-types";

import "swiper/css";
import "swiper/css/pagination";

type ProductRelatedCardProps = {
  product: CollectionProduct;
  collectionTitle: string;
};

export function ProductRelatedCard({
  product,
  collectionTitle,
}: ProductRelatedCardProps) {
  const uid = useId();
  const images = product.images.length > 0 ? product.images : [];
  const {
    dotsRef,
    dotsClassName,
    modules,
    showDots,
    loop,
    onBeforeInit,
    onInit,
    onSlideChange,
  } = usePdpSwiperPagination({
    slideCount: images.length,
    loop: images.length > 1,
  });

  return (
    <div className="mk-pdp__related-card-wrap">
      <Link href={product.href} className="mk-pdp__related-card">
        {images.length > 0 ? (
          <ProductSliderShell
            dotsRef={dotsRef}
            dotsClassName={dotsClassName}
            ariaLabel={`${product.title} images`}
            compact
            showDots={showDots && images.length > 1}
          >
            <Swiper
              className="mk-pdp__related-img-swiper swiper"
              modules={modules}
              slidesPerView={1}
              loop={loop}
              onBeforeInit={onBeforeInit}
              onInit={onInit}
              onSlideChange={onSlideChange}
              onTouchEnd={(_, e) => e.stopPropagation()}
            >
              {images.map((src, index) => (
                <SwiperSlide key={`${uid}-${index}`}>
                  <div className="mk-pdp__related-img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={product.title} loading="lazy" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </ProductSliderShell>
        ) : (
          <div className="mk-pdp__related-img" />
        )}
        <h3 className="mk-pdp__related-name">{product.title}</h3>
        <span className="mk-pdp__related-cat">{collectionTitle}</span>
      </Link>
    </div>
  );
}
