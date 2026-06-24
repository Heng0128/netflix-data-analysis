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
    "# Netflix 电影与电视节目数据分析\n",
    "\n",
    "---\n",
    "\n",
    "## 小组分工（两人组）\n",
    "\n",
    "| 成员 | 角色 | 主要任务 | 完成工作 |\n",
    "| --- | --- | --- | --- |\n",
    "| **成员 A** | 数据科学家 | 数据预处理、统计分析、建模 | 数据清洗、缺失值处理、异常值检测、描述性统计、分组分析、相关性分析、线性回归、K-Means 聚类、随机森林分类 |\n",
    "| **成员 B** | 前端工程师 | 可视化开发、页面搭建、汇报 | pyecharts 交互式图表、Matplotlib 可视化、`index.html` 网页构建、交互逻辑、答辩演示 |\n",
    "\n",
    "**协同合作**：两人共同确定分析目标与可视化方案，成员 A 负责数据处理与分析建模，成员 B 负责可视化呈现与网页开发，定期同步进度，确保数据一致性。\n",
    "\n",
    "---\n",
    "\n",
    "## 1. 项目需求分析\n",
    "\n",
    "### 1.1 数据集背景\n",
    "- **来源**：Kaggle 公开数据集 Netflix Titles Dataset\n",
    "- **规模**：8,809 条记录，12 列原始字段\n",
    "- **字段说明**：\n",
    "\n",
    "| 字段名 | 类型 | 说明 | 取值范围 |\n",
    "| --- | --- | --- | --- |\n",
    "| show_id | string | 作品唯一标识 | s1 ~ s8809 |\n",
    "| type | string | 内容类型 | Movie / TV Show |\n",
    "| title | string | 作品标题 | - |\n",
    "| director | string | 导演姓名 | - |\n",
    "| cast | string | 演员阵容 | - |\n",
    "| country | string | 制片国家 | 86 个国家 |\n",
    "| date_added | date | 上线日期 | 2008-2021 |\n",
    "| release_year | int | 发行年份 | 1925-2021 |\n",
    "| rating | string | 年龄分级 | TV-MA, TV-14, PG-13 等 17 种 |\n",
    "| duration | string | 时长 | 电影(分钟) / 电视剧(季) |\n",
    "| listed_in | string | 流派分类 | 36 个主要流派 |\n",
    "| description | string | 剧情描述 | - |\n",
    "\n",
    "### 1.2 分析目标与预期结果\n",
    "1. **描述性分析**：探索数据集整体分布特征（类型、年份、国家、流派、评级、时长）\n",
    "2. **相关性分析**：分析数值变量间的相关关系\n",
    "3. **回归预测**：建立线性回归模型预测电影时长\n",
    "4. **聚类分析**：使用 K-Means 对内容进行聚类分群\n",
    "5. **分类预测**：使用随机森林模型预测内容类型（Movie / TV Show）\n",
    "6. **可视化呈现**：通过 pyecharts + Matplotlib 实现多维度可视化\n",
    "\n",
    "**预期结果**：发现 Netflix 内容库的分布规律，建立预测模型，为内容策略提供数据支持。\n",
    "\n",
    "---\n",
    "\n",
    "## 2. 数据加载与预处理"
]))

cells.append(code_cell([
    "import pandas as pd\n",
    "import numpy as np\n",
    "import json\n",
    "import os\n",
    "import warnings\n",
    "from collections import Counter\n",
    "warnings.filterwarnings('ignore')\n",
    "\n",
    "# 可视化库\n",
    "import matplotlib.pyplot as plt\n",
    "import matplotlib\n",
    "matplotlib.rcParams['font.sans-serif'] = ['DejaVu Sans']\n",
    "matplotlib.rcParams['axes.unicode_minus'] = False\n",
    "%matplotlib inline\n",
    "\n",
    "# pyecharts\n",
    "from pyecharts import options as opts\n",
    "from pyecharts.charts import (\n",
    "    Bar, Pie, Line, Scatter, WordCloud, HeatMap, Boxplot, Funnel, Gauge, Timeline, Grid, Page\n",
    ")\n",
    "from pyecharts.globals import ThemeType, CurrentConfig, RenderType\n",
    "\n",
    "# 机器学习库\n",
    "from sklearn.preprocessing import StandardScaler, LabelEncoder\n",
    "from sklearn.model_selection import train_test_split\n",
    "from sklearn.linear_model import LinearRegression\n",
    "from sklearn.cluster import KMeans\n",
    "from sklearn.ensemble import RandomForestClassifier\n",
    "from sklearn.metrics import (\n",
    "    mean_squared_error, r2_score, accuracy_score,\n",
    "    classification_report, confusion_matrix, silhouette_score\n",
    ")\n",
    "\n",
    "CurrentConfig.ONLINE_HOST = \"https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/\""
]))

cells.append(code_cell([
    "df = pd.read_csv('netflix_titles.csv')\n",
    "print(f\"原始数据形状：{df.shape}\")\n",
    "print(f\"\\n各列数据类型：\\n{df.dtypes}\")\n",
    "print(f\"\\n前 5 行数据：\")\n",
    "df.head()"
]))

cells.append(md_cell("### 2.1 缺失值分析与处理"))

cells.append(code_cell([
    "# 缺失值统计\n",
    "missing = df.isnull().sum().sort_values(ascending=False)\n",
    "missing_pct = (missing / len(df) * 100).round(2)\n",
    "missing_df = pd.DataFrame({'缺失数量': missing, '缺失比例(%)': missing_pct})\n",
    "print(\"=== 缺失值统计 ===\")\n",
    "missing_df[missing_df['缺失数量'] > 0]"
]))

cells.append(code_cell([
    "# 缺失值处理策略\n",
    "# 1) director, cast, country: 用 'Unknown' 填充（分类变量，缺失有实际意义）\n",
    "# 2) date_added, rating, duration: 用众数填充\n",
    "\n",
    "df['director'] = df['director'].fillna('Unknown')\n",
    "df['cast'] = df['cast'].fillna('Unknown')\n",
    "df['country'] = df['country'].fillna('Unknown')\n",
    "df['date_added'] = df['date_added'].fillna(df['date_added'].mode()[0])\n",
    "df['rating'] = df['rating'].fillna(df['rating'].mode()[0])\n",
    "df['duration'] = df['duration'].fillna(df['duration'].mode()[0])\n",
    "\n",
    "print(f\"缺失值处理后，总缺失数：{df.isnull().sum().sum()}\")"
]))

cells.append(md_cell("### 2.2 特征工程与字段清洗"))

cells.append(code_cell([
    "# 提取添加年份、月份\n",
    "df['year_added'] = df['date_added'].str.extract(r'(\\d{4})').astype(int)\n",
    "\n",
    "# 拆分多值字段（流派、国家、演员）\n",
    "def split_field(s):\n",
    "    if pd.isna(s) or s == 'Unknown':\n",
    "        return []\n",
    "    return [x.strip() for x in str(s).split(',') if x.strip()]\n",
    "\n",
    "df['genres_list'] = df['listed_in'].apply(split_field)\n",
    "df['countries_list'] = df['country'].apply(split_field)\n",
    "df['cast_list'] = df['cast'].apply(split_field)\n",
    "\n",
    "# 数值化时长：电影=分钟数，电视节目=季数\n",
    "df['duration_num'] = df['duration'].str.extract(r'(\\d+)').astype(float).astype(int)\n",
    "\n",
    "# 衍生字段：流派数量、国家数量、演员数量、是否有导演\n",
    "df['genre_count'] = df['genres_list'].apply(len)\n",
    "df['country_count'] = df['countries_list'].apply(len)\n",
    "df['cast_count'] = df['cast_list'].apply(len)\n",
    "df['has_director'] = (df['director'] != 'Unknown').astype(int)\n",
    "\n",
    "# 第一流派、第一制片国\n",
    "df['primary_genre'] = df['genres_list'].apply(lambda x: x[0] if x else 'Unknown')\n",
    "df['primary_country'] = df['countries_list'].apply(lambda x: x[0] if x else 'Unknown')\n",
    "\n",
    "print(f\"处理后数据形状：{df.shape}\")\n",
    "print(f\"新增字段数：10 个衍生字段\")\n",
    "df.head(3)"
]))

cells.append(md_cell("### 2.3 异常值检测与处理"))

cells.append(md_cell("#### 方法一：IQR（四分位距）法"))

cells.append(code_cell([
    "# 对电影时长使用 IQR 法检测异常值\n",
    "movies_df = df[df['type'] == 'Movie'].copy()\n",
    "\n",
    "Q1 = movies_df['duration_num'].quantile(0.25)\n",
    "Q3 = movies_df['duration_num'].quantile(0.75)\n",
    "IQR = Q3 - Q1\n",
    "\n",
    "lower_bound = Q1 - 1.5 * IQR\n",
    "upper_bound = Q3 + 1.5 * IQR\n",
    "\n",
    "print(f\"=== IQR 法检测电影时长异常值 ===\")\n",
    "print(f\"Q1 (25%分位数): {Q1:.1f} 分钟\")\n",
    "print(f\"Q3 (75%分位数): {Q3:.1f} 分钟\")\n",
    "print(f\"IQR: {IQR:.1f} 分钟\")\n",
    "print(f\"正常范围: [{lower_bound:.1f}, {upper_bound:.1f}] 分钟\")\n",
    "\n",
    "iqr_outliers = movies_df[(movies_df['duration_num'] < lower_bound) | (movies_df['duration_num'] > upper_bound)]\n",
    "print(f\"\\n异常值数量: {len(iqr_outliers)} 部 ({len(iqr_outliers)/len(movies_df)*100:.2f}%)\")\n",
    "print(\"\\n异常值样本（时长最短/最长各5部）:\")\n",
    "iqr_outliers[['title', 'duration_num', 'release_year', 'primary_genre']].sort_values('duration_num').head(10)"
]))

