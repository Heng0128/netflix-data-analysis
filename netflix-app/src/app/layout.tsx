import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://heng0128.github.io/netflix-data-analysis"),
  title: {
    default: "Netflix 影视作品数据分析",
    template: "%s | Netflix 数据分析",
  },
  description:
    "基于 8,807 条 Netflix 影视作品数据的深度分析：内容类型、评分、年度趋势、时长分布、国家与流派相关性可视化。",
  keywords: [
    "Netflix",
    "数据分析",
    "影视数据",
    "数据可视化",
    "ECharts",
    "Next.js",
  ],
  authors: [{ name: "Netflix Data Analysis" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://heng0128.github.io/netflix-data-analysis",
    siteName: "Netflix 影视作品数据分析",
    title: "Netflix 影视作品数据分析",
    description:
      "基于 8,807 条 Netflix 影视作品数据的深度分析与可视化报告。",
  },
  twitter: {
    card: "summary_large_image",
    title: "Netflix 影视作品数据分析",
    description:
      "基于 8,807 条 Netflix 影视作品数据的深度分析与可视化报告。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
