"use client";

import { useRef } from "react";
import { A11y, Mousewheel, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Icon } from "@/components/icons/Icon";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type HistoricDetailsSliderProps = {
  images: string[];
};

export function HistoricDetailsSlider({ images }: HistoricDetailsSliderProps) {
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  return (
    <section className="sn_slider_details my-80 my-150">
      <Swiper
        className="swiper"
        data-swiper="details"
        modules={[Navigation, Pagination, Mousewheel, A11y]}
        slidesPerView="auto"
        spaceBetween={10}
        centeredSlides
        loop={false}
        watchSlidesProgress
        mousewheel={{ forceToAxis: true }}
        a11y={{
          enabled: true,
          prevSlideMessage: "Previous slide",
          nextSlideMessage: "Next slide",
        }}
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
        {images.map((src) => (
          <SwiperSlide key={src}>
            <div className="sn_slider_details_i">
              <figure>
                <picture>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" loading="lazy" />
                </picture>
                <figcaption className="sn_paragraph" />
              </figure>
            </div>
          </SwiperSlide>
        ))}
        <div className="sn_swiper_nav_wr mt-30 justify-content-center d-none d-lg-flex">
          <div
            ref={prevRef}
            className="sn_swiper_nav _prev"
            role="button"
            tabIndex={0}
            aria-label="Previous slide"
          >
            <Icon id="arrow-right" className="_arrow_left" />
          </div>
          <div
            ref={nextRef}
            className="sn_swiper_nav _next"
            role="button"
            tabIndex={0}
            aria-label="Next slide"
          >
            <Icon id="arrow-right" className="_arrow_right" />
          </div>
        </div>
        <div
          ref={paginationRef}
          className="sn_swiper_pagination mt-30 d-lg-none"
        />
      </Swiper>
    </section>
  );
}
