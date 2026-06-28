import type { NetflixStats } from '@/lib/netflix-data';

interface Props {
  stats: NetflixStats;
}

export default function OverviewSection({ stats }: Props) {
  const cards = [
    { value: stats.total.toLocaleString(), label: '总内容数量', desc: '涵盖全球Netflix平台影视作品', highlight: true },
    { value: stats.movieCount.toLocaleString(), label: '电影数量', desc: `占比 ${stats.moviePercent}% 的影视内容`, highlight: false },
    { value: stats.tvCount.toLocaleString(), label: '剧集数量', desc: `占比 ${100 - stats.moviePercent}% 的剧集内容`, highlight: false },
    { value: String(stats.avgDuration), label: '平均时长', desc: '电影平均播放时长（分钟）', highlight: false },
    { value: String(stats.peakYear), label: '峰值年份', desc: '内容发布最多年份', highlight: false },
  ];

  return (
    <section id="overview" className="py-24 px-4 bg-black/50 relative">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title reveal">数据概览</h2>
        <p className="text-gray-400 text-center mt-4 mb-12 reveal">全球 Netflix 平台核心数据指标一览</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <div key={card.label} className={`stat-card p-8 reveal`} style={{ transitionDelay: `${i * 60}ms` }}>
              <div className={`text-5xl font-bold mb-4 ${card.highlight ? 'text-red-500' : 'text-white'}`}>
                {card.value}
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">{card.label}</h3>
              <p className="text-gray-400 text-sm">{card.desc}</p>
            </div>
          ))}

          <div className="stat-card p-8 reveal" style={{ transitionDelay: '300ms' }}>
            <h3 className="text-white text-xl font-semibold mb-4">Top 5 国家</h3>
            <ul className="space-y-2.5">
              {stats.topCountries.map((c, i) => (
                <li key={c.country} className="flex items-center justify-between text-gray-300">
                  <span className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-600/20 border border-red-600/40 flex items-center justify-center text-xs text-red-400 font-bold">
                      {i + 1}
                    </span>
                    {c.country}
                  </span>
                  <span className="text-red-400 font-semibold">{c.count.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
