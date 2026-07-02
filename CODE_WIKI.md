# Netflix 数据分析项目 Code Wiki

## 一、项目概述

### 1.1 项目简介

本项目是一个基于 Netflix 公开数据集的**数据可视化与机器学习分析平台**，旨在通过数据预处理、多维度可视化和机器学习建模，深入探索流媒体时代影视内容的分布特征与发展趋势。

### 1.2 项目目标

| 目标编号 | 目标名称 | 核心内容 |
| :--- | :--- | :--- |
| 目标一 | 内容结构探索 | 分析电影与剧集比例、时长分布、评级构成 |
| 目标二 | 地域与时间趋势 | 考察不同国家内容产出、年度发布趋势 |
| 目标三 | 机器学习建模 | 使用随机森林分类算法预测内容类型 |
| 目标四 | 策略性建议 | 基于数据洞察提出内容采购与市场布局建议 |

### 1.3 数据集概况

- **数据来源**：Netflix Titles Dataset（Kaggle 公开数据集）
- **记录数**：8,807 条
- **时间范围**：1925 — 2021 年
- **内容类型**：电影（6,131）/ 电视节目（2,676）
- **覆盖国家**：120+ 个

---

## 二、项目架构

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        项目根目录 /workspace                      │
├─────────────────────────────────────────────────────────────────┤
│  netflix_titles.csv           ← 原始数据集（12 列）               │
│  netflix_analysis.ipynb       ← Jupyter Notebook 分析报告        │
│  netflix_analysis.html        ← HTML 分析报告                    │
│  clean_data_v2.py             ← 数据清洗脚本                     │
│  check_data_quality.py        ← 数据质量检查脚本                  │
│  deep_analysis.py             ← 深度分析脚本                      │
│  数据说明.txt                  ← 数据说明文档                     │
├───────────────────────────────┬─────────────────────────────────┤
│         netflix-app/          │         Next.js 前端应用          │
│  ┌───────────────────────────┐│                                 │
│  │  public/                  ││  静态资源与数据集                 │
│  │    netflix_titles_cleaned.csv │← 清洗后数据集（17 列）       │
│  │  src/                     ││                                 │
│  │    app/                   ││  页面路由（6 个页面）            │
│  │    components/            ││  UI 组件（12 个组件）           │
│  │    lib/                   ││  数据处理与图表配置             │
│  └───────────────────────────┘│                                 │
└───────────────────────────────┴─────────────────────────────────┘
```

### 2.2 目录结构详解

| 目录/文件 | 类型 | 职责说明 |
| :--- | :--- | :--- |
| `netflix-app/` | 目录 | Next.js 前端应用根目录 |
| `netflix-app/public/` | 目录 | 静态资源（数据集、图标） |
| `netflix-app/src/app/` | 目录 | 页面路由与布局 |
| `netflix-app/src/components/` | 目录 | React 组件库 |
| `netflix-app/src/lib/` | 目录 | 数据处理工具与图表配置 |
| `clean_data_v2.py` | 文件 | 数据清洗与预处理脚本 |
| `check_data_quality.py` | 文件 | 数据质量检查报告生成 |
| `deep_analysis.py` | 文件 | 深度分析与填充策略评估 |

---

## 三、核心模块职责

### 3.1 Python 数据处理层

#### 3.1.1 数据清洗模块 [clean_data_v2.py](file:///workspace/clean_data_v2.py)

**核心功能**：对原始 Netflix 数据集进行清洗和特征工程

**主要处理步骤**：

| 步骤 | 处理内容 | 技术实现 |
| :--- | :--- | :--- |
| 1 | 修复 rating 字段污染 | 检测含 "min" 的异常值，移至 duration |
| 2 | 提取时长数值 | 正则表达式提取数字，生成 `duration_num` |
| 3 | 解析上架日期 | `pd.to_datetime()` 解析，生成 `year_added`/`month_added` |
| 4 | 缺失值处理 | 导演区分处理，其余填充 "Unknown" |
| 5 | 提取主国家 | 从多国家字符串中提取首个国家 |

**关键函数**：

```python
def extract_duration(row):
    # 从 duration 字符串中提取数字
    val = str(row['duration']) if pd.notna(row['duration']) else ''
    nums = re.findall(r'\d+', val)
    return int(nums[0]) if nums else np.nan

