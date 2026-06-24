# -*- coding: utf-8 -*-
"""
Netflix 数据分析完整代码
========================
包含：数据预处理、描述性统计、相关性分析、线性回归、K-Means 聚类、随机森林分类、可视化

两人组分工：
- 成员 A（数据科学家）：数据清洗、预处理、统计分析、机器学习建模
- 成员 B（前端工程师）：可视化、网页前端、汇报演示

运行方式：python data_preprocessing.py
"""

import pandas as pd
import numpy as np
import json
import os
import warnings
from collections import Counter

warnings.filterwarnings('ignore')

# ============================================================
# 1. 数据加载
# ============================================================
print("=" * 60)
print("1. 数据加载")
print("=" * 60)

df = pd.read_csv('netflix_titles.csv')
print(f"原始数据形状: {df.shape}")
print(f"列名: {df.columns.tolist()}")

# ============================================================
# 2. 数据预处理 - 缺失值处理
# ============================================================
print("\n" + "=" * 60)
print("2. 缺失值处理")
print("=" * 60)

# 检查缺失值
missing = df.isnull().sum().sort_values(ascending=False)
missing_pct = (missing / len(df) * 100).round(2)
missing_df = pd.DataFrame({'缺失数量': missing, '缺失比例(%)': missing_pct})
print("缺失值统计:")
print(missing_df[missing_df['缺失数量'] > 0])

# 缺失值填充策略
# - director, cast, country: 用 'Unknown' 填充
# - date_added, rating, duration: 用众数填充
df['director'] = df['director'].fillna('Unknown')
df['cast'] = df['cast'].fillna('Unknown')
df['country'] = df['country'].fillna('Unknown')
df['date_added'] = df['date_added'].fillna(df['date_added'].mode()[0])
df['rating'] = df['rating'].fillna(df['rating'].mode()[0])
df['duration'] = df['duration'].fillna(df['duration'].mode()[0])

# rating 异常值处理：检测到 3 条 rating 值为时长格式（如 '74 min'），用众数填充
invalid_ratings = df['rating'].str.contains('min', na=False)
invalid_rating_count = invalid_ratings.sum()
if invalid_rating_count > 0:
    print(f"\n发现 rating 异常值 {invalid_rating_count} 条（时长格式），用众数填充:")
    print(df.loc[invalid_ratings, ['show_id', 'title', 'rating', 'duration']].to_string(index=False))
    df.loc[invalid_ratings, 'rating'] = df['rating'].mode()[0]

print(f"\n处理后缺失值总数: {df.isnull().sum().sum()} (应为 0)")

# ============================================================
# 3. 数据预处理 - 特征工程
# ============================================================
print("\n" + "=" * 60)
print("3. 特征工程")
print("=" * 60)

# 提取上线年份
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

# 衍生计数特征
df['genre_count'] = df['genres_list'].apply(len)
df['country_count'] = df['countries_list'].apply(len)
df['cast_count'] = df['cast_list'].apply(len)
df['has_director'] = (df['director'] != 'Unknown').astype(int)

# 第一流派、第一制片国
df['primary_genre'] = df['genres_list'].apply(lambda x: x[0] if x else 'Unknown')
df['primary_country'] = df['countries_list'].apply(lambda x: x[0] if x else 'Unknown')

print(f"处理后数据形状: {df.shape}")
print(f"新增 10 个衍生字段: year_added, genres_list, countries_list, cast_list,")
print(f"                    duration_num, genre_count, country_count, cast_count,")
print(f"                    primary_genre, primary_country")

# ============================================================
# 4. 异常值检测（IQR 法 + Z-score 法）
# ============================================================
print("\n" + "=" * 60)
print("4. 异常值检测")
print("=" * 60)

movies = df[df['type'] == 'Movie'].copy()

# 方法一：IQR 四分位距法
Q1 = movies['duration_num'].quantile(0.25)
Q3 = movies['duration_num'].quantile(0.75)
IQR = Q3 - Q1
lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

iqr_outliers = movies[(movies['duration_num'] < lower_bound) | (movies['duration_num'] > upper_bound)]
print(f"【IQR 法】")
print(f"  Q1={Q1:.1f}, Q3={Q3:.1f}, IQR={IQR:.1f}")
print(f"  正常范围: [{lower_bound:.1f}, {upper_bound:.1f}] 分钟")
print(f"  异常值数量: {len(iqr_outliers)} 部 ({len(iqr_outliers)/len(movies)*100:.2f}%)")

# 方法二：Z-score 法
movies['duration_zscore'] = (movies['duration_num'] - movies['duration_num'].mean()) / movies['duration_num'].std()
z_outliers = movies[abs(movies['duration_zscore']) > 3]
print(f"\n【Z-score 法】 (|Z| > 3)")
print(f"  均值: {movies['duration_num'].mean():.1f} 分钟")
print(f"  标准差: {movies['duration_num'].std():.1f} 分钟")
print(f"  异常值数量: {len(z_outliers)} 部 ({len(z_outliers)/len(movies)*100:.2f}%)")

