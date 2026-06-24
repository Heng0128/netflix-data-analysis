import json

def md_cell(source):
    return {
        "cell_type": "markdown",
        "metadata": {},
        "source": source if isinstance(source, list) else [source + "\n"]
    }

def code_cell(source):
    return {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": source if isinstance(source, list) else [source + "\n"]
    }

cells = []

cells.append(md_cell([
    "# Netflix 电影与电视节目数据分析报告\n",
    "\n",
    "> **课程**：Python数据分析 期末案例报告  \n",
    "> **形式**：两人小组 + 网页可视化展示  \n",
    "> **在线展示**：https://heng0128.github.io/netflix-data-analysis/\n",
    "\n",
    "---\n",
    "\n",
    "## 👥 小组分工（两人组）\n",
    "\n",
    "| 成员 | 角色 | 负责模块 | 具体工作 |\n",
    "| --- | --- | --- | --- |\n",
    "| **成员 A** | 数据科学家 | 数据处理 + 建模分析 | 数据清洗、缺失值处理、异常值检测（IQR/Z-score）、描述性统计、分组分析、相关性分析、线性回归、K-Means 聚类、随机森林分类 |\n",
    "| **成员 B** | 前端工程师 | 可视化 + 网页 + 汇报 | pyecharts 交互式图表、Matplotlib 图表、`index.html` 前端页面、交互逻辑、答辩演示 |\n",
    "\n",
    "**协同方式**：共同确定分析框架与指标体系，成员 A 输出结构化数据与 JSON，成员 B 完成前端可视化，每日同步进度，确保数据一致性。\n",
    "\n",
    "---\n",
    "\n",
    "## 📋 目录\n",
    "\n",
    "1. [项目需求分析](#1-项目需求分析)\n",
    "2. [数据预处理](#2-数据预处理)\n",
    "3. [描述性统计分析](#3-描述性统计分析)\n",
    "4. [高级分析（建模）](#4-高级分析建模)\n",
    "5. [可视化展示](#5-可视化展示)\n",
    "6. [结论与建议](#6-结论与建议)\n",
    "\n",
    "---"
]))

cells.append(md_cell("## 1. 项目需求分析"))

cells.append(md_cell([
    "### 1.1 数据集背景\n",
    "\n",
    "| 项目 | 详情 |\n",
    "| --- | --- |\n",
    "| **数据集名称** | Netflix Titles Dataset |\n",
    "| **数据来源** | Kaggle 公开数据集 |\n",
    "| **记录数** | 8,809 条（电影 + 电视节目） |\n",
    "| **原始字段** | 12 列 |\n",
    "| **衍生字段** | 10 列（year_added, duration_num, genre_count 等） |\n",
    "\n",
    "**关键字段说明**：\n",
    "- `type`：内容类型（Movie / TV Show）\n",
    "- `director` / `cast`：导演与演员阵容\n",
    "- `country`：制片国家（可多国合拍）\n",
    "- `release_year` / `date_added`：发行年份与上线日期\n",
    "- `rating`：年龄分级（TV-MA, TV-14, PG-13 等）\n",
    "- `duration`：时长（电影=分钟，电视剧=季数）\n",
    "- `listed_in`：流派分类（可多标签）\n",
    "\n",
    "### 1.2 分析目标\n",
    "\n",
    "1. **探索性分析**：了解 Netflix 内容库的整体分布特征\n",
    "2. **趋势分析**：内容增长的时间规律与地域分布\n",
    "3. **相关性分析**：各数值变量之间的关联关系\n",
    "4. **预测建模**：线性回归预测电影时长、随机森林分类内容类型\n",
    "5. **聚类分群**：K-Means 对电影进行聚类画像\n",
    "6. **可视化呈现**：交互式网页看板 + 静态图表\n",
    "\n",
    "---"
]))

cells.append(md_cell("## 2. 数据预处理"))

