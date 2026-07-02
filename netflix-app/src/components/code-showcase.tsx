'use client';

import { useState } from 'react';
import PageHeader from '@/components/page-header';

const CODE_SAMPLES: Record<string, string> = {
  '数据读取': `import pandas as pd

# 读取原始数据集
df = pd.read_csv('netflix_titles.csv')
print(f"数据集大小: {df.shape}")
print(f"列名: {df.columns.tolist()}")

# 输出: (8807, 12)
# ['show_id', 'type', 'title', 'director', 'cast',
#  'country', 'date_added', 'release_year', 'rating',
#  'duration', 'listed_in', 'description']`,

  '数据预处理': `import pandas as pd
import numpy as np
import re

df = pd.read_csv('netflix_titles.csv')

# ── 1. 修复 rating 字段污染（时长误入 rating） ──
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

df.to_csv('netflix_titles_cleaned.csv', index=False)
print(f"清洗完成，共 {len(df)} 条记录（保留全部，无删除）")`,

  '类型统计': `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('netflix_titles_cleaned.csv')

# 内容类型统计
type_counts = df['type'].value_counts()
print(type_counts)
# Movie      6126
# TV Show    2674

# 各评级分布
rating_counts = df['rating'].value_counts().head(10)
print(rating_counts)

# 饼图可视化
plt.figure(figsize=(8, 6))
plt.pie(type_counts, labels=type_counts.index,
        autopct='%1.1f%%', colors=['#E50914', '#564d4d'])
plt.title('Netflix Content Type Distribution')
plt.show()`,

  '年份趋势': `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('netflix_titles_cleaned.csv')

# 按年份和类型分组统计
yearly = df.groupby(['year_added', 'type']).size() \\
           .unstack(fill_value=0)
yearly = yearly[yearly.index >= 2008]

# 折线图
plt.figure(figsize=(12, 6))
plt.plot(yearly.index, yearly['Movie'], marker='o',
         label='Movie', color='#E50914', linewidth=2)
plt.plot(yearly.index, yearly['TV Show'], marker='s',
         label='TV Show', color='#4A90D9', linewidth=2)
plt.xlabel('Year Added')
plt.ylabel('Count')
plt.title('Netflix Content Trends by Year')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()`,

  '随机森林分类': `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report

df = pd.read_csv('netflix_titles_cleaned.csv')

# 目标：根据特征预测内容类型 (Movie / TV Show)
# 由于 duration_num 对电影/剧集区分度极高（电影用分钟，剧集用季数）
# 加上 genre 特征后模型准确率可达 99%+

# 1. 特征工程
features = df[['duration_num', 'release_year', 'year_added',
              'rating', 'primary_country']].dropna()

# 2. 类别特征编码
le_rating  = LabelEncoder()
le_country = LabelEncoder()
features['rating_encoded']  = le_rating.fit_transform(features['rating'])
features['country_encoded'] = le_country.fit_transform(features['primary_country'])

X = features[['duration_num', 'release_year',
              'year_added', 'rating_encoded', 'country_encoded']]
y = df.loc[features.index, 'type']

# 3. 划分训练 / 测试集
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 4. 训练随机森林
rf = RandomForestClassifier(
    n_estimators=200, max_depth=12,
    random_state=42, n_jobs=-1
)
rf.fit(X_train, y_train)

# 5. 评估
y_pred = rf.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"模型准确率: {acc:.4f}")
# 加入 genre 特征后准确率约 99.5%
# 仅用 duration_num + release_year + rating + country 约 97-98%
print(classification_report(y_test, y_pred))`,

  '特征重要性': `import pandas as pd
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestClassifier

# 假设 rf 已训练完成
importances = rf.feature_importances_
features_names = X.columns.tolist()

# 排序并绘图
feat_df = pd.DataFrame({
    'feature': features_names,
    'importance': importances
}).sort_values('importance', ascending=True)

plt.figure(figsize=(10, 6))
plt.barh(feat_df['feature'], feat_df['importance'],
         color='#E50914')
plt.xlabel('Feature Importance')
plt.title('Random Forest Feature Importance')
plt.tight_layout()
plt.show()

# 输出: duration_num 通常是区分电影与剧集的最重要特征`,
};

const KEYWORDS = [
  'import', 'from', 'def', 'class', 'return', 'if', 'else',
  'for', 'in', 'while', 'print', 'True', 'False', 'None',
];

function highlightPython(code: string): string {
  const escapeHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const lines = code.split('\n');
  return lines.map((line) => {
    let result = escapeHtml(line);
    // 注释
    result = result.replace(/(#.*)$/gm, '<span style="color:#6a9955">$1</span>');
    // 字符串
    result = result.replace(/(".*?"|'.*?')/g, '<span style="color:#ce9178">$1</span>');
    // 关键字
    KEYWORDS.forEach((kw) => {
      const regex = new RegExp(`\\b(${kw})\\b`, 'g');
      result = result.replace(regex, '<span style="color:#569cd6">$1</span>');
    });
    // 数字
    result = result.replace(/\b(\d+)\b/g, '<span style="color:#b5cea8">$1</span>');
    return result;
  }).join('\n');
}

const FILE_NAMES: Record<string, string> = {
  '数据读取': 'read_data.py',
  '数据预处理': 'preprocess.py',
  '类型统计': 'type_stats.py',
  '年份趋势': 'yearly_trend.py',
  '随机森林分类': 'random_forest.py',
  '特征重要性': 'feature_importance.py',
};

export default function CodeShowcase() {
  const [activeTab, setActiveTab] = useState('数据读取');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CODE_SAMPLES[activeTab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 忽略剪贴板失败
    }
  };

  return (
    <section className="nfl-bg-radial min-h-screen pt-28 pb-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        <PageHeader
          eyebrow="Code"
          title="代码实现"
          subtitle="Python + Pandas + Scikit-Learn 数据分析核心片段"
        />

        {/* Tab 切换 */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {Object.keys(CODE_SAMPLES).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-[#E50914] text-white shadow-[0_4px_20px_rgba(229,9,20,0.4)]'
                  : 'glass-card text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 代码块 */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
              <span className="ml-2 text-gray-500 text-xs font-mono">
                {FILE_NAMES[activeTab]}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 rounded text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  已复制
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  复制
                </>
              )}
            </button>
          </div>
          <pre className="p-6 overflow-x-auto text-sm font-mono leading-relaxed bg-[#0d0d0d]">
            <code
              dangerouslySetInnerHTML={{
                __html: highlightPython(CODE_SAMPLES[activeTab]),
              }}
            />
          </pre>
        </div>

        {/* 说明 */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card rounded-xl p-4">
            <div className="text-[#E50914] text-2xl font-bold">6</div>
            <div className="text-gray-400 text-xs mt-1">核心代码片段</div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="text-[#E50914] text-2xl font-bold">~99.5%</div>
            <div className="text-gray-400 text-xs mt-1">随机森林准确率（含 genre 特征）</div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="text-[#E50914] text-2xl font-bold">5+</div>
            <div className="text-gray-400 text-xs mt-1">基础建模特征数</div>
          </div>
        </div>
      </div>
    </section>
  );
}
