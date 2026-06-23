import pandas as pd
import numpy as np
import json
import os
from collections import Counter
from pyecharts import options as opts
from pyecharts.charts import (
    Bar, Pie, Line, HeatMap, Funnel, Page,
)
from pyecharts.globals import ThemeType, CurrentConfig

CurrentConfig.ONLINE_HOST = "https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/"

df = pd.read_csv('netflix_titles.csv')
print(f"原始数据形状：{df.shape}")

# 预处理
df['director'] = df['director'].fillna('Unknown')
df['cast'] = df['cast'].fillna('Unknown')
df['country'] = df['country'].fillna('Unknown')
df['date_added'] = df['date_added'].fillna(df['date_added'].mode()[0])
df['rating'] = df['rating'].fillna(df['rating'].mode()[0])
df['duration'] = df['duration'].fillna(df['duration'].mode()[0])
df['year_added'] = df['date_added'].str.extract(r'(\d{4})').astype(int)

def split_field(s):
    if pd.isna(s) or s == 'Unknown':
        return []
    return [x.strip() for x in str(s).split(',') if x.strip()]

df['genres_list'] = df['listed_in'].apply(split_field)
df['countries_list'] = df['country'].apply(split_field)
df['cast_list'] = df['cast'].apply(split_field)
df['duration_num'] = df['duration'].str.extract(r'(\d+)').astype(float).astype(int)

# 描述性统计
type_dist = df['type'].value_counts().reset_index()
type_dist.columns = ['类型', '数量']
type_dist['占比(%)'] = (type_dist['数量'] / type_dist['数量'].sum() * 100).round(2)

year_added = df.groupby(['year_added', 'type']).size().unstack().fillna(0).astype(int)
year_added = year_added.sort_index()
year_added['总计'] = year_added.sum(axis=1)

all_countries = []
for c in df['countries_list']:
    all_countries.extend(c)
country_count = pd.DataFrame(Counter(all_countries).most_common(15), columns=['国家', '数量'])

all_genres = []
for g in df['genres_list']:
    all_genres.extend(g)
genre_count = pd.DataFrame(Counter(all_genres).most_common(10), columns=['流派', '数量'])

rating_dist = df['rating'].value_counts().head(10).reset_index()
rating_dist.columns = ['评级', '数量']

print("✓ 统计分析完成")

# 图1 环形图
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

# 图2 折线图
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

# 图3 国家
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

# 图4 流派
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

# 图5 评级漏斗
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

# 图6 电影时长直方图
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

# 图7 流派类型堆叠
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


# 图9 季数玫瑰图
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

# 图10 热力图
def chart_heatmap():
    filtered = df[(df['release_year'] >= 2008) & (df['release_year'] <= 2021)]
    top_rating = rating_dist['评级'].head(8).tolist()
    r = filtered[filtered['rating'].isin(top_rating)]
    years = sorted(r['release_year'].unique().tolist())
    heatmap_data = []
    for y_idx, y in enumerate(years):
        for rt_idx, rt in enumerate(top_rating):
            cnt = r[(r['release_year'] == y) & (r['rating'] == rt)].shape[0]
            heatmap_data.append([rt_idx, y_idx, cnt])
    c = (
        HeatMap(init_opts=opts.InitOpts(theme=ThemeType.DARK, width="100%", height="600px"))
        .add_xaxis(years)
        .add_yaxis(
            "作品数量", top_rating, heatmap_data,
            label_opts=opts.LabelOpts(is_show=True, color="#fff", font_size=10),
        )
        .set_global_opts(
            title_opts=opts.TitleOpts(
                title="🔥 发行年份 × 评级 热力图",
                title_textstyle_opts=opts.TextStyleOpts(color="#fff", font_size=22, font_weight="bold"),
                pos_left="center",
            ),
            xaxis_opts=opts.AxisOpts(
                type_="category",
                splitarea_opts=opts.SplitAreaOpts(is_show=True, areastyle_opts=opts.AreaStyleOpts(opacity=1)),
                axisline_opts=opts.AxisLineOpts(linestyle_opts=opts.LineStyleOpts(color="#666")),
                axislabel_opts=opts.LabelOpts(color="#ccc", rotate=45),
            ),
            yaxis_opts=opts.AxisOpts(
                type_="category",
                splitarea_opts=opts.SplitAreaOpts(is_show=True, areastyle_opts=opts.AreaStyleOpts(opacity=1)),
                axisline_opts=opts.AxisLineOpts(linestyle_opts=opts.LineStyleOpts(color="#666")),
                axislabel_opts=opts.LabelOpts(color="#fff"),
            ),
            visualmap_opts=opts.VisualMapOpts(
                min_=0, max_=max([d[2] for d in heatmap_data]),
                range_color=["#0d0d0d", "#831010", "#E50914", "#FFD700"],
                textstyle_opts=opts.TextStyleOpts(color="#fff"),
                pos_right="20px", pos_bottom="20px",
            ),
        )
    )
    return c

