import pandas as pd
import numpy as np
import re

pd.set_option('display.max_columns', None)
pd.set_option('display.max_colwidth', 60)
pd.set_option('display.width', 200)

RAW_PATH = '/workspace/netflix_titles.csv'
OUT_PATH = '/workspace/netflix-app/public/netflix_titles_cleaned.csv'

print("=" * 80)
print("Netflix 数据清洗 v2 - 改进版")
print("=" * 80)

# ── 1. 加载数据 ──
print("\n📥 1. 加载原始数据")
df = pd.read_csv(RAW_PATH)
print(f"原始数据: {len(df):,} 行 × {len(df.columns)} 列")

# ── 2. 修复 rating 字段污染 ──
print("\n🔧 2. 修复 rating 字段污染（时长误入 rating）")
# 识别 rating 中含 "min" 或数字的污染记录
polluted_mask = df['rating'].notna() & df['rating'].str.contains(r'\d+\s*min', case=False, na=False)
polluted_count = polluted_mask.sum()
print(f"发现 {polluted_count} 条 rating 污染记录")

if polluted_count > 0:
    # 将 rating 的值移回 duration
    df.loc[polluted_mask, 'duration'] = df.loc[polluted_mask, 'rating']
    # rating 设为 NaN，后面统一处理
    df.loc[polluted_mask, 'rating'] = np.nan
    print(f"✅ 已修复 {polluted_count} 条记录，rating 置为待填充")

# ── 3. 提取时长数值 ──
print("\n⏱️  3. 提取时长数值 (duration_num)")
def extract_duration(row):
    val = str(row['duration']) if pd.notna(row['duration']) else ''
    nums = re.findall(r'\d+', val)
    if nums:
        return int(nums[0])
    return np.nan

df['duration_num'] = df.apply(extract_duration, axis=1)
print(f"duration_num 提取完成，缺失: {df['duration_num'].isna().sum()} 条")

# ── 4. 解析 date_added ──
print("\n📆 4. 解析上架日期 (date_added)")
# 注意：不删除 date_added 为空的记录！
df['date_added_parsed'] = pd.to_datetime(df['date_added'].str.strip(), format='mixed', errors='coerce')
df['year_added'] = df['date_added_parsed'].dt.year
df['month_added'] = df['date_added_parsed'].dt.month

# date_added 为空的，用 release_year 近似填充 year_added（标记为估算）
no_date_mask = df['date_added_parsed'].isna()
print(f"date_added 为空: {no_date_mask.sum()} 条")
print(f"  → 用 release_year 近似填充 year_added，month_added 填充为 NaN")
df.loc[no_date_mask, 'year_added'] = df.loc[no_date_mask, 'release_year']
# month_added 保持 NaN

# date_added_parsed 转为字符串（方便 CSV 存储）
df['date_added_parsed'] = df['date_added_parsed'].dt.strftime('%Y-%m-%d')
df.loc[df['date_added_parsed'].isna(), 'date_added_parsed'] = '未知'

print(f"year_added 缺失: {df['year_added'].isna().sum()} 条")
print(f"month_added 缺失: {df['month_added'].isna().sum()} 条")

# ── 5. 处理缺失值 ──
print("\n🔍 5. 缺失值处理")

# 5.1 director: 剧集用 "Not Applicable"，电影用 "Unknown"
# 注意：不用 "N/A" 因为 pandas 读取时会识别为 NaN
print("\n5.1 director 字段:")
tv_mask = df['type'] == 'TV Show'
movie_mask = df['type'] == 'Movie'

df['director'] = df['director'].fillna('')
# 剧集缺失导演 → "Not Applicable"（剧集本来就常缺导演，不适用单一导演）
df.loc[tv_mask & (df['director'].str.strip() == ''), 'director'] = 'Not Applicable'
# 电影缺失导演 → "Unknown"
df.loc[movie_mask & (df['director'].str.strip() == ''), 'director'] = 'Unknown'

print(f"  剧集 director=Not Applicable: {(df.loc[tv_mask, 'director'] == 'Not Applicable').sum():,} 条")
print(f"  电影 director=Unknown: {(df.loc[movie_mask, 'director'] == 'Unknown').sum():,} 条")

