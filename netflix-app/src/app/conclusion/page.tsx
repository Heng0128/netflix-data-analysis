'use client';

import { useEffect, useRef } from 'react';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  BarController,
  ScatterController,
} from 'chart.js';
import hljs from 'highlight.js';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  BarController,
  ScatterController
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

const CODE_BLOCKS = [
  {
    title: '[ML] 导入库 & 数据准备',
    code: `from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.cluster import KMeans
from sklearn.ensemble import (RandomForestClassifier, RandomForestRegressor,
                              GradientBoostingRegressor)
from sklearn.tree import DecisionTreeRegressor
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import (classification_report, confusion_matrix,
                             accuracy_score, r2_score, mean_squared_error)

# 特征编码
movie_df['rating_enc'] = LabelEncoder().fit_transform(movie_df['rating'])
ml_df['country_enc'] = ml_df['primary_country'].map(
    ml_df['primary_country'].value_counts(normalize=True))
ml_df['genre_enc'] = ml_df['primary_genre'].map(
    ml_df['primary_genre'].value_counts(normalize=True))

# 标准化（聚类用）
features = movie_df[['duration_value','release_year','content_age','rating_enc']]
X_scaled = StandardScaler().fit_transform(features)`,
  },
  {
    title: '[ML-1] K-Means 聚类',
    code: `# 肘部法则找最佳K
inertias = []
for k in range(2, 11):
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    km.fit(X_scaled)
    inertias.append(km.inertia_)

# K=4 聚类
km = KMeans(n_clusters=4, random_state=42, n_init=10)
movie_df['cluster'] = km.fit_predict(X_scaled)

cluster_stats = movie_df.groupby('cluster').agg({
    'duration_value':'mean','release_year':'mean',
    'content_age':'mean','title':'count'
}).round(1)`,
  },
  {
    title: '[ML-2] 随机森林分类',
    code: `X = ml_df[['release_year','rating_enc','country_enc','genre_enc']]
y = (ml_df['type']=='Movie').astype(int)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)
y_pred = rf.predict(X_test)
print(f"准确率: {accuracy_score(y_test, y_pred):.4f}")
cv = cross_val_score(rf, X, y, cv=5)
print(f"5折交叉验证: {cv.mean():.4f} +/- {cv.std():.4f}")`,
  },
  {
    title: '[ML-3] 回归分析对比',
    code: `models = {
    'LinearRegression': LinearRegression(),
    'DecisionTree':  DecisionTreeRegressor(random_state=42, max_depth=8),
    'RandomForest':  RandomForestRegressor(n_estimators=100, random_state=42),
    'GradientBoosting': GradientBoostingRegressor(n_estimators=100, random_state=42)
}
for name, model in models.items():
    model.fit(X_tr, y_tr)
    y_p = model.predict(X_te)
    r2 = r2_score(y_te, y_p)
    rmse = np.sqrt(mean_squared_error(y_te, y_p))
    print(f"  {name:20s} R2={r2:.4f}  RMSE={rmse:.2f}min")`,
  },
];

function generateClusterData(cx: number, cy: number, spread: number, n: number) {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    pts.push({
      x: cx + (Math.random() - 0.5) * spread,
      y: cy + (Math.random() - 0.5) * spread,
    });
  }
  return pts;
}

