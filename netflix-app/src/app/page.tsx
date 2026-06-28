import HeroSection from '@/components/hero-section';
import HomeSections from '@/components/home-sections';
import { getAllData } from '@/lib/netflix-data';

export default function Home() {
  const { stats } = getAllData();

  return (
    <main className="flex flex-col">
      <HeroSection stats={stats} />
      <HomeSections />
    </main>
  );
}
