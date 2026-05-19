import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.scavolini.com",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
