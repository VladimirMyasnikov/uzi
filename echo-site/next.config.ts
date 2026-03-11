import type { NextConfig } from "next";

const isGhPages = process.env.GH_PAGES === "1";
const basePath = isGhPages ? "/uzi" : undefined;
const assetPrefix = isGhPages ? "/uzi/" : undefined;

const nextConfig: NextConfig = {
  output: isGhPages ? "export" : undefined,
  basePath,
  assetPrefix,
  typescript: {
    // Для сборки статики на GitHub Pages игнорируем ошибки во внутренних типах .next/dev/types
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "example.com" },
    ],
  },
};

export default nextConfig;