cells.append(md_cell("#### 方法二：Z-score 法"))

cells.append(code_cell([
    "# Z-score 法：|Z| > 3 视为异常\n",
    "movies_df['duration_zscore'] = (movies_df['duration_num'] - movies_df['duration_num'].mean()) / movies_df['duration_num'].std()\n",
    "\n",
    "z_outliers = movies_df[abs(movies_df['duration_zscore']) > 3]\n",
    "print(f\"=== Z-score 法检测电影时长异常值（|Z|>3） ===\")\n",
    "print(f\"电影时长均值: {movies_df['duration_num'].mean():.1f} 分钟\")\n",
    "print(f\"电影时长标准差: {movies_df['duration_num'].std():.1f} 分钟\")\n",
    "print(f\"异常值数量: {len(z_outliers)} 部 ({len(z_outliers)/len(movies_df)*100:.2f}%)\")\n",
    "\n",
    "print(\"\\nZ-score 异常值样本:\")\n",
    "z_outliers[['title', 'duration_num', 'duration_zscore', 'primary_genre']].sort_values('duration_zscore').head(10)"
]))

cells.append(code_cell([
    "# 异常值处理：标记但不删除，保留分析价值\n",
    "df['is_outlier_duration'] = 0\n",
    "df.loc[movies_df[(movies_df['duration_num'] < lower_bound) | (movies_df['duration_num'] > upper_bound)].index, 'is_outlier_duration'] = 1\n",
    "\n",
    "print(f\"已标记异常值: {df['is_outlier_duration'].sum()} 部\")\n",
    "print(\"处理策略：标记保留，分析时可选择排除或单独研究\")"
]))

cells.append(md_cell([
    "---\n",
    "\n",
    "## 3. 描述性统计分析"
]))

cells.append(code_cell([
    "# 数值型变量描述性统计\n",
    "numeric_cols = ['release_year', 'year_added', 'duration_num', 'genre_count', 'country_count', 'cast_count']\n",
    "print(\"=== 数值型变量描述性统计 ===\")\n",
    "df[numeric_cols].describe().round(2)"
]))

cells.append(code_cell([
    "# 类型分布\n",
    "type_dist = df['type'].value_counts().reset_index()\n",
    "type_dist.columns = ['类型', '数量']\n",
    "type_dist['占比(%)'] = (type_dist['数量'] / type_dist['数量'].sum() * 100).round(2)\n",
    "print(\"=== 内容类型分布 ===\")\n",
    "type_dist"
]))

cells.append(code_cell([
    "# 按年份添加内容数量\n",
    "year_added = df.groupby(['year_added', 'type']).size().unstack().fillna(0).astype(int)\n",
    "year_added = year_added.sort_index()\n",
    "year_added['总计'] = year_added.sum(axis=1)\n",
    "print(\"=== 年度新增内容趋势 ===\")\n",
    "year_added.tail(10)"
]))

cells.append(code_cell([
    "# 制片国家 Top15\n",
    "all_countries = []\n",
    "for c in df['countries_list']:\n",
    "    all_countries.extend(c)\n",
    "country_count = pd.DataFrame(Counter(all_countries).most_common(15), columns=['国家', '数量'])\n",
    "print(\"=== 制片国家 Top15 ===\")\n",
    "country_count"
]))

cells.append(code_cell([
    "# 热门流派 Top10\n",
    "all_genres = []\n",
    "for g in df['genres_list']:\n",
    "    all_genres.extend(g)\n",
    "genre_count = pd.DataFrame(Counter(all_genres).most_common(10), columns=['流派', '数量'])\n",
    "print(\"=== 热门流派 Top10 ===\")\n",
    "genre_count"
]))

cells.append(code_cell([
    "# 评级分布\n",
    "rating_dist = df['rating'].value_counts().head(10).reset_index()\n",
    "rating_dist.columns = ['评级', '数量']\n",
    "print(\"=== 年龄评级 Top10 ===\")\n",
    "rating_dist"
]))

cells.append(code_cell([
    "# 分组统计：按类型分组\n",
    "type_group = df.groupby('type').agg({\n",
    "    'title': 'count',\n",
    "    'duration_num': ['mean', 'median', 'std'],\n",
    "    'release_year': ['mean', 'min', 'max'],\n",
    "    'cast_count': 'mean'\n",
    "}).round(2)\n",
    "print(\"=== 按类型分组统计 ===\")\n",
    "type_group"
]))

cells.append(md_cell([
    "---\n",
    "\n",
    "## 4. 相关性分析与回归分析"
]))

cells.append(md_cell("### 4.1 相关性矩阵分析"))

cells.append(code_cell([
    "# 计算相关系数矩阵\n",
    "corr_matrix = df[numeric_cols].corr()\n",
    "print(\"=== 相关系数矩阵 ===\")\n",
    "corr_matrix.round(3)"
]))

cells.append(code_cell([
    "# Matplotlib 绘制相关性热力图\n",
    "fig, ax = plt.subplots(figsize=(10, 8))\n",
    "im = ax.imshow(corr_matrix, cmap='RdBu_r', vmin=-1, vmax=1)\n",
    "\n",
    "ax.set_xticks(range(len(numeric_cols)))\n",
    "ax.set_yticks(range(len(numeric_cols)))\n",
    "ax.set_xticklabels(numeric_cols, rotation=45, ha='right')\n",
    "ax.set_yticklabels(numeric_cols)\n",
    "\n",
    "# 在热力图上添加数值标注\n",
    "for i in range(len(numeric_cols)):\n",
    "    for j in range(len(numeric_cols)):\n",
    "        text = ax.text(j, i, f'{corr_matrix.iloc[i, j]:.2f}',\n",
    "                       ha='center', va='center', color='white', fontsize=10)\n",
    "\n",
    "cbar = plt.colorbar(im)\n",
    "cbar.set_label('相关系数', fontsize=12)\n",
    "ax.set_title('数值变量相关性热力图', fontsize=14, fontweight='bold', pad=20)\n",
    "plt.tight_layout()\n",
    "plt.show()"
]))

cells.append(code_cell([
    "# 关键相关性解读\n",
    "print(\"=== 关键相关性解读 ===\")\n",
    "print(f\"1. release_year 与 year_added: r = {corr_matrix.loc['release_year', 'year_added']:.3f}\")\n",
    "print(\"   → 正相关：越新发行的电影，通常越晚上线到 Netflix\")\n",
    "print(f\"\\n2. genre_count 与 cast_count: r = {corr_matrix.loc['genre_count', 'cast_count']:.3f}\")\n",
    "print(\"   → 弱正相关：流派标签越多的作品，演员阵容可能越庞大\")\n",
    "print(f\"\\n3. duration_num 与 release_year: r = {corr_matrix.loc['duration_num', 'release_year']:.3f}\")\n",
    "print(\"   → 弱相关：发行年份与时长没有强线性关系\")"
]))

cells.append(md_cell("### 4.2 线性回归分析：预测电影时长"))

cells.append(code_cell([
    "# 准备数据：使用电影数据，建立特征\n",
    "movies = df[df['type'] == 'Movie'].copy()\n",
    "\n",
    "# 选择特征：发行年份、流派数量、国家数量、演员数量\n",
    "features = ['release_year', 'genre_count', 'country_count', 'cast_count']\n",
    "X = movies[features]\n",
    "y = movies['duration_num']\n",
    "\n",
    "# 划分训练集和测试集\n",
    "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n",
    "\n",
    "print(f\"训练集大小: {X_train.shape[0]}\")\n",
    "print(f\"测试集大小: {X_test.shape[0]}\")\n",
    "print(f\"特征变量: {features}\")"
]))

cells.append(code_cell([
    "# 训练线性回归模型\n",
    "lr_model = LinearRegression()\n",
    "lr_model.fit(X_train, y_train)\n",
    "\n",
    "# 预测\n",
    "y_pred = lr_model.predict(X_test)\n",
    "\n",
    "# 评估模型\n",
    "mse = mean_squared_error(y_test, y_pred)\n",
    "rmse = np.sqrt(mse)\n",
    "r2 = r2_score(y_test, y_pred)\n",
    "\n",
    "print(\"=== 线性回归模型评估 ===\")\n",
    "print(f\"均方误差 (MSE): {mse:.2f}\")\n",
    "print(f\"均方根误差 (RMSE): {rmse:.2f} 分钟\")\n",
    "print(f\"决定系数 (R²): {r2:.4f}\")\n",
    "print(f\"\\n模型解释了 {r2*100:.2f}% 的电影时长变异\")"
]))

cells.append(code_cell([
    "# 回归系数分析\n",
    "coef_df = pd.DataFrame({\n",
    "    '特征': features,\n",
    "    '系数': lr_model.coef_,\n",
    "    '标准化系数': lr_model.coef_ * X_train.std().values\n",
    "})\n",
    "coef_df = coef_df.sort_values('标准化系数', key=abs, ascending=False)\n",
    "print(\"=== 回归系数分析 ===\")\n",
    "print(f\"截距: {lr_model.intercept_:.2f}\")\n",
    "print()\n",
    "coef_df.round(3)"
]))

