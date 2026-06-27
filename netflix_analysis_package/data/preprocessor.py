"""
Data preprocessing module for Netflix dataset.
Handles missing values, feature engineering, and data cleaning.
"""

import pandas as pd
import numpy as np
from typing import Tuple, List
from collections import Counter


class DataPreprocessor:
    """Handles all data preprocessing operations."""
    
    def __init__(self, data: pd.DataFrame):
        """
        Initialize the DataPreprocessor.
        
        Args:
            data: Raw Netflix DataFrame.
        """
        self.data = data.copy()
        self.missing_info = {}
        self.outlier_info = {}
    
    def handle_missing_values(self) -> pd.DataFrame:
        """
        Handle missing values with appropriate strategies.
        
        Returns:
            DataFrame with missing values handled.
        """
        # Store missing value info before handling
        self.missing_info = {
            'before': self.data.isnull().sum().to_dict(),
            'strategies': {}
        }
        
        # Fill categorical missing values with 'Unknown'
        categorical_cols = ['director', 'cast', 'country']
        for col in categorical_cols:
            if col in self.data.columns:
                self.data[col] = self.data[col].fillna('Unknown')
                self.missing_info['strategies'][col] = 'fillna_Unknown'
        
        # Fill other missing values with mode (most frequent)
        mode_cols = ['date_added', 'rating', 'duration']
        for col in mode_cols:
            if col in self.data.columns and self.data[col].isnull().any():
                mode_value = self.data[col].mode()[0]
                self.data[col] = self.data[col].fillna(mode_value)
                self.missing_info['strategies'][col] = f'fillna_mode_{mode_value}'
        
        # Handle rating anomalies (values containing 'min')
        if 'rating' in self.data.columns:
            invalid_ratings = self.data['rating'].str.contains('min', na=False)
            if invalid_ratings.any():
                invalid_count = invalid_ratings.sum()
                self.data.loc[invalid_ratings, 'rating'] = self.data['rating'].mode()[0]
                self.missing_info['rating_anomalies_fixed'] = invalid_count
        
        self.missing_info['after'] = self.data.isnull().sum().to_dict()
        self.missing_info['total_remaining'] = self.data.isnull().sum().sum()
        
        return self.data
    
    def engineer_features(self) -> pd.DataFrame:
        """
        Create derived features from existing data.
        
        Returns:
            DataFrame with additional engineered features.
        """
        # Extract year and month from date_added
        self.data['year_added'] = self.data['date_added'].str.extract(r'(\d{4})').astype(float).astype('Int64')
        
        # Helper function to split multi-value fields
        def split_field(s):
            if pd.isna(s) or s == 'Unknown':
                return []
            return [x.strip() for x in str(s).split(',') if x.strip()]
        
        # Split multi-value columns
        self.data['genres_list'] = self.data['listed_in'].apply(split_field)
        self.data['countries_list'] = self.data['country'].apply(split_field)
        self.data['cast_list'] = self.data['cast'].apply(split_field)
        
        # Extract numeric duration
        self.data['duration_num'] = self.data['duration'].str.extract(r'(\d+)').astype(float).astype('Int64')
        
        # Count features
        self.data['genre_count'] = self.data['genres_list'].apply(len)
        self.data['country_count'] = self.data['countries_list'].apply(len)
        self.data['cast_count'] = self.data['cast_list'].apply(len)
        
        # Binary features
        self.data['has_director'] = (self.data['director'] != 'Unknown').astype(int)
        
        # Primary category features
        self.data['primary_genre'] = self.data['genres_list'].apply(lambda x: x[0] if x else 'Unknown')
        self.data['primary_country'] = self.data['countries_list'].apply(lambda x: x[0] if x else 'Unknown')
        
        return self.data
    
    def detect_outliers_iqr(self, column: str = 'duration_num') -> Tuple[pd.DataFrame, dict]:
        """
        Detect outliers using IQR method.
        
        Args:
            column: Column name to check for outliers.
            
        Returns:
            Tuple of (DataFrame with outlier flag, outlier statistics).
        """
        movies = self.data[self.data['type'] == 'Movie'].copy()
        
        if column not in movies.columns:
            raise ValueError(f"Column {column} not found")
        
        Q1 = movies[column].quantile(0.25)
        Q3 = movies[column].quantile(0.75)
        IQR = Q3 - Q1
        
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        
        outliers = movies[(movies[column] < lower_bound) | (movies[column] > upper_bound)]
        
        self.outlier_info['iqr'] = {
            'column': column,
            'Q1': float(Q1),
            'Q3': float(Q3),
            'IQR': float(IQR),
            'lower_bound': float(lower_bound),
            'upper_bound': float(upper_bound),
            'outlier_count': len(outliers),
            'outlier_percentage': len(outliers) / len(movies) * 100
        }
        
        # Mark outliers in main dataframe
        self.data['is_outlier_iqr'] = 0
        self.data.loc[outliers.index, 'is_outlier_iqr'] = 1
        
        return self.data, self.outlier_info['iqr']
    
    def detect_outliers_zscore(self, column: str = 'duration_num', threshold: float = 3.0) -> dict:
        """
        Detect outliers using Z-score method.
        
        Args:
            column: Column name to check for outliers.
            threshold: Z-score threshold (default: 3.0).
            
        Returns:
            Dictionary with outlier statistics.
        """
        movies = self.data[self.data['type'] == 'Movie'].copy()
        
        if column not in movies.columns:
            raise ValueError(f"Column {column} not found")
        
        mean = movies[column].mean()
        std = movies[column].std()
        
        z_scores = np.abs((movies[column] - mean) / std)
        outliers = movies[z_scores > threshold]
        
        self.outlier_info['zscore'] = {
            'column': column,
            'mean': float(mean),
            'std': float(std),
            'threshold': threshold,
            'outlier_count': len(outliers),
            'outlier_percentage': len(outliers) / len(movies) * 100
        }
        
        return self.outlier_info['zscore']
    
    def get_processed_data(self) -> pd.DataFrame:
        """Return the processed DataFrame."""
        return self.data
    
    def get_preprocessing_report(self) -> dict:
        """
        Generate a comprehensive preprocessing report.
        
        Returns:
            Dictionary containing all preprocessing information.
        """
        return {
            'missing_values': self.missing_info,
            'outliers': self.outlier_info,
            'final_shape': self.data.shape,
            'features_added': [
                'year_added', 'genres_list', 'countries_list', 'cast_list',
                'duration_num', 'genre_count', 'country_count', 'cast_count',
                'has_director', 'primary_genre', 'primary_country'
            ]
        }
