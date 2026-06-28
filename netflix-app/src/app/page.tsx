import HeroSection from '@/components/hero-section';
import { getAllData } from '@/lib/netflix-data';

export default function Home() {
  const { stats } = getAllData();

  return (
    <main>
      <HeroSection stats={stats} />
    </main>
  );
}
