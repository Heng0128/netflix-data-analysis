import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/netflix-data-analysis',
  assetPrefix: '/netflix-data-analysis/',
  images: { unoptimized: true },
};

export default nextConfig;
