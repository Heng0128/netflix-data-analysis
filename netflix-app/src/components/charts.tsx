'use client';

import { useEffect, useRef, memo } from 'react';
import * as echarts from 'echarts';

interface ChartProps {
  option: echarts.EChartsOption;
  className?: string;
  height?: number | string;
  loading?: boolean;
  onChartReady?: (chart: echarts.ECharts) => void;
}

function ChartComponent({
  option,
  className = '',
  loading = false,
  onChartReady,
}: ChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | undefined>(undefined);
  const resizeObserver = useRef<ResizeObserver | undefined>(undefined);
  const onChartReadyRef = useRef(onChartReady);

  useEffect(() => {
    onChartReadyRef.current = onChartReady;
  }, [onChartReady]);

  useEffect(() => {
    if (!chartRef.current) return;

    chartInstance.current = echarts.init(chartRef.current, undefined, {
      renderer: 'canvas',
    });

    onChartReadyRef.current?.(chartInstance.current);

    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener('resize', handleResize);

    if (chartRef.current && 'ResizeObserver' in window) {
      resizeObserver.current = new ResizeObserver(() => {
        chartInstance.current?.resize();
      });
      resizeObserver.current.observe(chartRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.current?.disconnect();
      chartInstance.current?.dispose();
      chartInstance.current = undefined;
    };
  }, []);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.setOption(option, { notMerge: false });
    }
  }, [option]);

  useEffect(() => {
    if (chartInstance.current) {
      if (loading) {
        chartInstance.current.showLoading('default', {
          text: '加载中...',
          color: '#E50914',
          textColor: '#fff',
          maskColor: 'rgba(0, 0, 0, 0.8)',
          zlevel: 0,
        });
      } else {
        chartInstance.current.hideLoading();
      }
    }
  }, [loading]);

  return (
    <div
      ref={chartRef}
      className={`w-full h-full ${className}`}
      style={{ minHeight: '200px' }}
    />
  );
}

export const Chart = memo(ChartComponent);

export function getBaseOption(): echarts.EChartsOption {
  return {
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: 'rgba(20,20,20,0.95)',
      borderColor: 'rgba(229,9,20,0.3)',
      borderWidth: 1,
      textStyle: { color: '#fff', fontSize: 12 },
      padding: [8, 12],
      borderRadius: 8,
    },
    textStyle: { color: '#fff' },
    animationDuration: 800,
    animationEasing: 'cubicOut',
  };
}

export function getAxisStyle() {
  return {
    xAxis: {
      type: 'category' as const,
      axisLine: { lineStyle: { color: '#333' } },
      axisLabel: { color: '#888', fontSize: 11 },
      axisTick: { show: false },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value' as const,
      axisLine: { show: false },
      axisLabel: { color: '#888', fontSize: 11 },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#222', type: 'dashed' as const } },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
  };
}

export const CHART_COLORS = {
  primary: '#E50914',
  secondary: '#FFD700',
  accent: '#FFC000',
  warning: '#B81D24',
  success: '#FFEB3B',
  purple: '#CC8B3C',
};

export default Chart;
