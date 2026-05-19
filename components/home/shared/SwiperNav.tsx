import type { RefObject } from "react";
import { Icon } from "@/components/icons/Icon";

type SwiperNavProps = {
  light?: boolean;
  prevRef: RefObject<HTMLDivElement | null>;
  nextRef: RefObject<HTMLDivElement | null>;
};

export function SwiperNav({ light = false, prevRef, nextRef }: SwiperNavProps) {
  return (
    <div className={`button-actions${light ? " _light" : ""}`}>
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
  );
}
