"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function isHomePath(pathname: string) {
  return pathname === "/";
}

/** Home: transparent header over hero; other routes: solid sticky header (same Header component). */
export function BodyRouteClasses() {
  const pathname = usePathname();
  const isHome = isHomePath(pathname);

  useEffect(() => {
    if (isHome) {
      document.body.classList.add("home-2025");
      document.body.classList.remove("_menu_sticky");
      document.body.classList.remove(
        "scroll-down",
        "scroll-up",
        "_affix_navigation_shown",
      );
      return;
    }

    document.body.classList.remove("home-2025");
    document.body.classList.add("_menu_sticky");
    document.body.classList.remove(
      "scroll-down",
      "scroll-up",
      "_affix_navigation_shown",
    );
  }, [isHome]);

  return null;
}