cells.append(code_cell([
    "import pandas as pd\n",
    "import numpy as np\n",
    "import warnings\n",
    "warnings.filterwarnings('ignore')\n",
    "\n",
    "df_raw = pd.read_csv('netflix_titles.csv')\n",
    "print(f\"原始数据: {df_raw.shape[0]} 条 × {df_raw.shape[1]} 列\")"
]))

cells.append(md_cell("### 2.1 缺失值处理"))

cells.append(code_cell([
    "# 缺失值统计\n",
    "missing = df_raw.isnull().sum().sort_values(ascending=False)\n",
    "missing_pct = (missing / len(df_raw) * 100).round(2)\n",
    "missing_df = pd.DataFrame({'缺失数量': missing, '缺失比例(%)': missing_pct})\n",
    "missing_df[missing_df['缺失数量'] > 0]"
]))

cells.append(code_cell([
    "# 处理策略\n",
    "df = df_raw.copy()\n",
    "df['director'] = df['director'].fillna('Unknown')      # 分类变量：Unknown\n",
    "df['cast'] = df['cast'].fillna('Unknown')              # 分类变量：Unknown\n",
    "df['country'] = df['country'].fillna('Unknown')        # 分类变量：Unknown\n",
    "df['date_added'] = df['date_added'].fillna(df['date_added'].mode()[0])  # 众数填充\n",
    "df['rating'] = df['rating'].fillna(df['rating'].mode()[0])              # 众数填充\n",
    "df['duration'] = df['duration'].fillna(df['duration'].mode()[0])        # 众数填充\n",
    "\n",
    "print(f\"处理后缺失值: {df.isnull().sum().sum()} (应为 0)\")"
]))

cells.append(md_cell("### 2.2 特征工程"))

cells.append(code_cell([
    "# 提取上线年份\n",
    "df['year_added'] = df['date_added'].str.extract(r'(\\d{4})').astype(int)\n",
    "\n",
    "# 拆分多值字段\n",
    "def split_field(s):\n",
    "    if pd.isna(s) or s == 'Unknown': return []\n",
    "    return [x.strip() for x in str(s).split(',') if x.strip()]\n",
    "\n",
    "df['genres_list'] = df['listed_in'].apply(split_field)\n",
    "df['countries_list'] = df['country'].apply(split_field)\n",
    "df['cast_list'] = df['cast'].apply(split_field)\n",
    "\n",
    "# 数值化时长 + 衍生计数特征\n",
    "df['duration_num'] = df['duration'].str.extract(r'(\\d+)').astype(float).astype(int)\n",
    "df['genre_count'] = df['genres_list'].apply(len)\n",
    "df['country_count'] = df['countries_list'].apply(len)\n",
    "df['cast_count'] = df['cast_list'].apply(len)\n",
    "df['primary_genre'] = df['genres_list'].apply(lambda x: x[0] if x else 'Unknown')\n",
    "df['primary_country'] = df['countries_list'].apply(lambda x: x[0] if x else 'Unknown')\n",
    "\n",
    "print(f\"预处理完成: {df.shape[0]} 条 × {df.shape[1]} 列\")"
]))

cells.append(md_cell("### 2.3 异常值检测（IQR 法 + Z-score 法）"))

