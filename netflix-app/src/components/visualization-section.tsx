'use client';

import { useMemo } from 'react';
import { Chart } from './charts';
import PageHeader from '@/components/page-header';
import type { ChartData } from '@/lib/netflix-data';
import { getAllChartConfigs } from '@/lib/chart-configs';

interface Props {
  chartData: ChartData;
}

export default function VisualizationSection({ chartData }: Props) {
  const charts = useMemo(() => getAllChartConfigs(chartData), [chartData]);

  return (
    <section className="nfl-bg-radial min-h-screen pt-28 pb-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <PageHeader
          eyebrow="Visualization"
          title="数据可视化"
          subtitle="9 张图表全景展示 Netflix 内容生态"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {charts.map((c) => (
            <div
              key={c.title}
              className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col"
            >
              <h3 className="text-white text-base font-medium mb-4 flex items-center gap-2 shrink-0">
                <span className="w-1 h-4 rounded-full bg-[#E50914]" />
                {c.title}
              </h3>
              <div className="flex-1 min-h-[288px]">
                <Chart option={c.option} className="h-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
