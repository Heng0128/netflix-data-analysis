import type { NetflixStats } from '@/lib/netflix-data';

interface Props {
  stats: NetflixStats;
}

export default function AnalysisSection({ stats }: Props) {
  const insights = [
    {
      title: '电影主导市场',
      desc: `电影占比达${stats.moviePercent}%，远超剧集，反映Netflix早期以电影为核心的内容策略`,
      icon: '🎬',
    },
    {
      title: '时长集中趋势',
      desc: `平均时长${stats.avgDuration}分钟，契合通勤观影场景，长篇内容需分段呈现`,
      icon: '⏱️',
    },
    {
      title: '2019年内容爆发',
      desc: '平台在2019年达到内容发布峰值，此后趋于稳定',
      icon: '📈',
    },
    {
      title: '美国绝对领先',
      desc: '美国内容产出量远超其他国家，体现全球化与本土化的平衡策略',
      icon: '🌎',
    },
  ];

  return (
    <section id="analysis" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">关键发现</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {insights.map((insight, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-red-500/50 transition-colors">
              <div className="text-4xl mb-4">{insight.icon}</div>
              <h3 className="text-white text-xl font-semibold mb-3">{insight.title}</h3>
              <p className="text-gray-400 leading-relaxed">{insight.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
