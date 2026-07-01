import * as echarts from 'echarts';
import type { ChartData } from './netflix-data';
import { getBaseOption, getAxisStyle, CHART_COLORS } from '@/components/charts';

const BASE_OPTION = getBaseOption();
const AXIS_STYLE = getAxisStyle();

const DONUT_COLORS = [
  '#E50914',
  '#FFD700',
  '#FFC000',
  '#B81D24',
  '#CC8B3C',
  '#FFEB3B',
];

const TREEMAP_COLORS = [
  '#E50914',
  '#FFD700',
  '#FFC000',
  '#B81D24',
  '#CC8B3C',
  '#FFEB3B',
];

const CORRELATION_COUNTRIES = [
  'United States',
  'India',
  'United Kingdom',
  'Canada',
  'France',
];

export function getPieOption(
  typeDistribution: ChartData['typeDistribution'],
): echarts.EChartsOption {
  return {
    ...BASE_OPTION,
    tooltip: { ...BASE_OPTION.tooltip, trigger: 'item' as const },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 8, borderColor: '#000', borderWidth: 2 },
        label: { show: true, color: '#fff', formatter: '{b}: {d}%' },
        data: typeDistribution.map((d, i) => ({
          ...d,
          itemStyle: { color: i === 0 ? CHART_COLORS.primary : '#141414' },
        })),
      },
    ],
  };
}

export function getDonutOption(
  ratingDistribution: ChartData['ratingDistribution'],
): echarts.EChartsOption {
  return {
    ...BASE_OPTION,
    tooltip: { ...BASE_OPTION.tooltip, trigger: 'item' as const },
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 8, borderColor: '#000', borderWidth: 2 },
        label: { show: true, color: '#fff', formatter: '{b}: {c}' },
        data: ratingDistribution.slice(0, 6).map((d, i) => ({
          name: d.name,
          value: d.value,
          itemStyle: { color: DONUT_COLORS[i] || '#564d4d' },
        })),
      },
    ],
  };
}

export function getLineOption(
  yearlyTrends: ChartData['yearlyTrends'],
): echarts.EChartsOption {
  return {
    ...BASE_OPTION,
    ...AXIS_STYLE,
    xAxis: {
      ...AXIS_STYLE.xAxis,
      type: 'category',
      data: yearlyTrends.map((d) => d.year),
    },
    yAxis: { ...AXIS_STYLE.yAxis, type: 'value' },
    series: [
      {
        name: 'Movie',
        type: 'line',
        smooth: true,
        data: yearlyTrends.map((d) => d.movies),
        itemStyle: { color: CHART_COLORS.primary },
        areaStyle: { color: 'rgba(229,9,20,0.2)' },
      },
      {
        name: 'TV Show',
        type: 'line',
        smooth: true,
        data: yearlyTrends.map((d) => d.tvShows),
        itemStyle: { color: CHART_COLORS.secondary },
        areaStyle: { color: 'rgba(255,215,0,0.2)' },
      },
    ],
    legend: { textStyle: { color: '#fff' }, top: 0 },
  };
}

export function getHistogramOption(
  durationHistogram: ChartData['durationHistogram'],
): echarts.EChartsOption {
  return {
    ...BASE_OPTION,
    ...AXIS_STYLE,
    xAxis: {
      ...AXIS_STYLE.xAxis,
      type: 'category',
      data: durationHistogram.map((d) => d.range),
    },
    yAxis: { ...AXIS_STYLE.yAxis, type: 'value' },
    series: [
      {
        type: 'bar',
        data: durationHistogram.map((d) => d.count),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: CHART_COLORS.primary },
            { offset: 1, color: CHART_COLORS.secondary },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
        barWidth: '60%',
      },
    ],
  };
}

export function getScatterOption(
  scatterData: ChartData['scatterData'],
): echarts.EChartsOption {
  return {
    ...BASE_OPTION,
    xAxis: {
      type: 'value',
      name: 'Year',
      nameTextStyle: { color: '#888' },
      axisLine: { lineStyle: { color: '#333' } },
      axisLabel: { color: '#888' },
      splitLine: { lineStyle: { color: '#222', type: 'dashed' as const } },
    },
    yAxis: {
      type: 'value',
      name: 'Duration (min)',
      nameTextStyle: { color: '#888' },
      axisLine: { lineStyle: { color: '#333' } },
      axisLabel: { color: '#888' },
      splitLine: { lineStyle: { color: '#222', type: 'dashed' as const } },
    },
    series: [
      {
        type: 'scatter',
        symbolSize: 6,
        data: scatterData.map((d) => [d.x, d.y]),
        itemStyle: { color: 'rgba(229,9,20,0.6)' },
      },
    ],
    tooltip: {
      ...BASE_OPTION.tooltip,
      trigger: 'item' as const,
      formatter: (p: echarts.TooltipComponentFormatterCallbackParams) => {
        const params = Array.isArray(p) ? p[0] : p;
        const [x, y] = (params.data as number[]) ?? [];
        return `${x} - ${y} min`;
      },
    },
  };
}

