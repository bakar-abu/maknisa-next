"use client";

import Link from "next/link";
import { useId, useRef } from "react";
import { A11y, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Icon } from "@/components/icons/Icon";
import type { CollectionProduct, CollectionTag } from "@/lib/collection-types";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type CollectionProductCardProps = {
  product: CollectionProduct;
  tagsById: Map<number, CollectionTag>;
};

export function CollectionProductCard({
  product,
  tagsById,
}: CollectionProductCardProps) {
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const uid = useId();

  return (
    <div className="col-12 col-md-6 col-lg-4 col-xl-3 mb-30 mb-md-80" role="listitem">
      <div className="sn_kitchen_i">
        <Link
          href={product.href}
          className="sn_kitchen_i_link stretched-link"
          aria-label={product.title}
        />
        <div className="sn_kitchen_i_title mb-10" role="heading" aria-level={2}>
          <span>{product.title}</span>
          <Icon id="arrow-right" className="_external_big" />
        </div>
        <div className="sn_kitchen_i_sw mb-30">
          {product.onlineShop ? (
            <div className="sn_kitchen_i_tag">Shop online!</div>
          ) : null}
          {product.images.length > 0 ? (
            <Swiper
              className="swiper"
              data-swiper="kitchen"
              modules={[Navigation, Pagination, A11y]}
              slidesPerView={1}
              loop={product.images.length > 1}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              pagination={{
                el: paginationRef.current,
                clickable: true,
              }}
              onBeforeInit={(swiper) => {
                if (
                  typeof swiper.params.navigation !== "boolean" &&
                  swiper.params.navigation
                ) {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                }
                if (paginationRef.current) {
                  swiper.params.pagination = {
                    ...(typeof swiper.params.pagination === "object"
                      ? swiper.params.pagination
                      : {}),
                    el: paginationRef.current,
                  };
                }
              }}
              onInit={(swiper) => {
                swiper.navigation.init();
                swiper.navigation.update();
                swiper.pagination.init();
                swiper.pagination.update();
              }}
            >
              {product.images.map((src) => (
                <SwiperSlide key={`${uid}-${src}`}>
                  <picture>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={product.title} loading="lazy" />
                  </picture>
                </SwiperSlide>
              ))}
              <div className="sn_kitchen_i_sw_nav d-flex align-items-center">
                <div ref={prevRef} className="sn_swiper_nav _prev" role="button" tabIndex={0}>
                  <Icon id="arrow-right" className="_arrow_left" />
                </div>
                <div ref={paginationRef} className="sn_swiper_pagination flex-grow-1" />
                <div ref={nextRef} className="sn_swiper_nav _next" role="button" tabIndex={0}>
                  <Icon id="arrow-right" className="_arrow_right" />
                </div>
              </div>
            </Swiper>
          ) : null}
        </div>
        {product.tagIds.length > 0 ? (
          <div className="sn_kitchen_tags">
            {product.tagIds.map((tagId) => {
              const tag = tagsById.get(tagId);
              if (!tag) return null;
              return (
                <span
                  key={tagId}
                  className="sn_kitchen_tags_i"
                  data-tag={tagId}
                >
                  {tag.label}
                </span>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
