import type { NetflixStats } from '@/lib/netflix-data';
import PageHeader from '@/components/page-header';

interface Props {
  stats: NetflixStats;
}

export default function ConclusionSection({ stats }: Props) {
  const takeaways = [
    {
      title: '内容策略',
      desc: '电影主导（70%+），但剧集投入持续上升，反映 Netflix 由量向质的战略转向。',
    },
    {
      title: '市场布局',
      desc: '美国内容领先，但印度、韩国等市场增长迅速，本土化是全球化关键。',
    },
    {
      title: '未来趋势',
      desc: '短剧、纪录片、国际合制将持续走高，数据驱动决策贯穿内容生命周期。',
    },
  ];

  return (
    <section className="nfl-bg-radial min-h-screen pt-28 pb-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        <PageHeader
          eyebrow="Conclusion"
          title="结论与展望"
          subtitle="数据驱动的洞察总结"
        />

        {/* 主结论卡 */}
        <div className="glass-card glass-card-hover rounded-2xl p-8 sm:p-10 mb-8">
          <div className="text-5xl font-extrabold mb-6 bg-gradient-to-br from-[#E50914] to-[#B20710] bg-clip-text text-transparent">
            {stats.total.toLocaleString()}+
          </div>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            通过对{' '}
            <span className="text-[#E50914] font-semibold">
              {stats.total.toLocaleString()}
            </span>{' '}
            条 Netflix 内容的深度分析，我们揭示了流媒体时代的内容趋势：
            <span className="text-white font-semibold">电影主导、剧集崛起、美国领先</span>。
          </p>
          <p className="text-gray-400 leading-relaxed">
            数据驱动决策，理解内容分布是优化推荐算法和内容投资的关键。
            未来趋势指向更多国际内容和短剧的制作。
          </p>
        </div>

        {/* 三栏要点 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {takeaways.map((t, i) => (
            <div
              key={t.title}
              className="glass-card glass-card-hover rounded-2xl p-6"
            >
              <div className="text-[#E50914] font-bold text-sm mb-2">
                0{i + 1}
              </div>
              <h3 className="text-white font-semibold mb-2">{t.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>

        {/* 页脚信息 */}
        <div className="text-center text-gray-500 text-xs sm:text-sm glass-card rounded-xl py-4 px-6">
          数据来源：Netflix Titles Dataset &nbsp;|&nbsp; 分析工具：Python + ECharts
        </div>
      </div>
    </section>
  );
}
