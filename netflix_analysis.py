#!/usr/bin/env python
# coding: utf-8

# # Netflix 电影与电视节目数据分析
# 
# ---
# 
# ## 小组分工（两人组）
# 
# | 成员 | 角色 | 主要任务 | 完成工作 |
# | --- | --- | --- | --- |
# | **成员 A** | 数据科学家 | 数据预处理、统计分析、建模 | 数据清洗、缺失值处理、异常值检测、描述性统计、分组分析、相关性分析、线性回归、K-Means 聚类、随机森林分类 |
# | **成员 B** | 前端工程师 | 可视化开发、页面搭建、汇报 | pyecharts 交互式图表、Matplotlib 可视化、`index.html` 网页构建、交互逻辑、答辩演示 |
# 
# **协同合作**：两人共同确定分析目标与可视化方案，成员 A 负责数据处理与分析建模，成员 B 负责可视化呈现与网页开发，定期同步进度，确保数据一致性。
# 
# ---
# 
# ## 1. 项目需求分析
# 
# ### 1.1 数据集背景
# - **来源**：Kaggle 公开数据集 Netflix Titles Dataset
# - **规模**：8,809 条记录，12 列原始字段
# - **字段说明**：
# 
# | 字段名 | 类型 | 说明 | 取值范围 |
# | --- | --- | --- | --- |
# | show_id | string | 作品唯一标识 | s1 ~ s8809 |
# | type | string | 内容类型 | Movie / TV Show |
# | title | string | 作品标题 | - |
# | director | string | 导演姓名 | - |
# | cast | string | 演员阵容 | - |
# | country | string | 制片国家 | 86 个国家 |
# | date_added | date | 上线日期 | 2008-2021 |
# | release_year | int | 发行年份 | 1925-2021 |
# | rating | string | 年龄分级 | TV-MA, TV-14, PG-13 等 17 种 |
# | duration | string | 时长 | 电影(分钟) / 电视剧(季) |
# | listed_in | string | 流派分类 | 36 个主要流派 |
# | description | string | 剧情描述 | - |
# 
# ### 1.2 分析目标与预期结果
# 1. **描述性分析**：探索数据集整体分布特征（类型、年份、国家、流派、评级、时长）
# 2. **相关性分析**：分析数值变量间的相关关系
# 3. **回归预测**：建立线性回归模型预测电影时长
# 4. **聚类分析**：使用 K-Means 对内容进行聚类分群
# 5. **分类预测**：使用随机森林模型预测内容类型（Movie / TV Show）
# 6. **可视化呈现**：通过 pyecharts + Matplotlib 实现多维度可视化
# 
# **预期结果**：发现 Netflix 内容库的分布规律，建立预测模型，为内容策略提供数据支持。
# 
# ---
# 
# ## 2. 数据加载与预处理

# In[ ]:


import pandas as pd
import numpy as np
import json
import os
import warnings
from collections import Counter
warnings.filterwarnings('ignore')

# 可视化库
import matplotlib.pyplot as plt
import matplotlib
matplotlib.rcParams['font.sans-serif'] = ['DejaVu Sans']
matplotlib.rcParams['axes.unicode_minus'] = False
plt.switch_backend('Agg')  # 非交互式后端，避免显示问题

# pyecharts
from pyecharts import options as opts
from pyecharts.charts import (
    Bar, Pie, Line, Scatter, WordCloud, HeatMap, Boxplot, Funnel, Gauge, Timeline, Grid, Page
)
from pyecharts.globals import ThemeType, CurrentConfig, RenderType

# 机器学习库
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    mean_squared_error, r2_score, accuracy_score,
    classification_report, confusion_matrix, silhouette_score
)

CurrentConfig.ONLINE_HOST = "https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/"


# In[ ]:


df = pd.read_csv('netflix_titles.csv')
print(f"原始数据形状：{df.shape}")
print(f"\n各列数据类型：\n{df.dtypes}")
print(f"\n前 5 行数据：")
df.head()


# ### 2.1 缺失值分析与处理
# 

# In[ ]:


# 缺失值统计
missing = df.isnull().sum().sort_values(ascending=False)
missing_pct = (missing / len(df) * 100).round(2)
missing_df = pd.DataFrame({'缺失数量': missing, '缺失比例(%)': missing_pct})
print("=== 缺失值统计 ===")
missing_df[missing_df['缺失数量'] > 0]


# In[ ]:


# 缺失值处理策略
# 1) director, cast, country: 用 'Unknown' 填充（分类变量，缺失有实际意义）
# 2) date_added, rating, duration: 用众数填充

df['director'] = df['director'].fillna('Unknown')
df['cast'] = df['cast'].fillna('Unknown')
df['country'] = df['country'].fillna('Unknown')
df['date_added'] = df['date_added'].fillna(df['date_added'].mode()[0])
df['rating'] = df['rating'].fillna(df['rating'].mode()[0])
df['duration'] = df['duration'].fillna(df['duration'].mode()[0])

print(f"缺失值处理后，总缺失数：{df.isnull().sum().sum()}")


# ### 2.2 特征工程与字段清洗
# 

# In[ ]:


# 提取添加年份、月份
df['year_added'] = df['date_added'].str.extract(r'(\d{4})').astype(int)

# 拆分多值字段（流派、国家、演员）
def split_field(s):
    if pd.isna(s) or s == 'Unknown':
        return []
    return [x.strip() for x in str(s).split(',') if x.strip()]

df['genres_list'] = df['listed_in'].apply(split_field)
df['countries_list'] = df['country'].apply(split_field)
df['cast_list'] = df['cast'].apply(split_field)

# 数值化时长：电影=分钟数，电视节目=季数
df['duration_num'] = df['duration'].str.extract(r'(\d+)').astype(float).astype(int)

# 衍生字段：流派数量、国家数量、演员数量、是否有导演
df['genre_count'] = df['genres_list'].apply(len)
df['country_count'] = df['countries_list'].apply(len)
df['cast_count'] = df['cast_list'].apply(len)
df['has_director'] = (df['director'] != 'Unknown').astype(int)

# 第一流派、第一制片国
df['primary_genre'] = df['genres_list'].apply(lambda x: x[0] if x else 'Unknown')
df['primary_country'] = df['countries_list'].apply(lambda x: x[0] if x else 'Unknown')

print(f"处理后数据形状：{df.shape}")
print(f"新增字段数：10 个衍生字段")
df.head(3)


# ### 2.3 异常值检测与处理
# 

# #### 方法一：IQR（四分位距）法
# 

# In[ ]:


# 对电影时长使用 IQR 法检测异常值
movies_df = df[df['type'] == 'Movie'].copy()

Q1 = movies_df['duration_num'].quantile(0.25)
Q3 = movies_df['duration_num'].quantile(0.75)
IQR = Q3 - Q1

lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

print(f"=== IQR 法检测电影时长异常值 ===")
print(f"Q1 (25%分位数): {Q1:.1f} 分钟")
print(f"Q3 (75%分位数): {Q3:.1f} 分钟")
print(f"IQR: {IQR:.1f} 分钟")
print(f"正常范围: [{lower_bound:.1f}, {upper_bound:.1f}] 分钟")

