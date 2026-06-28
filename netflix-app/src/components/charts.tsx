'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface ChartProps {
  option: echarts.EChartsOption;
  className?: string;
}

export default function Chart({ option, className = '' }: ChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | undefined>(undefined);

  useEffect(() => {
    if (!chartRef.current) return;

    chartInstance.current = echarts.init(chartRef.current, undefined, {
      renderer: 'canvas',
    });

    chartInstance.current.setOption(option);

    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
    };
  }, [option]);

  return <div ref={chartRef} className={`w-full h-full ${className}`} />;
}

export function getBaseOption(): echarts.EChartsOption {
  return {
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: 'rgba(20,20,20,0.95)',
      borderColor: 'rgba(229,9,20,0.3)',
      textStyle: { color: '#fff' },
    },
    textStyle: { color: '#fff' },
  };
}

export function getAxisStyle() {
  return {
    xAxis: {
      type: 'category' as const,
      axisLine: { lineStyle: { color: '#333' } },
      axisLabel: { color: '#888' },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value' as const,
      axisLine: { lineStyle: { color: '#333' } },
      axisLabel: { color: '#888' },
      splitLine: { lineStyle: { color: '#222' } },
    },
  };
}
