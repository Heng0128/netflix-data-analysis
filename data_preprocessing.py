# Netflix 数据预处理与分析代码

## 1. 数据加载与预处理

```python
import pandas as pd
import numpy as np
import json
from collections import Counter
from pyecharts import options as opts
from pyecharts.charts import Bar, Pie, Line, WordCloud, HeatMap, Funnel, Page
from pyecharts.globals import ThemeType, CurrentConfig

# 设置在线资源
CurrentConfig.ONLINE_HOST = "https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/"

# -------- 数据加载 --------
df = pd.read_csv('netflix_titles_cleaned.csv')
print(f"数据集形状：{df.shape}")
print(f"列名：{df.columns.tolist()}")
```

## 2. 缺失值处理

```python
# 检查缺失值
print("缺失值统计:")
print(df.isnull().sum())

# 由于数据已经清洗，缺失值为 0
# 原始数据的处理方法如下：
# for col in ['director', 'cast', 'country']:
#     df[col] = df[col].fillna('Unknown')
# df['date_added'] = df['date_added'].fillna(df['date_added'].mode()[0])
# df['rating'] = df['rating'].fillna(df['rating'].mode()[0])
# df['duration'] = df['duration'].fillna(df['duration'].mode()[0])

print(f"总缺失值数：{df.isnull().sum().sum()}")
```

## 3. 异常值处理

```python
# 检测时长异常值
outliers = df[df['is_anomaly_duration'] == 1]
print(f"异常值数量：{len(outliers)}")
print("异常值样本:")
print(outliers[['title', 'duration', 'type']].head())

# 异常值处理方法：标记但不删除，保留用于分析
```

## 4. 描述性统计分析

```python
# 数值型变量描述性统计
numeric_cols = ['release_year', 'year_added', 'duration_num', 'genre_count', 'country_count', 'cast_count']
print("=== 数值型变量描述性统计 ===")
print(df[numeric_cols].describe())

# 分类型变量分布
print("\n=== 分类型变量分布 ===")
for col in ['type', 'rating', 'primary_genre', 'primary_country']:
    print(f"\n{col} 分布:")
    print(df[col].value_counts().head(10))
```

## 5. 分组统计分析

```python
# 按类型分组
type_group = df.groupby('type').agg({
    'title': 'count',
    'duration_num': 'mean',
    'release_year': 'mean'
}).round(2)
print("=== 按类型分组统计 ===")
print(type_group)

# 按年份和类型交叉分组
heatmap_data = df.groupby(['year_added', 'type']).size().unstack(fill_value=0)
print("\n=== 年份×类型交叉表 ===")
print(heatmap_data.tail(10))

# 按国家分组
country_group = df.groupby('primary_country').size().sort_values(ascending=False).head(15)
print("\n=== 制片国家 Top15 ===")
print(country_group)

# 按流派分组
genre_group = df.groupby('primary_genre').size().sort_values(ascending=False).head(15)
print("\n=== 流派 Top15 ===")
print(genre_group)
```

## 6. 相关性分析

```python
# 计算相关系数矩阵
corr_matrix = df[numeric_cols].corr()
print("=== 相关系数矩阵 ===")
print(corr_matrix)

# 关键发现
print("\n关键相关性:")
print(f"release_year 与 year_added: {corr_matrix.loc['release_year', 'year_added']:.3f}")
print(f"duration_num 与 cast_count: {corr_matrix.loc['duration_num', 'cast_count']:.3f}")
```

## 7. 数据导出

```python
# 导出分析结果
analysis_results = {
    'type_distribution': df['type'].value_counts().to_dict(),
    'year_trend': df.groupby('year_added').size().to_dict(),
    'country_distribution': df['primary_country'].value_counts().head(15).to_dict(),
    'genre_distribution': df['primary_genre'].value_counts().head(15).to_dict(),
    'rating_distribution': df['rating'].value_counts().to_dict(),
    'movie_duration_stats': df[df['type'] == 'Movie']['duration_num'].describe().to_dict(),
    'tv_seasons_distribution': df[df['type'] == 'TV Show']['duration_num'].value_counts().head(10).to_dict(),
    'correlation_matrix': corr_matrix.to_dict(),
    'anomalies_count': len(outliers)
}

with open('data/complete_analysis.json', 'w', encoding='utf-8') as f:
    json.dump(analysis_results, f, ensure_ascii=False, indent=2)

print("分析结果已保存到 data/complete_analysis.json")
```

## 8. 核心发现总结

```python
total = len(df)
type_dist = df['type'].value_counts()

print("\n" + "="*50)
print("核心发现总结")
print("="*50)
print(f"1. 电影占比：{type_dist.get('Movie', 0)/total*100:.1f}% ({type_dist.get('Movie', 0)} 部)")
print(f"2. 电视节目占比：{type_dist.get('TV Show', 0)/total*100:.1f}% ({type_dist.get('TV Show', 0)} 部)")

year_trend = df.groupby('year_added').size()
peak_year = year_trend.idxmax()
print(f"3. 内容发布峰值年份：{peak_year} 年 ({year_trend.max()} 部)")

country_dist = df['primary_country'].value_counts()
print(f"4. 最大制片国：{country_dist.index[0]} ({country_dist.iloc[0]} 部)")

genre_dist = df['primary_genre'].value_counts()
print(f"5. 最热门流派：{genre_dist.index[0]} ({genre_dist.iloc[0]} 部)")

rating_dist = df['rating'].value_counts()
print(f"6. 最多评级：{rating_dist.index[0]} ({rating_dist.iloc[0]} 部)")

movies = df[df['type'] == 'Movie']
print(f"7. 电影平均时长：{movies['duration_num'].mean():.1f} 分钟")

print(f"8. 异常值数量：{len(outliers)} 部")
```
