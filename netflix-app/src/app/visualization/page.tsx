'use client';

import { useEffect, useRef } from 'react';
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  DoughnutController,
  LineController,
  BarController,
  PolarAreaController,
  RadarController,
} from 'chart.js';

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  DoughnutController,
  LineController,
  BarController,
  PolarAreaController,
  RadarController
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

const chartData = [
  { num: '01', icon: 'pie-chart', type: '环形图', title: '电影 vs 电视节目占比', subtitle: 'Netflix 内容类型整体分布' },
  { num: '02', icon: 'chart-line', type: '折线图', title: '历年内容上架趋势', subtitle: '2008-2021 年 Netflix 新增内容数量' },
  { num: '03', icon: 'layer-group', type: '面积图', title: '内容发行年份分布', subtitle: '1980-2021 年发行的内容数量' },
  { num: '04', icon: 'globe', type: '水平柱状图', title: 'Top 10 内容制作国家/地区', subtitle: '按主要制作国统计内容数量' },
  { num: '05', icon: 'user-shield', type: '柱状图', title: '年龄评级分布', subtitle: 'Netflix 内容的年龄分级构成' },
  { num: '06', icon: 'clock', type: '直方图', title: '电影时长分布', subtitle: '6,131 部电影按时长区间统计' },
  { num: '07', icon: 'tags', type: '水平柱状图', title: 'Top 10 热门类型', subtitle: '按主类型（listed_in）统计' },
  { num: '08', icon: 'calendar-alt', type: '雷达图', title: '月度上架分布', subtitle: 'Netflix 各月份内容上架数量雷达对比' },
  { num: '09', icon: 'chart-bar', type: '堆叠柱状图', title: '电影 vs 电视节目上架趋势对比', subtitle: '2008-2021 年电影与电视节目新增数量对比' },
];

