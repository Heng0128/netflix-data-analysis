'use client';

import { useEffect, useRef } from 'react';
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
  BarElement,
  RadialLinearScale,
} from 'chart.js';

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
  BarElement,
  RadialLinearScale
);

Chart.defaults.color = 'rgba(255,255,255,0.65)';
Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
Chart.defaults.font.family = "'Segoe UI','Helvetica Neue','Noto Sans SC',Arial,sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15,15,15,0.92)';
Chart.defaults.plugins.tooltip.borderColor = 'rgba(229,9,20,0.35)';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.padding = 12;
Chart.defaults.plugins.tooltip.cornerRadius = 10;
Chart.defaults.plugins.tooltip.titleColor = '#E50914';
Chart.defaults.plugins.tooltip.bodyColor = 'rgba(255,255,255,0.85)';
Chart.defaults.plugins.tooltip.titleFont = { weight: 'bold' as const, size: 13 };
Chart.defaults.plugins.tooltip.displayColors = false;

const NF_RED = '#E50914';
const NF_GRID = 'rgba(255,255,255,0.05)';

function createGradient(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, colorStart: string, colorEnd: string) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, colorStart);
  g.addColorStop(1, colorEnd);
  return g;
}

export default function VisualizationPage() {
  const chartRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const chartsRef = useRef<Chart[]>([]);

  useEffect(() => {
    const charts: Chart[] = [];

    const c1 = chartRefs.current[0];
    if (c1) {
      charts.push(
        new Chart(c1, {
          type: 'doughnut',
          data: {
            labels: ['电影 Movie', '电视节目 TV Show'],
            datasets: [{
              data: [6131, 2676],
              backgroundColor: [NF_RED, 'rgba(74,144,217,0.75)'],
              borderColor: ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.08)'],
              borderWidth: 2,
              hoverOffset: 12,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom', labels: { padding: 16, font: { size: 13 } } },
              tooltip: {
                backgroundColor: 'rgba(15,15,15,0.92)',
                borderColor: NF_RED,
                borderWidth: 1,
                callbacks: {
                  label: (ctx) => `${ctx.label}: ${ctx.parsed.toLocaleString()} 条 (${((ctx.parsed / 8807) * 100).toFixed(1)}%)`,
                },
              },
            },
            cutout: '62%',
          },
        })
      );
    }

    const c2 = chartRefs.current[1];
    if (c2) {
      const ctx2 = c2.getContext('2d')!;
      charts.push(
        new Chart(c2, {
          type: 'line',
          data: {
            labels: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021],
            datasets: [{
              label: '上架内容数',
              data: [2, 2, 1, 13, 3, 11, 24, 82, 429, 1188, 1649, 2016, 1879, 1498],
              borderColor: NF_RED,
              backgroundColor: (context) => {
                const chart = context.chart;
                const { ctx, chartArea } = chart;
                if (!chartArea) return 'rgba(229,9,20,0.2)';
                return createGradient(ctx, 0, chartArea.top, 0, chartArea.bottom, 'rgba(229,9,20,0.35)', 'rgba(229,9,20,0)');
              },
              borderWidth: 2.5,
              fill: true,
              tension: 0.35,
              pointBackgroundColor: NF_RED,
              pointBorderColor: '#fff',
              pointRadius: 4,
              pointHoverRadius: 7,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { color: NF_GRID } },
              y: { grid: { color: NF_GRID }, beginAtZero: true },
            },
          },
        })
      );
    }

    const c3 = chartRefs.current[2];
    if (c3) {
      const ctx3 = c3.getContext('2d')!;
      charts.push(
        new Chart(c3, {
          type: 'line',
          data: {
            labels: [1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021],
            datasets: [{
              label: '发行数量',
              data: [11, 13, 17, 11, 12, 10, 13, 8, 18, 16, 22, 17, 23, 28, 22, 25, 24, 38, 36, 39, 37, 45, 51, 61, 64, 80, 96, 88, 136, 152, 194, 185, 237, 288, 352, 560, 902, 1032, 1147, 1030, 953, 592],
              borderColor: NF_RED,
              backgroundColor: (context) => {
                const chart = context.chart;
                const { ctx, chartArea } = chart;
                if (!chartArea) return 'rgba(229,9,20,0.2)';
                return createGradient(ctx, 0, chartArea.top, 0, chartArea.bottom, 'rgba(229,9,20,0.4)', 'rgba(229,9,20,0)');
              },
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointRadius: 0,
              pointHoverRadius: 5,
              pointBackgroundColor: NF_RED,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { color: NF_GRID }, ticks: { maxTicksLimit: 10 } },
              y: { grid: { color: NF_GRID }, beginAtZero: true },
            },
          },
        })
      );
    }

    const c4 = chartRefs.current[3];
    if (c4) {
      const ctx4 = c4.getContext('2d')!;
      charts.push(
        new Chart(c4, {
          type: 'bar',
          data: {
            labels: ['United States', 'India', 'United Kingdom', 'Canada', 'Japan', 'France', 'South Korea', 'Spain', 'Mexico', 'Australia'],
            datasets: [{
              label: '内容数量',
              data: [3211, 1008, 628, 271, 259, 212, 211, 181, 134, 117],
              backgroundColor: (context) => {
                const chart = context.chart;
                const { chartArea } = chart;
                if (!chartArea) return 'rgba(229,9,20,0.6)';
                return createGradient(ctx4, chartArea.left, 0, chartArea.right, 0, 'rgba(229,9,20,0.8)', 'rgba(229,9,20,0.3)');
              },
              borderRadius: 6,
              borderSkipped: false,
            }],
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { color: NF_GRID } },
              y: { grid: { display: false }, ticks: { font: { size: 11 } } },
            },
          },
        })
      );
    }

    const c5 = chartRefs.current[4];
    if (c5) {
      charts.push(
        new Chart(c5, {
          type: 'bar',
          data: {
            labels: ['TV-MA', 'TV-14', 'TV-PG', 'R', 'PG-13', 'TV-Y7', 'TV-Y', 'PG', 'TV-G', 'NR', 'G', 'TV-Y7-FV', 'NC-17', 'UR'],
            datasets: [{
              label: '数量',
              data: [3214, 2160, 863, 799, 490, 334, 307, 287, 220, 80, 41, 6, 3, 3],
              backgroundColor: [
                '#E50914', '#E50914', '#E50914', '#E50914', '#E50914',
                '#e87d24', '#e87d24', '#e87d24', '#e87d24',
                '#6c757d', '#6c757d', '#e87d24', '#6c757d', '#6c757d',
              ],
              borderRadius: 5,
              borderSkipped: false,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 45 } },
              y: { grid: { color: NF_GRID }, beginAtZero: true },
            },
          },
        })
      );
    }

    const c6 = chartRefs.current[5];
    if (c6) {
      const ctx6 = c6.getContext('2d')!;
      charts.push(
        new Chart(c6, {
          type: 'bar',
          data: {
            labels: ['<30', '30-60', '60-90', '90-120', '120-150', '150-180', '180+'],
            datasets: [{
              label: '电影数量',
              data: [124, 334, 1383, 3092, 936, 213, 48],
              backgroundColor: (context) => {
                const chart = context.chart;
                const { ctx, chartArea } = chart;
                if (!chartArea) return 'rgba(229,9,20,0.6)';
                return createGradient(ctx, 0, chartArea.top, 0, chartArea.bottom, 'rgba(229,9,20,0.85)', 'rgba(229,9,20,0.25)');
              },
              borderRadius: 6,
              borderSkipped: false,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false }, title: { display: true, text: '时长（分钟）', color: '#b3b3b3' } },
              y: { grid: { color: NF_GRID }, beginAtZero: true },
            },
          },
        })
      );
    }

    const c7 = chartRefs.current[6];
    if (c7) {
      const ctx7 = c7.getContext('2d')!;
      charts.push(
        new Chart(c7, {
          type: 'bar',
          data: {
            labels: ['Dramas', 'Comedies', 'Action & Adventure', 'Documentaries', 'International TV Shows', 'Children & Family Movies', 'Crime TV Shows', "Kids' TV", 'Stand-Up Comedy', 'Horror Movies'],
            datasets: [{
              label: '内容数量',
              data: [1600, 1210, 859, 829, 774, 605, 399, 388, 334, 275],
              backgroundColor: (context) => {
                const chart = context.chart;
                const { chartArea } = chart;
                if (!chartArea) return 'rgba(229,9,20,0.6)';
                return createGradient(ctx7, chartArea.left, 0, chartArea.right, 0, 'rgba(229,9,20,0.8)', 'rgba(229,9,20,0.3)');
              },
              borderRadius: 6,
              borderSkipped: false,
            }],
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { color: NF_GRID } },
              y: { grid: { display: false }, ticks: { font: { size: 11 } } },
            },
          },
        })
      );
    }

    const c8 = chartRefs.current[7];
    if (c8) {
      charts.push(
        new Chart(c8, {
          type: 'polarArea',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
              data: [738, 563, 742, 764, 632, 728, 827, 755, 770, 760, 705, 813],
              backgroundColor: [
                'rgba(229,9,20,0.7)', 'rgba(229,9,20,0.45)', 'rgba(229,9,20,0.7)',
                'rgba(229,9,20,0.75)', 'rgba(229,9,20,0.5)', 'rgba(229,9,20,0.65)',
                'rgba(229,9,20,0.85)', 'rgba(229,9,20,0.7)', 'rgba(229,9,20,0.72)',
                'rgba(229,9,20,0.68)', 'rgba(229,9,20,0.6)', 'rgba(229,9,20,0.82)',
              ],
              borderColor: 'rgba(255,255,255,0.06)',
              borderWidth: 2,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              r: {
                grid: { color: NF_GRID },
                ticks: { color: 'rgba(255,255,255,0.4)', backdropColor: 'transparent', font: { size: 10 } },
                angleLines: { color: NF_GRID },
              },
            },
          },
        })
      );
    }

    const c9 = chartRefs.current[8];
    if (c9) {
      charts.push(
        new Chart(c9, {
          type: 'bar',
          data: {
            labels: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021],
            datasets: [
              {
                label: '电影 Movie',
                data: [1, 2, 1, 13, 3, 6, 19, 56, 253, 839, 1237, 1424, 1284, 993],
                backgroundColor: NF_RED,
                borderRadius: 4,
                borderSkipped: false,
              },
              {
                label: '电视节目 TV Show',
                data: [1, 0, 0, 0, 0, 5, 5, 26, 176, 349, 412, 592, 595, 505],
                backgroundColor: 'rgba(74,144,217,0.75)',
                borderRadius: 4,
                borderSkipped: false,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top', labels: { padding: 16, font: { size: 13 }, usePointStyle: true } },
            },
            scales: {
              x: { stacked: true, grid: { display: false } },
              y: { stacked: true, grid: { color: NF_GRID }, beginAtZero: true },
            },
          },
        })
      );
    }

    chartsRef.current = charts;

    return () => {
      charts.forEach((c) => c.destroy());
    };
  }, []);

  return (
    <section id="viz" style={{ padding: '64px 24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="section-title">可视化分析 · 9 Charts</div>
      <div className="section-desc">从内容类型、时间趋势、地域分布、类型偏好、时长分布等多维度展开可视化探索</div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-num">01</div>
          <div className="chart-icon"><i className="fas fa-chart-pie"></i> 环形图</div>
          <div className="chart-title">电影 vs 电视节目占比</div>
          <div className="chart-subtitle">Netflix 内容类型整体分布</div>
          <div className="chart-wrap">
            <canvas ref={(el) => { chartRefs.current[0] = el; }}></canvas>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-num">02</div>
          <div className="chart-icon"><i className="fas fa-chart-line"></i> 折线图</div>
          <div className="chart-title">历年内容上架趋势</div>
          <div className="chart-subtitle">2008-2021 年 Netflix 新增内容数量</div>
          <div className="chart-wrap">
            <canvas ref={(el) => { chartRefs.current[1] = el; }}></canvas>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-num">03</div>
          <div className="chart-icon"><i className="fas fa-chart-area"></i> 面积图</div>
          <div className="chart-title">内容发行年份分布</div>
          <div className="chart-subtitle">1980-2021 年发行的内容数量</div>
          <div className="chart-wrap">
            <canvas ref={(el) => { chartRefs.current[2] = el; }}></canvas>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-num">04</div>
          <div className="chart-icon"><i className="fas fa-chart-bar"></i> 水平柱状图</div>
          <div className="chart-title">Top 10 内容制作国家/地区</div>
          <div className="chart-subtitle">按主要制作国统计内容数量</div>
          <div className="chart-wrap">
            <canvas ref={(el) => { chartRefs.current[3] = el; }}></canvas>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-num">05</div>
          <div className="chart-icon"><i className="fas fa-film"></i> 柱状图</div>
          <div className="chart-title">年龄评级分布</div>
          <div className="chart-subtitle">Netflix 内容的年龄分级构成</div>
          <div className="chart-wrap">
            <canvas ref={(el) => { chartRefs.current[4] = el; }}></canvas>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-num">06</div>
          <div className="chart-icon"><i className="fas fa-clock"></i> 直方图</div>
          <div className="chart-title">电影时长分布</div>
          <div className="chart-subtitle">6,131 部电影按时长区间统计</div>
          <div className="chart-wrap">
            <canvas ref={(el) => { chartRefs.current[5] = el; }}></canvas>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-num">07</div>
          <div className="chart-icon"><i className="fas fa-tags"></i> 水平柱状图</div>
          <div className="chart-title">Top 10 热门类型</div>
          <div className="chart-subtitle">按主类型（listed_in）统计</div>
          <div className="chart-wrap">
            <canvas ref={(el) => { chartRefs.current[6] = el; }}></canvas>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-num">08</div>
          <div className="chart-icon"><i className="fas fa-calendar"></i> 极坐标图</div>
          <div className="chart-title">月度上架分布</div>
          <div className="chart-subtitle">Netflix 各月份内容上架数量</div>
          <div className="chart-wrap">
            <canvas ref={(el) => { chartRefs.current[7] = el; }}></canvas>
          </div>
        </div>

        <div className="chart-card full-width">
          <div className="chart-num">09</div>
          <div className="chart-icon"><i className="fas fa-layer-group"></i> 堆叠柱状图</div>
          <div className="chart-title">电影 vs 电视节目上架趋势对比</div>
          <div className="chart-subtitle">2008-2021 年电影与电视节目新增数量对比</div>
          <div className="chart-wrap tall">
            <canvas ref={(el) => { chartRefs.current[8] = el; }}></canvas>
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '32px' }}>
        <span style={{ background: 'linear-gradient(135deg,#E50914,#B20710)', borderRadius: '8px', width: '32px', height: '32px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>&#128161;</span>
        数据分析核心发现
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '16px' }}>
        <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: '12px', padding: '20px', borderLeft: '3px solid #E50914' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: '#E50914' }}>① 内容策略：影片为主，快速增长</div>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.7)', lineHeight: 1.8 }}>Netflix 以电影（69.6%）为主要内容形式，2015–2019 年上架量呈指数增长，2019 年达峰值（1,768 部），2020 年因疫情制作停滞下滑约 23%，2021 年已开始回暖。</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: '12px', padding: '20px', borderLeft: '3px solid #4A90D9' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: '#4A90D9' }}>② 内容来源：美国主导，亚洲崛起</div>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.7)', lineHeight: 1.8 }}>美国以 2,818 部占绝对主导（32%），印度（972）、英国（419）紧随其后。韩国、日本内容近年显著增加，Netflix 正持续加大亚太本地化内容投资力度。</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: '12px', padding: '20px', borderLeft: '3px solid #F5A623' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: '#F5A623' }}>③ 内容定级：成熟受众为核心</div>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.7)', lineHeight: 1.8 }}>TV-MA（36.4%）与 TV-14（24.5%）合计超 60%，表明 Netflix 以青少年及成年观众为核心目标，家庭向内容（TV-G、TV-PG）占比偏低，不足 10%。</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: '12px', padding: '20px', borderLeft: '3px solid #7BC67E' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: '#7BC67E' }}>④ 数据质量：存在字段污染与高缺失</div>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.7)', lineHeight: 1.8 }}>发现 3 条记录时长数据误入 rating 字段（74/84/66 min），director 缺失率高达 29.91%（主要为电视节目导演信息缺失）。预处理阶段均已完成修复与填充。</p>
        </div>
      </div>
    </section>
  );
}
