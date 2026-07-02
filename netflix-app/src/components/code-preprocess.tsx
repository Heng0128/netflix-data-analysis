'use client';

import { useEffect } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

const code1 = `import pandas as pd
import numpy as np
import warnings
warnings.filterwarnings('ignore')

pd.set_option('display.max_columns', None)
pd.set_option('display.max_colwidth', 60)

# 加载原始数据
df = pd.read_csv(
    'netflix_titles.csv', encoding='utf-8'
)
print(f"数据集原始记录数：8,809 条（数据说明文档）")
print(f"pandas 加载行数：{len(df):,} 行（2条含换行符的记录已正确合并）")
df`;

const code2 = `# 缺失值详情
missing = df.isnull().sum()
missing_pct = (missing / len(df) * 100).round(2)

missing_df = pd.DataFrame({
    '缺失数量': missing[missing > 0],
    '缺失率(%)': missing_pct[missing > 0]
}).sort_values('缺失率(%)', ascending=False)
missing_df`;

const code3 = `# rating 字段污染检测（时长误入 rating 列）
valid_ratings = {'G','PG','PG-13','R','NC-17','NR','UR',
                 'TV-Y','TV-Y7','TV-Y7-FV','TV-G','TV-PG','TV-14','TV-MA'}
bad_rating_mask = df['rating'].notna() & ~df['rating'].isin(valid_ratings)
print(df[bad_rating_mask][['show_id','title','rating','duration']].to_string())

# release_year 范围检测
print(f"release_year 范围：{df['release_year'].min()} ~ {df['release_year'].max()}")`;

const code4 = `df_clean = df.copy()

# ── 修复 rating 字段污染 ──
bad_mask = df_clean['rating'].notna() & ~df_clean['rating'].isin(valid_ratings)
df_clean.loc[bad_mask & df_clean['duration'].isna(), 'duration'] = df_clean.loc[bad_mask, 'rating']
df_clean.loc[bad_mask, 'rating'] = np.nan

# ── 日期解析 ──
df_clean['date_added'] = pd.to_datetime(
    df_clean['date_added'].str.strip(), format='%B %d, %Y', errors='coerce')
df_clean['year_added']  = df_clean['date_added'].dt.year
df_clean['month_added'] = df_clean['date_added'].dt.month

# 重要：不删除 date_added 为空的行！
# 用 release_year 近似填充 year_added，保留全部数据
df_clean['year_added'] = df_clean['year_added'].fillna(df_clean['release_year'])

# ── duration 拆分 ──
def parse_duration(row):
    val = str(row['duration']) if pd.notna(row['duration']) else ''
    if 'min' in val:
        return int(val.replace('min','').strip())
    elif 'Season' in val:
        return int(val.split()[0])
    return np.nan
df_clean['duration_value'] = df_clean.apply(parse_duration, axis=1)

# ── 缺失值填充 ──
# 剧集导演用 "Not Applicable"（剧集本来就常缺导演，不适用单一导演）
# 注意：不用 "N/A" 因为 pandas 读取时会识别为 NaN
tv_mask = df_clean['type'] == 'TV Show'
movie_mask = df_clean['type'] == 'Movie'
df_clean.loc[tv_mask, 'director'] = df_clean.loc[tv_mask, 'director'].fillna('Not Applicable')
df_clean.loc[movie_mask, 'director'] = df_clean.loc[movie_mask, 'director'].fillna('Unknown')

df_clean['cast'] = df_clean['cast'].fillna('Unknown')
df_clean['country'] = df_clean['country'].fillna('Unknown')
# rating 用 "Unknown" 而非众数，避免引入偏差
df_clean['rating'] = df_clean['rating'].fillna('Unknown')

# ── 特征工程 ──
df_clean['content_age'] = 2021 - df_clean['release_year']
df_clean['primary_country'] = df_clean['country'].apply(
    lambda x: x.split(',')[0].strip() if x != 'Unknown' else 'Unknown')
df_clean['primary_genre'] = df_clean['listed_in'].apply(
    lambda x: x.split(',')[0].strip())
df_clean['is_movie'] = (df_clean['type'] == 'Movie').astype(int)
df_clean['years_to_netflix'] = df_clean['year_added'] - df_clean['release_year']
df_clean.loc[df_clean['years_to_netflix'] < 0, 'years_to_netflix'] = np.nan

print(f"清洗后数据集：{df_clean.shape}")
print(f"  → 保留全部 {len(df_clean):,} 条记录，无删除")
df_clean`;

