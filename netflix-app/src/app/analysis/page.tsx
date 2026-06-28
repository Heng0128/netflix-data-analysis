import AnalysisSection from '@/components/analysis-section';
import { getAllData } from '@/lib/netflix-data';

export const metadata = {
  title: '深度分析 — Netflix 数据分析',
};

export default function AnalysisPage() {
  const { stats } = getAllData();

  return (
    <main>
      <AnalysisSection stats={stats} />
    </main>
  );
}
