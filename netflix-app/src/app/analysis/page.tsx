import AnalysisSection from '@/components/analysis-section';
import { getAllData } from '@/lib/netflix-data';

export const metadata = {
  title: '深度分析',
  description: 'Netflix 数据集深度分析：数据集背景、变量说明、四大分析目标与关键发现，探索流媒体内容趋势。',
};

export default function AnalysisPage() {
  const { stats } = getAllData();

  return (
    <main>
      <AnalysisSection stats={stats} />
    </main>
  );
}
