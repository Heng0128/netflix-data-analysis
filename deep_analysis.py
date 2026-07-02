import pandas as pd
import numpy as np

pd.set_option('display.max_columns', None)
pd.set_option('display.max_colwidth', 80)
pd.set_option('display.width', 200)

RAW_PATH = '/workspace/netflix_titles.csv'
CLEAN_PATH = '/workspace/netflix-app/public/netflix_titles_cleaned.csv'

df_raw = pd.read_csv(RAW_PATH)
df_clean = pd.read_csv(CLEAN_PATH)

print("=" * 90)
print("🔍 深度分析：删除记录 + 空值 + 未知值填充")
print("=" * 90)

# ═══════════════════════════════════════════════════════════
# 1. 找出被删除的记录
# ═══════════════════════════════════════════════════════════
print("\n" + "=" * 90)
print("📉 第一部分：被删除的 10 条记录分析")
print("=" * 90)

raw_ids = set(df_raw['show_id'].tolist())
clean_ids = set(df_clean['show_id'].tolist())
deleted_ids = raw_ids - clean_ids

print(f"\n原始数据 show_id 数量: {len(raw_ids)}")
print(f"清洗后 show_id 数量: {len(clean_ids)}")
print(f"被删除的 show_id: {sorted(deleted_ids)}")

deleted_rows = df_raw[df_raw['show_id'].isin(deleted_ids)].sort_values('show_id')
print(f"\n被删除的 {len(deleted_rows)} 条记录详情:")
print("-" * 90)

for idx, row in deleted_rows.iterrows():
    print(f"\n【{row['show_id']}】 {row['title']}")
    print(f"  类型: {row['type']}")
    print(f"  导演: {row['director']}")
    print(f"  国家: {row['country']}")
    print(f"  上架日期: {row['date_added']}")
    print(f"  发行年份: {row['release_year']}")
    print(f"  评级: {row['rating']}")
    print(f"  时长: {row['duration']}")
    
    # 检查各字段是否为空
    null_cols = row[row.isna()].index.tolist()
    if null_cols:
        print(f"  ⚠️  空字段: {null_cols}")
    
    # 检查是否有异常值
    if pd.notna(row['rating']):
        valid_ratings = {'G','PG','PG-13','R','NC-17','NR','UR',
                        'TV-Y','TV-Y7','TV-Y7-FV','TV-G','TV-PG','TV-14','TV-MA'}
        if row['rating'] not in valid_ratings:
            print(f"  ⚠️  非法 rating: {row['rating']}")

print(f"\n--- 被删除记录的类型分布 ---")
print(deleted_rows['type'].value_counts())

print(f"\n--- 被删除记录的空字段统计 ---")
null_counts = deleted_rows.isnull().sum()
print(null_counts[null_counts > 0])

# ═══════════════════════════════════════════════════════════
# 2. 原始数据空值详细分析
# ═══════════════════════════════════════════════════════════
print("\n" + "=" * 90)
print("📊 第二部分：原始数据空值详细分析")
print("=" * 90)

print(f"\n原始数据总行数: {len(df_raw):,}")
print(f"原始数据总列数: {len(df_raw.columns)}")

missing = df_raw.isnull().sum()
missing_pct = (missing / len(df_raw) * 100).round(2)
missing_df = pd.DataFrame({
    '缺失数量': missing,
    '缺失率(%)': missing_pct
}).sort_values('缺失数量', ascending=False)

print(f"\n各字段缺失情况:")
print(missing_df[missing_df['缺失数量'] > 0])

# 按类型分别统计缺失
print(f"\n--- 按内容类型分别统计缺失 ---")
for content_type in ['Movie', 'TV Show']:
    subset = df_raw[df_raw['type'] == content_type]
    print(f"\n{content_type} ({len(subset):,} 条):")
    miss = subset.isnull().sum()
    miss_pct = (miss / len(subset) * 100).round(2)
    mdf = pd.DataFrame({'缺失数': miss, '缺失率%': miss_pct})
    print(mdf[mdf['缺失数'] > 0])

