import pandas as pd
import numpy as np
import re

pd.set_option('display.max_columns', None)
pd.set_option('display.max_colwidth', 60)
pd.set_option('display.width', 200)

CSV_PATH = '/workspace/netflix-app/public/netflix_titles_cleaned.csv'

print("=" * 80)
print("Netflix Cleaned CSV 数据质量检查报告")
print("=" * 80)

# ── 1. 基本信息 ──
print("\n📊 1. 基本信息")
print("-" * 80)
df = pd.read_csv(CSV_PATH)
print(f"总行数: {len(df):,}")
print(f"总列数: {len(df.columns)}")
print(f"列名: {list(df.columns)}")

# ── 2. 缺失值检查 ──
print("\n🔍 2. 缺失值检查")
print("-" * 80)
missing = df.isnull().sum()
missing_pct = (missing / len(df) * 100).round(4)
missing_df = pd.DataFrame({
    '缺失数量': missing,
    '缺失率(%)': missing_pct
}).sort_values('缺失数量', ascending=False)
print(missing_df[missing_df['缺失数量'] > 0])

# 检查空字符串
print("\n空字符串检查:")
for col in df.select_dtypes(include='object').columns:
    empty_count = (df[col].str.strip() == '').sum()
    if empty_count > 0:
        print(f"  {col}: {empty_count} 个空字符串")

# 检查 "未知" 填充情况
print("\n'未知' 值填充情况:")
for col in ['director', 'cast', 'country']:
    if col in df.columns:
        unknown_count = (df[col] == '未知').sum()
        print(f"  {col}: {unknown_count:,} 条 ({unknown_count/len(df)*100:.2f}%)")

# ── 3. 重复值检查 ──
print("\n🔄 3. 重复值检查")
print("-" * 80)
dup_show_id = df.duplicated(subset=['show_id']).sum()
dup_full = df.duplicated().sum()
print(f"show_id 重复: {dup_show_id} 条")
print(f"完全重复行: {dup_full} 条")

if dup_show_id > 0:
    print("重复的 show_id:")
    print(df[df.duplicated(subset=['show_id'], keep=False)][['show_id', 'title']].head(10))

# ── 4. type 字段检查 ──
print("\n🎬 4. type 字段检查")
print("-" * 80)
type_counts = df['type'].value_counts()
print(f"类型分布:\n{type_counts}")
invalid_types = df[~df['type'].isin(['Movie', 'TV Show'])]
print(f"\n非法类型数量: {len(invalid_types)}")
if len(invalid_types) > 0:
    print(invalid_types[['show_id', 'title', 'type']].head())