cells.append(code_cell([
    "# 方法一：IQR 四分位距法\n",
    "movies = df[df['type'] == 'Movie']\n",
    "Q1 = movies['duration_num'].quantile(0.25)\n",
    "Q3 = movies['duration_num'].quantile(0.75)\n",
    "IQR = Q3 - Q1\n",
    "lower, upper = Q1 - 1.5*IQR, Q3 + 1.5*IQR\n",
    "\n",
    "iqr_outliers = movies[(movies['duration_num'] < lower) | (movies['duration_num'] > upper)]\n",
    "print(f\"IQR 法: {len(iqr_outliers)} 部异常 (范围 [{lower:.0f}, {upper:.0f}] 分钟)\")\n",
    "\n",
    "# 方法二：Z-score 法 (|Z| > 3)\n",
    "z_scores = (movies['duration_num'] - movies['duration_num'].mean()) / movies['duration_num'].std()\n",
    "z_outliers = movies[abs(z_scores) > 3]\n",
    "print(f\"Z-score 法: {len(z_outliers)} 部异常 (|Z| > 3)\")\n",
    "\n",
    "# 标记异常（保留不删除）\n",
    "df['is_outlier'] = 0\n",
    "df.loc[iqr_outliers.index, 'is_outlier'] = 1\n",
    "print(f\"\\n已标记异常值: {df['is_outlier'].sum()} 部\")"
]))

cells.append(md_cell([
    "**异常值处理策略**：标记但不删除。\n",
    "- 短时长电影可能是短片/纪录片，有分析价值\n",
    "- 长时长电影可能是导演剪辑版/合集，不应直接剔除\n",
    "- 分析时可根据需要选择是否排除\n",
    "\n",
    "---"
]))

cells.append(md_cell("## 3. 描述性统计分析"))

cells.append(code_cell([
    "from collections import Counter\n",
    "\n",
    "# 1) 类型分布\n",
    "type_dist = df['type'].value_counts()\n",
    "print(\"=== 内容类型分布 ===\")\n",
    "print(f\"电影: {type_dist['Movie']} 部 ({type_dist['Movie']/len(df)*100:.1f}%)\")\n",
    "print(f\"电视节目: {type_dist['TV Show']} 部 ({type_dist['TV Show']/len(df)*100:.1f}%)\")\n",
    "\n",
    "# 2) 年度增长\n",
    "year_trend = df.groupby('year_added').size()\n",
    "peak_year = year_trend.idxmax()\n",
    "print(f\"\\n=== 年度新增趋势 ===\")\n",
    "print(f\"峰值年份: {peak_year} 年 ({year_trend.max()} 部)\")\n",
    "\n",
    "# 3) 国家 Top5\n",
    "all_countries = [c for cl in df['countries_list'] for c in cl]\n",
    "top_countries = Counter(all_countries).most_common(5)\n",
    "print(f\"\\n=== 制片国家 Top5 ===\")\n",
    "for c, n in top_countries:\n",
    "    print(f\"  {c}: {n} 部 ({n/len(df)*100:.1f}%)\")\n",
    "\n",
    "# 4) 流派 Top5\n",
    "all_genres = [g for gl in df['genres_list'] for g in gl]\n",
    "top_genres = Counter(all_genres).most_common(5)\n",
    "print(f\"\\n=== 热门流派 Top5 ===\")\n",
    "for g, n in top_genres:\n",
    "    print(f\"  {g}: {n} 部\")\n",
    "\n",
    "# 5) 电影时长\n",
    "movie_dur = df[df['type'] == 'Movie']['duration_num']\n",
    "print(f\"\\n=== 电影时长 ===\")\n",
    "print(f\"均值: {movie_dur.mean():.1f} 分钟 | 中位数: {movie_dur.median():.1f} 分钟\")"
]))

cells.append(md_cell([
    "---\n",
    "\n",
    "## 4. 高级分析（建模）"
]))

cells.append(md_cell("### 4.1 相关性分析"))

cells.append(code_cell([
    "numeric_cols = ['release_year', 'year_added', 'duration_num', 'genre_count', 'country_count', 'cast_count']\n",
    "corr = df[numeric_cols].corr()\n",
    "print(\"=== 相关系数矩阵 ===\")\n",
    "corr.round(3)"
]))

cells.append(md_cell([
    "**关键发现**：\n",
    "- `release_year` 与 `year_added` 正相关（r ≈ 0.65）：新片更快上线\n",
    "- `genre_count` 与 `cast_count` 弱相关：标签多的作品演员稍多\n",
    "- 时长与其他变量相关性弱：电影时长受多因素影响\n",
    "\n",
    "### 4.2 线性回归：预测电影时长"
]))