const tableData = [
  { field: 'show_id', type: 'object', nonNull: '8,807', missing: '0.00', desc: '唯一标识符' },
  { field: 'type', type: 'object', nonNull: '8,807', missing: '0.00', desc: '电影 / 电视节目' },
  { field: 'title', type: 'object', nonNull: '8,807', missing: '0.00', desc: '标题名称' },
  { field: 'director', type: 'object', nonNull: '8,807', missing: '0.00', desc: '导演（剧集Not Applicable，电影Unknown）' },
  { field: 'cast', type: 'object', nonNull: '8,807', missing: '0.00', desc: '演员（已填充 Unknown）' },
  { field: 'country', type: 'object', nonNull: '8,807', missing: '0.00', desc: '制作国家（已填充 Unknown）' },
  { field: 'date_added', type: 'datetime64', nonNull: '8,797', missing: '0.11', desc: '上架日期（已解析，空值保留）' },
  { field: 'release_year', type: 'int64', nonNull: '8,807', missing: '0.00', desc: '发行年份 1925~2021' },
  { field: 'rating', type: 'object', nonNull: '8,807', missing: '0.00', desc: '年龄评级（Unknown 填充，非众数）' },
  { field: 'duration_value', type: 'int64', nonNull: '8,807', missing: '0.00', desc: '时长数值（分钟/季）' },
  { field: 'year_added', type: 'float64', nonNull: '8,807', missing: '0.00', desc: '上架年份（空值用发行年填充）' },
  { field: 'month_added', type: 'float64', nonNull: '8,797', missing: '0.11', desc: '上架月份（衍生，10条为空）' },
  { field: 'primary_country', type: 'object', nonNull: '8,807', missing: '0.00', desc: '主要制作国（衍生）' },
  { field: 'primary_genre', type: 'object', nonNull: '8,807', missing: '0.00', desc: '主要类型（衍生）' },
  { field: 'content_age', type: 'int64', nonNull: '8,807', missing: '0.00', desc: '内容年龄（衍生）' },
  { field: 'is_movie', type: 'int32', nonNull: '8,807', missing: '0.00', desc: '是否电影（衍生）' },
  { field: 'years_to_netflix', type: 'float64', nonNull: '8,733', missing: '0.84', desc: '上架延迟年数（衍生）' },
];

export default function CodePreprocess() {
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  return (
    <section id="preprocess" style={{ padding: '64px 24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="section-title">数据加载与预处理</div>
      <div className="section-desc">对原始 Netflix 数据集进行清洗、异常修复、类型转换与特征工程，输出 22 列结构化数据</div>

      <div className="code-container">
        <div className="code-header">
          <span className="code-dot red"></span>
          <span className="code-dot yellow"></span>
          <span className="code-dot green"></span>
          <span className="code-title">[1] 导入库 &amp; 数据加载</span>
        </div>
        <pre>
          <code className="language-python">{code1}</code>
        </pre>
      </div>

      <div className="code-container">
        <div className="code-header">
          <span className="code-dot red"></span>
          <span className="code-dot yellow"></span>
          <span className="code-dot green"></span>
          <span className="code-title">[2] 缺失值分析</span>
        </div>
        <pre>
          <code className="language-python">{code2}</code>
        </pre>
      </div>

      <div className="code-container">
        <div className="code-header">
          <span className="code-dot red"></span>
          <span className="code-dot yellow"></span>
          <span className="code-dot green"></span>
          <span className="code-title">[3] 数据异常检测</span>
        </div>
        <pre>
          <code className="language-python">{code3}</code>
        </pre>
      </div>

      <div className="code-container">
        <div className="code-header">
          <span className="code-dot red"></span>
          <span className="code-dot yellow"></span>
          <span className="code-dot green"></span>
          <span className="code-title">[4] 数据清洗与修复</span>
        </div>
        <pre>
          <code className="language-python">{code4}</code>
        </pre>
      </div>

      <div className="data-table" style={{ marginTop: '24px' }}>
        <table>
          <thead>
            <tr>
              <th>字段名</th>
              <th>数据类型</th>
              <th>非空数量</th>
              <th>缺失率(%)</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, idx) => (
              <tr key={idx}>
                <td>{row.field}</td>
                <td>{row.type}</td>
                <td>{row.nonNull}</td>
                <td>{row.missing}</td>
                <td>{row.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
