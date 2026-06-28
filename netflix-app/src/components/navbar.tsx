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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-black/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white font-bold text-sm">
              N
            </div>
            <span className="text-white font-semibold text-lg hidden sm:block">Netflix 分析</span>
          </div>
          <div className="flex gap-1 sm:gap-2 overflow-x-auto">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`px-2 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  active === s.id
                    ? 'bg-red-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
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
