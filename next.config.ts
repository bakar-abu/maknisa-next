import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/ww/kitchens/:productSlug",
        destination: "/ww/services/kitchens/:productSlug",
        permanent: true,
      },
      {
        source: "/ww/marble-tiles/:productSlug",
        destination: "/ww/services/marbels-tiles/:productSlug",
        permanent: true,
      },
      {
        source: "/ww/find-a-dealer",
        destination: "/ww/book-an-appointment",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.scavolini.com",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "scavolini-cdn.thron.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