iqr_outliers = movies_df[(movies_df['duration_num'] < lower_bound) | (movies_df['duration_num'] > upper_bound)]
print(f"\n异常值数量: {len(iqr_outliers)} 部 ({len(iqr_outliers)/len(movies_df)*100:.2f}%)")
print("\n异常值样本（时长最短/最长各5部）:")
iqr_outliers[['title', 'duration_num', 'release_year', 'primary_genre']].sort_values('duration_num').head(10)


# #### 方法二：Z-score 法
# 

# In[ ]:


# Z-score 法：|Z| > 3 视为异常
movies_df['duration_zscore'] = (movies_df['duration_num'] - movies_df['duration_num'].mean()) / movies_df['duration_num'].std()

z_outliers = movies_df[abs(movies_df['duration_zscore']) > 3]
print(f"=== Z-score 法检测电影时长异常值（|Z|>3） ===")
print(f"电影时长均值: {movies_df['duration_num'].mean():.1f} 分钟")
print(f"电影时长标准差: {movies_df['duration_num'].std():.1f} 分钟")
print(f"异常值数量: {len(z_outliers)} 部 ({len(z_outliers)/len(movies_df)*100:.2f}%)")

print("\nZ-score 异常值样本:")
z_outliers[['title', 'duration_num', 'duration_zscore', 'primary_genre']].sort_values('duration_zscore').head(10)


# In[ ]:


# 异常值处理：标记但不删除，保留分析价值
df['is_outlier_duration'] = 0
df.loc[movies_df[(movies_df['duration_num'] < lower_bound) | (movies_df['duration_num'] > upper_bound)].index, 'is_outlier_duration'] = 1

print(f"已标记异常值: {df['is_outlier_duration'].sum()} 部")
print("处理策略：标记保留，分析时可选择排除或单独研究")


# ---
# 
# ## 3. 描述性统计分析

# In[ ]:


# 数值型变量描述性统计
numeric_cols = ['release_year', 'year_added', 'duration_num', 'genre_count', 'country_count', 'cast_count']
print("=== 数值型变量描述性统计 ===")
df[numeric_cols].describe().round(2)


# In[ ]:


# 类型分布
type_dist = df['type'].value_counts().reset_index()
type_dist.columns = ['类型', '数量']
type_dist['占比(%)'] = (type_dist['数量'] / type_dist['数量'].sum() * 100).round(2)
print("=== 内容类型分布 ===")
type_dist


# In[ ]:


# 按年份添加内容数量
year_added = df.groupby(['year_added', 'type']).size().unstack().fillna(0).astype(int)
year_added = year_added.sort_index()
year_added['总计'] = year_added.sum(axis=1)
print("=== 年度新增内容趋势 ===")
year_added.tail(10)


# In[ ]:


# 制片国家 Top15
all_countries = []
for c in df['countries_list']:
    all_countries.extend(c)
country_count = pd.DataFrame(Counter(all_countries).most_common(15), columns=['国家', '数量'])
print("=== 制片国家 Top15 ===")
country_count


# In[ ]:


# 热门流派 Top10
all_genres = []
for g in df['genres_list']:
    all_genres.extend(g)
genre_count = pd.DataFrame(Counter(all_genres).most_common(10), columns=['流派', '数量'])
print("=== 热门流派 Top10 ===")
genre_count


# In[ ]:


# 评级分布
rating_dist = df['rating'].value_counts().head(10).reset_index()
rating_dist.columns = ['评级', '数量']
print("=== 年龄评级 Top10 ===")
rating_dist


# In[ ]:


# 分组统计：按类型分组
type_group = df.groupby('type').agg({
    'title': 'count',
    'duration_num': ['mean', 'median', 'std'],
    'release_year': ['mean', 'min', 'max'],
    'cast_count': 'mean'
}).round(2)
print("=== 按类型分组统计 ===")
type_group


# ---
# 
# ## 4. 相关性分析与回归分析

# ### 4.1 相关性矩阵分析
# 

# In[ ]:


# 计算相关系数矩阵
corr_matrix = df[numeric_cols].corr()
print("=== 相关系数矩阵 ===")
corr_matrix.round(3)


# In[ ]:


# Matplotlib 绘制相关性热力图
fig, ax = plt.subplots(figsize=(10, 8))
im = ax.imshow(corr_matrix, cmap='RdBu_r', vmin=-1, vmax=1)

ax.set_xticks(range(len(numeric_cols)))
ax.set_yticks(range(len(numeric_cols)))
ax.set_xticklabels(numeric_cols, rotation=45, ha='right')
ax.set_yticklabels(numeric_cols)

# 在热力图上添加数值标注
for i in range(len(numeric_cols)):
    for j in range(len(numeric_cols)):
        text = ax.text(j, i, f'{corr_matrix.iloc[i, j]:.2f}',
                       ha='center', va='center', color='white', fontsize=10)

cbar = plt.colorbar(im)
cbar.set_label('相关系数', fontsize=12)
ax.set_title('数值变量相关性热力图', fontsize=14, fontweight='bold', pad=20)
plt.tight_layout()
plt.show()


# In[ ]:


# 关键相关性解读
print("=== 关键相关性解读 ===")
print(f"1. release_year 与 year_added: r = {corr_matrix.loc['release_year', 'year_added']:.3f}")
print("   → 正相关：越新发行的电影，通常越晚上线到 Netflix")
print(f"\n2. genre_count 与 cast_count: r = {corr_matrix.loc['genre_count', 'cast_count']:.3f}")
print("   → 弱正相关：流派标签越多的作品，演员阵容可能越庞大")
print(f"\n3. duration_num 与 release_year: r = {corr_matrix.loc['duration_num', 'release_year']:.3f}")
print("   → 弱相关：发行年份与时长没有强线性关系")


# ### 4.2 线性回归分析：预测电影时长
# 

# In[ ]:


# 准备数据：使用电影数据，建立特征
movies = df[df['type'] == 'Movie'].copy()

# 选择特征：发行年份、流派数量、国家数量、演员数量
features = ['release_year', 'genre_count', 'country_count', 'cast_count']
X = movies[features]
y = movies['duration_num']

# 划分训练集和测试集
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"训练集大小: {X_train.shape[0]}")
print(f"测试集大小: {X_test.shape[0]}")
print(f"特征变量: {features}")


# In[ ]:


# 训练线性回归模型
lr_model = LinearRegression()
lr_model.fit(X_train, y_train)

# 预测
y_pred = lr_model.predict(X_test)

# 评估模型
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print("=== 线性回归模型评估 ===")
print(f"均方误差 (MSE): {mse:.2f}")
print(f"均方根误差 (RMSE): {rmse:.2f} 分钟")
print(f"决定系数 (R²): {r2:.4f}")
print(f"\n模型解释了 {r2*100:.2f}% 的电影时长变异")


# In[ ]:


# 回归系数分析
coef_df = pd.DataFrame({
    '特征': features,
    '系数': lr_model.coef_,
    '标准化系数': lr_model.coef_ * X_train.std().values
})
coef_df = coef_df.sort_values('标准化系数', key=abs, ascending=False)
print("=== 回归系数分析 ===")
print(f"截距: {lr_model.intercept_:.2f}")
print()
coef_df.round(3)


