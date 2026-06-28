import type { NetflixStats } from '@/lib/netflix-data';
import PageHeader from '@/components/page-header';

interface Props {
  stats: NetflixStats;
}

export default function OverviewSection({ stats }: Props) {
  const cards = [
    { value: stats.total.toLocaleString(), label: '总内容数量', desc: '涵盖全球 Netflix 平台影视作品', accent: true },
    { value: stats.movieCount.toLocaleString(), label: '电影数量', desc: `占比 ${stats.moviePercent}% 的影视内容` },
    { value: stats.tvCount.toLocaleString(), label: '剧集数量', desc: `占比 ${100 - stats.moviePercent}% 的剧集内容` },
    { value: String(stats.avgDuration), label: '平均时长', desc: '电影平均播放时长（分钟）' },
    { value: String(stats.peakYear), label: '峰值年份', desc: '内容发布最多年份' },
  ];

  return (
    <section className="nfl-bg-radial min-h-screen pt-28 pb-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <PageHeader
          eyebrow="Overview"
          title="数据概览"
          subtitle="Netflix 数据集的核心指标一览"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div
              key={c.label}
              className="glass-card glass-card-hover rounded-2xl p-8 flex flex-col"
            >
              <div
                className={`text-5xl font-bold mb-4 ${
                  c.accent
                    ? 'bg-gradient-to-br from-[#E50914] to-[#B20710] bg-clip-text text-transparent'
                    : 'text-white'
                }`}
              >
                {c.value}
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">{c.label}</h3>
              <p className="text-gray-400 text-sm">{c.desc}</p>
            </div>
          ))}

          {/* Top 5 国家 */}
          <div className="glass-card glass-card-hover rounded-2xl p-8 md:col-span-2 lg:col-span-3">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#E50914] to-[#B20710] flex items-center justify-center text-white font-bold">
                ★
              </div>
              <h3 className="text-white text-xl font-semibold">Top 5 内容产出国家</h3>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {stats.topCountries.map((c, i) => (
                <li
                  key={c.country}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5"
                >
                  <span className="text-gray-300 text-sm">
                    <span className="text-[#E50914] font-bold mr-2">#{i + 1}</span>
                    {c.country}
                  </span>
                  <span className="text-[#E50914] font-semibold text-sm">
                    {c.count.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
