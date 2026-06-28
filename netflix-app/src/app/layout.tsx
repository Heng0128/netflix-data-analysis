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
  title: "Netflix 数据分析 | 流媒体内容趋势洞察",
  description: "基于真实 Netflix 数据集的深度分析，通过 9 种可视化图表探索流媒体时代的影视内容趋势",
  keywords: ["Netflix", "数据分析", "数据可视化", "ECharts", "流媒体"],
  authors: [{ name: "Netflix Analysis" }],
  openGraph: {
    title: "Netflix 数据分析",
    description: "基于真实数据集的深度分析，探索流媒体时代的影视内容趋势",
    type: "website",
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
      <body className="min-h-full flex flex-col bg-black text-white">{children}</body>
    </html>
  );
}