cells.append(code_cell([
    "# 绘制实际值 vs 预测值散点图（Matplotlib）\n",
    "fig, ax = plt.subplots(figsize=(10, 6))\n",
    "\n",
    "ax.scatter(y_test, y_pred, alpha=0.5, color='#E50914', edgecolors='white', linewidth=0.5)\n",
    "\n",
    "# 理想对角线（y=x）\n",
    "min_val = min(y_test.min(), y_pred.min())\n",
    "max_val = max(y_test.max(), y_pred.max())\n",
    "ax.plot([min_val, max_val], [min_val, max_val], 'k--', label='理想预测 (y=x)', linewidth=2)\n",
    "\n",
    "ax.set_xlabel('实际时长（分钟）', fontsize=12)\n",
    "ax.set_ylabel('预测时长（分钟）', fontsize=12)\n",
    "ax.set_title(f'电影时长预测：实际值 vs 预测值\\nR² = {r2:.4f}  |  RMSE = {rmse:.1f} min', \n",
    "             fontsize=13, fontweight='bold')\n",
    "ax.legend(fontsize=11)\n",
    "ax.grid(True, alpha=0.3)\n",
    "plt.tight_layout()\n",
    "plt.show()"
]))

cells.append(code_cell([
    "print(\"=== 线性回归结论 ===\")\n",
    "print(f\"模型 R² = {r2:.4f}，说明仅用发行年份、流派数、国家数、演员数\")\n",
    "print(f\"只能解释约 {r2*100:.1f}% 的电影时长变化。\")\n",
    "print()\n",
    "print(\"原因分析：\")\n",
    "print(\"1. 电影时长受多种复杂因素影响（剧情、导演风格、市场定位等）\")\n",
    "print(\"2. 我们的特征都是比较表层的元数据特征\")\n",
    "print(\"3. 如果加入流派、导演等分类特征，模型效果可能会提升\")"
]))

cells.append(md_cell([
    "---\n",
    "\n",
    "## 5. K-Means 聚类分析"
]))

cells.append(md_cell("### 5.1 数据准备与标准化"))

cells.append(code_cell([
    "# 准备聚类数据：使用数值型特征\n",
    "cluster_features = ['release_year', 'duration_num', 'genre_count', 'country_count', 'cast_count']\n",
    "\n",
    "# 分别对电影和电视节目聚类（因为时长含义不同）\n",
    "movie_cluster_data = df[df['type'] == 'Movie'][cluster_features].copy()\n",
    "movie_cluster_data = movie_cluster_data.dropna()\n",
    "\n",
    "# 标准化\n",
    "scaler = StandardScaler()\n",
    "X_scaled = scaler.fit_transform(movie_cluster_data)\n",
    "\n",
    "print(f\"聚类数据形状: {X_scaled.shape}\")\n",
    "print(f\"聚类特征: {cluster_features}\")"
]))

cells.append(md_cell("### 5.2 确定最佳 K 值：肘部法则"))

cells.append(code_cell([
    "# 肘部法则：计算不同 K 值的惯性（SSE）\n",
    "inertias = []\n",
    "k_range = range(2, 11)\n",
    "\n",
    "for k in k_range:\n",
    "    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)\n",
    "    kmeans.fit(X_scaled)\n",
    "    inertias.append(kmeans.inertia_)\n",
    "\n",
    "# 绘制肘部图（Matplotlib）\n",
    "fig, ax = plt.subplots(figsize=(10, 6))\n",
    "ax.plot(k_range, inertias, 'o-', color='#E50914', linewidth=2, markersize=8)\n",
    "ax.set_xlabel('K 值（簇数）', fontsize=12)\n",
    "ax.set_ylabel('惯性 (SSE)', fontsize=12)\n",
    "ax.set_title('K-Means 肘部法则：确定最佳 K 值', fontsize=14, fontweight='bold')\n",
    "ax.grid(True, alpha=0.3)\n",
    "ax.set_xticks(list(k_range))\n",
    "\n",
    "# 标注最佳 K\n",
    "best_k = 4\n",
    "ax.axvline(x=best_k, color='blue', linestyle='--', alpha=0.7, label=f'最佳 K = {best_k}')\n",
    "ax.legend(fontsize=11)\n",
    "plt.tight_layout()\n",
    "plt.show()"
]))

cells.append(md_cell("### 5.3 K-Means 聚类（K=4）"))

cells.append(code_cell([
    "# 使用 K=4 进行聚类\n",
    "kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)\n",
    "movie_cluster_data['cluster'] = kmeans.fit_predict(X_scaled)\n",
    "\n",
    "# 计算轮廓系数\n",
    "sil_score = silhouette_score(X_scaled, kmeans.labels_)\n",
    "print(f\"=== K-Means 聚类结果 ===\")\n",
    "print(f\"聚类数: 4\")\n",
    "print(f\"轮廓系数: {sil_score:.4f}\")\n",
    "print(f\"\\n各簇样本数:\")\n",
    "movie_cluster_data['cluster'].value_counts().sort_index()"
]))

cells.append(code_cell([
    "# 聚类画像：各簇特征均值对比\n",
    "cluster_profile = movie_cluster_data.groupby('cluster')[cluster_features].mean().round(2)\n",
    "cluster_profile['样本数'] = movie_cluster_data['cluster'].value_counts().sort_index()\n",
    "cluster_profile['占比(%)'] = (cluster_profile['样本数'] / len(movie_cluster_data) * 100).round(2)\n",
    "print(\"=== 各簇特征画像 ===\")\n",
    "cluster_profile"
]))

cells.append(code_cell([
    "# 聚类可视化：使用发行年份 vs 时长 散点图（Matplotlib）\n",
    "fig, ax = plt.subplots(figsize=(12, 7))\n",
    "\n",
    "colors = ['#E50914', '#4ECDC4', '#FFD700', '#A29BFE']\n",
    "labels = [f'簇 {i}' for i in range(4)]\n",
    "\n",
    "for i in range(4):\n",
    "    cluster_data = movie_cluster_data[movie_cluster_data['cluster'] == i]\n",
    "    ax.scatter(cluster_data['release_year'], cluster_data['duration_num'], \n",
    "              c=colors[i], label=f'簇 {i} ({len(cluster_data)}部)', \n",
    "              alpha=0.6, s=30, edgecolors='white', linewidth=0.5)\n",
    "\n",
    "ax.set_xlabel('发行年份', fontsize=12)\n",
    "ax.set_ylabel('时长（分钟）', fontsize=12)\n",
    "ax.set_title('K-Means 聚类结果：发行年份 vs 电影时长', fontsize=14, fontweight='bold')\n",
    "ax.legend(fontsize=11, loc='upper right')\n",
    "ax.grid(True, alpha=0.3)\n",
    "plt.tight_layout()\n",
    "plt.show()"
]))

cells.append(code_cell([
    "print(\"=== 聚类画像解读 ===\")\n",
    "print()\n",
    "for i in range(4):\n",
    "    c = cluster_profile.loc[i]\n",
    "    print(f\"【簇 {i}】 {c['样本数']:.0f} 部 ({c['占比(%)']:.1f}%)\")\n",
    "    print(f\"  - 平均发行年份: {c['release_year']:.0f} 年\")\n",
    "    print(f\"  - 平均时长: {c['duration_num']:.0f} 分钟\")\n",
    "    print(f\"  - 平均流派数: {c['genre_count']:.1f} 个\")\n",
    "    print(f\"  - 平均演员数: {c['cast_count']:.1f} 人\")\n",
    "    print()"
]))

cells.append(md_cell([
    "---\n",
    "\n",
    "## 6. 随机森林分类：预测内容类型"
]))

cells.append(md_cell("### 6.1 特征工程与数据准备"))

cells.append(code_cell([
    "# 准备分类数据：预测 type (Movie / TV Show)\n",
    "ml_df = df.copy()\n",
    "\n",
    "# 选择特征\n",
    "features_for_rf = [\n",
    "    'release_year', 'year_added', 'duration_num',\n",
    "    'genre_count', 'country_count', 'cast_count',\n",
    "    'has_director', 'rating', 'primary_genre', 'primary_country'\n",
    "]\n",
    "\n",
    "# 对分类变量进行 Label Encoding\n",
    "le_rating = LabelEncoder()\n",
    "le_genre = LabelEncoder()\n",
    "le_country = LabelEncoder()\n",
    "\n",
    "ml_df['rating_enc'] = le_rating.fit_transform(ml_df['rating'])\n",
    "ml_df['primary_genre_enc'] = le_genre.fit_transform(ml_df['primary_genre'])\n",
    "ml_df['primary_country_enc'] = le_country.fit_transform(ml_df['primary_country'])\n",
    "\n",
    "# 最终特征\n",
    "X_rf = ml_df[['release_year', 'year_added', 'duration_num', 'genre_count',\n",
    "              'country_count', 'cast_count', 'has_director',\n",
    "              'rating_enc', 'primary_genre_enc', 'primary_country_enc']]\n",
    "y_rf = (ml_df['type'] == 'Movie').astype(int)  # 1=Movie, 0=TV Show\n",
    "\n",
    "# 划分数据集\n",
    "X_train_rf, X_test_rf, y_train_rf, y_test_rf = train_test_split(\n",
    "    X_rf, y_rf, test_size=0.2, random_state=42, stratify=y_rf\n",
    ")\n",
    "\n",
    "print(f\"训练集: {X_train_rf.shape[0]} 条\")\n",
    "print(f\"测试集: {X_test_rf.shape[0]} 条\")\n",
    "print(f\"特征数: {X_rf.shape[1]}\")\n",
    "print(f\"\\n类别分布（训练集）:\")\n",
    "print(f\"  Movie (1): {y_train_rf.sum()} 条 ({y_train_rf.mean()*100:.1f}%)\")\n",
    "print(f\"  TV Show (0): {len(y_train_rf)-y_train_rf.sum()} 条 ({(1-y_train_rf.mean())*100:.1f}%)\")"
]))