export function getHeatmapOption(
  correlationMatrix: ChartData['correlationMatrix'],
): echarts.EChartsOption {
  return {
    ...BASE_OPTION,
    xAxis: {
      type: 'category',
      data: CORRELATION_COUNTRIES,
      axisLine: { lineStyle: { color: '#333' } },
      axisLabel: { color: '#888', rotate: 30, fontSize: 10 },
    },
    yAxis: {
      type: 'category',
      data: CORRELATION_COUNTRIES,
      axisLine: { lineStyle: { color: '#333' } },
      axisLabel: { color: '#888', fontSize: 10 },
    },
    visualMap: {
      min: -1,
      max: 1,
      calculable: true,
      textStyle: { color: '#fff', fontSize: 10 },
      inRange: {
        color: [
          '#FFC000',
          '#CC8B3C',
          '#FFEB3B',
          '#FFD700',
          '#E50914',
          '#B81D24',
          '#831a1a',
          '#564d4d',
          '#3d3d3d',
          '#2a2a2a',
        ],
      },
    },
    series: [
      {
        type: 'heatmap',
        data: correlationMatrix.flatMap(
          (row, i) =>
            row.map((v, j) => [j, i, v] as [number, number, number]),
        ),
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' },
        },
        label: { show: true, color: '#fff', fontSize: 10 },
      },
    ],
  };
}

export function getRadarOption(
  radarData: ChartData['radarData'],
): echarts.EChartsOption {
  const maxValue = Math.max(...radarData.map((x) => x.value)) * 1.2;
  return {
    ...BASE_OPTION,
    radar: {
      indicator: radarData.map((d) => ({ name: d.country, max: maxValue })),
      axisName: { color: '#888', fontSize: 10 },
      splitArea: {
        areaStyle: {
          color: ['rgba(229,9,20,0.05)', 'rgba(229,9,20,0.1)'],
        },
      },
      axisLine: { lineStyle: { color: '#333' } },
      splitLine: { lineStyle: { color: '#222' } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: radarData.map((d) => d.value),
            name: 'Content',
            itemStyle: { color: CHART_COLORS.primary },
            areaStyle: { color: 'rgba(229,9,20,0.3)' },
            lineStyle: { width: 2 },
          },
        ],
      },
    ],
  };
}

export function getStackedAreaOption(
  stackedAreaData: ChartData['stackedAreaData'],
): echarts.EChartsOption {
  return {
    ...BASE_OPTION,
    ...AXIS_STYLE,
    xAxis: {
      ...AXIS_STYLE.xAxis,
      type: 'category',
      data: stackedAreaData.map((d) => d.year),
    },
    yAxis: { ...AXIS_STYLE.yAxis, type: 'value' },
    series: [
      {
        name: 'Movie',
        type: 'line',
        smooth: true,
        stack: 'Total',
        areaStyle: { color: 'rgba(229,9,20,0.5)' },
        itemStyle: { color: CHART_COLORS.primary },
        data: stackedAreaData.map((d) => d.movies),
      },
      {
        name: 'TV Show',
        type: 'line',
        smooth: true,
        stack: 'Total',
        areaStyle: { color: 'rgba(255,215,0,0.5)' },
        itemStyle: { color: CHART_COLORS.secondary },
        data: stackedAreaData.map((d) => d.tvShows),
      },
    ],
    legend: { textStyle: { color: '#fff' }, top: 0 },
  };
}

export function getTreemapOption(
  treemapData: ChartData['treemapData'],
): echarts.EChartsOption {
  return {
    ...BASE_OPTION,
    series: [
      {
        type: 'treemap',
        data: treemapData.map((d, i) => ({
          name: d.name,
          value: d.value,
          itemStyle: { color: TREEMAP_COLORS[i] || '#564d4d' },
        })),
        label: {
          show: true,
          formatter: '{b}\n{c}',
          color: '#fff',
          fontSize: 12,
        },
        breadcrumb: { show: false },
      } as echarts.TreemapSeriesOption,
    ],
  };
}

export interface ChartConfig {
  title: string;
  option: echarts.EChartsOption;
}

export function getAllChartConfigs(chartData: ChartData): ChartConfig[] {
  return [
    { title: '内容类型分布', option: getPieOption(chartData.typeDistribution) },
    { title: '评分分布', option: getDonutOption(chartData.ratingDistribution) },
    { title: '年度趋势', option: getLineOption(chartData.yearlyTrends) },
    { title: '电影时长分布', option: getHistogramOption(chartData.durationHistogram) },
    { title: '年份与时长关系', option: getScatterOption(chartData.scatterData) },
    { title: '国家相关性热力图', option: getHeatmapOption(chartData.correlationMatrix) },
    { title: '主要内容国家', option: getRadarOption(chartData.radarData) },
    { title: '堆叠面积图', option: getStackedAreaOption(chartData.stackedAreaData) },
    { title: '国家内容占比', option: getTreemapOption(chartData.treemapData) },
  ];
}
