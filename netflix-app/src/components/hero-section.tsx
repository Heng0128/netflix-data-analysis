import type { NetflixStats } from '@/lib/netflix-data';
import AnimatedNumber from '@/components/animated-number';

interface Props {
  stats: NetflixStats;
}

export default function HeroSection({ stats }: Props) {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/30 via-black to-black" />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(229,9,20,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(229,9,20,0.1) 0%, transparent 50%)' }} />

      <div className="relative z-10 text-center px-4 py-20 max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Netflix <span className="text-red-600">数据分析</span>
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          基于真实数据集的深度分析，探索流媒体时代的影视内容趋势
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">
              <AnimatedNumber value={stats.total} />
            </div>
            <div className="text-gray-400 text-sm">总内容数</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-3xl md:text-4xl font-bold text-red-500 mb-2">
              <AnimatedNumber value={stats.moviePercent} suffix="%" />
            </div>
            <div className="text-gray-400 text-sm">电影占比</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">
              <AnimatedNumber value={stats.avgDuration} suffix=" min" />
            </div>
            <div className="text-gray-400 text-sm">平均时长</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">
              <AnimatedNumber value={stats.peakYear} />
            </div>
            <div className="text-gray-400 text-sm">峰值年份</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
