import type { NextConfig } from "next";

// 仅在静态导出（生产）时启用 basePath，便于 GitHub Pages 部署；
// 开发模式下不使用 basePath，使预览 URL 更简洁。
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isProd ? '/netflix-data-analysis' : '',
  assetPrefix: isProd ? '/netflix-data-analysis/' : '',
  images: { unoptimized: true },
  // 允许沙箱预览域名访问 dev 资源（HMR 等）
  allowedDevOrigins: ['127.0.0.1', 'localhost', '.trae.cn', '.agent-sandbox-bj-c1-gw.trae.cn', '.remote-agent.svc.cluster.local'],
};

export default nextConfig;
