import type { Metadata, Viewport } from "next";
import "./globals.css";
import "highlight.js/styles/atom-one-dark.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Netflix 电影和电视节目数据分析",
  description: "基于 8,809 条 Netflix 内容数据的深度探索 · 数据预处理 + 9 维可视化分析",
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
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;600;700;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body>
        <Navbar />
        <main className="page-enter">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
