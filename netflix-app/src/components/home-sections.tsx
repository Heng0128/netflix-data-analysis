import Link from 'next/link';
import PageHeader from '@/components/page-header';

const TEAM_MEMBERS = [
  {
    avatar: '张',
    name: '张泽浩',
    role: '数据预处理',
    color: 'from-[#E50914] to-[#B20710]',
    tasks: [
      '脏数据修复（rating / duration 字段错位）',
      '缺失值处理与策略性填充',
      '特征提取（duration_num, year_added 等）',
      '数据清洗与导出 clean 版本',
    ],
  },
  {
    avatar: '周',
    name: '周宇恒',
    role: '算法与前端',
    color: 'from-[#4A90D9] to-[#2C5F94]',
    tasks: [
      '随机森林分类算法实现',
      '数据可视化图表生成',
      'Next.js 前端页面开发',
      '分析报告撰写与汇报',
    ],
  },
];

const QUICK_LINKS = [
  {
    href: '/overview',
    eyebrow: 'Overview',
    title: '数据概览',
    desc: '8807 条记录、17 个字段的核心指标一览',
    icon: '📊',
  },
  {
    href: '/analysis',
    eyebrow: 'Analysis',
    title: '深度分析',
    desc: '关键洞察与四大核心发现',
    icon: '🔍',
  },
  {
    href: '/code',
    eyebrow: 'Code',
    title: '代码实现',
    desc: 'Python + Pandas + 随机森林算法',
    icon: '💻',
  },
  {
    href: '/visualization',
    eyebrow: 'Visualization',
    title: '数据可视化',
    desc: '9 张 ECharts 交互式图表',
    icon: '📈',
  },
  {
    href: '/conclusion',
    eyebrow: 'Conclusion',
    title: '结论与展望',
    desc: '数据驱动的策略建议',
    icon: '🎯',
  },
];

const TECH_STACK = [
  { name: 'Next.js 16', desc: 'React 框架' },
  { name: 'TypeScript', desc: '类型安全' },
  { name: 'Tailwind CSS', desc: '原子化样式' },
  { name: 'ECharts 6', desc: '可视化引擎' },
  { name: 'Python', desc: '数据分析' },
  { name: 'Pandas', desc: '数据处理' },
];

export default function HomeSections() {
  return (
    <>
      {/* 小组分工 */}
      <section className="relative py-24 px-4 overflow-hidden bg-[#0A0A0A]">
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto">
          <PageHeader
            eyebrow="Team"
            title="小组分工"
            subtitle="明确任务分工，协同合作完成项目"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TEAM_MEMBERS.map((m) => (
              <div
                key={m.name}
                className="glass-card glass-card-hover rounded-2xl p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}
                  >
                    {m.avatar}
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-semibold">{m.name}</h3>
                    <p className="text-[#E50914] text-sm">{m.role}</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {m.tasks.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-sm text-gray-400">
                      <span className="text-[#E50914] mt-0.5">▸</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 快速入口 */}
      <section className="relative py-24 px-4 overflow-hidden nfl-bg-radial">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <PageHeader
            eyebrow="Explore"
            title="探索内容"
            subtitle="深入了解数据分析的各个环节"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {QUICK_LINKS.map((q) => (
              <Link
                key={q.href}
                href={q.href}
                className="glass-card glass-card-hover rounded-2xl p-6 group block"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{q.icon}</span>
                  <span className="text-[#E50914] text-xs tracking-widest uppercase">
                    {q.eyebrow}
                  </span>
                </div>
                <h3 className="text-white text-xl font-semibold mb-2 group-hover:text-[#E50914] transition-colors">
                  {q.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{q.desc}</p>
                <div className="mt-4 flex items-center text-[#E50914] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  查看详情
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 技术栈 */}
      <section className="relative py-24 px-4 overflow-hidden bg-[#0A0A0A]">
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto">
          <PageHeader
            eyebrow="Tech Stack"
            title="技术栈"
            subtitle="现代全栈技术构建数据可视化平台"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {TECH_STACK.map((t) => (
              <div
                key={t.name}
                className="glass-card glass-card-hover rounded-xl p-5 text-center"
              >
                <div className="text-white font-semibold mb-1">{t.name}</div>
                <div className="text-gray-500 text-xs">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