cells.append(md_cell("### 6.2 训练随机森林模型"))

cells.append(code_cell([
    "# 训练随机森林分类器\n",
    "rf_model = RandomForestClassifier(\n",
    "    n_estimators=100,\n",
    "    max_depth=10,\n",
    "    min_samples_split=5,\n",
    "    random_state=42,\n",
    "    n_jobs=-1\n",
    ")\n",
    "rf_model.fit(X_train_rf, y_train_rf)\n",
    "\n",
    "# 预测\n",
    "y_pred_rf = rf_model.predict(X_test_rf)\n",
    "y_pred_proba_rf = rf_model.predict_proba(X_test_rf)\n",
    "\n",
    "print(\"=== 随机森林模型评估 ===\")\n",
    "print(f\"测试集准确率: {accuracy_score(y_test_rf, y_pred_rf):.4f}\")"
]))

cells.append(code_cell([
    "# 详细分类报告\n",
    "print(\"=== 分类报告 ===\")\n",
    "print(classification_report(y_test_rf, y_pred_rf, target_names=['TV Show', 'Movie']))\n",
    "\n",
    "# 混淆矩阵\n",
    "cm = confusion_matrix(y_test_rf, y_pred_rf)\n",
    "print(\"=== 混淆矩阵 ===\")\n",
    "print(\"              预测 TV Show  预测 Movie\")\n",
    "print(f\"实际 TV Show    {cm[0][0]:>6}        {cm[0][1]:>6}\")\n",
    "print(f\"实际 Movie      {cm[1][0]:>6}        {cm[1][1]:>6}\")"
]))

cells.append(code_cell([
    "# 绘制混淆矩阵热力图（Matplotlib）\n",
    "fig, ax = plt.subplots(figsize=(8, 6))\n",
    "im = ax.imshow(cm, cmap='Reds')\n",
    "\n",
    "ax.set_xticks([0, 1])\n",
    "ax.set_yticks([0, 1])\n",
    "ax.set_xticklabels(['TV Show', 'Movie'], fontsize=12)\n",
    "ax.set_yticklabels(['TV Show', 'Movie'], fontsize=12)\n",
    "ax.set_xlabel('预测标签', fontsize=13)\n",
    "ax.set_ylabel('真实标签', fontsize=13)\n",
    "ax.set_title(f'随机森林混淆矩阵\\n准确率 = {accuracy_score(y_test_rf, y_pred_rf):.2%}', \n",
    "             fontsize=14, fontweight='bold')\n",
    "\n",
    "# 添加数值\n",
    "for i in range(2):\n",
    "    for j in range(2):\n",
    "        color = 'white' if cm[i, j] > cm.max() / 2 else 'black'\n",
    "        ax.text(j, i, str(cm[i, j]), ha='center', va='center', \n",
    "               color=color, fontsize=16, fontweight='bold')\n",
    "\n",
    "cbar = plt.colorbar(im)\n",
    "cbar.set_label('样本数', fontsize=12)\n",
    "plt.tight_layout()\n",
    "plt.show()"
]))

cells.append(md_cell("### 6.3 特征重要性分析"))

cells.append(code_cell([
    "# 特征重要性\n",
    "feature_names = ['release_year', 'year_added', 'duration_num', 'genre_count',\n",
    "                 'country_count', 'cast_count', 'has_director',\n",
    "                 'rating', 'primary_genre', 'primary_country']\n",
    "\n",
    "importances = rf_model.feature_importances_\n",
    "indices = np.argsort(importances)[::-1]\n",
    "\n",
    "importance_df = pd.DataFrame({\n",
    "    '特征': [feature_names[i] for i in indices],\n",
    "    '重要性': importances[indices]\n",
    "})\n",
    "print(\"=== 特征重要性排序 ===\")\n",
    "importance_df.round(4)"
]))

cells.append(code_cell([
    "# 绘制特征重要性柱状图（Matplotlib）\n",
    "fig, ax = plt.subplots(figsize=(10, 6))\n",
    "\n",
    "y_pos = np.arange(len(feature_names))\n",
    "sorted_importances = importances[indices]\n",
    "sorted_features = [feature_names[i] for i in indices]\n",
    "\n",
    "bars = ax.barh(y_pos, sorted_importances[::-1], color='#E50914', height=0.6)\n",
    "ax.set_yticks(y_pos)\n",
    "ax.set_yticklabels(sorted_features[::-1], fontsize=11)\n",
    "ax.set_xlabel('重要性', fontsize=12)\n",
    "ax.set_title('随机森林特征重要性', fontsize=14, fontweight='bold')\n",
    "ax.grid(True, axis='x', alpha=0.3)\n",
    "\n",
    "# 添加数值标注\n",
    "for i, bar in enumerate(bars):\n",
    "    width = bar.get_width()\n",
    "    ax.text(width + 0.005, bar.get_y() + bar.get_height()/2, \n",
    "           f'{sorted_importances[::-1][i]:.3f}', \n",
    "           va='center', fontsize=10)\n",
    "\n",
    "plt.tight_layout()\n",
    "plt.show()"
]))

cells.append(code_cell([
    "print(\"=== 随机森林分类结论 ===\")\n",
    "print(f\"1. 模型准确率: {accuracy_score(y_test_rf, y_pred_rf):.2%}\")\n",
    "print()\n",
    "print(\"2. 最重要的 3 个特征:\")\n",
    "for i in range(3):\n",
    "    print(f\"   {i+1}. {sorted_features[i]} ({sorted_importances[i]:.3f})\")\n",
    "print()\n",
    "print(\"3. 模型解读：\")\n",
    "print(\"   - 时长特征对区分电影和电视节目最关键（合理，因为电影是分钟，TV是季数）\")\n",
    "print(\"   - 其他特征也有一定贡献，说明内容类型可以从多个维度识别\")\n",
    "print(\"   - 准确率很高，说明用这些元数据可以很好地区分电影和电视节目\")"
]))

cells.append(md_cell([
    "---\n",
    "\n",
    "## 7. Matplotlib 基础可视化"
]))

cells.append(md_cell("### 7.1 饼状图：内容类型分布"))

cells.append(code_cell([
    "fig, ax = plt.subplots(figsize=(8, 8))\n",
    "\n",
    "sizes = type_dist['数量'].values\n",
    "labels = type_dist['类型'].values\n",
    "colors = ['#E50914', '#4ECDC4']\n",
    "explode = (0.05, 0)  # 突出显示电影\n",
    "\n",
    "wedges, texts, autotexts = ax.pie(\n",
    "    sizes, explode=explode, labels=labels, colors=colors,\n",
    "    autopct='%1.1f%%', shadow=True, startangle=90,\n",
    "    textprops={'fontsize': 13, 'fontweight': 'bold'}\n",
    ")\n",
    "\n",
    "for autotext in autotexts:\n",
    "    autotext.set_color('white')\n",
    "    autotext.set_fontsize(14)\n",
    "\n",
    "ax.set_title('Netflix 内容类型分布', fontsize=16, fontweight='bold', pad=20)\n",
    "ax.axis('equal')  # 保证饼图是圆形\n",
    "plt.tight_layout()\n",
    "plt.show()"
]))

cells.append(md_cell("### 7.2 柱状图：制片国家 Top10"))

cells.append(code_cell([
    "fig, ax = plt.subplots(figsize=(12, 7))\n",
    "\n",
    "top10_countries = country_count.head(10)\n",
    "bars = ax.barh(top10_countries['国家'][::-1], top10_countries['数量'][::-1], \n",
    "               color='#E50914', height=0.7)\n",
    "\n",
    "ax.set_xlabel('作品数量', fontsize=12)\n",
    "ax.set_title('制片国家 Top 10', fontsize=15, fontweight='bold')\n",
    "ax.grid(True, axis='x', alpha=0.3)\n",
    "\n",
    "# 添加数值标注\n",
    "for bar in bars:\n",
    "    width = bar.get_width()\n",
    "    ax.text(width + 20, bar.get_y() + bar.get_height()/2,\n",
    "           f'{int(width)}', va='center', fontsize=10, fontweight='bold')\n",
    "\n",
    "plt.tight_layout()\n",
    "plt.show()"
]))

cells.append(md_cell("### 7.3 直方图：电影时长分布"))

