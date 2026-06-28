import Link from 'next/link';
import type { NetflixStats } from '@/lib/netflix-data';
import AnimatedNumber from '@/components/animated-number';

interface Props {
  stats: NetflixStats;
}

export default function HeroSection({ stats }: Props) {
  return (
    <section
      id="hero"
      className="nfl-bg-radial min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* 动态网格背景层 */}
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* 顶部聚光渐变 */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/30 via-transparent to-[#0A0A0A]" />

      <div className="relative z-10 text-center px-4 py-20 max-w-5xl mx-auto">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full glass-card text-xs sm:text-sm text-[#E50914] tracking-widest uppercase">
          数据可视化项目
        </div>

        <h1 className="shimmer-text text-5xl sm:text-7xl md:text-8xl font-extrabold mb-6 tracking-tight">
          Netflix
        </h1>
        <p className="text-xl sm:text-2xl text-gray-300 mb-4 max-w-2xl mx-auto">
          基于真实数据集的深度分析
        </p>
        <p className="text-base text-gray-500 mb-12 max-w-xl mx-auto">
          探索流媒体时代的影视内容趋势，揭开 Netflix 全球内容版图
        </p>

        {/* CTA 按钮 */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link
            href="/overview"
            className="bg-[#E50914] hover:bg-[#FF4D58] text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-lg hover:shadow-[0_8px_30px_rgba(229,9,20,0.5)] hover:-translate-y-0.5"
          >
            开始探索
          </Link>
          <Link
            href="/visualization"
            className="glass-card glass-card-hover text-white font-semibold px-8 py-3 rounded-lg"
          >
            查看图表
          </Link>
        </div>

        {/* 关键统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="glass-card glass-card-hover rounded-xl p-6">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">
              <AnimatedNumber value={stats.total} />
            </div>
            <div className="text-gray-400 text-sm">总内容数</div>
          </div>

          <div className="glass-card glass-card-hover rounded-xl p-6">
            <div className="text-3xl md:text-4xl font-bold text-[#E50914] mb-2">
              <AnimatedNumber value={stats.moviePercent} suffix="%" />
            </div>
            <div className="text-gray-400 text-sm">电影占比</div>
          </div>

          <div className="glass-card glass-card-hover rounded-xl p-6">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">
              <AnimatedNumber value={stats.avgDuration} suffix=" min" />
            </div>
            <div className="text-gray-400 text-sm">平均时长</div>
          </div>

          <div className="glass-card glass-card-hover rounded-xl p-6">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">
              <AnimatedNumber value={stats.peakYear} />
            </div>
            <div className="text-gray-400 text-sm">峰值年份</div>
          </div>
        </div>
      </div>

      {/* 向下指示 */}
      <Link
        href="/overview"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/50 hover:text-white transition"
        aria-label="下一页"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </Link>
    </section>
  );
}