# In[ ]:


# 绘制实际值 vs 预测值散点图（Matplotlib）
fig, ax = plt.subplots(figsize=(10, 6))

ax.scatter(y_test, y_pred, alpha=0.5, color='#E50914', edgecolors='white', linewidth=0.5)

# 理想对角线（y=x）
min_val = min(y_test.min(), y_pred.min())
max_val = max(y_test.max(), y_pred.max())
ax.plot([min_val, max_val], [min_val, max_val], 'k--', label='理想预测 (y=x)', linewidth=2)

ax.set_xlabel('实际时长（分钟）', fontsize=12)
ax.set_ylabel('预测时长（分钟）', fontsize=12)
ax.set_title(f'电影时长预测：实际值 vs 预测值\nR² = {r2:.4f}  |  RMSE = {rmse:.1f} min', 
             fontsize=13, fontweight='bold')
ax.legend(fontsize=11)
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()


# In[ ]:


print("=== 线性回归结论 ===")
print(f"模型 R² = {r2:.4f}，说明仅用发行年份、流派数、国家数、演员数")
print(f"只能解释约 {r2*100:.1f}% 的电影时长变化。")
print()
print("原因分析：")
print("1. 电影时长受多种复杂因素影响（剧情、导演风格、市场定位等）")
print("2. 我们的特征都是比较表层的元数据特征")
print("3. 如果加入流派、导演等分类特征，模型效果可能会提升")


# ---
# 
# ## 5. K-Means 聚类分析

# ### 5.1 数据准备与标准化
# 

# In[ ]:


# 准备聚类数据：使用数值型特征
cluster_features = ['release_year', 'duration_num', 'genre_count', 'country_count', 'cast_count']

# 分别对电影和电视节目聚类（因为时长含义不同）
movie_cluster_data = df[df['type'] == 'Movie'][cluster_features].copy()
movie_cluster_data = movie_cluster_data.dropna()

# 标准化
scaler = StandardScaler()
X_scaled = scaler.fit_transform(movie_cluster_data)

print(f"聚类数据形状: {X_scaled.shape}")
print(f"聚类特征: {cluster_features}")


# ### 5.2 确定最佳 K 值：肘部法则
# 

# In[ ]:


# 肘部法则：计算不同 K 值的惯性（SSE）
inertias = []
k_range = range(2, 11)

for k in k_range:
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    kmeans.fit(X_scaled)
    inertias.append(kmeans.inertia_)

# 绘制肘部图（Matplotlib）
fig, ax = plt.subplots(figsize=(10, 6))
ax.plot(k_range, inertias, 'o-', color='#E50914', linewidth=2, markersize=8)
ax.set_xlabel('K 值（簇数）', fontsize=12)
ax.set_ylabel('惯性 (SSE)', fontsize=12)
ax.set_title('K-Means 肘部法则：确定最佳 K 值', fontsize=14, fontweight='bold')
ax.grid(True, alpha=0.3)
ax.set_xticks(list(k_range))

# 标注最佳 K
best_k = 4
ax.axvline(x=best_k, color='blue', linestyle='--', alpha=0.7, label=f'最佳 K = {best_k}')
ax.legend(fontsize=11)
plt.tight_layout()
plt.show()


# ### 5.3 K-Means 聚类（K=4）
# 

# In[ ]:


# 使用 K=4 进行聚类
kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
movie_cluster_data['cluster'] = kmeans.fit_predict(X_scaled)

# 计算轮廓系数
sil_score = silhouette_score(X_scaled, kmeans.labels_)
print(f"=== K-Means 聚类结果 ===")
print(f"聚类数: 4")
print(f"轮廓系数: {sil_score:.4f}")
print(f"\n各簇样本数:")
movie_cluster_data['cluster'].value_counts().sort_index()


# In[ ]:


# 聚类画像：各簇特征均值对比
cluster_profile = movie_cluster_data.groupby('cluster')[cluster_features].mean().round(2)
cluster_profile['样本数'] = movie_cluster_data['cluster'].value_counts().sort_index()
cluster_profile['占比(%)'] = (cluster_profile['样本数'] / len(movie_cluster_data) * 100).round(2)
print("=== 各簇特征画像 ===")
cluster_profile


# In[ ]:


# 聚类可视化：使用发行年份 vs 时长 散点图（Matplotlib）
fig, ax = plt.subplots(figsize=(12, 7))

colors = ['#E50914', '#4ECDC4', '#FFD700', '#A29BFE']
labels = [f'簇 {i}' for i in range(4)]

for i in range(4):
    cluster_data = movie_cluster_data[movie_cluster_data['cluster'] == i]
    ax.scatter(cluster_data['release_year'], cluster_data['duration_num'], 
              c=colors[i], label=f'簇 {i} ({len(cluster_data)}部)', 
              alpha=0.6, s=30, edgecolors='white', linewidth=0.5)

ax.set_xlabel('发行年份', fontsize=12)
ax.set_ylabel('时长（分钟）', fontsize=12)
ax.set_title('K-Means 聚类结果：发行年份 vs 电影时长', fontsize=14, fontweight='bold')
ax.legend(fontsize=11, loc='upper right')
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()


# In[ ]:


print("=== 聚类画像解读 ===")
print()
for i in range(4):
    c = cluster_profile.loc[i]
    print(f"【簇 {i}】 {c['样本数']:.0f} 部 ({c['占比(%)']:.1f}%)")
    print(f"  - 平均发行年份: {c['release_year']:.0f} 年")
    print(f"  - 平均时长: {c['duration_num']:.0f} 分钟")
    print(f"  - 平均流派数: {c['genre_count']:.1f} 个")
    print(f"  - 平均演员数: {c['cast_count']:.1f} 人")
    print()


# ---
# 
# ## 6. 随机森林分类：预测内容类型

# ### 6.1 特征工程与数据准备
# 

# In[ ]:


# 准备分类数据：预测 type (Movie / TV Show)
ml_df = df.copy()

# 选择特征
features_for_rf = [
    'release_year', 'year_added', 'duration_num',
    'genre_count', 'country_count', 'cast_count',
    'has_director', 'rating', 'primary_genre', 'primary_country'
]

# 对分类变量进行 Label Encoding
le_rating = LabelEncoder()
le_genre = LabelEncoder()
le_country = LabelEncoder()

ml_df['rating_enc'] = le_rating.fit_transform(ml_df['rating'])
ml_df['primary_genre_enc'] = le_genre.fit_transform(ml_df['primary_genre'])
ml_df['primary_country_enc'] = le_country.fit_transform(ml_df['primary_country'])

# 最终特征
X_rf = ml_df[['release_year', 'year_added', 'duration_num', 'genre_count',
              'country_count', 'cast_count', 'has_director',
              'rating_enc', 'primary_genre_enc', 'primary_country_enc']]
y_rf = (ml_df['type'] == 'Movie').astype(int)  # 1=Movie, 0=TV Show

