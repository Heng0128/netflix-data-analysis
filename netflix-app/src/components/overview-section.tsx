import type { NetflixStats } from '@/lib/netflix-data';

interface Props {
  stats: NetflixStats;
}

export default function OverviewSection({ stats }: Props) {
  return (
    <section id="overview" className="py-20 px-4 bg-black/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">数据概览</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-red-900/20 to-transparent rounded-xl p-8 border border-red-900/30">
            <div className="text-red-500 text-5xl font-bold mb-4">{stats.total.toLocaleString()}</div>
            <h3 className="text-white text-xl font-semibold mb-2">总内容数量</h3>
            <p className="text-gray-400 text-sm">涵盖全球Netflix平台影视作品</p>
          </div>

          <div className="bg-gradient-to-br from-red-900/20 to-transparent rounded-xl p-8 border border-red-900/30">
            <div className="text-white text-5xl font-bold mb-4">{stats.movieCount.toLocaleString()}</div>
            <h3 className="text-white text-xl font-semibold mb-2">电影数量</h3>
            <p className="text-gray-400 text-sm">占比 {stats.moviePercent}% 的影视内容</p>
          </div>

          <div className="bg-gradient-to-br from-red-900/20 to-transparent rounded-xl p-8 border border-red-900/30">
            <div className="text-white text-5xl font-bold mb-4">{stats.tvCount.toLocaleString()}</div>
            <h3 className="text-white text-xl font-semibold mb-2">剧集数量</h3>
            <p className="text-gray-400 text-sm">占比 {100 - stats.moviePercent}% 的剧集内容</p>
          </div>

          <div className="bg-gradient-to-br from-red-900/20 to-transparent rounded-xl p-8 border border-red-900/30">
            <div className="text-white text-5xl font-bold mb-4">{stats.avgDuration}</div>
            <h3 className="text-white text-xl font-semibold mb-2">平均时长</h3>
            <p className="text-gray-400 text-sm">电影平均播放时长（分钟）</p>
          </div>

          <div className="bg-gradient-to-br from-red-900/20 to-transparent rounded-xl p-8 border border-red-900/30">
            <div className="text-white text-5xl font-bold mb-4">{stats.peakYear}</div>
            <h3 className="text-white text-xl font-semibold mb-2">峰值年份</h3>
            <p className="text-gray-400 text-sm">内容发布最多年份</p>
          </div>

          <div className="bg-gradient-to-br from-red-900/20 to-transparent rounded-xl p-8 border border-red-900/30">
            <h3 className="text-white text-xl font-semibold mb-4">Top 5 国家</h3>
            <ul className="space-y-2">
              {stats.topCountries.map((c, i) => (
                <li key={c.country} className="flex items-center justify-between text-gray-300">
                  <span>{i + 1}. {c.country}</span>
                  <span className="text-red-400">{c.count.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
