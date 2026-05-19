"use client";

import { useEffect } from "react";

export type HeaderScrollMode = "home" | "inner";

/**
 * Reference header scroll behavior:
 * - home: transparent at top → _menu_sticky after hero spacer
 * - inner: _menu_sticky always (solid header)
 * - both: scroll-down hides header, scroll-up reveals it; affix bar on scroll
 */
export function useHeaderScroll(mode: HeaderScrollMode, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    let lastScrollY = 0;

    const update = () => {
      const scrollY =
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop;

      const spacer = document.querySelector<HTMLElement>(".sn_header_spacer");
      const spacerHeight = spacer?.offsetHeight ?? 0;

      if (mode === "home") {
        document.body.classList.toggle("_menu_sticky", scrollY > spacerHeight);
      } else {
        document.body.classList.add("_menu_sticky");
      }

      document.body.classList.toggle("_affix_navigation_shown", scrollY > 0);

      if (scrollY === 0) {
        document.body.classList.remove("scroll-up", "scroll-down");
      } else if (scrollY > lastScrollY) {
        document.body.classList.add("scroll-down");
        document.body.classList.remove("scroll-up");
      } else if (scrollY < lastScrollY) {
        document.body.classList.add("scroll-up");
        document.body.classList.remove("scroll-down");
      }

      lastScrollY = scrollY;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      document.body.classList.remove(
        "_affix_navigation_shown",
        "scroll-up",
        "scroll-down",
      );
      if (mode === "home") {
        document.body.classList.remove("_menu_sticky");
      }
    };
  }, [enabled, mode]);
}

/** @deprecated Use useHeaderScroll */
export function useHomeScroll(enabled = true) {
  useHeaderScroll("home", enabled);
}