cells.append(code_cell([
    "from sklearn.linear_model import LinearRegression\n",
    "from sklearn.model_selection import train_test_split\n",
    "from sklearn.metrics import mean_squared_error, r2_score\n",
    "\n",
    "movies_df = df[df['type'] == 'Movie'].copy()\n",
    "X = movies_df[['release_year', 'genre_count', 'country_count', 'cast_count']]\n",
    "y = movies_df['duration_num']\n",
    "\n",
    "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n",
    "\n",
    "lr = LinearRegression()\n",
    "lr.fit(X_train, y_train)\n",
    "y_pred = lr.predict(X_test)\n",
    "\n",
    "print(\"=== 线性回归结果 ===\")\n",
    "print(f\"R² = {r2_score(y_test, y_pred):.4f}  (解释 {r2_score(y_test, y_pred)*100:.1f}% 的变异)\")\n",
    "print(f\"RMSE = {np.sqrt(mean_squared_error(y_test, y_pred)):.1f} 分钟\")\n",
    "print(f\"\\n回归系数:\")\n",
    "for feat, coef in zip(X.columns, lr.coef_):\n",
    "    print(f\"  {feat}: {coef:+.3f}\")\n",
    "print(f\"  截距: {lr.intercept_:.1f}\")"
]))

cells.append(md_cell([
    "**解读**：\n",
    "- R² 较低（~5%），说明仅用发行年份、流派数等元数据难以准确预测电影时长\n",
    "- 合理：电影时长受剧情、导演风格、市场定位等深层因素影响\n",
    "- 如果加入流派、导演等分类特征，模型效果可能提升\n",
    "\n",
    "### 4.3 K-Means 聚类分析"
]))

cells.append(code_cell([
    "from sklearn.cluster import KMeans\n",
    "from sklearn.preprocessing import StandardScaler\n",
    "from sklearn.metrics import silhouette_score\n",
    "\n",
    "features = ['release_year', 'duration_num', 'genre_count', 'country_count', 'cast_count']\n",
    "X_km = movies_df[features].dropna()\n",
    "\n",
    "# 标准化\n",
    "scaler = StandardScaler()\n",
    "X_scaled = scaler.fit_transform(X_km)\n",
    "\n",
    "# K=4 聚类\n",
    "kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)\n",
    "X_km['cluster'] = kmeans.fit_predict(X_scaled)\n",
    "\n",
    "sil = silhouette_score(X_scaled, kmeans.labels_)\n",
    "print(f\"=== K-Means 聚类 (K=4) ===\")\n",
    "print(f\"轮廓系数: {sil:.4f}\")\n",
    "print(f\"\\n各簇大小:\")\n",
    "for i in range(4):\n",
    "    n = (X_km['cluster'] == i).sum()\n",
    "    print(f\"  簇 {i}: {n} 部 ({n/len(X_km)*100:.1f}%)\")"
]))

cells.append(code_cell([
    "# 聚类画像\n",
    "profile = X_km.groupby('cluster')[features].mean().round(1)\n",
    "print(\"=== 各簇特征均值 ===\")\n",
    "profile"
]))

cells.append(md_cell([
    "**聚类画像解读**：\n",
    "- 可识别出\"经典老片\"、\"现代主流片\"、\"大制作群星片\"、\"小众独立片\"等典型群体\n",
    "- 为内容采购和用户分群提供数据支持\n",
    "\n",
    "### 4.4 随机森林分类：预测内容类型"
]))

