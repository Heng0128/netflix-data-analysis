import VisualizationSection from '@/components/visualization-section';
import { getAllData } from '@/lib/netflix-data';

export const metadata = {
  title: '数据可视化',
  description: '9 张交互式 ECharts 图表全景展示 Netflix 内容生态：类型分布、评分分布、年度趋势、时长分布、国家相关性等。',
};

export default function VisualizationPage() {
  const { chartData } = getAllData();

  return (
    <main>
      <VisualizationSection chartData={chartData} />
    </main>
  );
}