# 划分数据集
X_train_rf, X_test_rf, y_train_rf, y_test_rf = train_test_split(
    X_rf, y_rf, test_size=0.2, random_state=42, stratify=y_rf
)

print(f"训练集: {X_train_rf.shape[0]} 条")
print(f"测试集: {X_test_rf.shape[0]} 条")
print(f"特征数: {X_rf.shape[1]}")
print(f"\n类别分布（训练集）:")
print(f"  Movie (1): {y_train_rf.sum()} 条 ({y_train_rf.mean()*100:.1f}%)")
print(f"  TV Show (0): {len(y_train_rf)-y_train_rf.sum()} 条 ({(1-y_train_rf.mean())*100:.1f}%)")


# ### 6.2 训练随机森林模型
# 

# In[ ]:


# 训练随机森林分类器
rf_model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    min_samples_split=5,
    random_state=42,
    n_jobs=-1
)
rf_model.fit(X_train_rf, y_train_rf)

# 预测
y_pred_rf = rf_model.predict(X_test_rf)
y_pred_proba_rf = rf_model.predict_proba(X_test_rf)

print("=== 随机森林模型评估 ===")
print(f"测试集准确率: {accuracy_score(y_test_rf, y_pred_rf):.4f}")


# In[ ]:


# 详细分类报告
print("=== 分类报告 ===")
print(classification_report(y_test_rf, y_pred_rf, target_names=['TV Show', 'Movie']))

# 混淆矩阵
cm = confusion_matrix(y_test_rf, y_pred_rf)
print("=== 混淆矩阵 ===")
print("              预测 TV Show  预测 Movie")
print(f"实际 TV Show    {cm[0][0]:>6}        {cm[0][1]:>6}")
print(f"实际 Movie      {cm[1][0]:>6}        {cm[1][1]:>6}")


# In[ ]:


# 绘制混淆矩阵热力图（Matplotlib）
fig, ax = plt.subplots(figsize=(8, 6))
im = ax.imshow(cm, cmap='Reds')

ax.set_xticks([0, 1])
ax.set_yticks([0, 1])
ax.set_xticklabels(['TV Show', 'Movie'], fontsize=12)
ax.set_yticklabels(['TV Show', 'Movie'], fontsize=12)
ax.set_xlabel('预测标签', fontsize=13)
ax.set_ylabel('真实标签', fontsize=13)
ax.set_title(f'随机森林混淆矩阵\n准确率 = {accuracy_score(y_test_rf, y_pred_rf):.2%}', 
             fontsize=14, fontweight='bold')

# 添加数值
for i in range(2):
    for j in range(2):
        color = 'white' if cm[i, j] > cm.max() / 2 else 'black'
        ax.text(j, i, str(cm[i, j]), ha='center', va='center', 
               color=color, fontsize=16, fontweight='bold')

cbar = plt.colorbar(im)
cbar.set_label('样本数', fontsize=12)
plt.tight_layout()
plt.show()


# ### 6.3 特征重要性分析
# 

# In[ ]:


# 特征重要性
feature_names = ['release_year', 'year_added', 'duration_num', 'genre_count',
                 'country_count', 'cast_count', 'has_director',
                 'rating', 'primary_genre', 'primary_country']

importances = rf_model.feature_importances_
indices = np.argsort(importances)[::-1]

importance_df = pd.DataFrame({
    '特征': [feature_names[i] for i in indices],
    '重要性': importances[indices]
})
print("=== 特征重要性排序 ===")
importance_df.round(4)


# In[ ]:


# 绘制特征重要性柱状图（Matplotlib）
fig, ax = plt.subplots(figsize=(10, 6))

y_pos = np.arange(len(feature_names))
sorted_importances = importances[indices]
sorted_features = [feature_names[i] for i in indices]

bars = ax.barh(y_pos, sorted_importances[::-1], color='#E50914', height=0.6)
ax.set_yticks(y_pos)
ax.set_yticklabels(sorted_features[::-1], fontsize=11)
ax.set_xlabel('重要性', fontsize=12)
ax.set_title('随机森林特征重要性', fontsize=14, fontweight='bold')
ax.grid(True, axis='x', alpha=0.3)

# 添加数值标注
for i, bar in enumerate(bars):
    width = bar.get_width()
    ax.text(width + 0.005, bar.get_y() + bar.get_height()/2, 
           f'{sorted_importances[::-1][i]:.3f}', 
           va='center', fontsize=10)

plt.tight_layout()
plt.show()


# In[ ]:


print("=== 随机森林分类结论 ===")
print(f"1. 模型准确率: {accuracy_score(y_test_rf, y_pred_rf):.2%}")
print()
print("2. 最重要的 3 个特征:")
for i in range(3):
    print(f"   {i+1}. {sorted_features[i]} ({sorted_importances[i]:.3f})")
print()
print("3. 模型解读：")
print("   - 时长特征对区分电影和电视节目最关键（合理，因为电影是分钟，TV是季数）")
print("   - 其他特征也有一定贡献，说明内容类型可以从多个维度识别")
print("   - 准确率很高，说明用这些元数据可以很好地区分电影和电视节目")


# ---
# 
# ## 7. Matplotlib 基础可视化

# ### 7.1 饼状图：内容类型分布
# 

# In[ ]:


fig, ax = plt.subplots(figsize=(8, 8))

sizes = type_dist['数量'].values
labels = type_dist['类型'].values
colors = ['#E50914', '#4ECDC4']
explode = (0.05, 0)  # 突出显示电影

wedges, texts, autotexts = ax.pie(
    sizes, explode=explode, labels=labels, colors=colors,
    autopct='%1.1f%%', shadow=True, startangle=90,
    textprops={'fontsize': 13, 'fontweight': 'bold'}
)

for autotext in autotexts:
    autotext.set_color('white')
    autotext.set_fontsize(14)

ax.set_title('Netflix 内容类型分布', fontsize=16, fontweight='bold', pad=20)
ax.axis('equal')  # 保证饼图是圆形
plt.tight_layout()
plt.show()


# ### 7.2 柱状图：制片国家 Top10
# 

# In[ ]:


fig, ax = plt.subplots(figsize=(12, 7))

top10_countries = country_count.head(10)
bars = ax.barh(top10_countries['国家'][::-1], top10_countries['数量'][::-1], 
               color='#E50914', height=0.7)

ax.set_xlabel('作品数量', fontsize=12)
ax.set_title('制片国家 Top 10', fontsize=15, fontweight='bold')
ax.grid(True, axis='x', alpha=0.3)

# 添加数值标注
for bar in bars:
    width = bar.get_width()
    ax.text(width + 20, bar.get_y() + bar.get_height()/2,
           f'{int(width)}', va='center', fontsize=10, fontweight='bold')

plt.tight_layout()
plt.show()


# ### 7.3 直方图：电影时长分布
# 

# In[ ]:


fig, ax = plt.subplots(figsize=(12, 6))

movie_durations = df[df['type'] == 'Movie']['duration_num']

n, bins, patches = ax.hist(movie_durations, bins=30, color='#E50914', 
                          edgecolor='white', linewidth=0.5, alpha=0.8)

