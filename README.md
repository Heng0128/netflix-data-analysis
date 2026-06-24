# Netflix 数据可视化面板

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![ECharts](https://img.shields.io/badge/ECharts-5.4+-red.svg)](https://echarts.apache.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📊 项目简介

本项目是一个基于 **Netflix 电影与电视节目数据集** 的交互式数据可视化面板。通过紧凑的多图表布局，单屏可同时展示 10+ 个可视化图表，支持交互式下钻分析，帮助用户快速探索 Netflix 内容库的分布特征和趋势规律。

**最后更新**: 2026 年

---

## 📁 项目结构

```
/workspace
├── index.html                  # 主页面（交互式可视化面板）
├── css/
│   └── style.css               # 样式文件（紧凑布局）
├── js/
│   └── main.js                 # 核心逻辑（图表渲染 + 交互）
├── data/
│   ├── analysis_data.json      # 结构化分析数据
│   ├── complete_analysis.json  # 完整分析结果
│   └── raw_data_sample.csv     # 原始数据样本
├── netflix_titles_cleaned.csv  # 清洗后的数据集（8,807 条×23 字段）
├── netflix_analysis.ipynb      # Jupyter 分析代码（必备）
├── netflix_report.ipynb        # Jupyter 案例报告（必备）
├── data_preprocessing.py       # 数据预处理代码文档
├── README.md                   # 项目说明文档
└── 数据说明.txt                # 数据集背景介绍
```

---

## 🚀 快速启动

### 方式一：直接打开 HTML 文件

```bash
# 双击打开 index.html 即可
# 或使用浏览器打开
open index.html  # macOS
start index.html  # Windows
xdg-open index.html  # Linux
```

### 方式二：本地服务器（推荐）

```bash
# Python 3
python3 -m http.server 8080

# 访问 http://localhost:8080/index.html
```

---

## 📈 可视化图表清单

| 序号 | 图表名称 | 类型 | 说明 |
|------|----------|------|------|
| 1 | 内容类型分布 | 环形图 | 电影 vs 电视节目占比 |
| 2 | 年度发布趋势 | 折线图 | 2015-2021 年内容增长趋势 |
| 3 | 制片国家 Top15 | 柱状图 | 各国内容产出排行 |
| 4 | 热门流派 Top10 | 柱状图 | 流派分布统计 |
| 5 | 年龄评级分布 | 漏斗图 | TV-MA、TV-14 等评级占比 |
| 6 | 电影时长分布 | 直方图 | 电影时长区间统计 |
| 7 | 电视节目季数 | 柱状图 | 剧集季数分布 |
| 8 | 年份×类型热力图 | 热力图 | 时间维度交叉分析 |
| 9 | **流派词云** | 力导向图 | 流派关键词视觉化（支持点击下钻） |
| 10 | 相关性矩阵 | 热力图 | 数值变量相关性分析 |

---

## 👥 小组分工示例

| 成员 | 角色 | 任务描述 | 完成工作 |
|------|------|----------|----------|
| 成员 A | 数据科学家 | 数据预处理、统计分析 | 数据清洗、缺失值处理、异常值检测、描述性统计、分组分析、相关性分析 |
| 成员 B | 前端工程师 | 可视化开发、页面搭建 | pyecharts 图表开发、index.html 页面构建、交互逻辑实现、答辩演示 |
| 成员 C | 报告撰写 | 文档整理、汇报准备 | 需求分析文档、结论总结、PPT 制作、问答准备 |

---

## 🛠️ 技术栈

- **数据处理**: Python 3.8+, Pandas, NumPy
- **可视化**: ECharts 5.4+, PyECharts
- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **开发环境**: Jupyter Notebook, VS Code

---

## 📊 数据集信息

### 数据来源
- **名称**: Netflix Titles Dataset
- **来源**: Kaggle 公开数据集
- **规模**: 8,807 条记录
- **原始字段**: 12 个
- **衍生字段**: 12 个（共 24 个字段）

### 关键字段说明

| 字段名 | 类型 | 说明 | 取值范围 |
|--------|------|------|----------|
| show_id | string | 作品唯一标识 | s1, s2, ... |
| type | string | 内容类型 | Movie, TV Show |
| title | string | 作品标题 | - |
| director | string | 导演 | - |
| cast | string | 演员阵容 | - |
| country | string | 制片国家 | 86 个国家 |
| date_added | date | 上线日期 | 1967-2021 |
| release_year | int | 发行年份 | 1925-2021 |
| rating | string | 年龄分级 | TV-MA, TV-14, PG-13 等 17 种 |
| duration | string | 时长 | 电影 (分钟), 电视剧 (季) |
| listed_in | string | 流派分类 | 36 个主要流派 |
| description | string | 剧情描述 | - |

### 衍生字段
- `year_added`: 提取自 date_added 的年份
- `month_added`: 提取自 date_added 的月份
- `duration_num`: 时长的数值部分
- `duration_unit`: 时长单位 (Minutes/Seasons)
- `primary_genre`: 第一流派
- `primary_country`: 第一制片国
- `genre_count`: 流派数量
- `country_count`: 国家数量
- `cast_count`: 演员数量
- `is_anomaly_duration`: 时长异常标记
- `no_director`: 无导演标记

---

## 🔍 核心发现

### 数据分析结果

1. **内容类型分布**: 电影占主导 (69.6%, 6,131 部)，电视节目占 30.4% (2,676 部)
2. **增长趋势**: 2019 年达到发布峰值 (2,016 部)，随后略有下降
3. **地域分布**: 美国为最大制片国 (3,690 部)，其次是印度 (1,046 部)
4. **流派偏好**: International Movies (2,752 部) > Dramas (2,427 部) > Comedies (1,674 部)
5. **年龄分级**: TV-MA (成人内容) 最多 (3,211 部)，其次是 TV-14 (2,160 部)
6. **时长特征**: 电影平均时长 99.5 分钟，电视剧多为 1-2 季
7. **相关性**: release_year 与 year_added 呈弱正相关 (r=0.11)，整体相关性不强
8. **异常值**: 检测到 453 部时长异常作品（IQR 法），已标记但不影响整体分析

---

## 💡 结论与建议

### 业务建议

1. **内容策略优化**: 
   - 继续加大 Drama 和 Comedy 类内容投入（用户需求最高）
   - 考虑增加 International Movies 类别的多样性（增长潜力大）

2. **区域市场拓展**:
   - 美国市场已饱和，可重点发展印度、英国等第二梯队市场
   - 针对 Unknown 国家标记的作品进行数据质量清理

3. **用户分级管理**:
   - TV-MA 内容占比最高 (36.5%)，需加强家长控制功能
   - 针对 TV-PG 和 PG 级别内容可增加家庭友好型推荐

4. **数据质量改进**:
   - 完善导演、演员信息的缺失值填充
   - 对异常时长数据进行人工复核

---

## 📝 汇报指南

### 10 分钟汇报结构

| 时间 | 环节 | 内容 | 负责人 |
|------|------|------|--------|
| 0-2 min | 项目背景 | 数据集介绍、分析目标 | 成员 A |
| 2-4 min | 数据处理 | 预处理流程、代码展示 | 成员 A |
| 4-7 min | 可视化演示 | 操作 index.html 展示 10 个图表 | 成员 B |
| 7-9 min | 分析结论 | 核心发现、业务建议 | 成员 C |
| 9-10 min | 总结展望 | 项目亮点、改进方向 | 全员 |

### 5 分钟答辩准备

**常见问题及回答要点**:

1. **Q: 为什么选择这些可视化图表？**
   - A: 根据数据类型选择：分类型用柱状图/饼图，时序用折线图，分布用直方图，关系用热力图

2. **Q: 如何处理缺失值和异常值？**
   - A: 缺失值用众数填充（分类变量）或均值填充（数值变量）；异常值标记但不删除，保留分析价值

3. **Q: 词云下钻功能如何实现？**
   - A: 使用 ECharts Graph 的 click 事件监听，动态过滤数据并更新表格 DOM

4. **Q: 数据分析的核心价值是什么？**
   - A: 发现内容分布规律，为平台内容采购和用户推荐提供数据支持

---

## ⚠️ 注意事项

1. **Jupyter Notebook 为必备材料**: 汇报时必须展示 `netflix_analysis.ipynb` 和 `netflix_report.ipynb`
2. **代码可运行性**: 确保所有代码单元格可顺序执行，无报错
3. **数据一致性**: 网页展示数据应与 Notebook 分析结果一致
4. **分工明确**: 报告中需清晰说明每位成员的贡献
5. **时间控制**: 汇报严格控制在 10 分钟内，提前演练

---

## 📄 许可证

MIT License

---

## 📞 联系方式

如有问题，请通过课程平台提交 Issue 或联系小组成员。