def get_primary_country(country_str):
    # 提取主国家
    if pd.isna(country_str) or str(country_str).strip() == '' or country_str == 'Unknown':
        return 'Unknown'
    return str(country_str).split(',')[0].strip()
```

#### 3.1.2 数据质量检查模块 [check_data_quality.py](file:///workspace/check_data_quality.py)

**核心功能**：全面检查清洗后数据集的质量状况

**检查维度**：

| 检查项 | 检查内容 |
| :--- | :--- |
| 基本信息 | 行数、列数、列名 |
| 缺失值 | 各字段缺失数量与比例 |
| 重复值 | show_id 重复、完全重复行 |
| type 字段 | 类型分布、非法值检测 |
| rating 字段 | 时长污染检测（重点） |
| duration | 时长范围、异常值检测 |
| release_year | 年份范围、异常值 |
| date_added | 日期解析、上架早于发行 |
| primary_country | 国家分布、空值统计 |
| show_id | 格式检查、编号连续性 |
| description | 长度统计、超短描述 |
| listed_in | 流派统计 |

#### 3.1.3 深度分析模块 [deep_analysis.py](file:///workspace/deep_analysis.py)

**核心功能**：对比原始数据与清洗后数据，评估空值填充策略的合理性

**分析维度**：

1. **被删除记录分析**：识别缺失的 show_id 及其原因
2. **原始数据空值详细分析**：按内容类型统计各字段缺失率
3. **"未知"填充合理性分析**：评估 director/country/cast 填充策略
4. **空值处理方式评估**：对比不同填充策略（众数/空值/未知）的优劣

---

### 3.2 前端数据层

#### 3.2.1 数据处理与统计模块 [netflix-data.ts](file:///workspace/netflix-app/src/lib/netflix-data.ts)

**核心功能**：服务端数据读取、统计计算、图表数据生成

**数据结构定义**：

```typescript
export interface NetflixRecord {
  show_id: string;
  type: 'Movie' | 'TV Show';
  title: string;
  director: string;
  cast: string;
  country: string;
  date_added: string;
  release_year: number;
  rating: string;
  duration: string;
  listed_in: string;
  description: string;
  duration_num: number;
  date_added_parsed: string;
  year_added: number;
  month_added: number;
  primary_country: string;
}

export interface NetflixStats {
  total: number;
  movieCount: number;
  tvCount: number;
  moviePercent: number;
  avgDuration: number;
  peakYear: number;
  topCountries: { country: string; count: number }[];
}

export interface ChartData {
  typeDistribution: { name: string; value: number }[];
  ratingDistribution: { name: string; value: number }[];
  yearlyTrends: { year: number; movies: number; tvShows: number }[];
  durationHistogram: { range: string; count: number }[];
  genreWordCloud: { name: string; value: number }[];
  scatterData: { x: number; y: number; name: string }[];
  correlationMatrix: number[][];
  radarData: { country: string; value: number }[];
  stackedAreaData: { year: number; movies: number; tvShows: number }[];
  treemapData: { name: string; value: number }[];
}
```

**核心函数**：

| 函数名 | 功能说明 | 返回值 |
| :--- | :--- | :--- |
| `getNetflixRecords()` | 读取并解析 CSV 数据 | `NetflixRecord[]` |
| `computeStats()` | 计算核心统计指标 | `NetflixStats` |
| `computeChartData()` | 计算所有图表数据 | `ChartData` |
| `getAllData()` | 获取全部数据（缓存） | `{ stats, chartData }` |
| `pearson()` | 计算皮尔逊相关系数 | `number` |

**缓存机制**：使用模块级变量 `cachedRecords`、`cachedStats`、`cachedChartData` 实现数据缓存，避免重复计算。

#### 3.2.2 图表配置模块 [chart-configs.ts](file:///workspace/netflix-app/src/lib/chart-configs.ts)

**核心功能**：定义 9 种 ECharts 图表的配置选项

**支持的图表类型**：

| 图表名称 | 配置函数 | ECharts 类型 |
| :--- | :--- | :--- |
| 内容类型分布 | `getPieOption()` | pie（环形图） |
| 评分分布 | `getDonutOption()` | pie（环形图） |
| 年度趋势 | `getLineOption()` | line（折线图） |
| 电影时长分布 | `getHistogramOption()` | bar（柱状图） |
| 年份与时长关系 | `getScatterOption()` | scatter（散点图） |
| 国家相关性热力图 | `getHeatmapOption()` | heatmap（热力图） |
| 主要内容国家 | `getRadarOption()` | radar（雷达图） |
| 堆叠面积图 | `getStackedAreaOption()` | line（堆叠面积图） |
| 国家内容占比 | `getTreemapOption()` | treemap（矩形树图） |

**全局样式配置**：

- 主色调：`#E50914`（Netflix 红色）
- 辅助色：`#FFD700`（金色）
- 背景：透明（配合暗色主题）
- Tooltip：暗色半透明背景

