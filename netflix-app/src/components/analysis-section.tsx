import type { NetflixStats } from '@/lib/netflix-data';
import PageHeader from '@/components/page-header';

interface Props {
  stats: NetflixStats;
}

export default function AnalysisSection({ stats }: Props) {
  const insights = [
    {
      title: '电影主导市场',
      desc: `电影占比达 ${stats.moviePercent}%，远超剧集，反映 Netflix 早期以电影为核心的内容策略。`,
      icon: '🎬',
      stat: `${stats.moviePercent}%`,
    },
    {
      title: '时长集中趋势',
      desc: `平均时长 ${stats.avgDuration} 分钟，契合通勤观影场景，长篇内容需分段呈现。`,
      icon: '⏱️',
      stat: `${stats.avgDuration} min`,
    },
    {
      title: `${stats.peakYear} 年内容爆发`,
      desc: `平台在 ${stats.peakYear} 年达到内容发布峰值，此后趋于稳定，标志流媒体竞争进入新阶段。`,
      icon: '📈',
      stat: `${stats.peakYear}`,
    },
    {
      title: '美国绝对领先',
      desc: '美国内容产出量远超其他国家，体现全球化与本土化的平衡策略。',
      icon: '🌎',
      stat: stats.topCountries[0]?.country ?? '美国',
    },
  ];

  return (
    <section className="nfl-bg-radial min-h-screen pt-28 pb-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <PageHeader
          eyebrow="Analysis"
          title="关键发现"
          subtitle="从数据中提炼的核心洞察"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map((insight) => (
            <div
              key={insight.title}
              className="glass-card glass-card-hover rounded-2xl p-8 flex gap-5"
            >
              <div className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#E50914]/20 to-transparent border border-[#E50914]/30 flex items-center justify-center text-3xl">
                {insight.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <h3 className="text-white text-xl font-semibold">{insight.title}</h3>
                  <span className="text-[#E50914] font-bold text-sm whitespace-nowrap">
                    {insight.stat}
                  </span>
                </div>
                <p className="text-gray-400 leading-relaxed text-sm">{insight.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
