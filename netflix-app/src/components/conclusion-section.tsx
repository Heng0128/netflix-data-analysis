import type { NetflixStats } from '@/lib/netflix-data';

interface Props {
  stats: NetflixStats;
}

export default function ConclusionSection({ stats }: Props) {
  return (
    <section id="conclusion" className="py-24 px-4 bg-gradient-to-t from-black via-gray-950 to-black relative">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="section-title reveal">结论</h2>

        <div className="glass-card p-8 md:p-10 mb-12 reveal">
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            通过对 <span className="gradient-text font-bold text-xl">{stats.total.toLocaleString()}</span> 条Netflix内容的深度分析，
            我们揭示了流媒体时代的内容趋势：电影主导、剧集崛起、美国领先。
          </p>
          <p className="text-gray-400 leading-relaxed">
            数据驱动决策，理解内容分布是优化推荐算法和内容投资的关键。
            未来趋势指向更多国际内容和短剧的制作。
          </p>
        </div>

        <div className="reveal flex flex-wrap items-center justify-center gap-3 text-gray-500 text-sm">
          <span className="badge">Netflix Titles Dataset</span>
          <span className="badge">Python</span>
          <span className="badge">ECharts</span>
          <span className="badge">Next.js</span>
        </div>
      </div>
    </section>
  );
}