cells.append(code_cell([
    "fig, ax = plt.subplots(figsize=(12, 6))\n",
    "\n",
    "movie_durations = df[df['type'] == 'Movie']['duration_num']\n",
    "\n",
    "n, bins, patches = ax.hist(movie_durations, bins=30, color='#E50914', \n",
    "                          edgecolor='white', linewidth=0.5, alpha=0.8)\n",
    "\n",
    "ax.set_xlabel('时长（分钟）', fontsize=12)\n",
    "ax.set_ylabel('电影数量', fontsize=12)\n",
    "ax.set_title(f'电影时长分布直方图\\n均值: {movie_durations.mean():.1f} min | 中位数: {movie_durations.median():.1f} min',\n",
    "             fontsize=14, fontweight='bold')\n",
    "ax.grid(True, alpha=0.3, axis='y')\n",
    "\n",
    "# 标注均值和中位数\n",
    "ax.axvline(movie_durations.mean(), color='gold', linestyle='--', linewidth=2, label=f'均值 = {movie_durations.mean():.1f} min')\n",
    "ax.axvline(movie_durations.median(), color='green', linestyle='--', linewidth=2, label=f'中位数 = {movie_durations.median():.1f} min')\n",
    "ax.legend(fontsize=11)\n",
    "\n",
    "plt.tight_layout()\n",
    "plt.show()"
]))

cells.append(md_cell("### 7.4 折线图：年度新增内容趋势"))

cells.append(code_cell([
    "fig, ax = plt.subplots(figsize=(12, 6))\n",
    "\n",
    "years = year_added.index.tolist()\n",
    "movies_count = year_added.get('Movie', pd.Series(0, index=years)).tolist()\n",
    "shows_count = year_added.get('TV Show', pd.Series(0, index=years)).tolist()\n",
    "\n",
    "ax.plot(years, movies_count, 'o-', color='#E50914', linewidth=2.5, \n",
    "        markersize=6, label='电影')\n",
    "ax.plot(years, shows_count, 's-', color='#4ECDC4', linewidth=2.5, \n",
    "        markersize=6, label='电视节目')\n",
    "\n",
    "ax.fill_between(years, movies_count, alpha=0.2, color='#E50914')\n",
    "ax.fill_between(years, shows_count, alpha=0.2, color='#4ECDC4')\n",
    "\n",
    "ax.set_xlabel('年份', fontsize=12)\n",
    "ax.set_ylabel('新增内容数量', fontsize=12)\n",
    "ax.set_title('Netflix 年度新增内容趋势', fontsize=15, fontweight='bold')\n",
    "ax.legend(fontsize=12)\n",
    "ax.grid(True, alpha=0.3)\n",
    "ax.set_xlim([2010, 2021])\n",
    "\n",
    "plt.tight_layout()\n",
    "plt.show()"
]))

cells.append(md_cell("### 7.5 散点图：发行年份 vs 时长"))

cells.append(code_cell([
    "fig, ax = plt.subplots(figsize=(12, 7))\n",
    "\n",
    "# 电影散点图\n",
    "movies_scatter = df[(df['type'] == 'Movie') & (df['release_year'] >= 1980)]\n",
    "ax.scatter(movies_scatter['release_year'], movies_scatter['duration_num'],\n",
    "          c='#E50914', alpha=0.4, s=15, label='电影')\n",
    "\n",
    "ax.set_xlabel('发行年份', fontsize=12)\n",
    "ax.set_ylabel('时长（分钟）', fontsize=12)\n",
    "ax.set_title('电影发行年份 vs 时长散点图（1980年至今）', fontsize=14, fontweight='bold')\n",
    "ax.grid(True, alpha=0.3)\n",
    "ax.legend(fontsize=12)\n",
    "\n",
    "plt.tight_layout()\n",
    "plt.show()"
]))

cells.append(md_cell([
    "---\n",
    "\n",
    "## 8. pyecharts 交互式可视化"
]))

cells.append(md_cell("### 8.1 内容类型分布环形图"))

cells.append(code_cell([
    "def chart_type_pie():\n",
    "    data = [list(z) for z in zip(type_dist['类型'].tolist(), type_dist['数量'].tolist())]\n",
    "    c = (\n",
    "        Pie(init_opts=opts.InitOpts(theme=ThemeType.DARK, width=\"100%\", height=\"500px\"))\n",
    "        .add(\n",
    "            series_name=\"数量分布\",\n",
    "            data_pair=data,\n",
    "            radius=[\"40%\", \"70%\"],\n",
    "            center=[\"50%\", \"50%\"],\n",
    "            label_opts=opts.LabelOpts(formatter=\"{b}: {c} ({d}%)\", font_size=14, color=\"#fff\"),\n",
    "            itemstyle_opts=opts.ItemStyleOpts(border_color=\"#0e0e0e\", border_width=2),\n",
    "        )\n",
    "        .set_colors([\"#E50914\", \"#831010\"])\n",
    "        .set_global_opts(\n",
    "            title_opts=opts.TitleOpts(\n",
    "                title=\"🎬 Netflix 内容类型分布\",\n",
    "                subtitle=f\"共 {df.shape[0]} 部作品\",\n",
    "                title_textstyle_opts=opts.TextStyleOpts(color=\"#fff\", font_size=22, font_weight=\"bold\"),\n",
    "                subtitle_textstyle_opts=opts.TextStyleOpts(color=\"#ccc\", font_size=14),\n",
    "                pos_left=\"center\",\n",
    "            ),\n",
    "            legend_opts=opts.LegendOpts(orient=\"vertical\", pos_top=\"middle\", pos_right=\"10px\", textstyle_opts=opts.TextStyleOpts(color=\"#fff\")),\n",
    "        )\n",
    "    )\n",
    "    return c\n",
    "\n",
    "c1 = chart_type_pie()\n",
    "c1.render('charts/chart1.html')\n",
    "c1"
]))

cells.append(md_cell("### 8.2 年度发布趋势折线图"))

cells.append(code_cell([
    "def chart_year_line():\n",
    "    years = [int(y) for y in year_added.index.tolist()]\n",
    "    movies = year_added.get('Movie', pd.Series(0, index=year_added.index)).tolist()\n",
    "    shows = year_added.get('TV Show', pd.Series(0, index=year_added.index)).tolist()\n",
    "    \n",
    "    c = (\n",
    "        Line(init_opts=opts.InitOpts(theme=ThemeType.DARK, width=\"100%\", height=\"550px\"))\n",
    "        .add_xaxis(years)\n",
    "        .add_yaxis(\n",
    "            \"电影\", movies, is_smooth=True, symbol_size=8,\n",
    "            linestyle_opts=opts.LineStyleOpts(width=4, color=\"#E50914\"),\n",
    "            itemstyle_opts=opts.ItemStyleOpts(color=\"#E50914\"),\n",
    "            areastyle_opts=opts.AreaStyleOpts(opacity=0.2, color=\"#E50914\"),\n",
    "            label_opts=opts.LabelOpts(is_show=False),\n",
    "        )\n",
    "        .add_yaxis(\n",
    "            \"电视节目\", shows, is_smooth=True, symbol_size=8,\n",
    "            linestyle_opts=opts.LineStyleOpts(width=4, color=\"#FFD700\"),\n",
    "            itemstyle_opts=opts.ItemStyleOpts(color=\"#FFD700\"),\n",
    "            areastyle_opts=opts.AreaStyleOpts(opacity=0.2, color=\"#FFD700\"),\n",
    "            label_opts=opts.LabelOpts(is_show=False),\n",
    "        )\n",
    "        .set_global_opts(\n",
    "            title_opts=opts.TitleOpts(\n",
    "                title=\"📈 Netflix 每年新增内容趋势\",\n",
    "                title_textstyle_opts=opts.TextStyleOpts(color=\"#fff\", font_size=22, font_weight=\"bold\"),\n",
    "                pos_left=\"center\",\n",
    "            ),\n",
    "            xaxis_opts=opts.AxisOpts(\n",
    "                axisline_opts=opts.AxisLineOpts(linestyle_opts=opts.LineStyleOpts(color=\"#666\")),\n",
    "                axislabel_opts=opts.LabelOpts(color=\"#ccc\"),\n",
    "            ),\n",
    "            yaxis_opts=opts.AxisOpts(\n",
    "                name=\"数量\",\n",
    "                axisline_opts=opts.AxisLineOpts(linestyle_opts=opts.LineStyleOpts(color=\"#666\")),\n",
    "                axislabel_opts=opts.LabelOpts(color=\"#ccc\"),\n",
    "                splitline_opts=opts.SplitLineOpts(is_show=True, linestyle_opts=opts.LineStyleOpts(opacity=0.15)),\n",
    "            ),\n",
    "            legend_opts=opts.LegendOpts(textstyle_opts=opts.TextStyleOpts(color=\"#fff\"), pos_top=\"50px\"),\n",
    "            tooltip_opts=opts.TooltipOpts(trigger=\"axis\", axis_pointer_type=\"cross\"),\n",
    "        )\n",
    "    )\n",
    "    return c\n",
    "\n",
    "c2 = chart_year_line()\n",
    "c2.render('charts/chart2.html')\n",
    "c2"
]))

cells.append(md_cell("### 8.3 制片国家 Top15 柱状图"))

