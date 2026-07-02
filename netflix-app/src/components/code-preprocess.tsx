'use client';

import { useEffect } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

const code1 = `import pandas as pd
import numpy as np
import re

pd.set_option('display.max_columns', None)
pd.set_option('display.max_colwidth', 60)
pd.set_option('display.width', 200)

# 加载原始数据
RAW_PATH = 'netflix_titles.csv'
df = pd.read_csv(RAW_PATH)
print(f"原始数据: {len(df):,} 行 × {len(df.columns)} 列")
# 原始数据: 8,807 行 × 12 列`;

const code2 = `# 缺失值详情
missing = df.isnull().sum()
missing_pct = (missing / len(df) * 100).round(2)

missing_df = pd.DataFrame({
    '缺失数量': missing[missing > 0],
    '缺失率(%)': missing_pct[missing > 0]
}).sort_values('缺失数量', ascending=False)
print(missing_df)

# director    2634    29.91%
# country    831      9.44%
# cast     825      9.37%
# date_added  10      0.11%
# rating      4       0.05%
# duration    3       0.03%`;

const code3 = `# rating 字段污染检测（时长误入 rating 列）
# 识别 rating 中含 "min" 或数字的污染记录
polluted_mask = df['rating'].notna() & df['rating'].str.contains(r'\\d+\\s*min', case=False, na=False)
polluted_count = polluted_mask.sum()
print(f"发现 {polluted_count} 条 rating 污染记录")
# 发现 3 条 rating 污染记录（Louis C.K. 相关）

# release_year 范围检测
print(f"release_year 范围：{df['release_year'].min()} ~ {df['release_year'].max()}")
# release_year 范围：1925 ~ 2021`;

const code4 = `# ── 1. 修复 rating 字段污染 ──
polluted_mask = df['rating'].notna() & df['rating'].str.contains(r'\\d+\\s*min', case=False, na=False)
df.loc[polluted_mask, 'duration'] = df.loc[polluted_mask, 'rating']
df.loc[polluted_mask, 'rating'] = np.nan

# ── 2. 提取时长数值 (duration_num) ──
def extract_duration(row):
    val = str(row['duration']) if pd.notna(row['duration']) else ''
    nums = re.findall(r'\\d+', val)
    if nums:
        return int(nums[0])
    return np.nan

df['duration_num'] = df.apply(extract_duration, axis=1)

# ── 3. 解析上架日期 (date_added) ──
# 注意：不删除 date_added 为空的记录！
df['date_added_parsed'] = pd.to_datetime(
    df['date_added'].str.strip(), format='mixed', errors='coerce')
df['year_added']  = df['date_added_parsed'].dt.year
df['month_added'] = df['date_added_parsed'].dt.month

# date_added 为空的，用 release_year 近似填充 year_added
no_date_mask = df['date_added_parsed'].isna()
df.loc[no_date_mask, 'year_added'] = df.loc[no_date_mask, 'release_year']

# date_added_parsed 转为字符串（方便 CSV 存储）
df['date_added_parsed'] = df['date_added_parsed'].dt.strftime('%Y-%m-%d')
df.loc[df['date_added_parsed'].isna(), 'date_added_parsed'] = '未知'

# ── 4. 缺失值处理 ──
# 4.1 director: 剧集用 "Not Applicable"，电影用 "Unknown"
# 注意：不用 "N/A" 因为 pandas 读取时会识别为 NaN
tv_mask = df['type'] == 'TV Show'
movie_mask = df['type'] == 'Movie'

df['director'] = df['director'].fillna('')
df.loc[tv_mask & (df['director'].str.strip() == ''), 'director'] = 'Not Applicable'
df.loc[movie_mask & (df['director'].str.strip() == ''), 'director'] = 'Unknown'

# 4.2 cast / country / rating: 用 "Unknown" 填充
df['cast'] = df['cast'].fillna('Unknown')
df['country'] = df['country'].fillna('Unknown')
df['rating'] = df['rating'].fillna('Unknown')  # 用 Unknown 而非众数，避免偏差

# ── 5. 提取主国家 primary_country ──
def get_primary_country(country_str):
    if pd.isna(country_str) or str(country_str).strip() == '' or country_str == 'Unknown':
        return 'Unknown'
    return str(country_str).split(',')[0].strip()

df['primary_country'] = df['country'].apply(get_primary_country)

# ── 保存结果 ──
output_cols = [
    'show_id', 'type', 'title', 'director', 'cast', 'country',
    'date_added', 'release_year', 'rating', 'duration', 'listed_in', 'description',
    'duration_num', 'date_added_parsed', 'year_added', 'month_added', 'primary_country'
]
df.to_csv('netflix_titles_cleaned.csv', index=False, encoding='utf-8')
print(f"清洗后数据: {len(df):,} 行 × {len(output_cols)} 列")
# 清洗后数据: 8,807 行 × 17 列（保留全部记录，无删除）`;

const tableData = [
  { field: 'show_id', type: 'object', nonNull: '8,807', missing: '0.00', desc: '唯一标识符' },
  { field: 'type', type: 'object', nonNull: '8,807', missing: '0.00', desc: '电影 / 电视节目' },
  { field: 'title', type: 'object', nonNull: '8,807', missing: '0.00', desc: '标题名称' },
  { field: 'director', type: 'object', nonNull: '8,807', missing: '0.00', desc: '导演（剧集Not Applicable，电影Unknown）' },
  { field: 'cast', type: 'object', nonNull: '8,807', missing: '0.00', desc: '演员（已填充 Unknown）' },
  { field: 'country', type: 'object', nonNull: '8,807', missing: '0.00', desc: '制作国家（已填充 Unknown）' },
  { field: 'date_added', type: 'object', nonNull: '8,797', missing: '0.11', desc: '上架日期（原始字符串，10条为空）' },
  { field: 'release_year', type: 'int64', nonNull: '8,807', missing: '0.00', desc: '发行年份 1925~2021' },
  { field: 'rating', type: 'object', nonNull: '8,807', missing: '0.00', desc: '年龄评级（Unknown 填充，非众数）' },
  { field: 'duration', type: 'object', nonNull: '8,804', missing: '0.03', desc: '时长（原始字符串）' },
  { field: 'listed_in', type: 'object', nonNull: '8,807', missing: '0.00', desc: '流派分类' },
  { field: 'description', type: 'object', nonNull: '8,807', missing: '0.00', desc: '内容描述' },
  { field: 'duration_num', type: 'float64', nonNull: '8,804', missing: '0.03', desc: '时长数值（分钟/季，衍生）' },
  { field: 'date_added_parsed', type: 'object', nonNull: '8,797', missing: '0.11', desc: '解析后日期（衍生，空值为"未知"）' },
  { field: 'year_added', type: 'float64', nonNull: '8,807', missing: '0.00', desc: '上架年份（衍生，空值用发行年填充）' },
  { field: 'month_added', type: 'float64', nonNull: '8,797', missing: '0.11', desc: '上架月份（衍生，10条为空）' },
  { field: 'primary_country', type: 'object', nonNull: '8,807', missing: '0.00', desc: '主要制作国（衍生）' },
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
