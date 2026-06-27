"""
Statistical analysis module for Netflix dataset.
Provides descriptive statistics, correlation analysis, and exploratory data analysis.
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Tuple
from collections import Counter


class StatisticalAnalyzer:
    """Handles statistical analysis operations."""
    
    def __init__(self, data: pd.DataFrame):
        """
        Initialize the StatisticalAnalyzer.
        
        Args:
            data: Preprocessed Netflix DataFrame.
        """
        self.data = data.copy()
        self.analysis_results = {}
    
    def descriptive_statistics(self, columns: List[str] = None) -> pd.DataFrame:
        """
        Compute descriptive statistics for numeric columns.
        
        Args:
            columns: List of column names to analyze. If None, uses default numeric columns.
            
        Returns:
            DataFrame with descriptive statistics.
        """
        if columns is None:
            columns = ['release_year', 'year_added', 'duration_num', 
                      'genre_count', 'country_count', 'cast_count']
        
        available_cols = [c for c in columns if c in self.data.columns]
        stats = self.data[available_cols].describe().round(2)
        
        self.analysis_results['descriptive_stats'] = stats
        return stats
    
    def type_distribution(self) -> pd.DataFrame:
        """
        Analyze distribution of content types (Movie vs TV Show).
        
        Returns:
            DataFrame with type distribution including percentages.
        """
        type_counts = self.data['type'].value_counts()
        type_dist = pd.DataFrame({
            'count': type_counts,
            'percentage': (type_counts / len(self.data) * 100).round(2)
        })
        
        self.analysis_results['type_distribution'] = type_dist
        return type_dist
    
    def yearly_trend(self) -> pd.DataFrame:
        """
        Analyze content addition trends by year.
        
        Returns:
            DataFrame with yearly content additions broken down by type.
        """
        if 'year_added' not in self.data.columns:
            raise ValueError("year_added column not found. Run feature engineering first.")
        
        trend = self.data.groupby(['year_added', 'type']).size().unstack().fillna(0).astype(int)
        trend = trend.sort_index()
        trend['total'] = trend.sum(axis=1)
        
        self.analysis_results['yearly_trend'] = trend
        return trend
    
    def top_countries(self, n: int = 15) -> List[Tuple[str, int]]:
        """
        Get top N countries by content production.
        
        Args:
            n: Number of top countries to return.
            
        Returns:
            List of (country, count) tuples.
        """
        all_countries = []
        for countries_list in self.data['countries_list']:
            all_countries.extend(countries_list)
        
        top = Counter(all_countries).most_common(n)
        self.analysis_results['top_countries'] = top
        return top
    
    def top_genres(self, n: int = 10) -> List[Tuple[str, int]]:
        """
        Get top N genres by content count.
        
        Args:
            n: Number of top genres to return.
            
        Returns:
            List of (genre, count) tuples.
        """
        all_genres = []
        for genres_list in self.data['genres_list']:
            all_genres.extend(genres_list)
        
        top = Counter(all_genres).most_common(n)
        self.analysis_results['top_genres'] = top
        return top
    
    def rating_distribution(self, n: int = 10) -> pd.DataFrame:
        """
        Analyze age rating distribution.
        
        Args:
            n: Number of top ratings to include.
            
        Returns:
            DataFrame with rating distribution.
        """
        rating_counts = self.data['rating'].value_counts().head(n)
        rating_dist = pd.DataFrame({
            'count': rating_counts,
            'percentage': (rating_counts / len(self.data) * 100).round(2)
        })
        
        self.analysis_results['rating_distribution'] = rating_dist
        return rating_dist
    
    def correlation_matrix(self, columns: List[str] = None) -> pd.DataFrame:
        """
        Compute correlation matrix for numeric variables.
        
        Args:
            columns: List of column names to include. If None, uses default columns.
            
        Returns:
            Correlation matrix as DataFrame.
        """
        if columns is None:
            columns = ['release_year', 'year_added', 'duration_num', 
                      'genre_count', 'country_count', 'cast_count']
        
        available_cols = [c for c in columns if c in self.data.columns]
        corr_matrix = self.data[available_cols].corr().round(3)
        
        self.analysis_results['correlation_matrix'] = corr_matrix
        return corr_matrix
    
    def group_by_type(self) -> pd.DataFrame:
        """
        Compute grouped statistics by content type.
        
        Returns:
            DataFrame with aggregated statistics per type.
        """
        grouped = self.data.groupby('type').agg({
            'title': 'count',
            'duration_num': ['mean', 'median', 'std'],
            'release_year': ['mean', 'min', 'max'],
            'cast_count': 'mean',
            'genre_count': 'mean'
        }).round(2)
        
        self.analysis_results['grouped_by_type'] = grouped
        return grouped
    
    def get_analysis_summary(self) -> Dict:
        """
        Generate a comprehensive analysis summary.
        
        Returns:
            Dictionary containing all analysis results.
        """
        return {
            'data_shape': self.data.shape,
            'type_distribution': self.analysis_results.get('type_distribution', {}).to_dict() 
                if 'type_distribution' in self.analysis_results else None,
            'descriptive_stats': self.analysis_results.get('descriptive_stats', {}).to_dict()
                if 'descriptive_stats' in self.analysis_results else None,
            'correlation_matrix': self.analysis_results.get('correlation_matrix', {}).to_dict()
                if 'correlation_matrix' in self.analysis_results else None,
            'top_countries': self.analysis_results.get('top_countries', []),
            'top_genres': self.analysis_results.get('top_genres', []),
        }