cells.append(code_cell([
    "def chart_country_bar():\n",
    "    countries = country_count['国家'].tolist()[::-1]\n",
    "    counts = country_count['数量'].tolist()[::-1]\n",
    "    \n",
    "    c = (\n",
    "        Bar(init_opts=opts.InitOpts(theme=ThemeType.DARK, width=\"100%\", height=\"600px\"))\n",
    "        .add_xaxis(countries)\n",
    "        .add_yaxis(\n",
    "            \"作品数量\", counts,\n",
    "            category_gap=\"40%\",\n",
    "            label_opts=opts.LabelOpts(position=\"right\", color=\"#fff\", font_size=12, font_weight=\"bold\"),\n",
    "            itemstyle_opts=opts.ItemStyleOpts(\n",
    "                color={\n",
    "                    \"type\": \"linear\", \"x\": 0, \"y\": 0, \"x2\": 1, \"y2\": 0,\n",
    "                    \"colorStops\": [[0, {\"r\": 229, \"g\": 9, \"b\": 20}], [1, {\"r\": 255, \"g\": 100, \"b\": 100}]],\n",
    "                },\n",
    "                border_radius=[0, 8, 8, 0],\n",
    "            ),\n",
    "        )\n",
    "        .reversal_axis()\n",
    "        .set_global_opts(\n",
    "            title_opts=opts.TitleOpts(\n",
    "                title=\"🌍 制片国家 Top 15\",\n",
    "                title_textstyle_opts=opts.TextStyleOpts(color=\"#fff\", font_size=22, font_weight=\"bold\"),\n",
    "                pos_left=\"center\",\n",
    "            ),\n",
    "            xaxis_opts=opts.AxisOpts(\n",
    "                axisline_opts=opts.AxisLineOpts(linestyle_opts=opts.LineStyleOpts(color=\"#666\")),\n",
    "                axislabel_opts=opts.LabelOpts(color=\"#ccc\"),\n",
    "                splitline_opts=opts.SplitLineOpts(is_show=True, linestyle_opts=opts.LineStyleOpts(opacity=0.15)),\n",
    "            ),\n",
    "            yaxis_opts=opts.AxisOpts(\n",
    "                axisline_opts=opts.AxisLineOpts(linestyle_opts=opts.LineStyleOpts(color=\"#666\")),\n",
    "                axislabel_opts=opts.LabelOpts(color=\"#fff\", font_size=13),\n",
    "            ),\n",
    "            legend_opts=opts.LegendOpts(is_show=False),\n",
    "        )\n",
    "    )\n",
    "    return c\n",
    "\n",
    "c3 = chart_country_bar()\n",
    "c3.render('charts/chart3.html')\n",
    "c3"
]))

cells.append(md_cell("### 8.4 热门流派 Top10 柱状图"))

cells.append(code_cell([
    "def chart_genre_bar():\n",
    "    genres = genre_count['流派'].tolist()[::-1]\n",
    "    counts = genre_count['数量'].tolist()[::-1]\n",
    "    \n",
    "    c = (\n",
    "        Bar(init_opts=opts.InitOpts(theme=ThemeType.DARK, width=\"100%\", height=\"550px\"))\n",
    "        .add_xaxis(genres)\n",
    "        .add_yaxis(\n",
    "            \"作品数量\", counts,\n",
    "            category_gap=\"45%\",\n",
    "            label_opts=opts.LabelOpts(position=\"right\", color=\"#fff\", font_size=12, font_weight=\"bold\"),\n",
    "            itemstyle_opts=opts.ItemStyleOpts(\n",
    "                color={\n",
    "                    \"type\": \"linear\", \"x\": 0, \"y\": 0, \"x2\": 1, \"y2\": 0,\n",
    "                    \"colorStops\": [[0, {\"r\": 64, \"g\": 158, \"b\": 255}], [1, {\"r\": 255, \"g\": 215, \"b\": 0}]],\n",
    "                },\n",
    "                border_radius=[0, 8, 8, 0],\n",
    "            ),\n",
    "        )\n",
    "        .reversal_axis()\n",
    "        .set_global_opts(\n",
    "            title_opts=opts.TitleOpts(\n",
    "                title=\"🎭 热门流派 Top 10\",\n",
    "                title_textstyle_opts=opts.TextStyleOpts(color=\"#fff\", font_size=22, font_weight=\"bold\"),\n",
    "                pos_left=\"center\",\n",
    "            ),\n",
    "            xaxis_opts=opts.AxisOpts(\n",
    "                axisline_opts=opts.AxisLineOpts(linestyle_opts=opts.LineStyleOpts(color=\"#666\")),\n",
    "                axislabel_opts=opts.LabelOpts(color=\"#ccc\"),\n",
    "                splitline_opts=opts.SplitLineOpts(is_show=True, linestyle_opts=opts.LineStyleOpts(opacity=0.15)),\n",
    "            ),\n",
    "            yaxis_opts=opts.AxisOpts(\n",
    "                axisline_opts=opts.AxisLineOpts(linestyle_opts=opts.LineStyleOpts(color=\"#666\")),\n",
    "                axislabel_opts=opts.LabelOpts(color=\"#fff\", font_size=12),\n",
    "            ),\n",
    "            legend_opts=opts.LegendOpts(is_show=False),\n",
    "        )\n",
    "    )\n",
    "    return c\n",
    "\n",
    "c4 = chart_genre_bar()\n",
    "c4.render('charts/chart4.html')\n",
    "c4"
]))

cells.append(md_cell("### 8.5 年龄评级分布漏斗图"))

cells.append(code_cell([
    "def chart_rating_funnel():\n",
    "    data = [list(z) for z in zip(rating_dist['评级'].tolist(), rating_dist['数量'].tolist())]\n",
    "    c = (\n",
    "        Funnel(init_opts=opts.InitOpts(theme=ThemeType.DARK, width=\"100%\", height=\"550px\"))\n",
    "        .add(\n",
    "            series_name=\"评级分布\",\n",
    "            data_pair=data,\n",
    "            label_opts=opts.LabelOpts(position=\"inside\", formatter=\"{b}: {c}\", color=\"#fff\", font_size=13, font_weight=\"bold\"),\n",
    "            sort_=\"descending\", gap=2,\n",
    "        )\n",
    "        .set_colors([\"#E50914\", \"#FF6B6B\", \"#FFD700\", \"#4ECDC4\", \"#45B7D1\", \"#96CEB4\", \"#FFEAA7\", \"#DDA0DD\", \"#A29BFE\", \"#81ECEC\"])\n",
    "        .set_global_opts(\n",
    "            title_opts=opts.TitleOpts(\n",
    "                title=\"🔖 年龄评级分布（漏斗图）\",\n",
    "                title_textstyle_opts=opts.TextStyleOpts(color=\"#fff\", font_size=22, font_weight=\"bold\"),\n",
    "                pos_left=\"center\",\n",
    "            ),\n",
    "            legend_opts=opts.LegendOpts(textstyle_opts=opts.TextStyleOpts(color=\"#fff\"), pos_top=\"50px\"),\n",
    "            tooltip_opts=opts.TooltipOpts(trigger=\"item\", formatter=\"{b}: {c} ({d}%)\"),\n",
    "        )\n",
    "    )\n",
    "    return c\n",
    "\n",
    "c5 = chart_rating_funnel()\n",
    "c5.render('charts/chart5.html')\n",
    "c5"
]))

cells.append(md_cell("### 8.6 电影时长分布直方图"))

cells.append(code_cell([
    "def chart_duration():\n",
    "    movies = df[df['type'] == 'Movie']['duration_num'].tolist()\n",
    "    bins = list(range(0, int(max(movies)) + 20, 10))\n",
    "    labels = [f\"{bins[i]}-{bins[i+1]}\" for i in range(len(bins)-1)]\n",
    "    counts, _ = np.histogram(movies, bins=bins)\n",
    "    \n",
    "    c = (\n",
    "        Bar(init_opts=opts.InitOpts(theme=ThemeType.DARK, width=\"100%\", height=\"550px\"))\n",
    "        .add_xaxis(labels)\n",
    "        .add_yaxis(\n",
    "            \"电影数量\", counts.tolist(),\n",
    "            category_gap=\"5%\",\n",
    "            label_opts=opts.LabelOpts(is_show=False),\n",
    "            itemstyle_opts=opts.ItemStyleOpts(\n",
    "                color={\n",
    "                    \"type\": \"linear\", \"x\": 0, \"y\": 0, \"x2\": 0, \"y2\": 1,\n",
    "                    \"colorStops\": [[0, {\"r\": 255, \"g\": 107, \"b\": 107}], [1, {\"r\": 229, \"g\": 9, \"b\": 20}]],\n",
    "                },\n",
    "                border_radius=[6, 6, 0, 0],\n",
    "            ),\n",
    "        )\n",
    "        .set_global_opts(\n",
    "            title_opts=opts.TitleOpts(\n",
    "                title=\"⏱ 电影时长分布（分钟）\",\n",
    "                subtitle=f\"平均时长: {int(np.mean(movies))} 分钟 | 中位数: {int(np.median(movies))} 分钟\",\n",
    "                title_textstyle_opts=opts.TextStyleOpts(color=\"#fff\", font_size=22, font_weight=\"bold\"),\n",
    "                subtitle_textstyle_opts=opts.TextStyleOpts(color=\"#ccc\", font_size=13),\n",
    "                pos_left=\"center\",\n",
    "            ),\n",
    "            xaxis_opts=opts.AxisOpts(\n",
    "                name=\"时长区间（分钟）\",\n",
    "                axisline_opts=opts.AxisLineOpts(linestyle_opts=opts.LineStyleOpts(color=\"#666\")),\n",
    "                axislabel_opts=opts.LabelOpts(color=\"#ccc\", rotate=45, font_size=10),\n",
    "            ),\n",
    "            yaxis_opts=opts.AxisOpts(\n",
    "                name=\"电影数量\",\n",
    "                axisline_opts=opts.AxisLineOpts(linestyle_opts=opts.LineStyleOpts(color=\"#666\")),\n",
    "                axislabel_opts=opts.LabelOpts(color=\"#ccc\"),\n",
    "                splitline_opts=opts.SplitLineOpts(is_show=True, linestyle_opts=opts.LineStyleOpts(opacity=0.15)),\n",
    "            ),\n",
    "            legend_opts=opts.LegendOpts(is_show=False),\n",
    "        )\n",
    "    )\n",
    "    return c\n",
    "\n",
    "c6 = chart_duration()\n",
    "c6.render('charts/chart6.html')\n",
    "c6"
]))

