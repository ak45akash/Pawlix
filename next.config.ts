import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/shop/:petType/:category", destination: "/shop?pet=:petType&category=:category", permanent: false },
      { source: "/shop/:petType", destination: "/shop?pet=:petType", permanent: false },
      { source: "/category/:slug", destination: "/shop?category=:slug", permanent: false },
    ];
  },
};

export default nextConfig;
