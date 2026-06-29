import ConclusionSection from '@/components/conclusion-section';
import { getAllData } from '@/lib/netflix-data';

export const metadata = {
  title: '结论与展望',
  description: 'Netflix 数据分析结论与策略建议：六大关键发现、随机森林模型结果、四大方向商业建议，数据驱动决策。',
};

export default function ConclusionPage() {
  const { stats } = getAllData();

  return (
    <main>
      <ConclusionSection stats={stats} />
    </main>
  );
}
