"use client";

import { useHomeScroll } from "@/hooks/useHomeScroll";

export function HomeScrollEffects() {
  useHomeScroll(true);
  return null;
}
