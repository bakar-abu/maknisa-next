"use client";

import { useCallback, useId, useMemo, useRef } from "react";
import { Autoplay, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

export type PdpSwiperPaginationOptions = {
  slideCount?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  /** When true, loop mode (related product cards). When false, one dot per slide. */
  loop?: boolean;
};

export function usePdpSwiperPagination(options?: PdpSwiperPaginationOptions) {
  const dotsRef = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, "");

  const slideCount = options?.slideCount;
  const autoplay = options?.autoplay ?? false;
  const autoplayDelay = options?.autoplayDelay ?? 3000;
  const loop = options?.loop ?? false;

  const showDots =
    slideCount !== undefined ? slideCount > 1 : true;

  const modules = useMemo(() => {
    const list = [Pagination];
    if (autoplay) list.push(Autoplay);
    return list;
  }, [autoplay]);

  const bindPagination = useCallback(
    (swiper: SwiperType) => {
      if (!dotsRef.current || !showDots) return;
      swiper.params.pagination = {
        ...(typeof swiper.params.pagination === "object"
          ? swiper.params.pagination
          : {}),
        el: dotsRef.current,
        clickable: true,
        type: "bullets",
      };
      if (swiper.pagination?.destroy) {
        swiper.pagination.destroy();
      }
      swiper.pagination.init();
      swiper.pagination.render();
      swiper.pagination.update();
    },
    [showDots],
  );

  const onBeforeInit = useCallback(
    (swiper: SwiperType) => {
      if (dotsRef.current && showDots) {
        swiper.params.pagination = {
          ...(typeof swiper.params.pagination === "object"
            ? swiper.params.pagination
            : {}),
          el: dotsRef.current,
          clickable: true,
          type: "bullets",
        };
      }
      if (autoplay) {
        swiper.params.autoplay = {
          delay: autoplayDelay,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        };
      }
    },
    [autoplay, autoplayDelay, showDots],
  );

  const onInit = useCallback(
    (swiper: SwiperType) => {
      bindPagination(swiper);
      if (autoplay && swiper.autoplay) {
        swiper.autoplay.start();
      }
    },
    [autoplay, bindPagination],
  );

  const onSlideChange = useCallback(
    (swiper: SwiperType) => {
      swiper.pagination?.update();
    },
    [],
  );

  const autoplayConfig = autoplay
    ? {
        delay: autoplayDelay,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }
    : undefined;

  const dotsClassName = `mk-pdp__dots mk-pdp__dots--${uid}`;

  return {
    dotsRef,
    dotsClassName,
    modules,
    showDots,
    loop,
    onBeforeInit,
    onInit,
    onSlideChange,
    autoplay: autoplayConfig,
  };
}
