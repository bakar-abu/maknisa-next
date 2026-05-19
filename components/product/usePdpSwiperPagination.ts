"use client";

import { useCallback, useId, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";

export function usePdpSwiperPagination() {
  const dotsRef = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, "");

  const bindPagination = useCallback((swiper: SwiperType) => {
    if (!dotsRef.current) return;
    swiper.params.pagination = {
      ...(typeof swiper.params.pagination === "object"
        ? swiper.params.pagination
        : {}),
      el: dotsRef.current,
      clickable: true,
      type: "bullets",
    };
    swiper.pagination.init();
    swiper.pagination.render();
    swiper.pagination.update();
  }, []);

  const onBeforeInit = useCallback(
    (swiper: SwiperType) => {
      if (dotsRef.current) {
        swiper.params.pagination = {
          ...(typeof swiper.params.pagination === "object"
            ? swiper.params.pagination
            : {}),
          el: dotsRef.current,
          clickable: true,
          type: "bullets",
        };
      }
    },
    [],
  );

  const onInit = useCallback(
    (swiper: SwiperType) => {
      bindPagination(swiper);
    },
    [bindPagination],
  );

  const dotsClassName = `mk-pdp__dots mk-pdp__dots--${uid}`;

  return { dotsRef, dotsClassName, onBeforeInit, onInit };
}
