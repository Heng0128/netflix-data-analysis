import VisualizationSection from '@/components/visualization-section';
import { getAllData } from '@/lib/netflix-data';

export const metadata = {
  title: '可视化图表 — Netflix 数据分析',
};

export default function VisualizationPage() {
  const { chartData } = getAllData();

  return (
    <main>
      <VisualizationSection chartData={chartData} />
    </main>
  );
}
