import ConclusionSection from '@/components/conclusion-section';
import { getAllData } from '@/lib/netflix-data';

export const metadata = {
  title: '结论与展望 — Netflix 数据分析',
};

export default function ConclusionPage() {
  const { stats } = getAllData();

  return (
    <main className="pt-16">
      <ConclusionSection stats={stats} />
    </main>
  );
}
