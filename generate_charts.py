"""
Netflix 数据分析 - 数据预处理与 JSON 导出模块
功能：数据清洗、统计分析、JSON 数据导出（供前端使用）
"""
import pandas as pd
import numpy as np
import json
from collections import Counter
from pathlib import Path


class NetflixDataProcessor:
    """Netflix 数据处理器"""
    
    def __init__(self, csv_path='netflix_titles_cleaned.csv'):
        self.csv_path = csv_path
        self.df = None
        
    def load_and_clean(self):
        """加载并清洗数据"""
        self.df = pd.read_csv(self.csv_path)
        print(f"原始数据形状：{self.df.shape}")
        
        # 缺失值填充
        fill_defaults = {
            'director': 'Unknown',
            'cast': 'Unknown', 
            'country': 'Unknown',
            'date_added': self.df['date_added'].mode()[0],
            'rating': self.df['rating'].mode()[0],
            'duration': self.df['duration'].mode()[0]
        }
        self.df.fillna(fill_defaults, inplace=True)
        
        # 提取年份和时长数字
        self.df['year_added'] = self.df['date_added'].str.extract(r'(\d{4})').astype(int)
        self.df['duration_num'] = self.df['duration'].str.extract(r'(\d+)').astype(float).astype(int)
        
        # 分割列表字段
        for field, col_name in [('listed_in', 'genres_list'), ('country', 'countries_list'), ('cast', 'cast_list')]:
            self.df[col_name] = self.df[field].apply(self._split_field)
        
        return self
    
    @staticmethod
    def _split_field(s):
        """分割逗号分隔的字段"""
        if pd.isna(s) or s == 'Unknown':
            return []
        return [x.strip() for x in str(s).split(',') if x.strip()]
    
    def export_statistics(self, output_dir='data'):
        """导出统计分析结果到 JSON"""
        Path(output_dir).mkdir(exist_ok=True)
        
        stats = {
            'overview': self._get_overview(),
            'type_dist': self._get_type_distribution(),
            'year_trend': self._get_year_trend(),
            'countries': self._get_top_countries(15),
            'genres': self._get_top_genres(10),
            'ratings': self._get_rating_distribution(10),
            'duration_stats': self._get_duration_stats(),
            'genre_type_breakdown': self._get_genre_type_breakdown(),
            'season_distribution': self._get_season_distribution(),
            'heatmap_data': self._get_heatmap_data(),
            'heatmap_meta': self._get_heatmap_meta(),
            'duration_histogram': self._get_duration_histogram(),
            'top_casts': self._get_top_casts(10)
        }
        
        output_path = Path(output_dir) / 'analysis_data.json'
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(stats, f, ensure_ascii=False, indent=2)
        
        print(f"✓ JSON 数据已导出至 {output_path}")
        return stats
    
    def _get_overview(self):
        """基础统计概览"""
        df = self.df
        return {
            'total': int(df.shape[0]),
            'movies': int((df['type'] == 'Movie').sum()),
            'tvshows': int((df['type'] == 'TV Show').sum()),
            'countries': len(set(c for cs in df['countries_list'] for c in cs)),
            'genres': len(set(g for gs in df['genres_list'] for g in gs)),
            'directors': int(df[df['director'] != 'Unknown']['director'].nunique())
        }
    
    def _get_type_distribution(self):
        """类型分布"""
        dist = self.df['type'].value_counts()
        return [
            {'类型': 'Movie' if idx == 'Movie' else 'TV Show', '数量': int(val)}
            for idx, val in dist.items()
        ]
    
    def _get_year_trend(self):
        """年度趋势"""
        year_added = self.df.groupby(['release_year', 'type']).size().unstack().fillna(0).astype(int)
        return [
            {
                'year': int(year),
                'Movie': int(row.get('Movie', 0)),
                'TV Show': int(row.get('TV Show', 0))
            }
            for year, row in year_added.iterrows()
        ]
    
    def _get_top_countries(self, n=15):
        """Top N 制片国家"""
        all_countries = [c for cs in self.df['countries_list'] for c in cs]
        return [
            {'国家': country, '数量': count}
            for country, count in Counter(all_countries).most_common(n)
        ]
    
    def _get_top_genres(self, n=10):
        """Top N 流派"""
        all_genres = [g for gs in self.df['genres_list'] for g in gs]
        return [
            {'流派': genre, '数量': count}
            for genre, count in Counter(all_genres).most_common(n)
        ]
    
    def _get_rating_distribution(self, n=10):
        """评级分布"""
        dist = self.df['rating'].value_counts().head(n)
        return [{'评级': idx, '数量': int(val)} for idx, val in dist.items()]
    
    def _get_duration_stats(self):
        """电影时长统计"""
        durations = self.df[self.df['type'] == 'Movie']['duration_num'].dropna()
        if len(durations) == 0:
            return {'mean': 0, 'median': 0, 'min': 0, 'max': 0, 'count': 0}
        return {
            'mean': float(np.mean(durations)),
            'median': float(np.median(durations)),
            'min': int(np.min(durations)),
            'max': int(np.max(durations)),
            'count': int(len(durations))
        }
    
    def _get_genre_type_breakdown(self, n=8):
        """流派 × 类型交叉分析"""
        top_genres = [g['流派'] for g in self._get_top_genres(n)]
        result = []
        for genre in top_genres:
            mask = self.df['genres_list'].apply(lambda x: genre in x)
            result.append({
                '流派': genre,
                '电影': int((mask & (self.df['type'] == 'Movie')).sum()),
                '电视节目': int((mask & (self.df['type'] == 'TV Show')).sum())
            })
        return result
    
    def _get_season_distribution(self):
        """TV Show 季数分布"""
        shows = self.df[self.df['type'] == 'TV Show']
        season_counts = shows['duration_num'].value_counts().sort_index().head(6)
        
        # 合并 6+ 季
        over_6 = shows[shows['duration_num'] > 6]['duration_num'].count()
        result = [
            {'季数': int(idx), '数量': int(val)}
            for idx, val in season_counts.items() if idx <= 6
        ]
        if over_6 > 0:
            result.append({'季数': '6+', '数量': int(over_6)})
        return result
    
    def _get_heatmap_meta(self):
        """热力图元数据"""
        return {
            'years': list(range(2008, 2022)),
            'ratings': [r['评级'] for r in self._get_rating_distribution(8)]
        }
    
    def _get_heatmap_data(self):
        """热力图数据"""
        meta = self._get_heatmap_meta()
        filtered = self.df[
            (self.df['release_year'].isin(meta['years'])) &
            (self.df['rating'].isin(meta['ratings']))
        ]
        return [
            {'year': int(year), 'rating': rating, 'count': int(count)}
            for (year, rating), count in filtered.groupby(['release_year', 'rating']).size().items()
        ]
    
    def _get_duration_histogram(self, bin_size=15):
        """电影时长直方图分箱"""
        durations = self.df[self.df['type'] == 'Movie']['duration_num'].dropna()
        if len(durations) == 0:
            return []
        
        max_dur = int(durations.max())
        bins = list(range(0, max_dur + bin_size + 1, bin_size))
        counts, _ = np.histogram(durations, bins=bins)
        
        return [
            {'range': f'{bins[i]}-{bins[i+1]}', 'count': int(counts[i])}
            for i in range(len(bins) - 1) if counts[i] > 0
        ]
    
    def _get_top_casts(self, n=10):
        """Top N 演员"""
        all_casts = [c for cs in self.df['cast_list'] for c in cs]
        return [
            {'演员': actor, '作品数': count}
            for actor, count in Counter(all_casts).most_common(n)
        ]


def main():
    """主函数"""
    processor = NetflixDataProcessor()
    processor.load_and_clean()
    processor.export_statistics()
    print("==== 数据处理完成 ====")


if __name__ == '__main__':
    main()
