"use client";

import { useEffect, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation } from "swiper/modules";
import Swiper from "swiper";

type MobileSwiperOptions = {
  slidesPerView?: number;
  spaceBetween?: number;
  breakpoint?: number;
};

export function useMobileSwiper(
  containerRef: React.RefObject<HTMLElement | null>,
  prevRef: React.RefObject<HTMLElement | null>,
  nextRef: React.RefObject<HTMLElement | null>,
  options: MobileSwiperOptions = {},
) {
  const swiperRef = useRef<SwiperType | null>(null);
  const { slidesPerView = 1.15, spaceBetween = 8, breakpoint = 768 } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const syncSwiper = () => {
      const isMobile = window.innerWidth < breakpoint;

      if (isMobile && !swiperRef.current) {
        swiperRef.current = new Swiper(container, {
          modules: [Navigation],
          slidesPerView,
          spaceBetween,
          navigation: {
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          },
        });
      } else if (!isMobile && swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }
    };

    syncSwiper();
    window.addEventListener("resize", syncSwiper);
    return () => {
      window.removeEventListener("resize", syncSwiper);
      swiperRef.current?.destroy(true, true);
      swiperRef.current = null;
    };
  }, [breakpoint, containerRef, nextRef, prevRef, slidesPerView, spaceBetween]);

  return swiperRef;
}
