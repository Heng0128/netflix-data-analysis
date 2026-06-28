import type { NetflixStats } from '@/lib/netflix-data';

interface Props {
  stats: NetflixStats;
}

export default function ConclusionSection({ stats }: Props) {
  return (
    <section id="conclusion" className="py-20 px-4 bg-gradient-to-t from-black via-gray-950 to-black">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-8">结论</h2>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-12">
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            通过对 <span className="text-red-400 font-semibold">{stats.total.toLocaleString()}</span> 条Netflix内容的深度分析，
            我们揭示了流媒体时代的内容趋势：电影主导、剧集崛起、美国领先。
          </p>
          <p className="text-gray-400 leading-relaxed">
            数据驱动决策，理解内容分布是优化推荐算法和内容投资的关键。
            未来趋势指向更多国际内容和短剧的制作。
          </p>
        </div>

        <div className="text-gray-500 text-sm">
          数据来源：Netflix Titles Dataset | 分析工具：Python + ECharts
        </div>
      </div>
    </section>
  );
}