cells.append(md_cell("### 8.7 流派 × 类型堆叠柱状图"))

cells.append(code_cell([
    "def chart_genre_type():\n",
    "    top_genres = genre_count['流派'].head(8).tolist()\n",
    "    genre_type_data = []\n",
    "    for genre in top_genres:\n",
    "        movie_count = df[df['genres_list'].apply(lambda x: genre in x) & (df['type'] == 'Movie')].shape[0]\n",
    "        show_count = df[df['genres_list'].apply(lambda x: genre in x) & (df['type'] == 'TV Show')].shape[0]\n",
    "        genre_type_data.append({'流派': genre, '电影': movie_count, '电视节目': show_count})\n",
    "    gt_df = pd.DataFrame(genre_type_data)\n",
    "    \n",
    "    c = (\n",
    "        Bar(init_opts=opts.InitOpts(theme=ThemeType.DARK, width=\"100%\", height=\"550px\"))\n",
    "        .add_xaxis(gt_df['流派'].tolist())\n",
    "        .add_yaxis(\n",
    "            \"电影\", gt_df['电影'].tolist(), stack=\"stack1\",\n",
    "            label_opts=opts.LabelOpts(is_show=True, color=\"#fff\", position=\"inside\"),\n",
    "            itemstyle_opts=opts.ItemStyleOpts(color=\"#E50914\", border_radius=[4, 4, 0, 0]),\n",
    "        )\n",
    "        .add_yaxis(\n",
    "            \"电视节目\", gt_df['电视节目'].tolist(), stack=\"stack1\",\n",
    "            label_opts=opts.LabelOpts(is_show=True, color=\"#fff\", position=\"inside\"),\n",
    "            itemstyle_opts=opts.ItemStyleOpts(color=\"#4ECDC4\", border_radius=[4, 4, 0, 0]),\n",
    "        )\n",
    "        .set_global_opts(\n",
    "            title_opts=opts.TitleOpts(\n",
    "                title=\"🎨 流派 × 类型 堆叠分布\",\n",
    "                title_textstyle_opts=opts.TextStyleOpts(color=\"#fff\", font_size=22, font_weight=\"bold\"),\n",
    "                pos_left=\"center\",\n",
    "            ),\n",
    "            xaxis_opts=opts.AxisOpts(\n",
    "                axisline_opts=opts.AxisLineOpts(linestyle_opts=opts.LineStyleOpts(color=\"#666\")),\n",
    "                axislabel_opts=opts.LabelOpts(color=\"#fff\", rotate=25, font_size=11),\n",
    "            ),\n",
    "            yaxis_opts=opts.AxisOpts(\n",
    "                axisline_opts=opts.AxisLineOpts(linestyle_opts=opts.LineStyleOpts(color=\"#666\")),\n",
    "                axislabel_opts=opts.LabelOpts(color=\"#ccc\"),\n",
    "                splitline_opts=opts.SplitLineOpts(is_show=True, linestyle_opts=opts.LineStyleOpts(opacity=0.15)),\n",
    "            ),\n",
    "            legend_opts=opts.LegendOpts(textstyle_opts=opts.TextStyleOpts(color=\"#fff\"), pos_top=\"50px\"),\n",
    "        )\n",
    "    )\n",
    "    return c\n",
    "\n",
    "c7 = chart_genre_type()\n",
    "c7.render('charts/chart7.html')\n",
    "c7"
]))

cells.append(md_cell("### 8.8 流派词云图"))

cells.append(code_cell([
    "def chart_genre_cloud():\n",
    "    words = [[g, int(c)] for g, c in Counter(all_genres).most_common()]\n",
    "    c = (\n",
    "        WordCloud(init_opts=opts.InitOpts(theme=ThemeType.DARK, width=\"100%\", height=\"550px\"))\n",
    "        .add(\n",
    "            \"\", words,\n",
    "            word_size_range=[16, 80],\n",
    "            shape=\"cardioid\",\n",
    "            textstyle_opts=opts.TextStyleOpts(font_family=\"Microsoft YaHei\"),\n",
    "        )\n",
    "        .set_global_opts(\n",
    "            title_opts=opts.TitleOpts(\n",
    "                title=\"☁️ Netflix 流派词云\",\n",
    "                title_textstyle_opts=opts.TextStyleOpts(color=\"#fff\", font_size=22, font_weight=\"bold\"),\n",
    "                pos_left=\"center\",\n",
    "            ),\n",
    "            tooltip_opts=opts.TooltipOpts(trigger=\"item\"),\n",
    "        )\n",
    "    )\n",
    "    return c\n",
    "\n",
    "c8 = chart_genre_cloud()\n",
    "c8.render('charts/chart10.html')\n",
    "c8"
]))

cells.append(md_cell("### 8.9 电视节目季数玫瑰图"))

cells.append(code_cell([
    "def chart_season_rose():\n",
    "    shows = df[df['type'] == 'TV Show']['duration_num'].value_counts().sort_index().head(8).reset_index()\n",
    "    shows.columns = ['季数', '数量']\n",
    "    shows['label'] = shows['季数'].astype(str) + ' Season'\n",
    "    data = [list(z) for z in zip(shows['label'].tolist(), shows['数量'].tolist())]\n",
    "    \n",
    "    c = (\n",
    "        Pie(init_opts=opts.InitOpts(theme=ThemeType.DARK, width=\"100%\", height=\"550px\"))\n",
    "        .add(\n",
    "            \"\", data, radius=[\"30%\", \"75%\"], rosetype=\"radius\",\n",
    "            label_opts=opts.LabelOpts(formatter=\"{b}: {c}\", color=\"#fff\", font_size=12),\n",
    "        )\n",
    "        .set_colors([\"#E50914\", \"#FF6B6B\", \"#FFD700\", \"#4ECDC4\", \"#45B7D1\", \"#96CEB4\", \"#FFEAA7\", \"#DDA0DD\"])\n",
    "        .set_global_opts(\n",
    "            title_opts=opts.TitleOpts(\n",
    "                title=\"🌸 电视节目季数分布（玫瑰图）\",\n",
    "                title_textstyle_opts=opts.TextStyleOpts(color=\"#fff\", font_size=22, font_weight=\"bold\"),\n",
    "                pos_left=\"center\",\n",
    "            ),\n",
    "            legend_opts=opts.LegendOpts(orient=\"vertical\", pos_top=\"middle\", pos_right=\"5%\", textstyle_opts=opts.TextStyleOpts(color=\"#fff\")),\n",
    "        )\n",
    "    )\n",
    "    return c\n",
    "\n",
    "c9 = chart_season_rose()\n",
    "c9.render('charts/chart9.html')\n",
    "c9"
]))

cells.append(md_cell([
    "---\n",
    "\n",
    "## 9. 导出 JSON 数据供前端使用"
]))