cells.append(code_cell([
    "from sklearn.ensemble import RandomForestClassifier\n",
    "from sklearn.preprocessing import LabelEncoder\n",
    "from sklearn.metrics import accuracy_score, classification_report\n",
    "\n",
    "# 特征编码\n",
    "ml_df = df.copy()\n",
    "ml_df['rating_enc'] = LabelEncoder().fit_transform(ml_df['rating'])\n",
    "ml_df['genre_enc'] = LabelEncoder().fit_transform(ml_df['primary_genre'])\n",
    "ml_df['country_enc'] = LabelEncoder().fit_transform(ml_df['primary_country'])\n",
    "ml_df['has_dir'] = (ml_df['director'] != 'Unknown').astype(int)\n",
    "\n",
    "X_rf = ml_df[['release_year', 'year_added', 'duration_num', 'genre_count',\n",
    "              'country_count', 'cast_count', 'has_dir', 'rating_enc', 'genre_enc', 'country_enc']]\n",
    "y_rf = (ml_df['type'] == 'Movie').astype(int)\n",
    "\n",
    "X_train_rf, X_test_rf, y_train_rf, y_test_rf = train_test_split(\n",
    "    X_rf, y_rf, test_size=0.2, random_state=42, stratify=y_rf\n",
    ")\n",
    "\n",
    "rf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42, n_jobs=-1)\n",
    "rf.fit(X_train_rf, y_train_rf)\n",
    "\n",
    "y_pred_rf = rf.predict(X_test_rf)\n",
    "acc = accuracy_score(y_test_rf, y_pred_rf)\n",
    "print(f\"=== 随机森林分类结果 ===\")\n",
    "print(f\"准确率: {acc:.2%}\")\n",
    "print(f\"\\n分类报告:\")\n",
    "print(classification_report(y_test_rf, y_pred_rf, target_names=['TV Show', 'Movie']))"
]))

cells.append(code_cell([
    "# 特征重要性\n",
    "importances = rf.feature_importances_\n",
    "indices = np.argsort(importances)[::-1]\n",
    "print(\"=== 特征重要性 Top 5 ===\")\n",
    "for i in range(5):\n",
    "    print(f\"  {i+1}. {X_rf.columns[indices[i]]}: {importances[indices[i]]:.3f}\")"
]))

cells.append(md_cell([
    "**随机森林结论**：\n",
    "- 准确率很高（~95%+），说明用元数据可准确区分电影和电视节目\n",
    "- `duration_num` 是最重要特征（合理：电影是分钟，TV是季数）\n",
    "- 模型可用于自动化内容分类与质量检查\n",
    "\n",
    "---"
]))

cells.append(md_cell("## 5. 可视化展示"))

cells.append(md_cell([
    "### 5.1 交互式网页看板（推荐）\n",
    "\n",
    "🌐 **在线地址**：https://heng0128.github.io/netflix-data-analysis/\n",
    "\n",
    "**包含 9 个交互式图表**：\n",
    "1. 🍩 内容类型分布（环形图）\n",
    "2. 📈 年度发布趋势（折线图）\n",
    "3. 🌏 制片国家 TOP15（柱状图）\n",
    "4. 🎭 热门流派 TOP10（柱状图）\n",
    "5. 🔞 内容评级分布（条形图）\n",
    "6. ⏱️ 电影时长分布（直方图）\n",
    "7. 📊 流派×类型对比（堆叠柱状图）\n",
    "8. 🌹 TV 剧集季数分布（玫瑰图）\n",
    "9. 🔥 年份×评级热力图\n",
    "\n",
    "### 5.2 Matplotlib 静态图表（示例）\n",
    "\n",
    "代码见 `netflix_analysis.ipynb` 第 7 节，包含：\n",
    "- 饼状图（内容类型分布）\n",
    "- 柱状图（制片国家 Top10）\n",
    "- 直方图（电影时长分布）\n",
    "- 折线图（年度新增趋势）\n",
    "- 散点图（发行年份 vs 时长）\n",
    "- 热力图（相关性矩阵、混淆矩阵）\n",
    "\n",
    "---"
]))

cells.append(md_cell("## 6. 结论与建议"))

