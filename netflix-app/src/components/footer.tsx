import Link from 'next/link';

/**
 * 全局页脚：品牌标识 + 快速链接 + 版权信息
 */
export default function Footer() {
  const links = [
    { href: '/overview', label: '数据概览' },
    { href: '/analysis', label: '深度分析' },
    { href: '/code', label: '代码实现' },
    { href: '/visualization', label: '数据可视化' },
    { href: '/conclusion', label: '结论与展望' },
  ];

  return (
    <footer className="relative mt-auto border-t border-white/5 bg-black/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* 品牌 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#E50914] rounded flex items-center justify-center text-white font-bold text-sm pulse-glow">
                N
              </div>
              <span className="text-white font-semibold text-lg">
                Netflix <span className="text-[#E50914]">分析</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              基于真实数据集的 Netflix 流媒体内容深度分析与可视化项目。
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 tracking-wider uppercase">
              快速导航
            </h4>
            <ul className="grid grid-cols-2 gap-2">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-gray-400 hover:text-[#E50914] text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 项目信息 */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 tracking-wider uppercase">
              项目信息
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="text-[#E50914]">●</span>
                数据规模：8,807 条记录
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#E50914]">●</span>
                技术栈：Next.js + ECharts
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#E50914]">●</span>
                数据来源：Netflix Titles Dataset
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Netflix 数据分析 · 数据科学与机器学习课程项目
          </p>
          <p className="text-gray-600 text-xs">
            仅供学习与学术研究使用
          </p>
        </div>
      </div>
    </footer>
  );
}