# 生成所有图表
charts = []
for i, fn in enumerate([chart_type_pie, chart_year_line, chart_country_bar, chart_genre_bar,
                        chart_rating_funnel, chart_duration, chart_genre_type,
                        chart_season_rose, chart_heatmap], 1):
    c = fn()
    c.render(f'charts/chart{i}.html')
    charts.append(c)
    print(f"✓ 图{i} 生成完成")

# Dashboard
page = Page(layout=Page.DraggablePageLayout, page_title="Netflix 数据分析看板")
for c in charts:
    page.add(c)
page.render('charts/dashboard.html')
print("✓ Dashboard 生成完成")

# 导出 JSON
overview = {
    'total': int(df.shape[0]),
    'movies': int(df[df['type'] == 'Movie'].shape[0]),
    'tvshows': int(df[df['type'] == 'TV Show'].shape[0]),
    'countries': len(set(c for cs in df['countries_list'] for c in cs)),
    'genres': len(set(g for gs in df['genres_list'] for g in gs)),
    'directors': int(df[df['director'] != 'Unknown']['director'].nunique()),
}

year_data = []
for idx, row in year_added.iterrows():
    year_data.append({
        'year': int(idx),
        'Movie': int(row.get('Movie', 0)),
        'TV Show': int(row.get('TV Show', 0)),
        'total': int(row['总计']),
    })

movie_dur = df[df['type'] == 'Movie']['duration_num'].tolist()
dur_stats = {
    'mean': float(np.mean(movie_dur)),
    'median': float(np.median(movie_dur)),
    'min': float(np.min(movie_dur)),
    'max': float(np.max(movie_dur)),
    'count': len(movie_dur),
}

# ===== 新增：补全所有前端需要的真实数据 =====

# 1) 流派 × 类型 真实交叉数据（图7 堆叠柱状图）
top_genres_for_type = genre_count['流派'].head(8).tolist()
genre_type_breakdown = []
for genre in top_genres_for_type:
    movie_count = int(df[df['genres_list'].apply(lambda x: genre in x) & (df['type'] == 'Movie')].shape[0])
    show_count = int(df[df['genres_list'].apply(lambda x: genre in x) & (df['type'] == 'TV Show')].shape[0])
    genre_type_breakdown.append({'流派': genre, '电影': movie_count, '电视节目': show_count})

# 2) TV Show 季数真实分布（图9 玫瑰图）
season_df = df[df['type'] == 'TV Show']['duration_num'].value_counts().sort_index().head(10).reset_index()
season_df.columns = ['季数', '数量']
# 合并 6+ 为一组
if len(season_df) > 6:
    over_6 = season_df.iloc[6:]['数量'].sum()
    season_df = season_df.head(6)
    season_df = pd.concat([season_df, pd.DataFrame([{'季数': '6+', '数量': over_6}])], ignore_index=True)
season_distribution = season_df.to_dict('records')

# 3) 发行年份 × 评级 真实热力数据（图10）
heatmap_years = list(range(2008, 2022))
heatmap_ratings = rating_dist['评级'].head(8).tolist()
heatmap_real = []
for y in heatmap_years:
    for r in heatmap_ratings:
        cnt = int(df[(df['release_year'] == y) & (df['rating'] == r)].shape[0])
        heatmap_real.append({'year': y, 'rating': r, 'count': cnt})

# 4) 电影时长真实分箱直方图（图6）
movie_durations = df[df['type'] == 'Movie']['duration_num']
bin_size = 15
bins_start = list(range(0, int(movie_durations.max()) + bin_size + 1, bin_size))
hist_counts, _ = np.histogram(movie_durations.tolist(), bins=bins_start)
duration_histogram = [
    {'range': f'{bins_start[i]}-{bins_start[i+1]}', 'count': int(hist_counts[i])}
    for i in range(len(bins_start)-1)
]

# 5) Top 演员（可选扩展）
all_casts = []
for cl in df['cast_list']:
    all_casts.extend(cl)
top_casts = pd.DataFrame(Counter(all_casts).most_common(10), columns=['演员', '作品数']).to_dict('records')

export = {
    'overview': overview,
    'type_dist': type_dist.to_dict(orient='records'),
    'year_trend': year_data,
    'countries': country_count.to_dict(orient='records'),
    'genres': genre_count.to_dict(orient='records'),
    'ratings': rating_dist.to_dict(orient='records'),
    'duration_stats': dur_stats,
    # ===== 补全的新字段 =====
    'genre_type_breakdown': genre_type_breakdown,
    'season_distribution': season_distribution,
    'heatmap_data': heatmap_real,
    'heatmap_meta': {'years': heatmap_years, 'ratings': heatmap_ratings},
    'duration_histogram': duration_histogram,
    'top_casts': top_casts,
}

with open('data/analysis_data.json', 'w', encoding='utf-8') as f:
    json.dump(export, f, ensure_ascii=False, indent=2)
print("✓ JSON 数据导出完成")
print("==== ALL DONE ====")
