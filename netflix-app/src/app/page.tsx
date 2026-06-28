import Navbar from '@/components/navbar';
import HeroSection from '@/components/hero-section';
import OverviewSection from '@/components/overview-section';
import AnalysisSection from '@/components/analysis-section';
import CodeShowcase from '@/components/code-showcase';
import VisualizationSection from '@/components/visualization-section';
import ConclusionSection from '@/components/conclusion-section';
import RevealProvider from '@/components/reveal-provider';
import { getAllData } from '@/lib/netflix-data';

export default function Home() {
  const { stats, chartData } = getAllData();

  return (
    <main>
      <RevealProvider>
        <Navbar />
        <HeroSection stats={stats} />
        <OverviewSection stats={stats} />
        <AnalysisSection stats={stats} />
        <CodeShowcase />
        <VisualizationSection chartData={chartData} />
        <ConclusionSection stats={stats} />
      </RevealProvider>
    </main>
  );
}