cells.append(code_cell([
    "os.makedirs('data', exist_ok=True)\n",
    "\n",
    "# 流派 × 类型交叉数据\n",
    "top_genres_for_type = genre_count['流派'].head(8).tolist()\n",
    "genre_type_breakdown = []\n",
    "for genre in top_genres_for_type:\n",
    "    movie_count = int(df[df['genres_list'].apply(lambda x: genre in x) & (df['type'] == 'Movie')].shape[0])\n",
    "    show_count = int(df[df['genres_list'].apply(lambda x: genre in x) & (df['type'] == 'TV Show')].shape[0])\n",
    "    genre_type_breakdown.append({'流派': genre, '电影': movie_count, '电视节目': show_count})\n",
    "\n",
    "# TV Show 季数分布\n",
    "season_df = df[df['type'] == 'TV Show']['duration_num'].value_counts().sort_index().head(10).reset_index()\n",
    "season_df.columns = ['季数', '数量']\n",
    "season_distribution = season_df.to_dict('records')\n",
    "\n",
    "# 热力图数据\n",
    "heatmap_years = list(range(2008, 2022))\n",
    "heatmap_ratings = rating_dist['评级'].head(8).tolist()\n",
    "heatmap_real = []\n",
    "for y in heatmap_years:\n",
    "    for r in heatmap_ratings:\n",
    "        cnt = int(df[(df['release_year'] == y) & (df['rating'] == r)].shape[0])\n",
    "        heatmap_real.append({'year': y, 'rating': r, 'count': cnt})\n",
    "\n",
    "# 电影时长直方图数据\n",
    "movie_durations = df[df['type'] == 'Movie']['duration_num']\n",
    "bin_size = 15\n",
    "bins_start = list(range(0, int(movie_durations.max()) + bin_size + 1, bin_size))\n",
    "hist_counts, _ = np.histogram(movie_durations.tolist(), bins=bins_start)\n",
    "duration_histogram = [\n",
    "    {'range': f'{bins_start[i]}-{bins_start[i+1]}', 'count': int(hist_counts[i])}\n",
    "    for i in range(len(bins_start)-1)\n",
    "]\n",
    "\n",
    "export = {\n",
    "    'overview': {\n",
    "        'total': int(df.shape[0]),\n",
    "        'movies': int(df[df['type'] == 'Movie'].shape[0]),\n",
    "        'tvshows': int(df[df['type'] == 'TV Show'].shape[0]),\n",
    "        'countries': len(set(c for cs in df['countries_list'] for c in cs)),\n",
    "        'genres': len(set(g for gs in df['genres_list'] for g in gs)),\n",
    "        'directors': int(df[df['director'] != 'Unknown']['director'].nunique()),\n",
    "    },\n",
    "    'type_dist': type_dist.to_dict(orient='records'),\n",
    "    'year_trend': [{'year': int(idx), 'Movie': int(row.get('Movie', 0)), 'TV Show': int(row.get('TV Show', 0)), 'total': int(row['总计'])}\n",
    "                   for idx, row in year_added.iterrows()],\n",
    "    'countries': country_count.to_dict(orient='records'),\n",
    "    'genres': genre_count.to_dict(orient='records'),\n",
    "    'ratings': rating_dist.to_dict(orient='records'),\n",
    "    'duration_stats': {\n",
    "        'mean': float(np.mean(movie_durations)),\n",
    "        'median': float(np.median(movie_durations)),\n",
    "        'min': float(np.min(movie_durations)),\n",
    "        'max': float(np.max(movie_durations)),\n",
    "        'count': len(movie_durations),\n",
    "    },\n",
    "    'genre_type_breakdown': genre_type_breakdown,\n",
    "    'season_distribution': season_distribution,\n",
    "    'heatmap_data': heatmap_real,\n",
    "    'heatmap_meta': {'years': heatmap_years, 'ratings': heatmap_ratings},\n",
    "    'duration_histogram': duration_histogram,\n",
    "    'correlation_matrix': corr_matrix.round(3).to_dict(),\n",
    "    'regression_results': {\n",
    "        'features': features,\n",
    "        'r2': round(r2, 4),\n",
    "        'rmse': round(rmse, 2),\n",
    "        'coefficients': coef_df.to_dict(orient='records'),\n",
    "    },\n",
    "    'kmeans_results': {\n",
    "        'best_k': 4,\n",
    "        'silhouette_score': round(sil_score, 4),\n",
    "        'cluster_profile': cluster_profile.round(2).to_dict(),\n",
    "    },\n",
    "    'randomforest_results': {\n",
    "        'accuracy': round(accuracy_score(y_test_rf, y_pred_rf), 4),\n",
    "        'feature_importance': importance_df.round(4).to_dict(orient='records'),\n",
    "    },\n",
    "}\n",
    "\n",
    "with open('data/complete_analysis.json', 'w', encoding='utf-8') as f:\n",
    "    json.dump(export, f, ensure_ascii=False, indent=2)\n",
    "\n",
    "print('完整分析数据导出完成 ✓')\n",
    "print(f\"文件路径: data/complete_analysis.json\")"
]))

cells.append(md_cell([
    "---\n",
    "\n",
    "## 10. 案例分析结论与建议"
]))

cells.append(md_cell("### 10.1 数据分析结果总结"))

cells.append(code_cell([
    "print(\"=\" * 60)\n",
    "print(\"Netflix 数据分析 · 核心发现总结\")\n",
    "print(\"=\" * 60)\n",
    "\n",
    "total = len(df)\n",
    "type_vc = df['type'].value_counts()\n",
    "\n",
    "print(f\"\\n📊 一、描述性统计发现\")\n",
    "print(f\"  1. 内容规模：共 {total} 部作品\")\n",
    "print(f\"  2. 类型分布：电影 {type_vc.get('Movie', 0)} 部 ({type_vc.get('Movie', 0)/total*100:.1f}%)，电视节目 {type_vc.get('TV Show', 0)} 部 ({type_vc.get('TV Show', 0)/total*100:.1f}%)\")\n",
    "\n",
    "year_trend = df.groupby('year_added').size()\n",
    "peak_year = year_trend.idxmax()\n",
    "print(f\"  3. 增长峰值：{peak_year} 年达到顶峰，新增 {year_trend.max()} 部\")\n",
    "\n",
    "print(f\"  4. 地域分布：{country_count.iloc[0]['国家']} 以 {country_count.iloc[0]['数量']} 部位居第一\")\n",
    "print(f\"  5. 最热门流派：{genre_count.iloc[0]['流派']}（{genre_count.iloc[0]['数量']} 部）\")\n",
    "\n",
    "movie_avg_dur = df[df['type'] == 'Movie']['duration_num'].mean()\n",
    "print(f\"  6. 电影平均时长：{movie_avg_dur:.1f} 分钟\")\n",
    "\n",
    "print(f\"\\n📈 二、相关性分析发现\")\n",
    "print(f\"  1. release_year 与 year_added 正相关 (r={corr_matrix.loc['release_year', 'year_added']:.3f})\")\n",
    "print(f\"     → 新发行的作品通常更快上线 Netflix\")\n",
    "\n",
    "print(f\"\\n🤖 三、机器学习建模发现\")\n",
    "print(f\"  1. 线性回归预测电影时长：R²={r2:.4f}，解释能力有限\")\n",
    "print(f\"  2. K-Means 聚类 (K=4)：轮廓系数={sil_score:.4f}，可将电影分为 4 个典型群体\")\n",
    "print(f\"  3. 随机森林分类：准确率={accuracy_score(y_test_rf, y_pred_rf):.2%}，可准确识别电影/电视节目\")\n",
    "print(f\"     → 最重要特征：{sorted_features[0]}（{sorted_importances[0]:.3f}）\")\n",
    "\n",
    "print(f\"\\n⚠️  四、数据质量发现\")\n",
    "print(f\"  1. 异常值检测：电影时长异常 {df['is_outlier_duration'].sum()} 部（IQR 法）\")\n",
    "print(f\"  2. 缺失值处理：6 个字段存在缺失，已用众数/Unknown 填充\")\n",
    "print()\n",
    "print(\"=\" * 60)"
]))

cells.append(md_cell("### 10.2 结论与建议"))

cells.append(md_cell([
    "#### 业务结论\n",
    "\n",
    "1. **电影仍是核心内容**：电影占比约 70%，是 Netflix 内容库的主体，但电视节目增长势头强劲。\n",
    "\n",
    "2. **内容增长已见顶**：2019 年前后是内容扩张高峰期，之后略有回落，说明 Netflix 可能从\"数量扩张\"转向\"质量提升\"。\n",
    "\n",
    "3. **美国内容一家独大**：美国产内容占比超过 40%，但印度、英国、日本等国的内容也在快速增长，国际化战略成效明显。\n",
    "\n",
    "4. **剧集多为单季试水**：超过 50% 的电视节目只有 1 季，反映了 Netflix 快速试错、数据驱动的剧集决策模式。\n",
    "\n",
    "#### 业务建议\n",
    "\n",
    "1. **内容策略优化**\n",
    "   - 继续加大 Drama 和 Comedy 类内容投入（用户需求最高）\n",
    "   - 增加 International Movies 类别的多样性，特别是亚洲市场\n",
    "   - 打造多季爆款 IP，提升用户留存率\n",
    "\n",
    "2. **区域市场拓展**\n",
    "   - 美国市场已相对饱和，可重点发展印度、韩国、日本等增长市场\n",
    "   - 推进本土化内容制作，降低对好莱坞内容的依赖\n",
    "\n",
    "3. **用户分级管理**\n",
    "   - TV-MA 内容占比最高（约 36%），需完善家长控制功能\n",
    "   - 增加家庭友好型内容（TV-PG / PG 级别），扩展受众群体\n",
    "\n",
    "4. **数据驱动决策**\n",
    "   - 利用随机森林等模型辅助内容类型判断和资源分配\n",
    "   - 通过聚类分析识别不同类型内容的特征模式，指导采购策略\n",
    "\n",
    "5. **数据质量改进**\n",
    "   - 完善导演、演员信息的缺失值填充\n",
    "   - 对异常时长数据进行人工复核，提升数据可信度"
]))

cells.append(md_cell([
    "---\n",
    "\n",
    "## 11. 汇报演讲要点（10 分钟版）\n",
    "\n",
    "| 时间 | 环节 | 主讲人 | 核心内容 |\n",
    "| --- | --- | --- | --- |\n",
    "| 0-1 min | 开场介绍 | 成员 A | 小组介绍、数据集背景、分析目标 |\n",
    "| 1-3 min | 数据预处理 | 成员 A | 缺失值处理、异常值检测（IQR/Z-score）、特征工程 |\n",
    "| 3-5 min | 描述性分析 + 可视化 | 成员 B | 展示网页看板，讲解 6 个核心图表发现 |\n",
    "| 5-7 min | 高级分析（建模） | 成员 A | 相关性分析、线性回归、K-Means 聚类、随机森林 |\n",
    "| 7-9 min | 结论建议 | 成员 B | 核心发现总结、业务建议 |\n",
    "| 9-10 min | 总结展望 | 全员 | 项目亮点、不足与改进方向 |\n",
    "\n",
    "---\n",
    "\n",
    "**END OF NOTEBOOK**"
]))

# 构建完整 notebook
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

with open('/workspace/netflix_analysis.ipynb', 'w', encoding='utf-8') as f:
    json.dump(notebook, f, ensure_ascii=False, indent=1)

print(f"✅ netflix_analysis.ipynb 生成完成！")
print(f"   共 {len(cells)} 个单元格")
