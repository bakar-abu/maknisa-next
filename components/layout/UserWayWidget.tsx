"use client";

import Script from "next/script";

export function UserWayWidget() {
  return (
    <>
      <Script
        id="userway-widget"
        src="https://cdn.userway.org/widget.js"
        data-account="uRrn9gMHwt"
        strategy="afterInteractive"
      />
      <noscript>
        Please ensure Javascript is enabled for purposes of{" "}
        <a href="https://userway.org/">website accessibility</a>
      </noscript>
    </>
  );
}