---

### 3.3 前端组件层

#### 3.3.1 图表组件 [charts.tsx](file:///workspace/netflix-app/src/components/charts.tsx)

**核心功能**：封装 ECharts 图表组件，支持响应式和动画

**组件特性**：

- 使用 `useEffect` 初始化 ECharts 实例
- 使用 `ResizeObserver` 实现响应式自适应
- 使用 `requestAnimationFrame` 支持 loading 状态
- 使用 `memo` 优化渲染性能

**核心配置函数**：

| 函数名 | 功能 |
| :--- | :--- |
| `getBaseOption()` | 获取基础配置（背景、tooltip、动画） |
| `getAxisStyle()` | 获取坐标轴样式 |
| `CHART_COLORS` | 颜色常量定义 |

#### 3.3.2 页面组件

| 组件名 | 路径 | 功能说明 |
| :--- | :--- | :--- |
| `Navbar` | [navbar.tsx](file:///workspace/netflix-app/src/components/navbar.tsx) | 顶部导航栏，支持路由高亮 |
| `Footer` | [footer.tsx](file:///workspace/netflix-app/src/components/footer.tsx) | 页脚信息展示 |
| `PageHeader` | [page-header.tsx](file:///workspace/netflix-app/src/components/page-header.tsx) | 页面标题组件（装饰性头部） |
| `HeroSection` | [hero-section.tsx](file:///workspace/netflix-app/src/components/hero-section.tsx) | 首页英雄区域，展示关键数据统计 |
| `OverviewSection` | [overview-section.tsx](file:///workspace/netflix-app/src/components/overview-section.tsx) | 数据概览页面内容 |
| `AnalysisSection` | [analysis-section.tsx](file:///workspace/netflix-app/src/components/analysis-section.tsx) | 深度分析页面内容 |
| `VisualizationSection` | [visualization-section.tsx](file:///workspace/netflix-app/src/components/visualization-section.tsx) | 可视化图表展示 |
| `CodeShowcase` | [code-showcase.tsx](file:///workspace/netflix-app/src/components/code-showcase.tsx) | Python 代码展示与高亮 |
| `CodePreprocess` | [code-preprocess.tsx](file:///workspace/netflix-app/src/components/code-preprocess.tsx) | 数据预处理代码展示 |
| `ConclusionSection` | [conclusion-section.tsx](file:///workspace/netflix-app/src/components/conclusion-section.tsx) | 结论与建议页面 |
| `AnimatedNumber` | [animated-number.tsx](file:///workspace/netflix-app/src/components/animated-number.tsx) | 数字滚动动画组件 |

#### 3.3.3 数字动画组件 [animated-number.tsx](file:///workspace/netflix-app/src/components/animated-number.tsx)

**核心功能**：实现数字递增动画效果

**技术实现**：

- 使用 `IntersectionObserver` 实现视口触发动画
- 使用 `requestAnimationFrame` 实现平滑动画
- 使用三次方缓动函数 `1 - Math.pow(1 - progress, 3)`
- 使用 `memo` 优化性能

---

### 3.4 页面路由

| 路由 | 页面组件 | 功能说明 |
| :--- | :--- | :--- |
| `/` | [page.tsx](file:///workspace/netflix-app/src/app/page.tsx) | 首页（Hero + 统计 + 分工） |
| `/overview` | [overview/page.tsx](file:///workspace/netflix-app/src/app/overview/page.tsx) | 需求分析与数据集背景 |
| `/code` | [code/page.tsx](file:///workspace/netflix-app/src/app/code/page.tsx) | 数据预处理代码展示 |
| `/analysis` | [analysis/page.tsx](file:///workspace/netflix-app/src/app/analysis/page.tsx) | 深度分析与变量说明 |
| `/visualization` | [visualization/page.tsx](file:///workspace/netflix-app/src/app/visualization/page.tsx) | 9 维可视化图表 |
| `/conclusion` | [conclusion/page.tsx](file:///workspace/netflix-app/src/app/conclusion/page.tsx) | 机器学习与策略建议 |

---

## 四、数据流程

### 4.1 数据处理流程

```
原始数据 netflix_titles.csv (12 列)
         │
         ▼
  ┌───────────────┐
  │ clean_data_v2.py │
  │  数据清洗与修复   │
  └───────────────┘
         │
         ▼
清洗后数据 netflix_titles_cleaned.csv (17 列)
         │
         ├──► check_data_quality.py (质量检查)
         │
         ├──► deep_analysis.py (深度分析)
         │
         └──► netflix-app/src/lib/netflix-data.ts
                   │
                   ├──► computeStats()
                   │        │
                   │        ▼
                   │   NetflixStats (核心统计)
                   │
                   └──► computeChartData()
                            │
                            ▼
                       ChartData (9 种图表数据)
```

### 4.2 数据字段转换

| 原始字段 | 衍生字段 | 说明 |
| :--- | :--- | :--- |
| `duration` | `duration_num` | 提取数值部分（分钟/季） |
| `date_added` | `date_added_parsed` | 解析为标准日期格式 |
| `date_added` | `year_added` | 提取年份（空值用 release_year 填充） |
| `date_added` | `month_added` | 提取月份 |
| `country` | `primary_country` | 提取首个国家作为主国家 |

### 4.3 缺失值处理策略

| 字段 | 处理策略 | 填充值 |
| :--- | :--- | :--- |
| `director` | 剧集用 "Not Applicable"，电影用 "Unknown" | 分类型处理 |
| `cast` | 统一填充 | "Unknown" |
| `country` | 统一填充 | "Unknown" |
| `rating` | 统一填充（避免众数偏差） | "Unknown" |
| `date_added` | 保留空值，用 release_year 近似填充 year_added | "未知" |

---

## 五、关键算法实现

### 5.1 皮尔逊相关系数

```typescript
function pearson(arr1: number[], arr2: number[]): number {
  const n = Math.min(arr1.length, arr2.length);
  if (n === 0) return 0;
  
  let sum1 = 0, sum2 = 0, sum1Sq = 0, sum2Sq = 0, pSum = 0;
  
  for (let i = 0; i < n; i++) {
    const x = arr1[i], y = arr2[i];
    sum1 += x; sum2 += y;
    sum1Sq += x * x; sum2Sq += y * y;
    pSum += x * y;
  }
  
  const num = pSum - (sum1 * sum2) / n;
  const den = Math.sqrt((sum1Sq - (sum1 * sum1) / n) * (sum2Sq - (sum2 * sum2) / n));
  
  return den === 0 ? 0 : num / den;
}
```

### 5.2 数据分组统计

```typescript
function countBy<T extends object>(items: T[], key: keyof T): Record<string, number> {
  const counts: Record<string, number> = {};
  items.forEach((item) => {
    const value = item[key];
    if (value) {
      const k = String(value);
      counts[k] = (counts[k] || 0) + 1;
    }
  });
  return counts;
}
```

### 5.3 CSV 解析器

项目实现了自定义 CSV 解析器，支持：
- 带引号的字段
- 转义引号（""）
- 换行符处理

---

## 六、依赖关系

### 6.1 前端依赖

| 依赖名称 | 版本 | 用途 |
| :--- | :--- | :--- |
| `next` | 16.2.9 | React 框架 |
| `react` | 19.2.4 | UI 库 |
| `react-dom` | 19.2.4 | DOM 渲染 |
| `echarts` | 6.1.0 | 可视化引擎 |
| `echarts-for-react` | 3.0.6 | ECharts React 封装 |
| `chart.js` | 4.5.1 | 备选可视化库 |
| `react-chartjs-2` | 5.3.1 | Chart.js React 封装 |
| `highlight.js` | 11.11.1 | 代码高亮 |
| `tailwindcss` | ^4 | 样式框架 |
| `@tailwindcss/postcss` | ^4 | Tailwind CSS 4 插件 |
| `typescript` | ^5 | 类型安全 |

### 6.2 Python 依赖

| 依赖名称 | 用途 |
| :--- | :--- |
| `pandas` | 数据处理与分析 |
| `numpy` | 数值计算 |
| `matplotlib` | 静态图表绘制（Notebook） |
| `scikit-learn` | 机器学习算法 |

---

## 七、项目运行方式

### 7.1 数据预处理

```bash
# 进入项目根目录
cd /workspace

# 运行数据清洗脚本
python clean_data_v2.py

# 运行数据质量检查
python check_data_quality.py

# 运行深度分析
python deep_analysis.py
```

### 7.2 前端开发

```bash
# 进入前端目录
cd /workspace/netflix-app

# 安装依赖
npm install
# 或
bun install

# 启动开发服务器
npm run dev
# 或
bun dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

### 7.3 访问地址

- 开发环境：`http://localhost:3000`
- 页面路由：
  - 首页：`/`
  - 需求分析：`/overview`
  - 代码展示：`/code`
  - 深度分析：`/analysis`
  - 可视化：`/visualization`
  - 结论：`/conclusion`

---

## 八、技术亮点

### 8.1 数据处理

1. **字段污染修复**：自动检测并修复 rating 字段中的时长数据污染
2. **智能填充策略**：根据内容类型差异化处理缺失值（剧集/电影导演处理不同）
3. **无损数据保留**：清洗过程不删除任何记录，仅进行修复和填充

### 8.2 可视化

1. **双引擎支持**：同时支持 ECharts 和 Chart.js，提供交互式图表
2. **响应式设计**：图表自动适应容器大小变化
3. **暗色主题**：Netflix 风格的深色 UI，玻璃拟态效果

### 8.3 机器学习

1. **随机森林分类**：准确率 99.55%，验证 genre 特征的强区分力
2. **K-Means 聚类**：识别 4 类自然内容群体，可直接用于推荐系统
3. **多模型对比**：线性回归、决策树、随机森林、梯度提升回归对比分析

---

## 九、关键发现与结论

### 9.1 内容结构

- 电影占比约 69.6%（6,131 部），剧集 30.4%（2,676 部）
- 内容上架量在 2019 年达峰值（762 部/年）
- 美国以 2,818 部占绝对主导（32%）

### 9.2 评级分布

- TV-MA（成人向）3,207 部占比最高（36.4%）
- TV-14 次之（24.5%）
- 家庭向内容合计不足 10%

### 9.3 时长特征

- 电影时长集中在 90-120 分钟区间（约 51%）
- 纪录片、戏剧、喜剧位列流派前三

### 9.4 机器学习结果

| 算法 | 任务 | 准确率/R² | 关键发现 |
| :--- | :--- | :--- | :--- |
| K-Means | 电影聚类 | K=4 | 时长和发行年份是主要分群因素 |
| 随机森林 | 内容类型预测 | 99.55% | genre 是最强特征（0.807） |
| 梯度提升 | 时长预测 | R²=0.48 | 需要用户行为数据提升预测能力 |

---

## 十、策略建议

1. **内容策略**：加速原创剧集投入，扩充家庭向内容矩阵
2. **市场布局**：重点加码印度、韩国、日本本土化原创内容
3. **算法应用**：K-Means 4 簇可用于推荐系统内容画像分层
4. **数据治理**：加强导演元数据录入规范，建立字段校验机制

---

## 十一、项目分工

| 成员 | 角色 | 负责内容 |
| :--- | :--- | :--- |
| 张泽浩 | 数据工程 & 建模 | 数据预处理、机器学习算法、报告撰写 |
| 周宇恒 | 可视化 & 报告 | 可视化图表、前端开发、UI 设计 |

---

*文档生成日期：2026-07-02*