# director 缺失分析
print(f"\n--- director 缺失详细分析 ---")
no_director = df_raw[df_raw['director'].isna()]
print(f"director 缺失总数: {len(no_director):,} ({len(no_director)/len(df_raw)*100:.2f}%)")
print(f"  其中电影: {len(no_director[no_director['type']=='Movie']):,} 条")
print(f"  其中剧集: {len(no_director[no_director['type']=='TV Show']):,} 条")

# country 缺失分析
print(f"\n--- country 缺失详细分析 ---")
no_country = df_raw[df_raw['country'].isna()]
print(f"country 缺失总数: {len(no_country):,} ({len(no_country)/len(df_raw)*100:.2f}%)")
print(f"  其中电影: {len(no_country[no_country['type']=='Movie']):,} 条")
print(f"  其中剧集: {len(no_country[no_country['type']=='TV Show']):,} 条")

# cast 缺失分析
print(f"\n--- cast 缺失详细分析 ---")
no_cast = df_raw[df_raw['cast'].isna()]
print(f"cast 缺失总数: {len(no_cast):,} ({len(no_cast)/len(df_raw)*100:.2f}%)")
print(f"  其中电影: {len(no_cast[no_cast['type']=='Movie']):,} 条")
print(f"  其中剧集: {len(no_cast[no_cast['type']=='TV Show']):,} 条")

# date_added 缺失
print(f"\n--- date_added 缺失 ---")
no_date = df_raw[df_raw['date_added'].isna()]
print(f"date_added 缺失总数: {len(no_date)} 条")
if len(no_date) > 0:
    print(no_date[['show_id', 'title', 'type', 'release_year']])

# rating 缺失
print(f"\n--- rating 缺失/异常 ---")
no_rating = df_raw[df_raw['rating'].isna()]
print(f"rating 缺失: {len(no_rating)} 条")

valid_ratings = {'G','PG','PG-13','R','NC-17','NR','UR',
                'TV-Y','TV-Y7','TV-Y7-FV','TV-G','TV-PG','TV-14','TV-MA'}
bad_rating = df_raw[df_raw['rating'].notna() & ~df_raw['rating'].isin(valid_ratings)]
print(f"rating 异常（时长污染等）: {len(bad_rating)} 条")
if len(bad_rating) > 0:
    print(bad_rating[['show_id', 'title', 'rating', 'duration']])

# ═══════════════════════════════════════════════════════════
# 3. "未知"填充合理性分析
# ═══════════════════════════════════════════════════════════
print("\n" + "=" * 90)
print("🤔 第三部分：\"未知\"填充合理性分析")
print("=" * 90)

# 统计清洗后的"未知"数量
print(f"\n清洗后\"未知\"值分布:")
for col in ['director', 'cast', 'country']:
    unknown_count = (df_clean[col] == '未知').sum()
    print(f"  {col}: {unknown_count:,} 条 ({unknown_count/len(df_clean)*100:.2f}%)")

# ---- director 填充分析 ----
print(f"\n--- director 用\"未知\"是否合适？ ---")
print(f"📌 原始缺失率: 29.91% (2,634 条)")
print(f"📌 主要是电视节目缺失导演:")
print(f"   - 电影导演缺失率: {len(df_raw[(df_raw['type']=='Movie') & df_raw['director'].isna()])/len(df_raw[df_raw['type']=='Movie'])*100:.2f}%")
print(f"   - 剧集导演缺失率: {len(df_raw[(df_raw['type']=='TV Show') & df_raw['director'].isna()])/len(df_raw[df_raw['type']=='TV Show'])*100:.2f}%")

print(f"""
✅ 结论：剧集导演缺失率高是合理的（很多剧集导演不固定或有多季不同导演）
✅ 用\"未知\"填充是可以接受的，但更准确可以用\"N/A\"或空值
   分析时注意过滤掉\"未知\"，或单独统计
""")

