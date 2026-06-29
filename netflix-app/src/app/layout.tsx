import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://netflix-analysis.example.com"),
  title: {
    default: "Netflix 数据分析 | 流媒体内容深度可视化",
    template: "%s | Netflix 数据分析",
  },
  description:
    "基于 8,807 条真实数据集的 Netflix 流媒体内容深度分析与可视化。探索电影与剧集分布、全球内容趋势、随机森林分类模型等数据科学项目成果。",
  keywords: [
    "Netflix",
    "数据分析",
    "数据可视化",
    "ECharts",
    "Next.js",
    "随机森林",
    "机器学习",
    "数据科学",
    "流媒体",
  ],
  authors: [{ name: "Data Science Team" }],
  creator: "Data Science Team",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://netflix-analysis.example.com",
    siteName: "Netflix 数据分析",
    title: "Netflix 数据分析 | 流媒体内容深度可视化",
    description:
      "基于 8,807 条真实数据集的 Netflix 流媒体内容深度分析与可视化。",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Netflix 数据分析项目",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Netflix 数据分析 | 流媒体内容深度可视化",
    description:
      "基于 8,807 条真实数据集的 Netflix 流媒体内容深度分析与可视化。",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
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
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-white">
        <Navbar />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