export default function VisualizationPage() {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const chartsRef = useRef<Chart[]>([]);

  useEffect(() => {
    const charts: Chart[] = [];

    const c1 = canvasRefs.current[0];
    if (c1) {
      charts.push(
        new Chart(c1, {
          type: 'doughnut',
          data: {
            labels: ['电影 (6,131)', '电视节目 (2,676)'],
            datasets: [{
              data: [6131, 2676],
              backgroundColor: ['#E50914', '#F5A623'],
              hoverOffset: 10,
              borderWidth: 0,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '62%',
            plugins: {
              legend: {
                position: 'bottom' as const,
                labels: { padding: 16, font: { size: 12 }, usePointStyle: true, pointStyle: 'circle' },
              },
              tooltip: {
                callbacks: {
                  label: (ctx) => `${ctx.label}: ${ctx.parsed!.toLocaleString()} 部 (${(ctx.parsed! / 8807 * 100).toFixed(1)}%)`,
                },
              },
            },
          },
        })
      );
    }

    const c2 = canvasRefs.current[1];
    if (c2) {
      const ctx = c2.getContext('2d')!;
      charts.push(
        new Chart(c2, {
          type: 'line',
          data: {
            labels: ['2008','2009','2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021'],
            datasets: [{
              label: '新增内容数量',
              data: [1,2,1,13,4,11,25,82,307,518,660,762,570,497],
              borderColor: NF_RED,
              backgroundColor: (context) => {
                const chart = context.chart;
                const { chartArea } = chart;
                if (!chartArea) return 'rgba(229,9,20,0.2)';
                const g = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                g.addColorStop(0, 'rgba(229,9,20,0.3)');
                g.addColorStop(1, 'rgba(229,9,20,0)');
                return g;
              },
              borderWidth: 2.5,
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#fff',
              pointBorderColor: NF_RED,
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { color: NF_GRID } },
              y: {
                grid: { color: NF_GRID },
                title: { display: true, text: '新增数量' },
                beginAtZero: true,
              },
            },
          },
        })
      );
    }

    const c3 = canvasRefs.current[2];
    if (c3) {
      const ctx = c3.getContext('2d')!;
      charts.push(
        new Chart(c3, {
          type: 'line',
          data: {
            labels: Array.from({length: 42}, (_,i) => String(1980 + i)),
            datasets: [{
              label: '发行数量',
              data: [12,14,17,16,21,22,19,25,28,30,33,35,38,42,50,60,75,85,95,110,130,150,175,200,230,260,290,330,380,440,510,590,680,790,910,1030,1150,1280,1400,1500,1450,1350],
              borderColor: '#F5A623',
              backgroundColor: (context) => {
                const chart = context.chart;
                const { chartArea } = chart;
                if (!chartArea) return 'rgba(245,166,35,0.2)';
                const g = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                g.addColorStop(0, 'rgba(245,166,35,0.3)');
                g.addColorStop(1, 'rgba(245,166,35,0)');
                return g;
              },
              borderWidth: 2,
              fill: true,
              tension: 0.25,
              pointRadius: 0,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { color: NF_GRID }, ticks: { maxTicksLimit: 10 } },
              y: {
                grid: { color: NF_GRID },
                title: { display: true, text: '内容数量' },
                beginAtZero: true,
              },
            },
          },
        })
      );
    }

    const c4 = canvasRefs.current[3];
    if (c4) {
      charts.push(
        new Chart(c4, {
          type: 'bar',
          data: {
            labels: ['美国','印度','英国','加拿大','法国','日本','韩国','西班牙','墨西哥','澳大利亚'],
            datasets: [{
              label: '内容数量',
              data: [2818, 972, 419, 226, 195, 186, 177, 134, 115, 87],
              backgroundColor: [
                '#E50914','#F5A623','#E50914','#F5A623','#E50914',
                '#F5A623','#E50914','#F5A623','#E50914','#F5A623'
              ],
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
              x: { grid: { color: NF_GRID }, title: { display: true, text: '内容数量' }, beginAtZero: true },
              y: { grid: { display: false } },
            },
          },
        })
      );
    }

    const c5 = canvasRefs.current[4];
    if (c5) {
      charts.push(
        new Chart(c5, {
          type: 'bar',
          data: {
            labels: ['TV-MA','TV-14','TV-PG','R','PG-13','TV-Y7','PG','TV-Y','TV-G','NR'],
            datasets: [{
              label: '内容数量',
              data: [3207, 2160, 863, 799, 490, 449, 287, 280, 220, 52],
              backgroundColor: [
                '#E50914','#F5A623','#E50914','#F5A623','#E50914',
                '#F5A623','#E50914','#F5A623','#E50914','#F5A623'
              ],
              borderRadius: 6,
              borderSkipped: false,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false } },
              y: { grid: { color: NF_GRID }, title: { display: true, text: '内容数量' }, beginAtZero: true },
            },
          },
        })
      );
    }

    const c6 = canvasRefs.current[5];
    if (c6) {
      charts.push(
        new Chart(c6, {
          type: 'bar',
          data: {
            labels: ['0-20','20-40','40-60','60-80','80-100','100-120','120-140','140-160','160-180','180-200','200+'],
            datasets: [{
              label: '电影数量',
              data: [42, 186, 523, 980, 1456, 1678, 720, 312, 145, 68, 21],
              backgroundColor: '#E50914',
              borderRadius: 4,
              borderSkipped: false,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false }, title: { display: true, text: '时长（分钟）' } },
              y: { grid: { color: NF_GRID }, title: { display: true, text: '电影数量' }, beginAtZero: true },
            },
          },
        })
      );
    }

    const c7 = canvasRefs.current[6];
    if (c7) {
      charts.push(
        new Chart(c7, {
          type: 'bar',
          data: {
            labels: ['纪录片','戏剧','喜剧','惊悚片','动作片','犯罪片','爱情片','冒险片','科幻片','家庭片'],
            datasets: [{
              label: '内容数量',
              data: [879, 785, 653, 528, 496, 420, 356, 298, 245, 212],
              backgroundColor: '#F5A623',
              borderRadius: 4,
              borderSkipped: false,
            }],
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { color: NF_GRID }, title: { display: true, text: '内容数量' }, beginAtZero: true },
              y: { grid: { display: false } },
            },
          },
        })
      );
    }

    const c8 = canvasRefs.current[7];
    if (c8) {
      charts.push(
        new Chart(c8, {
          type: 'radar',
          data: {
            labels: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
            datasets: [{
              label: '上架数量',
              data: [734, 678, 720, 692, 710, 685, 756, 789, 742, 768, 791, 842],
              borderColor: '#E50914',
              backgroundColor: 'rgba(229,9,20,0.25)',
              borderWidth: 2,
              pointBackgroundColor: '#fff',
              pointBorderColor: '#E50914',
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
              fill: true,
              tension: 0.15,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: (ctx) => `${ctx.label}: ${ctx.parsed.r} 部`,
                },
              },
            },
            scales: {
              r: {
                grid: { color: NF_GRID },
                angleLines: { color: NF_GRID },
                pointLabels: {
                  color: 'rgba(255,255,255,0.7)',
                  font: { size: 11 },
                },
                ticks: {
                  color: 'rgba(255,255,255,0.4)',
                  backdropColor: 'transparent',
                  font: { size: 10 },
                },
                beginAtZero: true,
              },
            },
          },
        })
      );
    }

    const c9 = canvasRefs.current[8];
    if (c9) {
      charts.push(
        new Chart(c9, {
          type: 'bar',
          data: {
            labels: ['2008','2009','2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021'],
            datasets: [
              {
                label: '电影',
                data: [1,1,1,12,3,8,20,65,240,385,475,550,390,325],
                backgroundColor: '#E50914',
                borderRadius: 4,
                borderSkipped: false,
              },
              {
                label: '电视节目',
                data: [0,1,0,1,1,3,5,17,67,133,185,212,180,172],
                backgroundColor: '#F5A623',
                borderRadius: 4,
                borderSkipped: false,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top' as const,
                labels: { padding: 14, font: { size: 12 }, usePointStyle: true },
              },
            },
            scales: {
              x: { stacked: true, grid: { display: false } },
              y: { stacked: true, grid: { color: NF_GRID }, title: { display: true, text: '新增数量' }, beginAtZero: true },
            },
          },
        })
      );
    }

    chartsRef.current = charts;

    return () => {
      charts.forEach(c => c.destroy());
    };
  }, []);

  return (
    <section id="visualization" style={{ padding: '64px 24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="section-title">可视化分析 · 9 Charts</div>
      <div className="section-desc">
        从内容类型、时间趋势、地域分布、类型偏好、时长分布等多维度展开可视化探索
      </div>

      <div className="charts-grid">
        {chartData.map((item, index) => (
          <div className="chart-card" key={index}>
            <div className="chart-num">{item.num}</div>
            <div className="chart-icon"><i className={`fas fa-${item.icon}`}></i> {item.type}</div>
            <div className="chart-title">{item.title}</div>
            <div className="chart-subtitle">{item.subtitle}</div>
            <div className="chart-wrap">
              <canvas ref={(el) => { canvasRefs.current[index] = el; }}></canvas>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ background: 'linear-gradient(135deg,#F5A623,#D97706)', borderRadius: '8px', width: '32px', height: '32px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>&#128161;</span>
          数据分析核心发现
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: 'rgba(229,9,20,.06)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ minWidth: '44px', height: '44px', background: 'rgba(229,9,20,.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>&#9312;</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>内容策略：影片为主，快速增长</div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.65)', lineHeight: 1.8 }}>Netflix 以电影（69.6%）为主要内容形式，2015&ndash;2019 年上架量呈指数增长，2019 年达峰值（1,768 部），2020 年因疫情制作停滞下滑约 23%，2021 年已开始回暖。</p>
            </div>
          </div>
          <div style={{ background: 'rgba(74,144,217,.06)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ minWidth: '44px', height: '44px', background: 'rgba(74,144,217,.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>&#9313;</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>内容来源：美国主导，亚洲崛起</div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.65)', lineHeight: 1.8 }}>美国以 2,818 部占绝对主导（32%），印度（972）、英国（419）紧随其后。韩国、日本内容近年显著增加，Netflix 正持续加大亚太本地化内容投资力度。</p>
            </div>
          </div>
          <div style={{ background: 'rgba(245,166,35,.06)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ minWidth: '44px', height: '44px', background: 'rgba(245,166,35,.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>&#9314;</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>内容定级：成熟受众为核心</div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.65)', lineHeight: 1.8 }}>TV-MA（36.4%）与 TV-14（24.5%）合计超 60%，表明 Netflix 以青少年及成年观众为核心目标，家庭向内容（TV-G、TV-PG）占比偏低，不足 10%。</p>
            </div>
          </div>
          <div style={{ background: 'rgba(123,198,126,.06)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ minWidth: '44px', height: '44px', background: 'rgba(123,198,126,.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>&#9315;</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>数据质量：存在字段污染与高缺失</div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.65)', lineHeight: 1.8 }}>发现 3 条记录时长数据误入 rating 字段（74/84/66 min），director 缺失率高达 29.91%（主要为电视节目导演信息缺失）。预处理阶段均已完成修复与填充。</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
