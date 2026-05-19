import type { Metadata, Viewport } from "next";
import { BodyRouteClassScript } from "@/components/layout/BodyRouteClassScript";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  icons: {
    icon: [
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/favicons/apple-touch-icon.png",
    shortcut: "/favicons/favicon.ico",
  },
  manifest: "/favicons/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#F99106",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="no-js" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="/styles/maknisa.css" />
        <link rel="mask-icon" href="/favicons/favicon-32x32.png" color="#F99106" />
      </head>
      <body suppressHydrationWarning>
        <BodyRouteClassScript />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
