# Netflix 数据分析项目 · Code Wiki

> 基于 Netflix Titles Dataset 的数据可视化与机器学习分析项目

---

## 目录

1. [项目概述](#1-项目概述)
2. [项目架构](#2-项目架构)
3. [目录结构](#3-目录结构)
4. [核心模块详解](#4-核心模块详解)
5. [关键类与函数](#5-关键类与函数)
6. [数据模型与类型定义](#6-数据模型与类型定义)
7. [依赖关系图](#7-依赖关系图)
8. [项目运行方式](#8-项目运行方式)
9. [部署与配置](#9-部署与配置)
10. [开发规范](#10-开发规范)

---

## 1. 项目概述

### 1.1 项目简介

本项目是一个基于 **Netflix Titles Dataset**（8,809 条记录）的完整数据分析项目，涵盖数据预处理、多维度可视化分析以及机器学习建模三大核心模块。项目采用 **Python + Pandas + Scikit-Learn** 进行数据分析，使用 **Next.js + React + ECharts/Chart.js** 构建交互式可视化前端。

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| 数据规模 | 8,809 条 Netflix 内容记录，12 个原始字段 + 5 个衍生字段 |
| 可视化图表 | 9 张 ECharts 图表 + 9 张 Chart.js 图表，共 18 个可视化视图 |
| 机器学习 | K-Means 聚类、随机森林分类、梯度提升回归三种算法 |
| 前端架构 | Next.js 16 (App Router) + React 19 + TypeScript |
| UI 设计 | Netflix 暗黑主题 + 玻璃拟态风格 + 动态动效 |
| 部署支持 | 静态导出 (Static Export)，支持 GitHub Pages 部署 |

### 1.3 分析目标

1. **内容结构探索** — 分析电影与剧集比例、时间分布，揭示内容策略演变
2. **地域与流派分析** — 识别主要内容来源国与热门流派
3. **数据质量检测** — 发现并修复字段污染与缺失值问题
4. **机器学习建模** — 聚类、分类、回归三类算法应用

---

## 2. 项目架构

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        数据层 (Data Layer)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ 原始CSV数据  │  │ Jupyter NB   │  │ 清洗后数据        │  │
│  │ netflix_     │  │ netflix_     │  │ netflix_titles_  │  │
│  │ titles.csv   │  │ analysis.ipynb│  │ cleaned.csv      │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘  │
└─────────┼─────────────────┼───────────────────┼────────────┘
          │                 │                   │
┌─────────▼─────────────────▼───────────────────▼────────────┐
│                    前端应用层 (Frontend Layer)               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    Next.js App Router                 │   │
│  │  /首页  /overview  /code  /visualization  /conclusion │   │
│  └───────────────────────┬──────────────────────────────┘   │
│                          │                                  │
│  ┌───────────────────────▼──────────────────────────────┐   │
│  │                    组件层 (Components)                 │   │
│  │  Navbar · Footer · HeroSection · Chart · PageHeader  │   │
│  │  VisualizationSection · AnalysisSection · ...        │   │
│  └───────────────────────┬──────────────────────────────┘   │
│                          │                                  │
│  ┌───────────────────────▼──────────────────────────────┐   │
│  │                    业务逻辑层 (Lib)                    │   │
│  │  netflix-data.ts (数据处理) · chart-configs.ts (图表) │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 架构层次说明

| 层次 | 职责 | 关键文件/目录 |
|------|------|--------------|
| **数据层** | 原始数据存储、Notebook 分析、清洗后数据 | `netflix_titles.csv`、`netflix_analysis.ipynb`、`netflix_titles_cleaned.csv` |
| **路由层** | 页面路由与元数据管理 | `src/app/` |
| **组件层** | UI 组件复用与交互逻辑 | `src/components/` |
| **业务逻辑层** | 数据处理、图表配置、统计计算 | `src/lib/` |
| **样式层** | 全局样式、主题变量、动效定义 | `src/app/globals.css` |

---

## 3. 目录结构

### 3.1 完整目录树

```
/workspace/
├── netflix_analysis.ipynb          # Jupyter Notebook 完整分析
├── netflix_analysis.html           # 静态 HTML 报告
├── netflix_titles.csv              # 原始数据集
├── 数据说明.txt                     # 数据集说明文档
│
└── netflix-app/                    # Next.js 前端应用
    ├── public/                     # 静态资源
    │   ├── netflix_titles_cleaned.csv  # 清洗后数据
    │   ├── file.svg / globe.svg
    │   └── ...
    │
    ├── src/
    │   ├── app/                    # App Router 页面
    │   │   ├── layout.tsx          # 根布局
    │   │   ├── page.tsx            # 首页
    │   │   ├── globals.css         # 全局样式
    │   │   ├── overview/           # 需求分析页
    │   │   ├── code/               # 预处理与代码页
    │   │   ├── analysis/           # 深度分析页
    │   │   ├── visualization/      # 可视化页
    │   │   └── conclusion/         # 结论与建议页
    │   │
    │   ├── components/             # React 组件
    │   │   ├── navbar.tsx          # 导航栏
    │   │   ├── footer.tsx          # 页脚
    │   │   ├── hero-section.tsx    # 首页 Hero 区
    │   │   ├── charts.tsx          # ECharts 图表组件
    │   │   ├── chart-configs.ts →  在 lib 中
    │   │   ├── page-header.tsx     # 页面标题组件
    │   │   ├── animated-number.tsx # 数字动画组件
    │   │   ├── overview-section.tsx
    │   │   ├── analysis-section.tsx
    │   │   ├── visualization-section.tsx
    │   │   ├── code-showcase.tsx   # 代码展示组件
    │   │   ├── code-preprocess.tsx # 预处理代码页
    │   │   ├── conclusion-section.tsx
    │   │   └── home-sections.tsx
    │   │
    │   └── lib/                    # 业务逻辑库
    │       ├── netflix-data.ts     # 数据加载与统计
    │       └── chart-configs.ts    # ECharts 配置
    │
    ├── package.json                # 依赖配置
    ├── next.config.ts              # Next.js 配置
    ├── tsconfig.json               # TypeScript 配置
    ├── eslint.config.mjs           # ESLint 配置
    └── tailwind.config (postcss)   # 样式配置
```

### 3.2 关键目录说明

| 目录 | 说明 | 核心文件数 |
|------|------|-----------|
| `src/app/` | Next.js App Router 页面，每个子目录对应一个路由 | 5 个页面 + 根布局 |
| `src/components/` | 可复用 React 组件，按功能划分 | 14 个组件 |
| `src/lib/` | 纯 TypeScript 业务逻辑，无 React 依赖 | 2 个核心模块 |
| `public/` | 静态资源与 CSV 数据文件 | 1 个数据文件 + 图标 |

---

## 4. 核心模块详解

### 4.1 数据处理模块 (`netflix-data.ts`)

**文件路径**: [netflix-data.ts](file:///workspace/netflix-app/src/lib/netflix-data.ts)

#### 模块职责

- CSV 数据解析（手动实现 RFC 4180 兼容解析器）
- 数据缓存管理（内存级缓存，避免重复读取）
- 统计指标计算
- 图表数据预处理
- 皮尔逊相关性计算

#### 核心流程

```
getNetflixRecords()
    ↓
parseCSV()  ← 手动 CSV 解析器（处理引号/转义）
    ↓
字段类型转换（数值字段自动转换）
    ↓
cachedRecords ← 内存缓存
    ↓
computeStats() / computeChartData()
    ↓
NetflixStats / ChartData
```

#### 关键常量

| 常量 | 值 | 用途 |
|------|----|------|
| `CORRELATION_COUNTRIES` | 5 个国家 | 相关性热力图国家列表 |
| `TOP_N_COUNTRIES` | 5 | Top N 国家数量 |
| `TOP_N_RATINGS` | 10 | Top N 评级数量 |
| `TOP_N_GENRES` | 30 | Top N 流派数量 |
| `YEAR_RANGE_START/END` | 2008/2021 | 年度趋势年份范围 |
| `SCATTER_SAMPLE_SIZE` | 500 | 散点图采样数量 |
| `DURATION_RANGES` | 6 个区间 | 电影时长分段 |

---

### 4.2 图表配置模块 (`chart-configs.ts`)

**文件路径**: [chart-configs.ts](file:///workspace/netflix-app/src/lib/chart-configs.ts)

#### 模块职责

- 9 种 ECharts 图表配置生成
- 统一主题风格管理
- 响应式图表配置

#### 图表类型清单

| 序号 | 图表类型 | 函数名 | 数据来源 |
|------|----------|--------|----------|
| 1 | 饼图（环形） | `getPieOption()` | 内容类型分布 |
| 2 | 环形图 | `getDonutOption()` | 评分分布 |
| 3 | 折线图 | `getLineOption()` | 年度趋势 |
| 4 | 柱状图（直方图） | `getHistogramOption()` | 电影时长分布 |
| 5 | 散点图 | `getScatterOption()` | 年份与时长关系 |
| 6 | 热力图 | `getHeatmapOption()` | 国家相关性 |
| 7 | 雷达图 | `getRadarOption()` | 主要内容国家 |
| 8 | 堆叠面积图 | `getStackedAreaOption()` | 堆叠面积趋势 |
| 9 | 矩形树图 | `getTreemapOption()` | 国家内容占比 |

#### 配色方案

```typescript
CHART_COLORS = {
  primary: '#E50914',      // Netflix 红
  secondary: '#FFD700',    // 金色
  accent: '#FFC000',       // 橙黄
  warning: '#B81D24',      // 暗红
  success: '#FFEB3B',      // 亮黄
  purple: '#CC8B3C',       // 金棕
}
```

---

### 4.3 图表组件 (`charts.tsx`)

**文件路径**: [charts.tsx](file:///workspace/netflix-app/src/components/charts.tsx)

#### 组件特性

- **Canvas 渲染**：ECharts Canvas 渲染器
- **响应式适配**：`ResizeObserver` + 窗口 resize 双重监听
- **加载状态**：内置 loading 动画
- **性能优化**：React.memo 包裹，避免不必要重渲染
- **生命周期管理**：自动 dispose 防止内存泄漏

#### Props 接口

```typescript
interface ChartProps {
  option: echarts.EChartsOption;  // ECharts 配置
  className?: string;             // 自定义类名
  height?: number | string;       // 高度
  loading?: boolean;              // 加载状态
  onChartReady?: (chart) => void; // 图表就绪回调
}
```

---

### 4.4 导航栏组件 (`navbar.tsx`)

**文件路径**: [navbar.tsx](file:///workspace/netflix-app/src/components/navbar.tsx)

#### 导航项配置

| 路由 | 标签 |
|------|------|
| `/` | 首页 |
| `/overview` | 需求分析 |
| `/code` | 预处理与代码 |
| `/visualization` | 可视化与发现 |
| `/conclusion` | 机器学习与建议 |

#### 交互特性

- 粘性定位 (`position: sticky`)
- 毛玻璃背景 (`backdrop-filter: blur(20px)`)
- 当前路由高亮（红色）
- Hover 颜色过渡动画

---

### 4.5 数字动画组件 (`animated-number.tsx`)

**文件路径**: [animated-number.tsx](file:///workspace/netflix-app/src/components/animated-number.tsx)

#### 实现原理

- **IntersectionObserver**：元素进入视口时触发动画
- **requestAnimationFrame**：60fps 平滑动画
- **缓动函数**：`easeOutCubic` (1 - (1-t)³)
- **只执行一次**：`hasAnimated` ref 防止重复触发

#### Props 接口

```typescript
interface AnimatedNumberProps {
  value: number;          // 目标数值
  duration?: number;      // 动画时长（默认2000ms）
  suffix?: string;        // 后缀
  prefix?: string;        // 前缀
}
```

---

### 4.6 代码展示组件 (`code-showcase.tsx`)

**文件路径**: [code-showcase.tsx](file:///workspace/netflix-app/src/components/code-showcase.tsx)

#### 功能特性

- 6 个 Python 代码片段 Tab 切换
- 自定义 Python 语法高亮（正则实现）
- 一键复制到剪贴板
- macOS 风格窗口装饰

#### 代码片段列表

| Tab | 文件名 | 内容 |
|-----|--------|------|
| 数据读取 | `read_data.py` | Pandas 读取 CSV |
| 数据预处理 | `preprocess.py` | 缺失值处理、特征工程 |
| 类型统计 | `type_stats.py` | 内容类型统计与饼图 |
| 年份趋势 | `yearly_trend.py` | 年度趋势折线图 |
| 随机森林分类 | `random_forest.py` | 随机森林分类模型 |
| 特征重要性 | `feature_importance.py` | 特征重要性可视化 |

---

## 5. 关键类与函数

### 5.1 数据处理函数

#### `parseCSV(text: string): string[][]`

**位置**: [netflix-data.ts#L71-L107](file:///workspace/netflix-app/src/lib/netflix-data.ts#L71-L107)

手动实现的 CSV 解析器，完整支持 RFC 4180 规范：
- 双引号字段边界识别
- 引号转义处理（`""` → `"`）
- 换行符字段内换行处理
- Windows (`\r\n`) 与 Unix (`\n`) 换行兼容

#### `getNetflixRecords(): NetflixRecord[]`

**位置**: [netflix-data.ts#L109-L140](file:///workspace/netflix-app/src/lib/netflix-data.ts#L109-L140)

从 `public/netflix_titles_cleaned.csv` 读取并解析数据，返回强类型化的记录数组。
- 使用 `fs.readFileSync` 同步读取（服务端执行）
- 数值字段自动类型转换
- 内存级单例缓存（`cachedRecords`）

#### `computeStats(): NetflixStats`

**位置**: [netflix-data.ts#L161-L195](file:///workspace/netflix-app/src/lib/netflix-data.ts#L161-L195)

计算核心统计指标：
- 总记录数、电影/剧集数量及占比
- 电影平均时长
- 内容发布峰值年份
- Top 5 内容产出国家

#### `computeChartData(): ChartData`

**位置**: [netflix-data.ts#L335-L365](file:///workspace/netflix-app/src/lib/netflix-data.ts#L335-L365)

计算全部 9 种图表所需数据，统一出口函数。内部调用各 `compute*` 子函数。

#### `pearson(arr1: number[], arr2: number[]): number`

**位置**: [netflix-data.ts#L197-L221](file:///workspace/netflix-app/src/lib/netflix-data.ts#L197-L221)

皮尔逊相关系数计算，用于国家间电影时长相关性分析。
- 取值范围 [-1, 1]
- 0 表示无相关性，±1 表示完全线性相关

---

### 5.2 辅助工具函数

#### `countBy<T>(items: T[], key: keyof T): Record<string, number>`

**位置**: [netflix-data.ts#L142-L152](file:///workspace/netflix-app/src/lib/netflix-data.ts#L142-L152)

通用分组计数函数，类似 SQL 的 `GROUP BY COUNT`。

#### `topEntries(counts: Record<string, number>, n: number): {name, value}[]`

**位置**: [netflix-data.ts#L154-L159](file:///workspace/netflix-app/src/lib/netflix-data.ts#L154-L159)

按计数降序排序并取 Top N。

---

### 5.3 React 组件

#### `Chart` 组件

**位置**: [charts.tsx#L14-L85](file:///workspace/netflix-app/src/components/charts.tsx#L14-L85)

ECharts 封装组件，核心特性：
- `useRef` 管理图表实例
- `useEffect` 处理初始化/销毁/配置更新
- `ResizeObserver` 监听容器尺寸变化
- `memo` 高阶组件优化

#### `AnimatedNumber` 组件

**位置**: [animated-number.tsx#L19-L69](file:///workspace/netflix-app/src/components/animated-number.tsx#L19-L69)

数字滚动动画组件：
- IntersectionObserver 触发
- easeOutCubic 缓动
- 仅动画一次

#### `PageHeader` 组件

**位置**: [page-header.tsx#L9-L26](file:///workspace/netflix-app/src/components/page-header.tsx#L9-L26)

页面统一标题组件，包含 eyebrow 标签、主标题、分隔线、副标题。

---

## 6. 数据模型与类型定义

### 6.1 NetflixRecord 接口

**位置**: [netflix-data.ts#L4-L22](file:///workspace/netflix-app/src/lib/netflix-data.ts#L4-L22)

```typescript
interface NetflixRecord {
  show_id: string;              // 唯一ID
  type: 'Movie' | 'TV Show';    // 内容类型
  title: string;                // 标题
  director: string;             // 导演
  cast: string;                 // 演员
  country: string;              // 制作国家
  date_added: string;           // 上架日期（原始字符串）
  release_year: number;         // 发行年份
  rating: string;               // 年龄评级
  duration: string;             // 时长（原始字符串）
  listed_in: string;            // 流派
  description: string;          // 描述
  duration_num: number;         // 时长数值（分钟/季）
  date_added_parsed: string;    // 解析后日期
  year_added: number;           // 上架年份
  month_added: number;          // 上架月份
  primary_country: string;      // 主要制作国
}
```

### 6.2 NetflixStats 接口

**位置**: [netflix-data.ts#L24-L32](file:///workspace/netflix-app/src/lib/netflix-data.ts#L24-L32)

```typescript
interface NetflixStats {
  total: number;                    // 总记录数
  movieCount: number;               // 电影数量
  tvCount: number;                  // 剧集数量
  moviePercent: number;             // 电影占比(%)
  avgDuration: number;              // 平均时长（分钟）
  peakYear: number;                 // 峰值年份
  topCountries: {country, count}[]; // Top 5 国家
}
```

### 6.3 ChartData 接口

**位置**: [netflix-data.ts#L34-L45](file:///workspace/netflix-app/src/lib/netflix-data.ts#L34-L45)

```typescript
interface ChartData {
  typeDistribution: {name, value}[];       // 类型分布
  ratingDistribution: {name, value}[];     // 评分分布
  yearlyTrends: {year, movies, tvShows}[]; // 年度趋势
  durationHistogram: {range, count}[];     // 时长直方图
  genreWordCloud: {name, value}[];         // 流派词云
  scatterData: {x, y, name}[];             // 散点数据
  correlationMatrix: number[][];           // 相关性矩阵
  radarData: {country, value}[];           // 雷达图数据
  stackedAreaData: {year, movies, tvShows}[]; // 堆叠面积
  treemapData: {name, value}[];            // 矩形树图
}
```

### 6.4 数据集字段说明

| 字段 | 类型 | 缺失率 | 说明 |
|------|------|--------|------|
| show_id | 字符串 | 0% | 唯一标识符 |
| type | 分类(2值) | 0% | Movie / TV Show |
| title | 字符串 | 0% | 内容标题 |
| director | 字符串 | 29.91% | 导演姓名 |
| cast | 字符串 | 9.22% | 主要演员列表 |
| country | 字符串 | 9.45% | 制作国家(可多值) |
| date_added | 日期型 | 0.11% | 上架日期 |
| release_year | 数值 | 0% | 发行年份(1925~2021) |
| rating | 分类(14值) | 0.04% | 年龄评级 |
| duration | 字符串 | 0.04% | 时长 |
| listed_in | 字符串 | 0% | 流派(可多值) |
| description | 文本 | 0% | 内容简述 |
| duration_num | 数值 | - | 衍生：时长数值 |
| year_added | 数值 | - | 衍生：上架年份 |
| month_added | 数值 | - | 衍生：上架月份 |
| primary_country | 字符串 | - | 衍生：主要制作国 |
| content_age | 数值 | - | 衍生：内容年龄 |

---

## 7. 依赖关系图

### 7.1 前端依赖 (package.json)

#### 运行时依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| `next` | 16.2.9 | React 框架 (App Router) |
| `react` | 19.2.4 | UI 库 |
| `react-dom` | 19.2.4 | React DOM 渲染 |
| `echarts` | 6.1.0 | 图表库（主图表） |
| `echarts-for-react` | 3.0.6 | ECharts React 封装 |
| `chart.js` | 4.5.1 | 图表库（备用图表） |
| `react-chartjs-2` | 5.3.1 | Chart.js React 封装 |
| `highlight.js` | 11.11.1 | 代码语法高亮 |

#### 开发依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| `typescript` | ^5 | 类型系统 |
| `tailwindcss` | ^4 | CSS 工具框架 |
| `@tailwindcss/postcss` | ^4 | Tailwind PostCSS 插件 |
| `eslint` | ^9 | 代码检查 |
| `eslint-config-next` | 16.2.9 | Next.js ESLint 配置 |
| `@types/node` | ^20 | Node 类型定义 |
| `@types/react` | ^19 | React 类型定义 |
| `@types/react-dom` | ^19 | React DOM 类型 |

### 7.2 模块依赖关系

```
page.tsx (各页面)
    ↓ 引用
components/ (各组件)
    ↓ 引用
lib/netflix-data.ts  ← 数据处理
lib/chart-configs.ts ← 图表配置
    ↓ 引用
components/charts.tsx ← ECharts 组件
```

### 7.3 页面组件依赖链

| 页面 | 依赖组件 | 依赖数据 |
|------|----------|----------|
| `/` (首页) | `HeroSection` | `NetflixStats` |
| `/overview` | `OverviewSection` | `NetflixStats` |
| `/analysis` | `AnalysisSection` | `NetflixStats` |
| `/visualization` | `VisualizationSection` | `ChartData` |
| `/code` | `CodeShowcase` / `CodePreprocess` | 静态代码文本 |
| `/conclusion` | `ConclusionSection` | `NetflixStats` |

---

## 8. 项目运行方式

### 8.1 环境要求

| 工具 | 最低版本 | 说明 |
|------|----------|------|
| Node.js | 18+ | Next.js 16 要求 |
| npm / yarn / pnpm / bun | - | 包管理器（推荐 bun） |

### 8.2 安装依赖

```bash
cd netflix-app

# 使用 npm
npm install

# 或使用 bun（推荐）
bun install
```

### 8.3 开发模式

```bash
# 启动开发服务器
npm run dev
# 或
bun dev
```

- 访问地址：`http://localhost:3000`
- 支持热更新 (Fast Refresh)
- 开发环境无 basePath

### 8.4 生产构建

```bash
# 构建静态站点
npm run build
# 或
bun run build
```

构建产物位于 `netflix-app/out/` 目录（静态导出模式）。

### 8.5 本地预览构建结果

```bash
# 启动生产服务器
npm run start
# 或
bun start
```

### 8.6 代码检查

```bash
# ESLint 检查
npm run lint
# 或
bun lint
```

---

## 9. 部署与配置

### 9.1 Next.js 配置

**文件**: [next.config.ts](file:///workspace/netflix-app/next.config.ts)

#### 关键配置项

| 配置 | 值 | 说明 |
|------|----|------|
| `output` | `'export'` | 静态导出模式，生成纯 HTML/CSS/JS |
| `basePath` | `'/netflix-data-analysis'` (生产) | 部署子路径 |
| `assetPrefix` | `'/netflix-data-analysis/'` (生产) | 静态资源前缀 |
| `images.unoptimized` | `true` | 禁用图片优化（静态导出需要） |
| `reactStrictMode` | `true` | React 严格模式 |
| `compress` | `true` | 启用 gzip 压缩 |

#### 环境变量

| 变量 | 说明 |
|------|------|
| `NODE_ENV` | `production` 时启用 basePath 与 assetPrefix |

### 9.2 GitHub Pages 部署

项目已配置 `.github/workflows/static.yml` 用于 GitHub Pages 自动部署：

1. 将代码推送到 GitHub 仓库
2. 启用 GitHub Pages（Source: GitHub Actions）
3. 每次 push 到主分支自动构建部署
4. 部署路径：`https://<username>.github.io/netflix-data-analysis/`

### 9.3 TypeScript 配置

**文件**: [tsconfig.json](file:///workspace/netflix-app/tsconfig.json)

- **target**: ES2017
- **strict**: true（严格类型检查）
- **paths**: `@/*` → `./src/*`（路径别名）
- **jsx**: react-jsx

---

## 10. 开发规范

### 10.1 代码风格

- **TypeScript 严格模式**：所有代码必须通过类型检查
- **ESLint**：使用 `eslint-config-next` 规则集
- **组件命名**：PascalCase（如 `HeroSection`）
- **函数命名**：camelCase（如 `computeStats`）
- **常量命名**：UPPER_SNAKE_CASE（如 `CHART_COLORS`）

### 10.2 组件规范

1. **Client Component**：使用 `'use client'` 指令标记（含交互/状态的组件）
2. **Server Component**：默认服务端组件（数据获取、静态内容）
3. **Props 接口**：显式定义 Props 类型
4. **默认导出**：每个组件文件默认导出主组件

### 10.3 样式规范

#### CSS 架构（三层）

```
① 主题层 (CSS Variables)  →  :root 中定义所有主题变量
② 组件层 (玻璃拟态)        →  .glass-card 等通用组件类
③ 动效层 (关键帧)          →  @keyframes 动画定义
```

#### 主题色板

| 变量名 | 值 | 用途 |
|--------|----|------|
| `--primary` | `#E50914` | Netflix 品牌红 |
| `--primary-dark` | `#B20710` | 深红色（渐变/阴影） |
| `--primary-light` | `#FF4D58` | 浅红色（hover） |
| `--background` | `#0A0A0A` | 页面背景 |
| `--glass-bg` | `rgba(255,255,255,.035)` | 玻璃卡片背景 |
| `--glass-border` | `rgba(255,255,255,.08)` | 玻璃卡片边框 |

### 10.4 Git 提交规范

参考 `.trae/rules/git-commit-message.md` 中的约定。

---

## 附录 A：机器学习算法概览

### A.1 K-Means 聚类

- **任务**：电影内容无监督分群
- **最佳 K**：4（肘部法则确定）
- **特征**：时长、发行年份、内容年龄、评级
- **4 个簇**：
  - 簇0：短片与纪录片（972部，低时长、近年）
  - 簇1：标准院线电影（2613部，90~120min）
  - 簇2：经典老片（497部，发行年早）
  - 簇3：成人向新片（2049部，近年高评级）

### A.2 随机森林分类

- **任务**：预测内容类型（Movie / TV Show）
- **准确率**：99.55%
- **5 折交叉验证**：97.5%
- **特征重要性 Top 1**：内容类型 genre（重要性 0.807）

### A.3 梯度提升回归

- **任务**：预测电影时长
- **最佳模型**：Gradient Boosting
- **R²**：0.4813
- **RMSE**：19.6 分钟
- **对比模型**：LinearRegression (0.206)、DecisionTree (0.427)、RandomForest (0.454)

---

## 附录 B：数据预处理步骤

1. **修复 rating 字段污染** — 3 条记录时长数据误入 rating 列
2. **解析日期** — `date_added` 解析为年份/月份
3. **提取数值时长** — 从 `duration` 字符串提取分钟数
4. **缺失值填充** — director/cast/country 填充 "Unknown"，rating 填充众数
5. **特征工程**：
   - `content_age` = 2021 - release_year
   - `primary_country` = 多国家取首个
   - `primary_genre` = 多流派取首个
   - `is_movie` = 类型二值化
   - `years_to_netflix` = 上架延迟年数

---

*文档生成时间：2026-07-02*
*项目版本：0.1.0*
