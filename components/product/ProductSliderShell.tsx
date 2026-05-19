"use client";

import type { ReactNode, RefObject } from "react";

type ProductSliderShellProps = {
  children: ReactNode;
  dotsRef: RefObject<HTMLDivElement | null>;
  dotsClassName: string;
  ariaLabel: string;
  compact?: boolean;
};

export function ProductSliderShell({
  children,
  dotsRef,
  dotsClassName,
  ariaLabel,
  compact = false,
}: ProductSliderShellProps) {
  return (
    <div
      className={`mk-pdp__slider${compact ? " mk-pdp__slider--compact" : ""}`}
    >
      <div className="mk-pdp__slider-media">{children}</div>
      <div
        ref={dotsRef}
        className={`mk-pdp__slider-dots ${dotsClassName}`}
        role="tablist"
        aria-label={ariaLabel}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      />
    </div>
  );
}
