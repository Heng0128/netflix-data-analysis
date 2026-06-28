'use client';

import { useMemo } from 'react';
import Chart, { getBaseOption, getAxisStyle } from './charts';
import type { ChartData } from '@/lib/netflix-data';
import * as echarts from 'echarts';

interface Props {
  chartData: ChartData;
}

const DONUT_COLORS = ['#E50914', '#B81D24', '#564d4d', '#333333', '#1a1a1a', '#0d0d0d'];

export default function VisualizationSection({ chartData }: Props) {
  const baseOption = getBaseOption();
  const axisStyle = getAxisStyle();

  const pieOption = useMemo<echarts.EChartsOption>(() => ({
    ...baseOption,
    tooltip: { ...baseOption.tooltip, trigger: 'item' as const },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 8, borderColor: '#000', borderWidth: 2 },
      label: { show: true, color: '#fff', formatter: '{b}: {d}%' },
      data: chartData.typeDistribution.map((d, i) => ({
        ...d,
        itemStyle: { color: i === 0 ? '#E50914' : '#141414' },
      })),
    }],
  }), [chartData.typeDistribution]);

  const donutOption = useMemo<echarts.EChartsOption>(() => ({
    ...baseOption,
    tooltip: { ...baseOption.tooltip, trigger: 'item' as const },
    series: [{
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 8, borderColor: '#000', borderWidth: 2 },
      label: { show: true, color: '#fff', formatter: '{b}: {c}' },
      data: chartData.ratingDistribution.slice(0, 6).map((d, i) => ({
        name: d.name,
        value: d.value,
        itemStyle: { color: DONUT_COLORS[i] || '#564d4d' },
      })),
    }],
  }), [chartData.ratingDistribution]);

  const lineOption = useMemo<echarts.EChartsOption>(() => ({
    ...baseOption,
    ...axisStyle,
    xAxis: { ...axisStyle.xAxis, type: 'category', data: chartData.yearlyTrends.map(d => d.year) },
    yAxis: { ...axisStyle.yAxis, type: 'value' },
    series: [
      { name: 'Movie', type: 'line', smooth: true, data: chartData.yearlyTrends.map(d => d.movies), itemStyle: { color: '#E50914' }, areaStyle: { color: 'rgba(229,9,20,0.2)' } },
      { name: 'TV Show', type: 'line', smooth: true, data: chartData.yearlyTrends.map(d => d.tvShows), itemStyle: { color: '#564d4d' }, areaStyle: { color: 'rgba(86,77,77,0.2)' } },
    ],
    legend: { textStyle: { color: '#fff' } },
  }), [chartData.yearlyTrends, axisStyle]);

  const histogramOption = useMemo<echarts.EChartsOption>(() => ({
    ...baseOption,
    ...axisStyle,
    xAxis: { ...axisStyle.xAxis, type: 'category', data: chartData.durationHistogram.map(d => d.range) },
    yAxis: { ...axisStyle.yAxis, type: 'value' },
    series: [{
      type: 'bar',
      data: chartData.durationHistogram.map(d => d.count),
      itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#E50914' }, { offset: 1, color: '#564d4d' }]) },
      barWidth: '60%',
    }],
  }), [chartData.durationHistogram, axisStyle]);

  const scatterOption = useMemo<echarts.EChartsOption>(() => ({
    ...baseOption,
    xAxis: { type: 'value', name: 'Year', nameTextStyle: { color: '#888' }, axisLine: { lineStyle: { color: '#333' } }, axisLabel: { color: '#888' }, splitLine: { lineStyle: { color: '#222' } } },
    yAxis: { type: 'value', name: 'Duration (min)', nameTextStyle: { color: '#888' }, axisLine: { lineStyle: { color: '#333' } }, axisLabel: { color: '#888' }, splitLine: { lineStyle: { color: '#222' } } },
    series: [{
      type: 'scatter',
      symbolSize: 6,
      data: chartData.scatterData.map(d => [d.x, d.y]),
      itemStyle: { color: 'rgba(229,9,20,0.6)' },
    }],
    tooltip: { ...baseOption.tooltip, trigger: 'item' as const, formatter: (p: echarts.TooltipComponentFormatterCallbackParams) => {
      const params = Array.isArray(p) ? p[0] : p;
      const [x, y] = (params.data as number[]) ?? [];
      return `${x} - ${y} min`;
    } },
  }), [chartData.scatterData, baseOption]);

  const heatmapOption = useMemo<echarts.EChartsOption>(() => {
    const countries = ['United States', 'India', 'United Kingdom', 'Canada', 'France'];
    return {
      ...baseOption,
      xAxis: { type: 'category', data: countries, axisLine: { lineStyle: { color: '#333' } }, axisLabel: { color: '#888', rotate: 30 } },
      yAxis: { type: 'category', data: countries, axisLine: { lineStyle: { color: '#333' } }, axisLabel: { color: '#888' } },
      visualMap: { min: -1, max: 1, calculable: true, textStyle: { color: '#fff' }, inRange: { color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'] } },
      series: [{ type: 'heatmap', data: chartData.correlationMatrix.flatMap((row, i) => row.map((v, j) => [j, i, v] as [number, number, number])), emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' } } }],
    };
  }, [chartData.correlationMatrix, baseOption]);

  const radarOption = useMemo<echarts.EChartsOption>(() => ({
    ...baseOption,
    radar: {
      indicator: chartData.radarData.map(d => ({ name: d.country, max: Math.max(...chartData.radarData.map(x => x.value)) * 1.2 })),
      axisName: { color: '#888' },
      splitArea: { areaStyle: { color: ['rgba(229,9,20,0.05)', 'rgba(229,9,20,0.1)'] } },
      axisLine: { lineStyle: { color: '#333' } },
      splitLine: { lineStyle: { color: '#222' } },
    },
    series: [{
      type: 'radar',
      data: [{ value: chartData.radarData.map(d => d.value), name: 'Content', itemStyle: { color: '#E50914' }, areaStyle: { color: 'rgba(229,9,20,0.3)' } }],
    }],
  }), [chartData.radarData, baseOption]);

  const stackedAreaOption = useMemo<echarts.EChartsOption>(() => ({
    ...baseOption,
    ...axisStyle,
    xAxis: { ...axisStyle.xAxis, type: 'category', data: chartData.stackedAreaData.map(d => d.year) },
    yAxis: { ...axisStyle.yAxis, type: 'value' },
    series: [
      { name: 'Movie', type: 'line', smooth: true, stack: 'Total', areaStyle: { color: 'rgba(229,9,20,0.5)' }, itemStyle: { color: '#E50914' }, data: chartData.stackedAreaData.map(d => d.movies) },
      { name: 'TV Show', type: 'line', smooth: true, stack: 'Total', areaStyle: { color: 'rgba(86,77,77,0.5)' }, itemStyle: { color: '#564d4d' }, data: chartData.stackedAreaData.map(d => d.tvShows) },
    ],
    legend: { textStyle: { color: '#fff' } },
  }), [chartData.stackedAreaData, axisStyle]);

  const treemapOption = useMemo<echarts.EChartsOption>(() => {
    const treemapColors = ['#E50914', '#B81D24', '#831a1a', '#564d4d', '#3d3d3d', '#2a2a2a'];
    return {
      ...baseOption,
      series: [{
        type: 'treemap',
        data: chartData.treemapData.map((d, i) => ({ name: d.name, value: d.value, itemStyle: { color: treemapColors[i] || '#564d4d' } })),
        label: { show: true, formatter: '{b}', color: '#fff' },
        breadcrumb: { show: false },
      }],
    };
  }, [chartData.treemapData, baseOption]);

  return (
    <section id="visualization" className="py-20 px-4 bg-gradient-to-b from-black via-gray-950 to-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">数据可视化</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
            <h3 className="text-white text-lg font-medium mb-4">内容类型分布</h3>
            <Chart option={pieOption} className="h-64" />
          </div>

          <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
            <h3 className="text-white text-lg font-medium mb-4">评分分布</h3>
            <Chart option={donutOption} className="h-64" />
          </div>

          <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
            <h3 className="text-white text-lg font-medium mb-4">年度趋势</h3>
            <Chart option={lineOption} className="h-64" />
          </div>

          <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
            <h3 className="text-white text-lg font-medium mb-4">电影时长分布</h3>
            <Chart option={histogramOption} className="h-64" />
          </div>

          <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
            <h3 className="text-white text-lg font-medium mb-4">年份与时长关系</h3>
            <Chart option={scatterOption} className="h-64" />
          </div>

          <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
            <h3 className="text-white text-lg font-medium mb-4">国家相关性热力图</h3>
            <Chart option={heatmapOption} className="h-64" />
          </div>

          <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
            <h3 className="text-white text-lg font-medium mb-4">主要内容国家</h3>
            <Chart option={radarOption} className="h-64" />
          </div>

          <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
            <h3 className="text-white text-lg font-medium mb-4">堆叠面积图</h3>
            <Chart option={stackedAreaOption} className="h-64" />
          </div>

          <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
            <h3 className="text-white text-lg font-medium mb-4">国家内容占比</h3>
            <Chart option={treemapOption} className="h-64" />
          </div>
        </div>
      </div>
    </section>
  );
}
