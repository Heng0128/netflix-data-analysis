"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/overview", label: "需求分析" },
  { href: "/code", label: "预处理与代码" },
  { href: "/visualization", label: "可视化与发现" },
  { href: "/conclusion", label: "机器学习与建议" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 32px",
        background: "rgba(10,10,10,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "inherit" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            background: "linear-gradient(135deg,#E50914,#B20710)",
            color: "#fff",
            fontWeight: 900,
            fontSize: "16px",
            borderRadius: "7px",
            boxShadow: "0 0 14px rgba(229,9,20,.4)",
          }}
        >
          N
        </span>
        <span style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "-.3px" }}>
          Netflix 数据分析
        </span>
      </Link>
      <div style={{ display: "flex", gap: "24px", fontSize: "13px" }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                color: isActive ? "#E50914" : "rgba(255,255,255,.6)",
                textDecoration: "none",
                transition: "color .2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#E50914";
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,.6)";
                }
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
