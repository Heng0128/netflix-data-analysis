import type { NetflixStats } from '@/lib/netflix-data';
import AnimatedNumber from '@/components/animated-number';

interface Props {
  stats: NetflixStats;
}

export default function HeroSection({ stats }: Props) {
  const heroCards = [
    { value: stats.total, suffix: '', label: '总内容数', highlight: false },
    { value: stats.moviePercent, suffix: '%', label: '电影占比', highlight: true },
    { value: stats.avgDuration, suffix: ' min', label: '平均时长', highlight: false },
    { value: stats.peakYear, suffix: '', label: '峰值年份', highlight: false },
  ];

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/30 via-black to-black" />
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 40%, rgba(229,9,20,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 60%, rgba(229,9,20,0.1) 0%, transparent 50%)' }} />

      <div className="relative z-10 text-center px-4 py-20 max-w-5xl mx-auto">
        <span className="badge animate-fade-in mb-6">基于 8,800+ 条真实数据</span>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up glow-text">
          Netflix <span className="gradient-text">数据分析</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto animate-fade-in-up delay-200">
          基于真实数据集的深度分析，探索流媒体时代的影视内容趋势
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
          {heroCards.map((card, i) => (
            <div
              key={card.label}
              className={`glass-card p-6 animate-scale-in delay-${(i + 1) * 100}`}
            >
              <div className={`text-3xl md:text-4xl font-bold mb-2 ${card.highlight ? 'text-red-500' : 'text-white'}`}>
                <AnimatedNumber value={card.value} suffix={card.suffix} />
              </div>
              <div className="text-gray-400 text-sm">{card.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
        <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
