import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ],
  },
};

export default nextConfig;