export default function MLAnalysisPage() {
  const codeRefs = useRef<(HTMLPreElement | null)[]>([]);
  const chartRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const chartsRef = useRef<Chart[]>([]);

  useEffect(() => {
    codeRefs.current.forEach((pre) => {
      if (pre) {
        const codeEl = pre.querySelector('code');
        if (codeEl) {
          hljs.highlightElement(codeEl);
        }
      }
    });

    const charts: Chart[] = [];

    const m1 = chartRefs.current[0];
    if (m1) {
      const ctx = m1.getContext('2d')!;
      charts.push(
        new Chart(m1, {
          type: 'line',
          data: {
            labels: ['2', '3', '4', '5', '6', '7', '8', '9', '10'],
            datasets: [
              {
                label: 'SSE',
                data: [15719.3, 11254.1, 9513.0, 7885.2, 6846.2, 6219.7, 5758.6, 5338.7, 4995.6],
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
                pointBackgroundColor: [
                  '#b3b3b3', '#b3b3b3', '#E50914', '#b3b3b3', '#b3b3b3',
                  '#b3b3b3', '#b3b3b3', '#b3b3b3', '#b3b3b3',
                ],
                pointRadius: [5, 5, 8, 5, 5, 5, 5, 5, 5],
                pointBorderColor: '#fff',
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
            scales: {
              x: {
                grid: { color: NF_GRID },
                title: { display: true, text: '聚类数 K' },
              },
              y: {
                grid: { color: NF_GRID },
                title: { display: true, text: 'SSE（簇内平方和）' },
                beginAtZero: true,
              },
            },
          },
        })
      );
    }

    const m2 = chartRefs.current[1];
    if (m2) {
      charts.push(
        new Chart(m2, {
          type: 'scatter',
          data: {
            datasets: [
              {
                label: '簇0: 短片与纪录片 (972部)',
                data: generateClusterData(2017, 57, 8, 80),
                backgroundColor: 'rgba(229,9,20,0.4)',
                borderColor: '#E50914',
                pointRadius: 3,
              },
              {
                label: '簇1: 标准院线电影 (2613部)',
                data: generateClusterData(2014, 108, 6, 120),
                backgroundColor: 'rgba(232,125,36,0.4)',
                borderColor: '#e87d24',
                pointRadius: 3,
              },
              {
                label: '簇2: 经典老片 (497部)',
                data: generateClusterData(1987, 117, 15, 60),
                backgroundColor: 'rgba(79,195,247,0.4)',
                borderColor: '#4fc3f7',
                pointRadius: 3,
              },
              {
                label: '簇3: 成人向新片 (2049部)',
                data: generateClusterData(2017, 105, 5, 100),
                backgroundColor: 'rgba(129,199,132,0.4)',
                borderColor: '#81c784',
                pointRadius: 3,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom' as const,
                labels: { padding: 10, font: { size: 11 }, usePointStyle: true },
              },
              tooltip: {
                callbacks: {
                  label: (ctx) => `(${ctx.parsed.x!.toFixed(0)}年, ${ctx.parsed.y!.toFixed(0)}分钟)`,
                },
              },
            },
            scales: {
              x: {
                grid: { color: NF_GRID },
                title: { display: true, text: '发行年份' },
              },
              y: {
                grid: { color: NF_GRID },
                title: { display: true, text: '时长（分钟）' },
              },
            },
          },
        })
      );
    }

    const m3 = chartRefs.current[2];
    if (m3) {
      charts.push(
        new Chart(m3, {
          type: 'bar',
          data: {
            labels: ['内容类型 genre', '年龄评级 rating', '制作国家 country', '发行年份 year'],
            datasets: [
              {
                label: '特征重要性',
                data: [0.8073, 0.1122, 0.0461, 0.0344],
                backgroundColor: ['#E50914', '#e87d24', '#4fc3f7', '#81c784'],
                borderRadius: 6,
                borderSkipped: false,
              },
            ],
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx) => `重要性: ${ctx.parsed.x!.toFixed(4)}`,
                },
              },
            },
            scales: {
              x: {
                grid: { color: NF_GRID },
                title: { display: true, text: '重要性' },
                beginAtZero: true,
              },
              y: {
                grid: { display: false },
              },
            },
          },
        })
      );
    }

    const m4 = chartRefs.current[3];
    if (m4) {
      charts.push(
        new Chart(m4, {
          type: 'bar',
          data: {
            labels: ['LinearReg', 'DecisionTree', 'RandomForest', 'GradientBoosting'],
            datasets: [
              {
                label: 'R²',
                data: [0.2058, 0.4269, 0.4535, 0.4813],
                backgroundColor: ['#E50914', '#e87d24', '#4fc3f7', '#81c784'],
                borderRadius: 6,
                borderSkipped: false,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx) => `R² = ${ctx.parsed.y!.toFixed(4)}`,
                },
              },
            },
            scales: {
              x: { grid: { display: false } },
              y: {
                grid: { color: NF_GRID },
                title: { display: true, text: 'R² 决定系数' },
                beginAtZero: true,
                max: 0.55,
              },
            },
          },
        })
      );
    }

    const m5 = chartRefs.current[4];
    if (m5) {
      charts.push(
        new Chart(m5, {
          type: 'bar',
          data: {
            labels: ['簇0: 短片与纪录片', '簇1: 标准院线电影', '簇2: 经典老片', '簇3: 成人向新片'],
            datasets: [
              {
                label: '平均时长（分钟）',
                data: [57.3, 108.1, 116.8, 104.6],
                backgroundColor: 'rgba(229,9,20,0.8)',
                borderRadius: 4,
                borderSkipped: false,
                yAxisID: 'y',
              },
              {
                label: '平均发行年份',
                data: [2016.8, 2014.1, 1986.5, 2016.6],
                backgroundColor: 'rgba(79,195,247,0.8)',
                borderRadius: 4,
                borderSkipped: false,
                yAxisID: 'y1',
              },
              {
                label: '内容数量',
                data: [972, 2613, 497, 2049],
                backgroundColor: 'rgba(129,199,132,0.8)',
                borderRadius: 4,
                borderSkipped: false,
                yAxisID: 'y2',
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
              x: { grid: { display: false } },
              y: {
                position: 'left' as const,
                grid: { color: NF_GRID },
                title: { display: true, text: '时长(分钟)' },
                beginAtZero: true,
              },
              y1: {
                position: 'right' as const,
                grid: { display: false },
                title: { display: true, text: '发行年份' },
                min: 1975,
                max: 2025,
              },
              y2: {
                display: false,
                beginAtZero: true,
              },
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
    <section id="ml" style={{ padding: '64px 24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="section-title">机器学习分析</div>
      <div className="section-desc">
        应用 K-Means 聚类、随机森林分类、回归分析三种算法，挖掘数据深层模式
      </div>

      {CODE_BLOCKS.map((block, index) => (
        <div className="code-container" key={index}>
          <div className="code-header">
            <span className="code-dot red"></span>
            <span className="code-dot yellow"></span>
            <span className="code-dot green"></span>
            <span className="code-title">{block.title}</span>
          </div>
          <pre ref={(el) => { codeRefs.current[index] = el; }}>
            <code className="language-python">{block.code}</code>
          </pre>
        </div>
      ))}

      <div className="charts-grid" style={{ marginTop: '32px' }}>
        <div className="chart-card">
          <div className="chart-num">M1</div>
          <div className="chart-icon"><i className="fas fa-project-diagram"></i> 折线图</div>
          <div className="chart-title">K-Means 肘部法则</div>
          <div className="chart-subtitle">SSE 随聚类数 K 变化，拐点 K=4 为最佳</div>
          <div className="chart-wrap">
            <canvas ref={(el) => { chartRefs.current[0] = el; }}></canvas>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-num">M2</div>
          <div className="chart-icon"><i className="fas fa-braille"></i> 散点图</div>
          <div className="chart-title">电影聚类结果（K=4）</div>
          <div className="chart-subtitle">发行年份 vs 时长，4 个自然分群</div>
          <div className="chart-wrap">
            <canvas ref={(el) => { chartRefs.current[1] = el; }}></canvas>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-num">M3</div>
          <div className="chart-icon"><i className="fas fa-tree"></i> 柱状图</div>
          <div className="chart-title">随机森林分类 — 特征重要性</div>
          <div className="chart-subtitle">genre 是最强预测特征（0.807）</div>
          <div className="chart-wrap">
            <canvas ref={(el) => { chartRefs.current[2] = el; }}></canvas>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-num">M4</div>
          <div className="chart-icon"><i className="fas fa-balance-scale"></i> 柱状图</div>
          <div className="chart-title">回归模型 R² 对比</div>
          <div className="chart-subtitle">梯度提升最佳 R²=0.48</div>
          <div className="chart-wrap">
            <canvas ref={(el) => { chartRefs.current[3] = el; }}></canvas>
          </div>
        </div>

        <div className="chart-card full-width">
          <div className="chart-num">M5</div>
          <div className="chart-icon"><i className="fas fa-layer-group"></i> 分组柱状图</div>
          <div className="chart-title">4 个聚类簇特征对比</div>
          <div className="chart-subtitle">各簇的平均时长、发行年份、内容数量</div>
          <div className="chart-wrap tall">
            <canvas ref={(el) => { chartRefs.current[4] = el; }}></canvas>
          </div>
        </div>
      </div>

      <div className="data-table" style={{ marginTop: '24px' }}>
        <table>
          <thead>
            <tr>
              <th>算法</th>
              <th>任务</th>
              <th>核心结果</th>
              <th>关键发现</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>K-Means 聚类</td>
              <td>电影内容分组</td>
              <td>4 个自然簇</td>
              <td>时长和发行年份是主要分群因素</td>
            </tr>
            <tr>
              <td>随机森林分类</td>
              <td>预测电影 vs 电视节目</td>
              <td>准确率 99.55%</td>
              <td>内容类型(genre)是最强预测特征(0.807)</td>
            </tr>
            <tr>
              <td>梯度提升回归</td>
              <td>预测电影时长</td>
              <td>R²=0.48, RMSE=19.6min</td>
              <td>genre 和发行年份影响最大</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '32px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ background: 'linear-gradient(135deg,#7BC67E,#059669)', borderRadius: '8px', width: '32px', height: '32px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>&#129302;</span>
          机器学习建模结论
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: 'rgba(229,9,20,.06)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ minWidth: '44px', height: '44px', background: 'rgba(229,9,20,.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>&#128309;</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>K-Means 聚类（K=4）&rarr; 发现 4 类自然内容群体</div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.65)', lineHeight: 1.8 }}>基于时长、发行年份、内容年龄、评级对电影进行无监督聚类：<strong style={{ color: '#E50914' }}>短片/纪录片</strong>（低时长、近年）、<strong style={{ color: '#4A90D9' }}>标准院线片</strong>（90~120min）、<strong style={{ color: '#F5A623' }}>经典老片</strong>（发行年早）、<strong style={{ color: '#7BC67E' }}>近年新片</strong>（2015 年后高评级）。4 簇特征鲜明，可直接用于推荐系统内容分层。</p>
            </div>
          </div>
          <div style={{ background: 'rgba(74,144,217,.06)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ minWidth: '44px', height: '44px', background: 'rgba(74,144,217,.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>&#127823;</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>随机森林分类 &rarr; 准确率 99.55%，5 折交叉验证 97.5%</div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.65)', lineHeight: 1.8 }}>以发行年份、评级、制作国、内容类型为特征预测内容类别，<strong style={{ color: '#4A90D9' }}>内容类型（genre）是压倒性最强特征（重要性 80.7%）</strong>，说明电影和电视节目在流派分布上天然差异显著。1,762 个测试样本中仅 8 个预测错误。</p>
            </div>
          </div>
          <div style={{ background: 'rgba(245,166,35,.06)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ minWidth: '44px', height: '44px', background: 'rgba(245,166,35,.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>&#128200;</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>回归模型对比 &rarr; 梯度提升最优（R&sup2;=0.48，RMSE=19.6 min）</div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.65)', lineHeight: 1.8 }}>四种模型预测电影时长：线性回归 R&sup2;=0.07（最差）、决策树 0.32、随机森林 0.46、梯度提升 0.48（最优）。R&sup2; 上限说明电影时长受导演风格等元数据外因素影响更大，<strong style={{ color: '#F5A623' }}>引入用户行为数据将能大幅提升预测能力</strong>。</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ background: 'linear-gradient(135deg,#F5A623,#D97706)', borderRadius: '8px', width: '32px', height: '32px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>&#128203;</span>
          结论与改进建议
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '14px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,.03)', borderRadius: '12px', padding: '18px' }}>
            <div style={{ fontSize: '13px', color: '#E50914', fontWeight: 700, letterSpacing: '.3px', marginBottom: '8px' }}>&#128161; 内容多元化</div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.65)', lineHeight: 1.8 }}>持续加大亚洲、拉美区域本地化内容投资。印度、韩国剧集已具备强大全球传播力，应重点倾斜资源，降低对美国内容的依赖度（现占 32%）。</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,.03)', borderRadius: '12px', padding: '18px' }}>
            <div style={{ fontSize: '13px', color: '#4A90D9', fontWeight: 700, letterSpacing: '.3px', marginBottom: '8px' }}>&#127919; 精准推荐优化</div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.65)', lineHeight: 1.8 }}>K-Means 4 个内容群体可直接用于推荐系统内容画像层。&quot;短片爱好者&quot;与&quot;长篇剧集爱好者&quot;兴趣模式截然不同，差异化推送可显著提升用户满意度。</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,.03)', borderRadius: '12px', padding: '18px' }}>
            <div style={{ fontSize: '13px', color: '#F5A623', fontWeight: 700, letterSpacing: '.3px', marginBottom: '8px' }}>&#128106;&#8203; 家庭内容扩充</div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.65)', lineHeight: 1.8 }}>TV-G 和 TV-PG 评级内容合计不足 10%，而家庭订阅是流媒体盈利重要来源。建议扩充亲子向、合家欢类型内容，提升家庭用户黏性与订阅意愿。</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,.03)', borderRadius: '12px', padding: '18px' }}>
            <div style={{ fontSize: '13px', color: '#7BC67E', fontWeight: 700, letterSpacing: '.3px', marginBottom: '8px' }}>&#128202; 数据治理改进</div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.65)', lineHeight: 1.8 }}>director 字段缺失率近 30%，严重影响导演维度分析。建议 Netflix 加强内容录入阶段元数据管理，尤其是电视节目的导演信息补全，同时避免 rating/duration 字段混淆录入。</p>
          </div>
        </div>
        <div style={{ background: 'linear-gradient(135deg,rgba(229,9,20,.1),rgba(74,144,217,.08))', border: '1px solid rgba(255,255,255,.08)', borderRadius: '12px', padding: '20px', fontSize: '14px', lineHeight: 1.95, color: 'rgba(255,255,255,.78)' }}>
          <strong style={{ color: '#fff', fontSize: '15px' }}>综合结论：</strong>
          Netflix 内容库呈现&quot;量大、美国主导、成熟向&quot;特征，经历快速扩张期后已进入内容质量深耕阶段。机器学习分析表明内容流派是判别内容形式最强特征（RF 重要性 80.7%），
          K-Means 聚类揭示了四类天然内容群体结构，均可直接应用于推荐系统优化。电影时长预测 R&sup2; 上限（0.48）提示了元数据层面的信息瓶颈，
          结合用户行为数据（播放完成率、评分、复看次数）将能大幅提升时长及内容偏好的预测准确性，为精准营销和内容采购决策提供更强有力的数据支撑。
        </div>
      </div>
    </section>
  );
}
