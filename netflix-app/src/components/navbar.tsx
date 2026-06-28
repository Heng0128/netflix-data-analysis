'use client';

import { useState, useEffect } from 'react';

const sections = [
  { id: 'hero', label: '首页' },
  { id: 'overview', label: '概览' },
  { id: 'analysis', label: '分析' },
  { id: 'code', label: '代码' },
  { id: 'visualization', label: '可视化' },
  { id: 'conclusion', label: '结论' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const scrollPos = window.scrollY + 100;

      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el && el.offsetTop <= scrollPos) {
          setActive(sec.id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-black/90 backdrop-blur-xl shadow-lg shadow-black/50 border-b border-white/5'
        : 'bg-gradient-to-b from-black/60 to-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-red-600/30">
              N
            </div>
            <span className="text-white font-bold text-lg hidden sm:block tracking-tight">
              Netflix <span className="text-red-500">分析</span>
            </span>
          </div>
          <div className="flex gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`nav-btn ${active === s.id ? 'nav-btn-active' : 'nav-btn-inactive'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
