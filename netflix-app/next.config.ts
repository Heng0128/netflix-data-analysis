import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isProd ? '/netflix-data-analysis' : '',
  assetPrefix: isProd ? '/netflix-data-analysis/' : '',
  images: { unoptimized: true },
  allowedDevOrigins: ['127.0.0.1', 'localhost', '.trae.cn', '.agent-sandbox-bj-c1-gw.trae.cn'],
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: ['echarts', 'echarts-for-react'],
  },
};

export default nextConfig;