# 5.2 cast: 用 "Unknown" 填充
print("\n5.2 cast 字段:")
df['cast'] = df['cast'].fillna('Unknown')
cast_unknown = (df['cast'] == 'Unknown').sum()
print(f"  cast=Unknown: {cast_unknown:,} 条 ({cast_unknown/len(df)*100:.2f}%)")

# 5.3 country: 用 "Unknown" 填充
print("\n5.3 country 字段:")
df['country'] = df['country'].fillna('Unknown')
country_unknown = (df['country'] == 'Unknown').sum()
print(f"  country=Unknown: {country_unknown:,} 条 ({country_unknown/len(df)*100:.2f}%)")

# 5.4 rating: 用 "Unknown" 填充（之前用众数 TV-MA，现在改为 Unknown）
print("\n5.4 rating 字段:")
rating_na_before = df['rating'].isna().sum()
df['rating'] = df['rating'].fillna('Unknown')
rating_unknown = (df['rating'] == 'Unknown').sum()
print(f"  rating=Unknown: {rating_unknown} 条 (之前缺失 {rating_na_before} 条)")
print(f"  ✅ 用 'Unknown' 替代众数填充，避免引入偏差")

# ── 6. 提取主国家 primary_country ──
print("\n🌍 6. 提取主国家 (primary_country)")
def get_primary_country(country_str):
    if pd.isna(country_str) or str(country_str).strip() == '' or country_str == 'Unknown':
        return 'Unknown'
    return str(country_str).split(',')[0].strip()

df['primary_country'] = df['country'].apply(get_primary_country)
print(f"primary_country 提取完成")
print(f"Top 5 主国家:")
print(df['primary_country'].value_counts().head(5))

# ── 7. 保存结果 ──
print("\n💾 7. 保存清洗后数据")
# 保持列顺序
output_cols = [
    'show_id', 'type', 'title', 'director', 'cast', 'country',
    'date_added', 'release_year', 'rating', 'duration', 'listed_in', 'description',
    'duration_num', 'date_added_parsed', 'year_added', 'month_added', 'primary_country'
]
df[output_cols].to_csv(OUT_PATH, index=False, encoding='utf-8')

print(f"已保存到: {OUT_PATH}")
print(f"清洗后数据: {len(df):,} 行 × {len(output_cols)} 列")

# ── 8. 验证 ──
print("\n✅ 8. 数据质量验证")
print("-" * 60)

# 检查行数
print(f"行数: {len(df):,} (原始 {len(df):,}，无删除 ✅)")

# 检查 rating 污染
valid_ratings = {'G','PG','PG-13','R','NC-17','NR','UR',
                'TV-Y','TV-Y7','TV-Y7-FV','TV-G','TV-PG','TV-14','TV-MA', 'Unknown'}
bad_rating = df[~df['rating'].isin(valid_ratings)]
print(f"非法 rating: {len(bad_rating)} 条 {'✅' if len(bad_rating)==0 else '❌'}")

# 检查 duration_num
print(f"duration_num 缺失: {df['duration_num'].isna().sum()} 条")

# 检查 director
print(f"director=Not Applicable (剧集): {((df['type']=='TV Show') & (df['director']=='Not Applicable')).sum():,} 条")
print(f"director=Unknown (电影): {((df['type']=='Movie') & (df['director']=='Unknown')).sum():,} 条")

# 检查 year_added 为空的记录（应该为 0）
print(f"year_added 缺失: {df['year_added'].isna().sum()} 条 {'✅' if df['year_added'].isna().sum()==0 else '⚠️'}")

# 检查 Friends 是否还在
friends = df[df['title'] == 'Friends']
print(f"\nFriends 剧集: {'✅ 存在，共 ' + str(len(friends)) + ' 条' if len(friends) > 0 else '❌ 丢失！'}")
if len(friends) > 0:
    print(f"  show_id: {friends.iloc[0]['show_id']}")
    print(f"  year_added: {friends.iloc[0]['year_added']}")
    print(f"  director: {friends.iloc[0]['director']}")

print("\n" + "=" * 80)
print("清洗完成！")
print("=" * 80)
