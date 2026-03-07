import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "example.com" },
    ],
  },
};

export default nextConfig;
