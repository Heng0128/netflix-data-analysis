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

  const pieOption = useMemo(() => ({
    ...baseOption,
    tooltip: { ...baseOption.tooltip, trigger: 'item' },
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

  const donutOption = useMemo(() => ({
    ...baseOption,
    tooltip: { ...baseOption.tooltip, trigger: 'item' },
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

  const lineOption = useMemo(() => ({
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

  const histogramOption = useMemo(() => ({
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

  const scatterOption = useMemo(() => ({
    ...baseOption,
    xAxis: { type: 'value', name: 'Year', nameTextStyle: { color: '#888' }, axisLine: { lineStyle: { color: '#333' } }, axisLabel: { color: '#888' }, splitLine: { lineStyle: { color: '#222' } } },
    yAxis: { type: 'value', name: 'Duration (min)', nameTextStyle: { color: '#888' }, axisLine: { lineStyle: { color: '#333' } }, axisLabel: { color: '#888' }, splitLine: { lineStyle: { color: '#222' } } },
    series: [{
      type: 'scatter',
      symbolSize: 6,
      data: chartData.scatterData.map(d => [d.x, d.y]),
      itemStyle: { color: 'rgba(229,9,20,0.6)' },
    }],
    tooltip: { ...baseOption.tooltip, trigger: 'item', formatter: (p: { data: number[] }) => `${p.data[0]} - ${p.data[1]} min` },
  }), [chartData.scatterData, baseOption]);

  const heatmapOption = useMemo(() => {
    const countries = ['United States', 'India', 'United Kingdom', 'Canada', 'France'];
    return {
      ...baseOption,
      xAxis: { type: 'category', data: countries, axisLine: { lineStyle: { color: '#333' } }, axisLabel: { color: '#888', rotate: 30 } },
      yAxis: { type: 'category', data: countries, axisLine: { lineStyle: { color: '#333' } }, axisLabel: { color: '#888' } },
      visualMap: { min: -1, max: 1, calculable: true, textStyle: { color: '#fff' }, inRange: { color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'] } },
      series: [{ type: 'heatmap', data: chartData.correlationMatrix.map((row, i) => row.map((v, j) => [j, i, v])), emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' } } }],
    };
  }, [chartData.correlationMatrix, baseOption]);

  const radarOption = useMemo(() => ({
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

  const stackedAreaOption = useMemo(() => ({
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

  const treemapOption = useMemo(() => {
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

  const chartMeta = [
    '内容类型分布',
    '评分分布',
    '年度趋势',
    '电影时长分布',
    '年份与时长关系',
    '国家相关性热力图',
    '主要内容国家',
    '堆叠面积图',
    '国家内容占比',
  ];

  const chartOptions = [
    pieOption,
    donutOption,
    lineOption,
    histogramOption,
    scatterOption,
    heatmapOption,
    radarOption,
    stackedAreaOption,
    treemapOption,
  ];

  return (
    <section id="visualization" className="py-24 px-4 bg-gradient-to-b from-black via-gray-950 to-black relative">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="section-title reveal">数据可视化</h2>
        <p className="text-gray-400 text-center mt-4 mb-12 reveal">9 种图表全方位呈现 Netflix 内容数据分布与趋势</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chartMeta.map((title, i) => (
            <div
              key={title}
              className="chart-card p-5 reveal"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-red-600" />
                {title}
              </h3>
              <Chart option={chartOptions[i] as echarts.EChartsOption} className="h-64" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
