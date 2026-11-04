"use client";

import { usePathname } from "next/navigation";
import { SiteChrome } from "./SiteChrome";

export function ConditionalSiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname?.startsWith("/maknisa-admin")) {
    return <>{children}</>;
  }

  return <SiteChrome>{children}</SiteChrome>;
}