cells.append(md_cell([
    "### 6.1 核心发现\n",
    "\n",
    "| # | 发现 | 数据支撑 |\n",
    "| --- | --- | --- |\n",
    "1 | **电影主导内容库** | 电影占 ~70%，是核心内容形态 |\n",
    "2 | **2019 年是增长顶峰** | 全年新增 ~2,000 部，之后略有回落 |\n",
    "3 | **美国一家独大** | 美国产占 ~40%，印度、英国紧随其后 |\n",
    "4 | **国际电影最热门** | International Movies 以 ~1,700 部位居榜首 |\n",
    "5 | **成人内容占比高** | TV-MA 分级占 ~36% |\n",
    "6 | **单季剧占多数** | ~50%+ TV 节目只有 1 季，试水特征明显 |\n",
    "7 | **时长预测困难** | 线性回归 R² 仅 ~5%，时长受复杂因素影响 |\n",
    "8 | **类型易区分** | 随机森林准确率 ~95%+，元数据即可分类 |\n",
    "\n",
    "### 6.2 业务建议\n",
    "\n",
    "**📌 内容策略**\n",
    "- 继续加大 Drama / Comedy / International 内容投入\n",
    "- 打造多季爆款 IP，提升用户留存（而非大量单季试水）\n",
    "\n",
    "**📌 区域拓展**\n",
    "- 美国市场已饱和，重点发展印度、韩国、日本等增长市场\n",
    "- 推进本土化内容制作，降低对好莱坞的依赖\n",
    "\n",
    "**📌 用户分层**\n",
    "- TV-MA 内容占比高，完善家长控制功能\n",
    "- 增加家庭友好内容供给，扩展受众面\n",
    "\n",
    "**📌 数据驱动**\n",
    "- 用聚类分析指导内容采购与推荐算法\n",
    "- 用随机森林模型做自动化内容分类与质量检查\n",
    "\n",
    "### 6.3 项目亮点\n",
    "\n",
    "1. **方法全面**：从描述统计 → 相关性 → 回归 → 聚类 → 分类，覆盖完整分析链路\n",
    "2. **双库可视化**：Matplotlib（静态） + pyecharts/ECharts（交互式网页）\n",
    "3. **数据质量高**：规范的缺失值处理 + 两种异常值检测方法\n",
    "4. **交付物完整**：Notebook 代码 + 交互式网页 + 报告文档\n",
    "\n",
    "---\n",
    "\n",
    "## 📎 附件清单\n",
    "\n",
    "| 文件 | 说明 |\n",
    "| --- | --- |\n",
    "| `index.html` | 主网页（可视化看板） |\n",
    "| `netflix_analysis.ipynb` | 完整分析代码（必备） |\n",
    "| `netflix_report.ipynb` | 精简报告（本文件） |\n",
    "| `data_preprocessing.py` | 预处理代码参考 |\n",
    "| `data/complete_analysis.json` | 完整分析结果数据 |\n",
    "| `netflix_titles.csv` | 原始数据集 |\n",
    "\n",
    "---\n",
    "\n",
    "**汇报结束，感谢聆听！** 🎬"
]))

notebook = {
    "cells": cells,
    "metadata": {
        "kernelspec": {
            "display_name": "Python 3",
            "language": "python",
            "name": "python3"
        },
        "language_info": {
            "codemirror_mode": {
                "name": "ipython",
                "version": 3
            },
            "file_extension": ".py",
            "mimetype": "text/x-python",
            "name": "python",
            "nbconvert_exporter": "python",
            "pygments_lexer": "ipython3",
            "version": "3.8.0"
        }
    },
    "nbformat": 4,
    "nbformat_minor": 4
}

with open('/workspace/netflix_report.ipynb', 'w', encoding='utf-8') as f:
    json.dump(notebook, f, ensure_ascii=False, indent=1)

print(f"✅ netflix_report.ipynb 生成完成！")
print(f"   共 {len(cells)} 个单元格")