# ---- country 填充分析 ----
print(f"--- country 用\"未知\"是否合适？ ---")
print(f"📌 原始缺失率: 9.44% (831 条)")

# 看看这些缺失国家的内容有什么规律
no_country_raw = df_raw[df_raw['country'].isna()]
print(f"\n缺失国家的内容类型分布:")
print(no_country_raw['type'].value_counts())

print(f"\n缺失国家的评级分布 (Top 10):")
print(no_country_raw['rating'].value_counts().head(10))

# 检查是否有 Netflix 原创标识的可能
print(f"\n缺失国家的标题样例:")
for _, row in no_country_raw.head(10).iterrows():
    print(f"  [{row['show_id']}] {row['title']} ({row['type']}) - {row['listed_in'][:50]}")

print(f"""
✅ 结论：国家缺失可能是 Netflix 全球发行的原创内容，或数据采集时遗漏
✅ 用\"未知\"是合理的，但也可以考虑：
   - 尝试从 description 中推断
   - 标记为\"International\"（国际发行）
   - 分析时单独作为一类，不参与国家排名
""")

# ---- cast 填充分析 ----
print(f"--- cast 用\"未知\"是否合适？ ---")
print(f"📌 原始缺失率: 9.22% (814 条)")
no_cast_raw = df_raw[df_raw['cast'].isna()]
print(f"\n缺失演员的内容类型分布:")
print(no_cast_raw['type'].value_counts())

print(f"\n缺失演员的内容样例:")
for _, row in no_cast_raw.head(8).iterrows():
    print(f"  [{row['show_id']}] {row['title']} ({row['type']})")

print(f"""
✅ 结论：演员缺失可能是纪录片、真人秀等非传统影视作品
✅ 用\"未知\"合理，分析演员网络时过滤即可
""")

# ---- 对比：用众数/空值/未知的优劣 ----
print("--- 不同填充策略对比 ---")
print("""
策略              优点                     缺点
─────────────────────────────────────────────────────────
"未知"字符串       直观易懂，保留缺失信息    字符串匹配需额外处理
NaN/空值          标准缺失值表示            可能导致计算错误
"Not Available"   更正式                   较长
众数填充           不影响统计比例            引入偏差，掩盖缺失信息
删除行            数据干净                  损失样本量，引入偏差
""")

print("📝 综合建议:")
print("""
1. 当前\"未知\"填充策略是合理的，属于"标记缺失值"方法
2. 如果做统计建模，建议将"未知"单独作为一类，不要和真实值混在一起
3. 做国家/导演排名时，应该排除"未知"或单独列示
4. 字段名上可以更明确，比如用 director_unknown 标志位
""")

# ═══════════════════════════════════════════════════════════
# 4. 空值处理方式评估
# ═══════════════════════════════════════════════════════════
print("\n" + "=" * 90)
print("📈 第四部分：空值处理方式评估")
print("=" * 90)

print(f"""
原始数据各字段空值处理方式总结:

字段            原始缺失率    处理方式          评价
─────────────────────────────────────────────────────────────────
director        29.91%     填充"未知"        ✅ 合理，剧集确实常缺导演
cast             9.22%     填充"未知"        ✅ 合理
country          9.44%     填充"未知"        ✅ 合理
date_added       0.11%     解析后保留空值    ⚠️  需确认是否填充
rating           0.04%     众数填充          ⚠️  众数填充可能引入偏差
duration         0.04%     提取数值          ✅ 正确
show_id          0%        -                 ✅ 完整
type             0%        -                 ✅ 完整
title            0%        -                 ✅ 完整
release_year     0%        -                 ✅ 完整
listed_in        0%        -                 ✅ 完整
description      0%        -                 ✅ 完整
""")

print("=" * 90)
print("分析完成")
print("=" * 90)
