"""
Visualization module using pyecharts for Netflix dataset.
Generates various interactive charts including bar, pie, line, heatmap, etc.
"""

import pandas as pd
import numpy as np
from typing import List, Dict, Tuple, Optional
from collections import Counter
from pyecharts import options as opts
from pyecharts.charts import (
    Bar, Pie, Line, Scatter, WordCloud, HeatMap, 
    Boxplot, Funnel, Gauge, Timeline, Grid, Page
)
from pyecharts.globals import ThemeType, CurrentConfig


class ChartGenerator:
    """Handles generation of pyecharts visualizations."""
    
    def __init__(self, data: pd.DataFrame, theme: str = 'dark'):
        """
        Initialize the ChartGenerator.
        
        Args:
            data: Preprocessed Netflix DataFrame.
            theme: ECharts theme ('dark', 'light', or custom).
        """
        self.data = data.copy()
        self.theme = ThemeType.DARK if theme == 'dark' else ThemeType.LIGHT
        self.charts = {}
        
        # Set ECharts CDN
        CurrentConfig.ONLINE_HOST = "https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/"
    
    def _get_init_opts(self, width: str = '100%', height: str = '500px'):
        """Get chart initialization options."""
        return opts.InitOpts(theme=self.theme, width=width, height=height)
    
    def create_type_pie_chart(self) -> Pie:
        """Create a pie chart showing content type distribution."""
        type_dist = self.data['type'].value_counts()
        data = [(t, c) for t, c in zip(type_dist.index, type_dist.values)]
        
        chart = (
            Pie(init_opts=self._get_init_opts(height='500px'))
            .add(
                series_name="Content Type",
                data_pair=data,
                radius=["40%", "70%"],
                center=["50%", "50%"],
                label_opts=opts.LabelOpts(
                    formatter="{b}: {c} ({d}%)", 
                    font_size=14, 
                    color="#fff"
                ),
                itemstyle_opts=opts.ItemStyleOpts(
                    border_color="#0e0e0e", 
                    border_width=2
                ),
            )
            .set_colors(["#E50914", "#831010"])
            .set_global_opts(
                title_opts=opts.TitleOpts(
                    title="🎬 Netflix Content Type Distribution",
                    subtitle=f"Total: {len(self.data)} titles",
                    title_textstyle_opts=opts.TextStyleOpts(
                        color="#fff", font_size=20, font_weight="bold"
                    ),
                    pos_left="center",
                ),
                legend_opts=opts.LegendOpts(
                    orient="vertical", 
                    pos_top="middle", 
                    pos_right="10px"
                ),
            )
        )
        
        self.charts['type_pie'] = chart
        return chart
    
    def create_yearly_trend_line(self) -> Line:
        """Create a line chart showing yearly content addition trends."""
        trend = self.data.groupby(['year_added', 'type']).size().unstack().fillna(0)
        trend = trend.sort_index()
        
        years = [int(y) for y in trend.index.tolist()]
        movies = trend.get('Movie', pd.Series(0, index=trend.index)).tolist()
        shows = trend.get('TV Show', pd.Series(0, index=trend.index)).tolist()
        
        chart = (
            Line(init_opts=self._get_init_opts(height='550px'))
            .add_xaxis(years)
            .add_yaxis(
                "Movies", movies, is_smooth=True, symbol_size=8,
                linestyle_opts=opts.LineStyleOpts(width=4, color="#E50914"),
                itemstyle_opts=opts.ItemStyleOpts(color="#E50914"),
                areastyle_opts=opts.AreaStyleOpts(opacity=0.2, color="#E50914"),
                label_opts=opts.LabelOpts(is_show=False),
            )
            .add_yaxis(
                "TV Shows", shows, is_smooth=True, symbol_size=8,
                linestyle_opts=opts.LineStyleOpts(width=4, color="#FFD700"),
                itemstyle_opts=opts.ItemStyleOpts(color="#FFD700"),
                areastyle_opts=opts.AreaStyleOpts(opacity=0.2, color="#FFD700"),
                label_opts=opts.LabelOpts(is_show=False),
            )
            .set_global_opts(
                title_opts=opts.TitleOpts(
                    title="📈 Yearly Content Addition Trend",
                    title_textstyle_opts=opts.TextStyleOpts(
                        color="#fff", font_size=20, font_weight="bold"
                    ),
                    pos_left="center",
                ),
                xaxis_opts=opts.AxisOpts(
                    axislabel_opts=opts.LabelOpts(color="#ccc"),
                ),
                yaxis_opts=opts.AxisOpts(
                    name="Count",
                    axislabel_opts=opts.LabelOpts(color="#ccc"),
                    splitline_opts=opts.SplitLineOpts(is_show=True),
                ),
                legend_opts=opts.LegendOpts(
                    textstyle_opts=opts.TextStyleOpts(color="#fff"),
                    pos_top="50px"
                ),
                tooltip_opts=opts.TooltipOpts(trigger="axis"),
            )
        )
        
        self.charts['yearly_trend'] = chart
        return chart
    
    def create_country_bar_chart(self, top_n: int = 15) -> Bar:
        """Create a horizontal bar chart showing top countries."""
        all_countries = []
        for countries_list in self.data['countries_list']:
            all_countries.extend(countries_list)
        
        top_countries = Counter(all_countries).most_common(top_n)
        countries = [c[0] for c in top_countries][::-1]
        counts = [c[1] for c in top_countries][::-1]
        
        chart = (
            Bar(init_opts=self._get_init_opts(height='600px'))
            .add_xaxis(countries)
            .add_yaxis(
                "Count", counts,
                category_gap="40%",
                label_opts=opts.LabelOpts(
                    position="right", 
                    color="#fff", 
                    font_size=12, 
                    font_weight="bold"
                ),
                itemstyle_opts=opts.ItemStyleOpts(
                    color={
                        "type": "linear", "x": 0, "y": 0, "x2": 1, "y2": 0,
                        "colorStops": [
                            {"offset": 0, "color": "#E50914"},
                            {"offset": 1, "color": "#FF6464"}
                        ],
                    },
                    border_radius=[0, 8, 8, 0],
                ),
            )
            .reversal_axis()
            .set_global_opts(
                title_opts=opts.TitleOpts(
                    title="🌍 Top Countries by Production",
                    title_textstyle_opts=opts.TextStyleOpts(
                        color="#fff", font_size=20, font_weight="bold"
                    ),
                    pos_left="center",
                ),
                xaxis_opts=opts.AxisOpts(
                    axislabel_opts=opts.LabelOpts(color="#ccc"),
                    splitline_opts=opts.SplitLineOpts(is_show=True),
                ),
                yaxis_opts=opts.AxisOpts(
                    axislabel_opts=opts.LabelOpts(color="#fff", font_size=13),
                ),
                legend_opts=opts.LegendOpts(is_show=False),
            )
        )
        
        self.charts['country_bar'] = chart
        return chart
    
    def create_genre_bar_chart(self, top_n: int = 10) -> Bar:
        """Create a horizontal bar chart showing top genres."""
        all_genres = []
        for genres_list in self.data['genres_list']:
            all_genres.extend(genres_list)
        
        top_genres = Counter(all_genres).most_common(top_n)
        genres = [g[0] for g in top_genres][::-1]
        counts = [g[1] for g in top_genres][::-1]
        
        chart = (
            Bar(init_opts=self._get_init_opts(height='550px'))
            .add_xaxis(genres)
            .add_yaxis(
                "Count", counts,
                category_gap="45%",
                label_opts=opts.LabelOpts(
                    position="right", 
                    color="#fff", 
                    font_size=12, 
                    font_weight="bold"
                ),
                itemstyle_opts=opts.ItemStyleOpts(
                    color={
                        "type": "linear", "x": 0, "y": 0, "x2": 1, "y2": 0,
                        "colorStops": [
                            {"offset": 0, "color": "#409EFF"},
                            {"offset": 1, "color": "#FFD700"}
                        ],
                    },
                    border_radius=[0, 8, 8, 0],
                ),
            )
            .reversal_axis()
            .set_global_opts(
                title_opts=opts.TitleOpts(
                    title="🎭 Top Genres",
                    title_textstyle_opts=opts.TextStyleOpts(
                        color="#fff", font_size=20, font_weight="bold"
                    ),
                    pos_left="center",
                ),
                xaxis_opts=opts.AxisOpts(
                    axislabel_opts=opts.LabelOpts(color="#ccc"),
                    splitline_opts=opts.SplitLineOpts(is_show=True),
                ),
                yaxis_opts=opts.AxisOpts(
                    axislabel_opts=opts.LabelOpts(color="#fff", font_size=12),
                ),
                legend_opts=opts.LegendOpts(is_show=False),
            )
        )
        
        self.charts['genre_bar'] = chart
        return chart
    
    def create_rating_funnel(self, top_n: int = 10) -> Funnel:
        """Create a funnel chart showing rating distribution."""
        rating_dist = self.data['rating'].value_counts().head(top_n)
        data = [(r, c) for r, c in zip(rating_dist.index, rating_dist.values)]
        
        colors = ["#E50914", "#FF6B6B", "#FFD700", "#4ECDC4", "#45B7D1", 
                 "#96CEB4", "#FFEAA7", "#DDA0DD", "#A29BFE", "#81ECEC"]
        
        chart = (
            Funnel(init_opts=self._get_init_opts(height='550px'))
            .add(
                series_name="Rating Distribution",
                data_pair=data,
                label_opts=opts.LabelOpts(
                    position="inside", 
                    formatter="{b}: {c}", 
                    color="#fff", 
                    font_size=13, 
                    font_weight="bold"
                ),
                sort_="descending", 
                gap=2,
            )
            .set_colors(colors[:len(data)])
            .set_global_opts(
                title_opts=opts.TitleOpts(
                    title="🔖 Age Rating Distribution",
                    title_textstyle_opts=opts.TextStyleOpts(
                        color="#fff", font_size=20, font_weight="bold"
                    ),
                    pos_left="center",
                ),
                legend_opts=opts.LegendOpts(
                    textstyle_opts=opts.TextStyleOpts(color="#fff"),
                    pos_top="50px"
                ),
                tooltip_opts=opts.TooltipOpts(
                    trigger="item", 
                    formatter="{b}: {c} ({d}%)"
                ),
            )
        )
        
        self.charts['rating_funnel'] = chart
        return chart
    
    def create_duration_histogram(self) -> Bar:
        """Create a histogram showing movie duration distribution."""
        movies = self.data[self.data['type'] == 'Movie']['duration_num'].dropna()
        
        bins = list(range(0, int(movies.max()) + 20, 10))
        counts, bin_edges = np.histogram(movies, bins=bins)
        labels = [f"{bins[i]}-{bins[i+1]}" for i in range(len(bins)-1)]
        
        avg_duration = int(movies.mean())
        median_duration = int(movies.median())
        
        chart = (
            Bar(init_opts=self._get_init_opts(height='550px'))
            .add_xaxis(labels)
            .add_yaxis(
                "Movie Count", counts.tolist(),
                category_gap="5%",
                label_opts=opts.LabelOpts(is_show=False),
                itemstyle_opts=opts.ItemStyleOpts(
                    color={
                        "type": "linear", "x": 0, "y": 0, "x2": 0, "y2": 1,
                        "colorStops": [
                            {"offset": 0, "color": "#FF6B6B"},
                            {"offset": 1, "color": "#E50914"}
                        ],
                    },
                    border_radius=[6, 6, 0, 0],
                ),
            )
            .set_global_opts(
                title_opts=opts.TitleOpts(
                    title="⏱ Movie Duration Distribution",
                    subtitle=f"Average: {avg_duration} min | Median: {median_duration} min",
                    title_textstyle_opts=opts.TextStyleOpts(
                        color="#fff", font_size=20, font_weight="bold"
                    ),
                    subtitle_textstyle_opts=opts.TextStyleOpts(color="#ccc", font_size=13),
                    pos_left="center",
                ),
                xaxis_opts=opts.AxisOpts(
                    name="Duration (minutes)",
                    axislabel_opts=opts.LabelOpts(color="#ccc", rotate=45),
                ),
                yaxis_opts=opts.AxisOpts(
                    name="Movie Count",
                    axislabel_opts=opts.LabelOpts(color="#ccc"),
                    splitline_opts=opts.SplitLineOpts(is_show=True),
                ),
                legend_opts=opts.LegendOpts(is_show=False),
            )
        )
        
        self.charts['duration_hist'] = chart
        return chart
    
    def render_to_file(self, chart_name: str, filename: str) -> None:
        """
        Render a chart to an HTML file.
        
        Args:
            chart_name: Name of the chart to render.
            filename: Output HTML filename.
        """
        if chart_name not in self.charts:
            raise ValueError(f"Chart '{chart_name}' not found. Create it first.")
        
        self.charts[chart_name].render(filename)
        print(f"Chart '{chart_name}' rendered to {filename}")
    
    def render_all_to_page(self, filename: str = 'charts.html') -> None:
        """Render all created charts to a single HTML page."""
        if not self.charts:
            raise ValueError("No charts created yet.")
        
        from pyecharts.charts import Page
        
        page_obj = Page()
        for chart in self.charts.values():
            page_obj.add(chart)
        
        page_obj.render(filename)
        print(f"All charts rendered to {filename}")
    
    def get_chart_list(self) -> List[str]:
        """Get list of created chart names."""
        return list(self.charts.keys())
