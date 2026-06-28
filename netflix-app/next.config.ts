import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/netflix-data-analysis/netflix-app',
  assetPrefix: '/netflix-data-analysis/netflix-app/',
  images: { unoptimized: true },
};

export default nextConfig;