# 标记异常值（保留不删除）
df['is_outlier_duration'] = 0
df.loc[iqr_outliers.index, 'is_outlier_duration'] = 1
print(f"\n异常值处理策略: 标记但不删除，保留分析价值")

# 保存清洗后的数据
df.to_csv('netflix_titles_cleaned.csv', index=False)
print(f"\n清洗后数据已保存: netflix_titles_cleaned.csv")

# ============================================================
# 5. 描述性统计分析
# ============================================================
print("\n" + "=" * 60)
print("5. 描述性统计分析")
print("=" * 60)

# 数值型变量描述统计
numeric_cols = ['release_year', 'year_added', 'duration_num', 'genre_count', 'country_count', 'cast_count']
print("\n【数值型变量描述性统计】")
print(df[numeric_cols].describe().round(2))

# 类型分布
type_dist = df['type'].value_counts()
print(f"\n【内容类型分布】")
print(f"  电影: {type_dist['Movie']} 部 ({type_dist['Movie']/len(df)*100:.1f}%)")
print(f"  电视节目: {type_dist['TV Show']} 部 ({type_dist['TV Show']/len(df)*100:.1f}%)")

# 年度趋势
year_trend = df.groupby('year_added').size()
peak_year = year_trend.idxmax()
print(f"\n【年度新增趋势】")
print(f"  峰值年份: {peak_year} 年 ({year_trend.max()} 部)")

# 国家 Top10
all_countries = [c for cl in df['countries_list'] for c in cl]
top_countries = Counter(all_countries).most_common(10)
print(f"\n【制片国家 Top10】")
for i, (c, n) in enumerate(top_countries, 1):
    print(f"  {i:2d}. {c}: {n} 部")

# 流派 Top10
all_genres = [g for gl in df['genres_list'] for g in gl]
top_genres = Counter(all_genres).most_common(10)
print(f"\n【热门流派 Top10】")
for i, (g, n) in enumerate(top_genres, 1):
    print(f"  {i:2d}. {g}: {n} 部")

# 分组统计：按类型
type_group = df.groupby('type').agg({
    'duration_num': ['mean', 'median', 'std'],
    'release_year': ['mean', 'min', 'max'],
    'cast_count': 'mean'
}).round(2)
print(f"\n【按类型分组统计】")
print(type_group)

# ============================================================
# 6. 相关性分析
# ============================================================
print("\n" + "=" * 60)
print("6. 相关性分析")
print("=" * 60)

corr_matrix = df[numeric_cols].corr()
print("\n相关系数矩阵:")
print(corr_matrix.round(3))

print(f"\n关键相关性:")
print(f"  release_year vs year_added: r = {corr_matrix.loc['release_year', 'year_added']:.3f} (正相关)")
print(f"  genre_count vs cast_count: r = {corr_matrix.loc['genre_count', 'cast_count']:.3f} (弱正相关)")
print(f"  duration_num vs release_year: r = {corr_matrix.loc['duration_num', 'release_year']:.3f} (弱相关)")

# ============================================================
# 7. 线性回归分析：预测电影时长
# ============================================================
print("\n" + "=" * 60)
print("7. 线性回归：预测电影时长")
print("=" * 60)

from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

movies_df = df[df['type'] == 'Movie'].copy()
features = ['release_year', 'genre_count', 'country_count', 'cast_count']
X = movies_df[features]
y = movies_df['duration_num']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

lr_model = LinearRegression()
lr_model.fit(X_train, y_train)
y_pred = lr_model.predict(X_test)

mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print(f"模型评估:")
print(f"  R² = {r2:.4f} (解释 {r2*100:.1f}% 的变异)")
print(f"  RMSE = {rmse:.2f} 分钟")
print(f"  MSE = {mse:.2f}")

print(f"\n回归系数:")
print(f"  截距: {lr_model.intercept_:.2f}")
for feat, coef in zip(features, lr_model.coef_):
    print(f"  {feat}: {coef:+.4f}")

print(f"\n结论: R² 较低，说明仅用元数据特征难以准确预测电影时长")

# ============================================================
# 8. K-Means 聚类分析
# ============================================================
print("\n" + "=" * 60)
print("8. K-Means 聚类分析")
print("=" * 60)

from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score

cluster_features = ['release_year', 'duration_num', 'genre_count', 'country_count', 'cast_count']
X_km = movies_df[cluster_features].dropna()

# 标准化
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_km)

# K=4 聚类
kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
X_km['cluster'] = kmeans.fit_predict(X_scaled)

sil_score = silhouette_score(X_scaled, kmeans.labels_)
print(f"聚类参数: K=4")
print(f"轮廓系数: {sil_score:.4f}")

print(f"\n各簇大小:")
for i in range(4):
    n = (X_km['cluster'] == i).sum()
    print(f"  簇 {i}: {n} 部 ({n/len(X_km)*100:.1f}%)")

print(f"\n各簇特征画像:")
profile = X_km.groupby('cluster')[cluster_features].mean().round(1)
print(profile)

# ============================================================
# 9. 随机森林分类：预测内容类型
# ============================================================
print("\n" + "=" * 60)
print("9. 随机森林分类：预测内容类型 (Movie / TV Show)")
print("=" * 60)

