'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const routes = [
  { href: '/', label: '首页' },
  { href: '/overview', label: '概览' },
  { href: '/analysis', label: '分析' },
  { href: '/code', label: '代码' },
  { href: '/visualization', label: '可视化' },
  { href: '/conclusion', label: '结论' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-md shadow-lg shadow-black/30' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#E50914] rounded flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-110 pulse-glow">
              N
            </div>
            <span className="text-white font-semibold text-lg hidden sm:block">
              Netflix <span className="text-[#E50914]">分析</span>
            </span>
          </Link>

          {/* 桌面导航 */}
          <ul className="hidden md:flex gap-1">
            {routes.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    isActive(r.href)
                      ? 'bg-[#E50914] text-white shadow-[0_4px_20px_rgba(229,9,20,0.4)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* 移动端汉堡按钮 */}
          <button
            className="md:hidden text-white p-2 rounded hover:bg-white/10 transition"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="菜单"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* 移动端下拉菜单 */}
        {mobileOpen && (
          <ul className="md:hidden mt-4 flex flex-col gap-1 glass-card rounded-xl p-2">
            {routes.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(r.href)
                      ? 'bg-[#E50914] text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}
