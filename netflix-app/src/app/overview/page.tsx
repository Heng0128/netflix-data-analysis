import OverviewSection from '@/components/overview-section';
import { getAllData } from '@/lib/netflix-data';

export const metadata = {
  title: '数据概览 — Netflix 数据分析',
};

export default function OverviewPage() {
  const { stats } = getAllData();

  return (
    <main className="pt-16">
      <OverviewSection stats={stats} />
    </main>
  );
}