# ── 5. rating 字段检查（重点：是否还有时长污染） ──
print("\n⭐ 5. rating 字段检查（时长污染检测）")
print("-" * 80)
valid_ratings = {'G', 'PG', 'PG-13', 'R', 'NC-17', 'NR', 'UR',
                 'TV-Y', 'TV-Y7', 'TV-Y7-FV', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA'}
bad_rating_mask = df['rating'].notna() & ~df['rating'].isin(valid_ratings)
bad_ratings = df[bad_rating_mask]
print(f"非法 rating 数量: {len(bad_ratings)}")
if len(bad_ratings) > 0:
    print("非法 rating 值分布:")
    print(bad_ratings['rating'].value_counts().head(20))
    print("\n样例:")
    print(bad_ratings[['show_id', 'title', 'rating', 'duration']].head(10))
else:
    print("✅ 所有 rating 值均合法，无时长污染")

# ── 6. duration / duration_num 字段检查 ──
print("\n⏱️  6. duration & duration_num 字段检查")
print("-" * 80)

# 电影时长检查
movies = df[df['type'] == 'Movie']
print(f"电影数量: {len(movies):,}")
print(f"duration_num 缺失: {movies['duration_num'].isnull().sum()}")
print(f"duration_num <= 0: {(movies['duration_num'] <= 0).sum()}")

if len(movies) > 0:
    print(f"电影时长统计 (分钟):")
    print(f"  最小值: {movies['duration_num'].min()}")
    print(f"  最大值: {movies['duration_num'].max()}")
    print(f"  均值: {movies['duration_num'].mean():.1f}")
    print(f"  中位数: {movies['duration_num'].median():.1f}")

    # 异常时长检测
    short_movies = movies[movies['duration_num'] < 10]
    long_movies = movies[movies['duration_num'] > 300]
    print(f"\n超短电影 (<10min): {len(short_movies)} 条")
    if len(short_movies) > 0:
        print(short_movies[['show_id', 'title', 'duration', 'duration_num']].head(10))
    print(f"超长电影 (>300min): {len(long_movies)} 条")
    if len(long_movies) > 0:
        print(long_movies[['show_id', 'title', 'duration', 'duration_num']].head(10))

# 电视节目季数检查
tv_shows = df[df['type'] == 'TV Show']
print(f"\n电视节目数量: {len(tv_shows):,}")
print(f"duration_num 缺失: {tv_shows['duration_num'].isnull().sum()}")
print(f"duration_num <= 0: {(tv_shows['duration_num'] <= 0).sum()}")

if len(tv_shows) > 0:
    print(f"剧集季数统计:")
    print(f"  最小值: {tv_shows['duration_num'].min()}")
    print(f"  最大值: {tv_shows['duration_num'].max()}")
    print(f"  均值: {tv_shows['duration_num'].mean():.1f}")
    print(f"  中位数: {tv_shows['duration_num'].median():.1f}")

    many_seasons = tv_shows[tv_shows['duration_num'] > 10]
    print(f"\n超过10季的剧集: {len(many_seasons)} 条")
    if len(many_seasons) > 0:
        print(many_seasons[['show_id', 'title', 'duration', 'duration_num']].head(10))

# 检查 duration 字符串与 duration_num 的一致性
print("\nduration 与 duration_num 一致性检查:")
def extract_duration_num(row):
    val = str(row['duration']) if pd.notna(row['duration']) else ''
    nums = re.findall(r'\d+', val)
    if nums:
        return int(nums[0])
    return None

mismatch_count = 0
for idx, row in df.iterrows():
    expected = extract_duration_num(row)
    actual = row['duration_num']
    if expected is not None and pd.notna(actual) and expected != int(actual):
        mismatch_count += 1
        if mismatch_count <= 5:
            print(f"  不一致: show_id={row['show_id']}, duration={row['duration']}, duration_num={actual}")

print(f"不一致总数: {mismatch_count}")

# ── 7. release_year 检查 ──
print("\n📅 7. release_year 字段检查")
print("-" * 80)
print(f"数据类型: {df['release_year'].dtype}")
print(f"范围: {df['release_year'].min()} ~ {df['release_year'].max()}")
print(f"均值: {df['release_year'].mean():.1f}")

year_outliers = df[(df['release_year'] < 1925) | (df['release_year'] > 2025)]
print(f"异常年份数量: {len(year_outliers)}")
if len(year_outliers) > 0:
    print(year_outliers[['show_id', 'title', 'release_year']].head(10))

# ── 8. date_added / year_added / month_added 检查 ──
print("\n📆 8. date_added 字段检查")
print("-" * 80)
print(f"date_added_parsed 缺失: {df['date_added_parsed'].isnull().sum():,} ({df['date_added_parsed'].isnull().sum()/len(df)*100:.2f}%)")
print(f"year_added 缺失: {df['year_added'].isnull().sum()}")
print(f"month_added 缺失: {df['month_added'].isnull().sum()}")

valid_dates = df[df['year_added'].notna() & df['month_added'].notna()]
print(f"\nyear_added 范围: {valid_dates['year_added'].min():.0f} ~ {valid_dates['year_added'].max():.0f}")
print(f"month_added 范围: {valid_dates['month_added'].min():.0f} ~ {valid_dates['month_added'].max():.0f}")

bad_months = valid_dates[(valid_dates['month_added'] < 1) | (valid_dates['month_added'] > 12)]
print(f"非法月份数量: {len(bad_months)}")

# 检查 year_added > release_year 的合理性
print("\n上架年份 vs 发行年份 (检查是否有未来上架):")
future_add = df[df['year_added'] < df['release_year']]
print(f"  上架早于发行的记录: {len(future_add)} 条")
if len(future_add) > 0:
    print(future_add[['show_id', 'title', 'release_year', 'year_added']].head(10))

# ── 9. primary_country 检查 ──
print("\n🌍 9. primary_country 字段检查")
print("-" * 80)
print(f"缺失: {df['primary_country'].isnull().sum():,}")
print(f"空字符串: {(df['primary_country'].str.strip() == '').sum()}")
print(f"'未知' 值: {(df['primary_country'] == '未知').sum():,}")

top_countries = df['primary_country'].value_counts().head(10)
print(f"\nTop 10 国家/地区:")
for country, count in top_countries.items():
    print(f"  {country}: {count:,} ({count/len(df)*100:.1f}%)")

# ── 10. show_id 格式检查 ──
print("\n🆔 10. show_id 格式检查")
print("-" * 80)
show_id_pattern = r'^s\d+$'
invalid_show_ids = df[~df['show_id'].str.match(show_id_pattern)]
print(f"非法格式数量: {len(invalid_show_ids)}")
if len(invalid_show_ids) > 0:
    print(invalid_show_ids['show_id'].head(20).tolist())

# 检查编号连续性
id_nums = df['show_id'].str.extract(r's(\d+)').astype(int)[0].sort_values()
expected = set(range(1, len(df) + 1))
actual = set(id_nums.tolist())
missing_ids = expected - actual
print(f"\n缺失的编号数量: {len(missing_ids)}")
if len(missing_ids) > 0:
    print(f"  缺失: {sorted(list(missing_ids))[:20]}...")

# ── 11. description 字段检查 ──
print("\n📝 11. description 字段检查")
print("-" * 80)
print(f"缺失: {df['description'].isnull().sum()}")
desc_lengths = df['description'].str.len()
print(f"长度范围: {desc_lengths.min()} ~ {desc_lengths.max()} 字符")
print(f"平均长度: {desc_lengths.mean():.0f} 字符")

short_desc = df[desc_lengths < 20]
print(f"超短描述 (<20字符): {len(short_desc)} 条")
if len(short_desc) > 0:
    print(short_desc[['show_id', 'title', 'description']].head(5))

# ── 12. listed_in 检查 ──
print("\n🎭 12. listed_in 字段检查")
print("-" * 80)
all_genres = []
for val in df['listed_in'].dropna():
    genres = [g.strip() for g in str(val).split(',')]
    all_genres.extend(genres)
genre_counts = pd.Series(all_genres).value_counts()
print(f"流派总数（去重）: {len(genre_counts)}")
print(f"\nTop 15 流派:")
for genre, count in genre_counts.head(15).items():
    print(f"  {genre}: {count:,}")

# ── 总结 ──
print("\n" + "=" * 80)
print("📋 数据质量总结")
print("=" * 80)

issues = []

if len(missing_df[missing_df['缺失数量'] > 0]) > 0:
    issues.append(f"❌ 存在缺失值: {missing_df['缺失数量'].sum():,} 处")
else:
    issues.append("✅ 无缺失值")

if dup_show_id > 0:
    issues.append(f"❌ show_id 重复: {dup_show_id} 条")
else:
    issues.append("✅ show_id 无重复")

if len(bad_ratings) > 0:
    issues.append(f"❌ rating 字段污染: {len(bad_ratings)} 条")
else:
    issues.append("✅ rating 字段干净，无时长污染")

if mismatch_count > 0:
    issues.append(f"❌ duration/duration_num 不一致: {mismatch_count} 条")
else:
    issues.append("✅ duration 与 duration_num 一致")

if len(year_outliers) > 0:
    issues.append(f"❌ 异常年份: {len(year_outliers)} 条")
else:
    issues.append("✅ 发行年份范围合理")

if len(invalid_show_ids) > 0:
    issues.append(f"❌ 非法 show_id 格式: {len(invalid_show_ids)} 条")
else:
    issues.append("✅ show_id 格式统一")

print("\n".join(issues))

print("\n" + "=" * 80)
print("检查完成")
print("=" * 80)