ax.set_xlabel('时长（分钟）', fontsize=12)
ax.set_ylabel('电影数量', fontsize=12)
ax.set_title(f'电影时长分布直方图\n均值: {movie_durations.mean():.1f} min | 中位数: {movie_durations.median():.1f} min',
             fontsize=14, fontweight='bold')
ax.grid(True, alpha=0.3, axis='y')

# 标注均值和中位数
ax.axvline(movie_durations.mean(), color='gold', linestyle='--', linewidth=2, label=f'均值 = {movie_durations.mean():.1f} min')
ax.axvline(movie_durations.median(), color='green', linestyle='--', linewidth=2, label=f'中位数 = {movie_durations.median():.1f} min')
ax.legend(fontsize=11)

plt.tight_layout()
plt.show()


# ### 7.4 折线图：年度新增内容趋势
# 

# In[ ]:


fig, ax = plt.subplots(figsize=(12, 6))

years = year_added.index.tolist()
movies_count = year_added.get('Movie', pd.Series(0, index=years)).tolist()
shows_count = year_added.get('TV Show', pd.Series(0, index=years)).tolist()

ax.plot(years, movies_count, 'o-', color='#E50914', linewidth=2.5, 
        markersize=6, label='电影')
ax.plot(years, shows_count, 's-', color='#4ECDC4', linewidth=2.5, 
        markersize=6, label='电视节目')

ax.fill_between(years, movies_count, alpha=0.2, color='#E50914')
ax.fill_between(years, shows_count, alpha=0.2, color='#4ECDC4')

ax.set_xlabel('年份', fontsize=12)
ax.set_ylabel('新增内容数量', fontsize=12)
ax.set_title('Netflix 年度新增内容趋势', fontsize=15, fontweight='bold')
ax.legend(fontsize=12)
ax.grid(True, alpha=0.3)
ax.set_xlim([2010, 2021])

plt.tight_layout()
plt.show()


# ### 7.5 散点图：发行年份 vs 时长
# 

# In[ ]:


fig, ax = plt.subplots(figsize=(12, 7))

# 电影散点图
movies_scatter = df[(df['type'] == 'Movie') & (df['release_year'] >= 1980)]
ax.scatter(movies_scatter['release_year'], movies_scatter['duration_num'],
          c='#E50914', alpha=0.4, s=15, label='电影')

ax.set_xlabel('发行年份', fontsize=12)
ax.set_ylabel('时长（分钟）', fontsize=12)
ax.set_title('电影发行年份 vs 时长散点图（1980年至今）', fontsize=14, fontweight='bold')
ax.grid(True, alpha=0.3)
ax.legend(fontsize=12)

plt.tight_layout()
plt.show()


# ---
# 
# ## 8. pyecharts 交互式可视化

# ### 8.1 内容类型分布环形图
# 

# In[ ]:


def chart_type_pie():
    data = [list(z) for z in zip(type_dist['类型'].tolist(), type_dist['数量'].tolist())]
    c = (
        Pie(init_opts=opts.InitOpts(theme=ThemeType.DARK, width="100%", height="500px"))
        .add(
            series_name="数量分布",
            data_pair=data,
            radius=["40%", "70%"],
            center=["50%", "50%"],
            label_opts=opts.LabelOpts(formatter="{b}: {c} ({d}%)", font_size=14, color="#fff"),
            itemstyle_opts=opts.ItemStyleOpts(border_color="#0e0e0e", border_width=2),
        )
        .set_colors(["#E50914", "#831010"])
        .set_global_opts(
            title_opts=opts.TitleOpts(
                title="🎬 Netflix 内容类型分布",
                subtitle=f"共 {df.shape[0]} 部作品",
                title_textstyle_opts=opts.TextStyleOpts(color="#fff", font_size=22, font_weight="bold"),
                subtitle_textstyle_opts=opts.TextStyleOpts(color="#ccc", font_size=14),
                pos_left="center",
            ),
            legend_opts=opts.LegendOpts(orient="vertical", pos_top="middle", pos_right="10px", textstyle_opts=opts.TextStyleOpts(color="#fff")),
        )
    )
    return c

c1 = chart_type_pie()
c1.render('charts/chart1.html')
c1


# ### 8.2 年度发布趋势折线图
# 

# In[ ]:


def chart_year_line():
    years = [int(y) for y in year_added.index.tolist()]
    movies = year_added.get('Movie', pd.Series(0, index=year_added.index)).tolist()
    shows = year_added.get('TV Show', pd.Series(0, index=year_added.index)).tolist()

    c = (
        Line(init_opts=opts.InitOpts(theme=ThemeType.DARK, width="100%", height="550px"))
        .add_xaxis(years)
        .add_yaxis(
            "电影", movies, is_smooth=True, symbol_size=8,
            linestyle_opts=opts.LineStyleOpts(width=4, color="#E50914"),
            itemstyle_opts=opts.ItemStyleOpts(color="#E50914"),
            areastyle_opts=opts.AreaStyleOpts(opacity=0.2, color="#E50914"),
            label_opts=opts.LabelOpts(is_show=False),
        )
        .add_yaxis(
            "电视节目", shows, is_smooth=True, symbol_size=8,
            linestyle_opts=opts.LineStyleOpts(width=4, color="#FFD700"),
            itemstyle_opts=opts.ItemStyleOpts(color="#FFD700"),
            areastyle_opts=opts.AreaStyleOpts(opacity=0.2, color="#FFD700"),
            label_opts=opts.LabelOpts(is_show=False),
        )
        .set_global_opts(
            title_opts=opts.TitleOpts(
                title="📈 Netflix 每年新增内容趋势",
                title_textstyle_opts=opts.TextStyleOpts(color="#fff", font_size=22, font_weight="bold"),
                pos_left="center",
            ),
            xaxis_opts=opts.AxisOpts(
                axisline_opts=opts.AxisLineOpts(linestyle_opts=opts.LineStyleOpts(color="#666")),
                axislabel_opts=opts.LabelOpts(color="#ccc"),
            ),
            yaxis_opts=opts.AxisOpts(
                name="数量",
                axisline_opts=opts.AxisLineOpts(linestyle_opts=opts.LineStyleOpts(color="#666")),
                axislabel_opts=opts.LabelOpts(color="#ccc"),
                splitline_opts=opts.SplitLineOpts(is_show=True, linestyle_opts=opts.LineStyleOpts(opacity=0.15)),
            ),
            legend_opts=opts.LegendOpts(textstyle_opts=opts.TextStyleOpts(color="#fff"), pos_top="50px"),
            tooltip_opts=opts.TooltipOpts(trigger="axis", axis_pointer_type="cross"),
        )
    )
    return c

c2 = chart_year_line()
c2.render('charts/chart2.html')
c2


# ### 8.3 制片国家 Top15 柱状图
# 

# In[ ]:


def chart_country_bar():
    countries = country_count['国家'].tolist()[::-1]
    counts = country_count['数量'].tolist()[::-1]

    c = (
        Bar(init_opts=opts.InitOpts(theme=ThemeType.DARK, width="100%", height="600px"))
        .add_xaxis(countries)
        .add_yaxis(
            "作品数量", counts,
            category_gap="40%",
            label_opts=opts.LabelOpts(position="right", color="#fff", font_size=12, font_weight="bold"),
            itemstyle_opts=opts.ItemStyleOpts(
                color={
                    "type": "linear", "x": 0, "y": 0, "x2": 1, "y2": 0,
                    "colorStops": [[0, {"r": 229, "g": 9, "b": 20}], [1, {"r": 255, "g": 100, "b": 100}]],
                },
                border_radius=[0, 8, 8, 0],
            ),
        )
        .reversal_axis()
        .set_global_opts(
            title_opts=opts.TitleOpts(
                title="🌍 制片国家 Top 15",
                title_textstyle_opts=opts.TextStyleOpts(color="#fff", font_size=22, font_weight="bold"),
                pos_left="center",
            ),
            xaxis_opts=opts.AxisOpts(
                axisline_opts=opts.AxisLineOpts(linestyle_opts=opts.LineStyleOpts(color="#666")),
                axislabel_opts=opts.LabelOpts(color="#ccc"),
                splitline_opts=opts.SplitLineOpts(is_show=True, linestyle_opts=opts.LineStyleOpts(opacity=0.15)),
            ),
            yaxis_opts=opts.AxisOpts(
                axisline_opts=opts.AxisLineOpts(linestyle_opts=opts.LineStyleOpts(color="#666")),
                axislabel_opts=opts.LabelOpts(color="#fff", font_size=13),
            ),
            legend_opts=opts.LegendOpts(is_show=False),
        )
    )
    return c

c3 = chart_country_bar()
c3.render('charts/chart3.html')
c3


# ### 8.4 热门流派 Top10 柱状图
# 

# In[ ]:


def chart_genre_bar():
    genres = genre_count['流派'].tolist()[::-1]
    counts = genre_count['数量'].tolist()[::-1]

    c = (
        Bar(init_opts=opts.InitOpts(theme=ThemeType.DARK, width="100%", height="550px"))
        .add_xaxis(genres)
        .add_yaxis(
            "作品数量", counts,
            category_gap="45%",
            label_opts=opts.LabelOpts(position="right", color="#fff", font_size=12, font_weight="bold"),
            itemstyle_opts=opts.ItemStyleOpts(
                color={
                    "type": "linear", "x": 0, "y": 0, "x2": 1, "y2": 0,
                    "colorStops": [[0, {"r": 64, "g": 158, "b": 255}], [1, {"r": 255, "g": 215, "b": 0}]],
                },
                border_radius=[0, 8, 8, 0],
            ),
        )
        .reversal_axis()
        .set_global_opts(
            title_opts=opts.TitleOpts(
                title="🎭 热门流派 Top 10",
                title_textstyle_opts=opts.TextStyleOpts(color="#fff", font_size=22, font_weight="bold"),
                pos_left="center",
            ),
            xaxis_opts=opts.AxisOpts(
                axisline_opts=opts.AxisLineOpts(linestyle_opts=opts.LineStyleOpts(color="#666")),
                axislabel_opts=opts.LabelOpts(color="#ccc"),
                splitline_opts=opts.SplitLineOpts(is_show=True, linestyle_opts=opts.LineStyleOpts(opacity=0.15)),
            ),
            yaxis_opts=opts.AxisOpts(
                axisline_opts=opts.AxisLineOpts(linestyle_opts=opts.LineStyleOpts(color="#666")),
                axislabel_opts=opts.LabelOpts(color="#fff", font_size=12),
            ),
            legend_opts=opts.LegendOpts(is_show=False),
        )
    )
    return c

c4 = chart_genre_bar()
c4.render('charts/chart4.html')
c4


# ### 8.5 年龄评级分布漏斗图
# 

# In[ ]:


def chart_rating_funnel():
    data = [list(z) for z in zip(rating_dist['评级'].tolist(), rating_dist['数量'].tolist())]
    c = (
        Funnel(init_opts=opts.InitOpts(theme=ThemeType.DARK, width="100%", height="550px"))
        .add(
            series_name="评级分布",
            data_pair=data,
            label_opts=opts.LabelOpts(position="inside", formatter="{b}: {c}", color="#fff", font_size=13, font_weight="bold"),
            sort_="descending", gap=2,
        )
        .set_colors(["#E50914", "#FF6B6B", "#FFD700", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#A29BFE", "#81ECEC"])
        .set_global_opts(
            title_opts=opts.TitleOpts(
                title="🔖 年龄评级分布（漏斗图）",
                title_textstyle_opts=opts.TextStyleOpts(color="#fff", font_size=22, font_weight="bold"),
                pos_left="center",
            ),
            legend_opts=opts.LegendOpts(textstyle_opts=opts.TextStyleOpts(color="#fff"), pos_top="50px"),
            tooltip_opts=opts.TooltipOpts(trigger="item", formatter="{b}: {c} ({d}%)"),
        )
    )
    return c

c5 = chart_rating_funnel()
c5.render('charts/chart5.html')
c5


# ### 8.6 电影时长分布直方图
# 

# In[ ]:


def chart_duration():
    movies = df[df['type'] == 'Movie']['duration_num'].tolist()
    bins = list(range(0, int(max(movies)) + 20, 10))
    labels = [f"{bins[i]}-{bins[i+1]}" for i in range(len(bins)-1)]
    counts, _ = np.histogram(movies, bins=bins)

    c = (
        Bar(init_opts=opts.InitOpts(theme=ThemeType.DARK, width="100%", height="550px"))
        .add_xaxis(labels)
        .add_yaxis(
            "电影数量", counts.tolist(),
            category_gap="5%",
            label_opts=opts.LabelOpts(is_show=False),
            itemstyle_opts=opts.ItemStyleOpts(
                color={
                    "type": "linear", "x": 0, "y": 0, "x2": 0, "y2": 1,
                    "colorStops": [[0, {"r": 255, "g": 107, "b": 107}], [1, {"r": 229, "g": 9, "b": 20}]],
                },
                border_radius=[6, 6, 0, 0],
            ),
        )
        .set_global_opts(
            title_opts=opts.TitleOpts(
                title="⏱ 电影时长分布（分钟）",
                subtitle=f"平均时长: {int(np.mean(movies))} 分钟 | 中位数: {int(np.median(movies))} 分钟",
                title_textstyle_opts=opts.TextStyleOpts(color="#fff", font_size=22, font_weight="bold"),
                subtitle_textstyle_opts=opts.TextStyleOpts(color="#ccc", font_size=13),
                pos_left="center",
            ),
            xaxis_opts=opts.AxisOpts(
                name="时长区间（分钟）",
                axisline_opts=opts.AxisLineOpts(linestyle_opts=opts.LineStyleOpts(color="#666")),
                axislabel_opts=opts.LabelOpts(color="#ccc", rotate=45, font_size=10),
            ),
            yaxis_opts=opts.AxisOpts(
                name="电影数量",
                axisline_opts=opts.AxisLineOpts(linestyle_opts=opts.LineStyleOpts(color="#666")),
                axislabel_opts=opts.LabelOpts(color="#ccc"),
                splitline_opts=opts.SplitLineOpts(is_show=True, linestyle_opts=opts.LineStyleOpts(opacity=0.15)),
            ),
            legend_opts=opts.LegendOpts(is_show=False),
        )
    )
    return c

c6 = chart_duration()
c6.render('charts/chart6.html')
c6


# ### 8.7 流派 × 类型堆叠柱状图
# 

# In[ ]:


def chart_genre_type():
    top_genres = genre_count['流派'].head(8).tolist()
    genre_type_data = []
    for genre in top_genres:
        movie_count = df[df['genres_list'].apply(lambda x: genre in x) & (df['type'] == 'Movie')].shape[0]
        show_count = df[df['genres_list'].apply(lambda x: genre in x) & (df['type'] == 'TV Show')].shape[0]
        genre_type_data.append({'流派': genre, '电影': movie_count, '电视节目': show_count})
    gt_df = pd.DataFrame(genre_type_data)

    c = (
        Bar(init_opts=opts.InitOpts(theme=ThemeType.DARK, width="100%", height="550px"))
        .add_xaxis(gt_df['流派'].tolist())
        .add_yaxis(
            "电影", gt_df['电影'].tolist(), stack="stack1",
            label_opts=opts.LabelOpts(is_show=True, color="#fff", position="inside"),
            itemstyle_opts=opts.ItemStyleOpts(color="#E50914", border_radius=[4, 4, 0, 0]),
        )
        .add_yaxis(
            "电视节目", gt_df['电视节目'].tolist(), stack="stack1",
            label_opts=opts.LabelOpts(is_show=True, color="#fff", position="inside"),
            itemstyle_opts=opts.ItemStyleOpts(color="#4ECDC4", border_radius=[4, 4, 0, 0]),
        )
        .set_global_opts(
            title_opts=opts.TitleOpts(
                title="🎨 流派 × 类型 堆叠分布",
                title_textstyle_opts=opts.TextStyleOpts(color="#fff", font_size=22, font_weight="bold"),
                pos_left="center",
            ),
            xaxis_opts=opts.AxisOpts(
                axisline_opts=opts.AxisLineOpts(linestyle_opts=opts.LineStyleOpts(color="#666")),
                axislabel_opts=opts.LabelOpts(color="#fff", rotate=25, font_size=11),
            ),
            yaxis_opts=opts.AxisOpts(
                axisline_opts=opts.AxisLineOpts(linestyle_opts=opts.LineStyleOpts(color="#666")),
                axislabel_opts=opts.LabelOpts(color="#ccc"),
                splitline_opts=opts.SplitLineOpts(is_show=True, linestyle_opts=opts.LineStyleOpts(opacity=0.15)),
            ),
            legend_opts=opts.LegendOpts(textstyle_opts=opts.TextStyleOpts(color="#fff"), pos_top="50px"),
        )
    )
    return c

c7 = chart_genre_type()
c7.render('charts/chart7.html')
c7


# ### 8.8 流派词云图
# 

# In[ ]:


def chart_genre_cloud():
    words = [[g, int(c)] for g, c in Counter(all_genres).most_common()]
    c = (
        WordCloud(init_opts=opts.InitOpts(theme=ThemeType.DARK, width="100%", height="550px"))
        .add(
            "", words,
            word_size_range=[16, 80],
            shape="cardioid",
            textstyle_opts=opts.TextStyleOpts(font_family="Microsoft YaHei"),
        )
        .set_global_opts(
            title_opts=opts.TitleOpts(
                title="☁️ Netflix 流派词云",
                title_textstyle_opts=opts.TextStyleOpts(color="#fff", font_size=22, font_weight="bold"),
                pos_left="center",
            ),
            tooltip_opts=opts.TooltipOpts(trigger="item"),
        )
    )
    return c

c8 = chart_genre_cloud()
c8.render('charts/chart10.html')
c8


# ### 8.9 电视节目季数玫瑰图
# 

# In[ ]:


def chart_season_rose():
    shows = df[df['type'] == 'TV Show']['duration_num'].value_counts().sort_index().head(8).reset_index()
    shows.columns = ['季数', '数量']
    shows['label'] = shows['季数'].astype(str) + ' Season'
    data = [list(z) for z in zip(shows['label'].tolist(), shows['数量'].tolist())]

    c = (
        Pie(init_opts=opts.InitOpts(theme=ThemeType.DARK, width="100%", height="550px"))
        .add(
            "", data, radius=["30%", "75%"], rosetype="radius",
            label_opts=opts.LabelOpts(formatter="{b}: {c}", color="#fff", font_size=12),
        )
        .set_colors(["#E50914", "#FF6B6B", "#FFD700", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"])
        .set_global_opts(
            title_opts=opts.TitleOpts(
                title="🌸 电视节目季数分布（玫瑰图）",
                title_textstyle_opts=opts.TextStyleOpts(color="#fff", font_size=22, font_weight="bold"),
                pos_left="center",
            ),
            legend_opts=opts.LegendOpts(orient="vertical", pos_top="middle", pos_right="5%", textstyle_opts=opts.TextStyleOpts(color="#fff")),
        )
    )
    return c

c9 = chart_season_rose()
c9.render('charts/chart9.html')
c9


# ---
# 
# ## 9. 导出 JSON 数据供前端使用

# In[ ]:


os.makedirs('data', exist_ok=True)

# 流派 × 类型交叉数据
top_genres_for_type = genre_count['流派'].head(8).tolist()
genre_type_breakdown = []
for genre in top_genres_for_type:
    movie_count = int(df[df['genres_list'].apply(lambda x: genre in x) & (df['type'] == 'Movie')].shape[0])
    show_count = int(df[df['genres_list'].apply(lambda x: genre in x) & (df['type'] == 'TV Show')].shape[0])
    genre_type_breakdown.append({'流派': genre, '电影': movie_count, '电视节目': show_count})

# TV Show 季数分布
season_df = df[df['type'] == 'TV Show']['duration_num'].value_counts().sort_index().head(10).reset_index()
season_df.columns = ['季数', '数量']
season_distribution = season_df.to_dict('records')

# 热力图数据
heatmap_years = list(range(2008, 2022))
heatmap_ratings = rating_dist['评级'].head(8).tolist()
heatmap_real = []
for y in heatmap_years:
    for r in heatmap_ratings:
        cnt = int(df[(df['release_year'] == y) & (df['rating'] == r)].shape[0])
        heatmap_real.append({'year': y, 'rating': r, 'count': cnt})

# 电影时长直方图数据
movie_durations = df[df['type'] == 'Movie']['duration_num']
bin_size = 15
bins_start = list(range(0, int(movie_durations.max()) + bin_size + 1, bin_size))
hist_counts, _ = np.histogram(movie_durations.tolist(), bins=bins_start)
duration_histogram = [
    {'range': f'{bins_start[i]}-{bins_start[i+1]}', 'count': int(hist_counts[i])}
    for i in range(len(bins_start)-1)
]

export = {
    'overview': {
        'total': int(df.shape[0]),
        'movies': int(df[df['type'] == 'Movie'].shape[0]),
        'tvshows': int(df[df['type'] == 'TV Show'].shape[0]),
        'countries': len(set(c for cs in df['countries_list'] for c in cs)),
        'genres': len(set(g for gs in df['genres_list'] for g in gs)),
        'directors': int(df[df['director'] != 'Unknown']['director'].nunique()),
    },
    'type_dist': type_dist.to_dict(orient='records'),
    'year_trend': [{'year': int(idx), 'Movie': int(row.get('Movie', 0)), 'TV Show': int(row.get('TV Show', 0)), 'total': int(row['总计'])}
                   for idx, row in year_added.iterrows()],
    'countries': country_count.to_dict(orient='records'),
    'genres': genre_count.to_dict(orient='records'),
    'ratings': rating_dist.to_dict(orient='records'),
    'duration_stats': {
        'mean': float(np.mean(movie_durations)),
        'median': float(np.median(movie_durations)),
        'min': float(np.min(movie_durations)),
        'max': float(np.max(movie_durations)),
        'count': len(movie_durations),
    },
    'genre_type_breakdown': genre_type_breakdown,
    'season_distribution': season_distribution,
    'heatmap_data': heatmap_real,
    'heatmap_meta': {'years': heatmap_years, 'ratings': heatmap_ratings},
    'duration_histogram': duration_histogram,
    'correlation_matrix': corr_matrix.round(3).to_dict(),
    'regression_results': {
        'features': features,
        'r2': round(r2, 4),
        'rmse': round(rmse, 2),
        'coefficients': coef_df.to_dict(orient='records'),
    },
    'kmeans_results': {
        'best_k': 4,
        'silhouette_score': round(sil_score, 4),
        'cluster_profile': cluster_profile.round(2).to_dict(),
    },
    'randomforest_results': {
        'accuracy': round(accuracy_score(y_test_rf, y_pred_rf), 4),
        'feature_importance': importance_df.round(4).to_dict(orient='records'),
    },
}

with open('data/complete_analysis.json', 'w', encoding='utf-8') as f:
    json.dump(export, f, ensure_ascii=False, indent=2)

print('完整分析数据导出完成 ✓')
print(f"文件路径: data/complete_analysis.json")


# ---
# 
# ## 10. 案例分析结论与建议

# ### 10.1 数据分析结果总结
# 

# In[ ]:


print("=" * 60)
print("Netflix 数据分析 · 核心发现总结")
print("=" * 60)

total = len(df)
type_vc = df['type'].value_counts()

print(f"\n📊 一、描述性统计发现")
print(f"  1. 内容规模：共 {total} 部作品")
print(f"  2. 类型分布：电影 {type_vc.get('Movie', 0)} 部 ({type_vc.get('Movie', 0)/total*100:.1f}%)，电视节目 {type_vc.get('TV Show', 0)} 部 ({type_vc.get('TV Show', 0)/total*100:.1f}%)")

year_trend = df.groupby('year_added').size()
peak_year = year_trend.idxmax()
print(f"  3. 增长峰值：{peak_year} 年达到顶峰，新增 {year_trend.max()} 部")

print(f"  4. 地域分布：{country_count.iloc[0]['国家']} 以 {country_count.iloc[0]['数量']} 部位居第一")
print(f"  5. 最热门流派：{genre_count.iloc[0]['流派']}（{genre_count.iloc[0]['数量']} 部）")

movie_avg_dur = df[df['type'] == 'Movie']['duration_num'].mean()
print(f"  6. 电影平均时长：{movie_avg_dur:.1f} 分钟")

print(f"\n📈 二、相关性分析发现")
print(f"  1. release_year 与 year_added 正相关 (r={corr_matrix.loc['release_year', 'year_added']:.3f})")
print(f"     → 新发行的作品通常更快上线 Netflix")

print(f"\n🤖 三、机器学习建模发现")
print(f"  1. 线性回归预测电影时长：R²={r2:.4f}，解释能力有限")
print(f"  2. K-Means 聚类 (K=4)：轮廓系数={sil_score:.4f}，可将电影分为 4 个典型群体")
print(f"  3. 随机森林分类：准确率={accuracy_score(y_test_rf, y_pred_rf):.2%}，可准确识别电影/电视节目")
print(f"     → 最重要特征：{sorted_features[0]}（{sorted_importances[0]:.3f}）")

print(f"\n⚠️  四、数据质量发现")
print(f"  1. 异常值检测：电影时长异常 {df['is_outlier_duration'].sum()} 部（IQR 法）")
print(f"  2. 缺失值处理：6 个字段存在缺失，已用众数/Unknown 填充")
print()
print("=" * 60)


# ### 10.2 结论与建议
# 

# #### 业务结论
# 
# 1. **电影仍是核心内容**：电影占比约 70%，是 Netflix 内容库的主体，但电视节目增长势头强劲。
# 
# 2. **内容增长已见顶**：2019 年前后是内容扩张高峰期，之后略有回落，说明 Netflix 可能从"数量扩张"转向"质量提升"。
# 
# 3. **美国内容一家独大**：美国产内容占比超过 40%，但印度、英国、日本等国的内容也在快速增长，国际化战略成效明显。
# 
# 4. **剧集多为单季试水**：超过 50% 的电视节目只有 1 季，反映了 Netflix 快速试错、数据驱动的剧集决策模式。
# 
# #### 业务建议
# 
# 1. **内容策略优化**
#    - 继续加大 Drama 和 Comedy 类内容投入（用户需求最高）
#    - 增加 International Movies 类别的多样性，特别是亚洲市场
#    - 打造多季爆款 IP，提升用户留存率
# 
# 2. **区域市场拓展**
#    - 美国市场已相对饱和，可重点发展印度、韩国、日本等增长市场
#    - 推进本土化内容制作，降低对好莱坞内容的依赖
# 
# 3. **用户分级管理**
#    - TV-MA 内容占比最高（约 36%），需完善家长控制功能
#    - 增加家庭友好型内容（TV-PG / PG 级别），扩展受众群体
# 
# 4. **数据驱动决策**
#    - 利用随机森林等模型辅助内容类型判断和资源分配
#    - 通过聚类分析识别不同类型内容的特征模式，指导采购策略
# 
# 5. **数据质量改进**
#    - 完善导演、演员信息的缺失值填充
#    - 对异常时长数据进行人工复核，提升数据可信度

# ---
# 
# ## 11. 汇报演讲要点（10 分钟版）
# 
# | 时间 | 环节 | 主讲人 | 核心内容 |
# | --- | --- | --- | --- |
# | 0-1 min | 开场介绍 | 成员 A | 小组介绍、数据集背景、分析目标 |
# | 1-3 min | 数据预处理 | 成员 A | 缺失值处理、异常值检测（IQR/Z-score）、特征工程 |
# | 3-5 min | 描述性分析 + 可视化 | 成员 B | 展示网页看板，讲解 6 个核心图表发现 |
# | 5-7 min | 高级分析（建模） | 成员 A | 相关性分析、线性回归、K-Means 聚类、随机森林 |
# | 7-9 min | 结论建议 | 成员 B | 核心发现总结、业务建议 |
# | 9-10 min | 总结展望 | 全员 | 项目亮点、不足与改进方向 |
# 
# ---
# 
# **END OF NOTEBOOK**
