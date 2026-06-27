"""
Netflix Data Analysis Package
=============================
A modular, well-structured package for Netflix content data analysis.

Package Structure:
    - config: Configuration and constants
    - data: Data loading and preprocessing
    - analysis: Statistical analysis and machine learning
    - visualization: Chart generation using pyecharts
    - utils: Utility functions
"""

__version__ = '2.0.0'
__author__ = 'Netflix Analysis Team'

from netflix_analysis_package.config.settings import settings
from netflix_analysis_package.data.loader import DataLoader
from netflix_analysis_package.data.preprocessor import DataPreprocessor
from netflix_analysis_package.analysis.statistics import StatisticalAnalyzer
from netflix_analysis_package.analysis.models import MLModels
from netflix_analysis_package.visualization.charts import ChartGenerator

__all__ = [
    'settings',
    'DataLoader',
    'DataPreprocessor', 
    'StatisticalAnalyzer',
    'MLModels',
    'ChartGenerator',
]
