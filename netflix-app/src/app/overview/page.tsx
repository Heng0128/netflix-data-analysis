import OverviewSection from '@/components/overview-section';
import { getAllData } from '@/lib/netflix-data';

export const metadata = {
  title: '数据概览',
  description: 'Netflix 数据集核心指标一览：总内容数量、电影剧集分布、平均时长、峰值年份及 Top 5 内容产出国家。',
};

export default function OverviewPage() {
  const { stats } = getAllData();

  return (
    <main>
      <OverviewSection stats={stats} />
    </main>
  );
}
