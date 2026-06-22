# Netflix 电影和电视节目数据分析

[![Deploy to GitHub Pages](https://github.com/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/actions/workflows/pages/pages-build-deployment)

## 项目简介

本项目对 Netflix 平台上的电影和电视节目进行全面的数据分析，通过可视化图表展示内容分布、趋势和模式。数据集包含 8,809 条记录，涵盖电影和电视节目的详细信息，包括导演、演员、制作国家、发行年份、评级、时长、流派等。

## 数据集概览

### 数据来源
Netflix 标题数据集是 Netflix 上可获取的电影和电视节目的综合汇编。

### 数据规模
- **总条目数**: 8,809 条记录
- **列数**: 12 列原始数据 + 衍生字段

### 数据字段说明

| 字段名 | 说明 |
|--------|------|
| `show_id` | 每个标题的唯一标识符 |
| `type` | 标题类别（Movie / TV Show） |
| `title` | 电影或电视节目的名称 |
| `director` | 导演姓名 |
| `cast` | 主要演员列表 |
| `country` | 制作国家 |
| `date_added` | 添加到 Netflix 的日期 |
| `release_year` | 原始发布年份 |
| `rating` | 年龄评级 |
| `duration` | 时长（电影为分钟，电视节目为季数） |
| `listed_in` | 所属流派 |
| `description` | 简短概述 |

### 衍生字段
- `year_added` - 添加年份
- `month_added` - 添加月份
- `duration_num` - 时长数值
- `duration_unit` - 时长单位（Minutes/Seasons）
- `primary_genre` - 主要流派
- `primary_country` - 主要制作国家
- `genre_count` - 流派数量
- `country_count` - 制作国家数量
- `cast_count` - 演员数量

## 项目结构

```
.
├── README.md                    # 项目说明文档
├── data/                        # 原始数据目录
│   └── netflix_titles.csv       # 原始数据集
├── netflix_titles_cleaned.csv   # 清洗后的数据集
├── generate_charts.py           # 图表生成脚本
├── index.html                   # 交互式可视化仪表盘
├── charts/                      # 生成的图表文件
│   ├── chart1.html ~ chart10.html  # 独立图表
│   └── dashboard.html           # 综合仪表盘
├── netflix_analysis.ipynb       # Jupyter 分析笔记本
├── netflix_report.ipynb         # Jupyter 报告笔记本
└── .github/workflows/           # GitHub Actions 工作流
    └── pages.yml                # GitHub Pages 部署配置
```

## 快速开始

### 环境要求

- Python 3.8+
- pandas
- numpy
- pyecharts

### 安装依赖

```bash
pip install pandas numpy pyecharts
```

### 运行分析

1. **生成图表**:
   ```bash
   python generate_charts.py
   ```

2. **查看交互式仪表盘**:
   - 打开 `index.html` 或 `charts/dashboard.html` 在浏览器中查看

3. **Jupyter Notebook 分析**:
   ```bash
   jupyter notebook netflix_analysis.ipynb
   ```

## 可视化图表

本项目生成了以下类型的可视化图表：

| 图表编号 | 类型 | 描述 |
|----------|------|------|
| Chart 1 | 饼图 | 电影与电视节目分布 |
| Chart 2 | 柱状图 | 按年份统计的内容添加趋势 |
| Chart 3 | 地图/柱状图 | 内容制作国家分布 Top 15 |
| Chart 4 | 词云 | 流派分布 |
| Chart 5 | 热力图 | 月份与年份的内容添加热力图 |
| Chart 6 | 漏斗图 | 年龄评级分布 |
| Chart 7 | 柱状图 | 电影时长分布 |
| Chart 8 | 柱状图 | 电视节目季数分布 |
| Chart 9 | 词云 | 热门演员 Top 50 |
| Chart 10 | 组合图 | 多维度综合分析 |

## 潜在应用场景

### 📊 内容分析
- 分析随时间变化的流派流行度
- 研究不同国家间内容制作的分布情况
- 对比电影与电视节目制作趋势

### 🤖 推荐系统
- 基于内容相似性的推荐建模
- 用户偏好分析
- 元数据特征工程

### 📈 市场分析
- Netflix 内容策略分析
- 国际市场关注度研究
- 流派多样化分析
- 原创内容投资趋势

## GitHub Pages 部署

本项目配置了自动部署到 GitHub Pages 的工作流：

- 推送到 `main` 分支将自动触发部署
- 静态内容（HTML、图表）将部署到 GitHub Pages
- 访问地址：`https://<username>.github.io/<repository>/`

## 许可证

本项目仅供学习和研究使用。

## 致谢

- 数据来源：Netflix 公开数据集
- 可视化库：[pyecharts](https://pyecharts.org/)
- 部署平台：GitHub Pages

---

**注意**: 本项目是一个数据分析演示项目，旨在展示数据可视化和分析技术。
