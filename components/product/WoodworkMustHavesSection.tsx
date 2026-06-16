"use client";

import { useId, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import type { WoodworkMustHaveItem } from "@/lib/woodwork-pdp-content";
import { WoodworkSliderArrow } from "@/components/product/WoodworkSliderArrow";

import "swiper/css";

type WoodworkMustHavesSectionProps = {
  productTitle: string;
  items: WoodworkMustHaveItem[];
};

export function WoodworkMustHavesSection({
  productTitle,
  items,
}: WoodworkMustHavesSectionProps) {
  const uid = useId();
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (items.length === 0) return null;

  const goToSlide = (index: number) => {
    if (!swiperRef.current) return;
    if (items.length > 1) {
      swiperRef.current.slideToLoop(index);
    } else {
      swiperRef.current.slideTo(index);
    }
  };

  const goPrev = () => {
    if (!swiperRef.current) return;
    if (items.length > 1) {
      swiperRef.current.slidePrev();
    }
  };

  const goNext = () => {
    if (!swiperRef.current) return;
    if (items.length > 1) {
      swiperRef.current.slideNext();
    }
  };

  return (
    <section className="ww-must-haves" aria-labelledby={`${uid}-must-haves-title`}>
      <div className="ww-must-haves__ct">
        <div className="ww-must-haves__in">
          <div className="ww-must-haves__vertical">
            <div className="ww-must-haves__vertical-in">
              <div className="ww-must-haves__vertical-stack">
                <span className="ww-must-haves__vertical-name">{productTitle}</span>
                <span
                  className="ww-must-haves__vertical-label"
                  id={`${uid}-must-haves-title`}
                >
                  must-haves
                </span>
              </div>
            </div>
          </div>

          <div className="ww-must-haves__container">
            <div className="ww-must-haves__row">
              <div className="ww-must-haves__col-media">
                <div className="ww-must-haves__images">
                  <Swiper
                    className="ww-must-haves__swiper"
                    slidesPerView="auto"
                    spaceBetween={20}
                    loop={items.length > 1}
                    onSwiper={(swiper) => {
                      swiperRef.current = swiper;
                    }}
                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                  >
                    {items.map((item, index) => (
                      <SwiperSlide key={`${uid}-must-${index}`}>
                        <div className="ww-must-haves__slide">
                          {item.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.image} alt={item.title} loading="lazy" />
                          ) : (
                            <div className="ww-must-haves__slide-placeholder" />
                          )}
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {items.length > 1 ? (
                    <div className="ww-must-haves__nav-wr">
                      <button
                        type="button"
                        className="ww-must-haves__nav _prev"
                        aria-label="Previous must-have"
                        onClick={goPrev}
                      >
                        <WoodworkSliderArrow direction="prev" />
                      </button>
                      <button
                        type="button"
                        className="ww-must-haves__nav _next"
                        aria-label="Next must-have"
                        onClick={goNext}
                      >
                        <WoodworkSliderArrow direction="next" />
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="ww-must-haves__col-list">
                <div className="ww-must-haves__links">
                  {items.map((item, index) => (
                    <button
                      key={`${uid}-link-${index}`}
                      type="button"
                      className={
                        activeIndex === index
                          ? "ww-must-haves__link is-active"
                          : "ww-must-haves__link"
                      }
                      aria-selected={activeIndex === index}
                      onClick={() => goToSlide(index)}
                    >
                      <span className="ww-must-haves__index">{index + 1}.</span>
                      <span className="ww-must-haves__title">{item.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
