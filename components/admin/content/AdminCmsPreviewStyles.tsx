"use client";

import { useEffect } from "react";

/** Loads public site styles for accurate section previews inside the admin CMS. */
export function AdminCmsPreviewStyles() {
  useEffect(() => {
    const href = "/styles/maknisa.css";
    const existing = document.querySelector(`link[href="${href}"]`);
    if (existing) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }, []);

  return null;
}
