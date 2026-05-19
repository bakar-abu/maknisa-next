"use client";

import { usePathname } from "next/navigation";
import { useHeaderScroll } from "@/hooks/useHomeScroll";

export function HeaderScrollEffects() {
  const pathname = usePathname();
  const mode = pathname === "/" ? "home" : "inner";

  useHeaderScroll(mode);
  return null;
}