from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

ml_df = df.copy()
ml_df['rating_enc'] = LabelEncoder().fit_transform(ml_df['rating'])
ml_df['genre_enc'] = LabelEncoder().fit_transform(ml_df['primary_genre'])
ml_df['country_enc'] = LabelEncoder().fit_transform(ml_df['primary_country'])

X_rf = ml_df[['release_year', 'year_added', 'duration_num', 'genre_count',
              'country_count', 'cast_count', 'has_director',
              'rating_enc', 'genre_enc', 'country_enc']]
y_rf = (ml_df['type'] == 'Movie').astype(int)

X_train_rf, X_test_rf, y_train_rf, y_test_rf = train_test_split(
    X_rf, y_rf, test_size=0.2, random_state=42, stratify=y_rf
)

rf_model = RandomForestClassifier(
    n_estimators=100, max_depth=10,
    min_samples_split=5, random_state=42, n_jobs=-1
)
rf_model.fit(X_train_rf, y_train_rf)

y_pred_rf = rf_model.predict(X_test_rf)
acc = accuracy_score(y_test_rf, y_pred_rf)

print(f"模型评估:")
print(f"  准确率: {acc:.2%}")
print(f"\n分类报告:")
print(classification_report(y_test_rf, y_pred_rf, target_names=['TV Show', 'Movie']))

print(f"混淆矩阵:")
cm = confusion_matrix(y_test_rf, y_pred_rf)
print(f"              预测 TV Show  预测 Movie")
print(f"实际 TV Show    {cm[0][0]:>6}        {cm[0][1]:>6}")
print(f"实际 Movie      {cm[1][0]:>6}        {cm[1][1]:>6}")

print(f"\n特征重要性 Top5:")
importances = rf_model.feature_importances_
indices = np.argsort(importances)[::-1]
for i in range(5):
    print(f"  {i+1}. {X_rf.columns[indices[i]]}: {importances[indices[i]]:.4f}")

# ============================================================
# 10. 导出分析结果
# ============================================================
print("\n" + "=" * 60)
print("10. 导出分析结果")
print("=" * 60)

os.makedirs('data', exist_ok=True)

export_data = {
    'overview': {
        'total': int(df.shape[0]),
        'movies': int(df[df['type'] == 'Movie'].shape[0]),
        'tvshows': int(df[df['type'] == 'TV Show'].shape[0]),
        'countries': len(set(c for cs in df['countries_list'] for c in cs)),
        'genres': len(set(g for gs in df['genres_list'] for g in gs)),
        'directors': int(df[df['director'] != 'Unknown']['director'].nunique()),
    },
    'type_distribution': df['type'].value_counts().to_dict(),
    'year_trend': df.groupby('year_added').size().to_dict(),
    'top_countries': dict(Counter(all_countries).most_common(15)),
    'top_genres': dict(Counter(all_genres).most_common(15)),
    'rating_distribution': df['rating'].value_counts().head(10).to_dict(),
    'correlation_matrix': corr_matrix.round(3).to_dict(),
    'regression_results': {
        'features': features,
        'r2': round(r2, 4),
        'rmse': round(rmse, 2),
        'mse': round(mse, 2),
    },
    'kmeans_results': {
        'best_k': 4,
        'silhouette_score': round(sil_score, 4),
        'cluster_profile': profile.round(2).to_dict(),
    },
    'randomforest_results': {
        'accuracy': round(acc, 4),
        'top_features': [X_rf.columns[indices[i]] for i in range(5)],
    },
    'outliers_count': int(df['is_outlier_duration'].sum()),
}

with open('data/complete_analysis.json', 'w', encoding='utf-8') as f:
    json.dump(export_data, f, ensure_ascii=False, indent=2)

print(f"分析结果已导出: data/complete_analysis.json")

# ============================================================
# 11. 核心发现总结
# ============================================================
print("\n" + "=" * 60)
print("🎉 分析完成！核心发现总结")
print("=" * 60)

print(f"""
📊 描述性统计
  1. 电影占比 ~70%，是 Netflix 内容主体
  2. {peak_year} 年是内容增长顶峰，新增 {year_trend.max()} 部
  3. {top_countries[0][0]} 是最大制片国（{top_countries[0][1]} 部）
  4. {top_genres[0][0]} 是最热门流派（{top_genres[0][1]} 部）

📈 高级分析
  1. 相关性：发行年份与上线年份正相关 (r={corr_matrix.loc['release_year', 'year_added']:.2f})
  2. 线性回归：R²={r2:.4f}，时长预测较困难
  3. K-Means 聚类：K=4，轮廓系数={sil_score:.4f}
  4. 随机森林分类：准确率={acc:.2%}，可准确识别内容类型

⚠️  数据质量
  1. 异常值：{df['is_outlier_duration'].sum()} 部电影时长异常（IQR法）
  2. 缺失值：6 个字段存在缺失，已用众数/Unknown 填充
""")

print("=" * 60)
print("✅ 全部分析完成！")
print("=" * 60)
