"""
Configuration settings for Netflix analysis package.
"""

from dataclasses import dataclass
from typing import List, Set


@dataclass
class Settings:
    """Global configuration settings."""
    
    # Data paths
    RAW_DATA_PATH: str = 'netflix_titles.csv'
    CLEANED_DATA_PATH: str = 'netflix_titles_cleaned.csv'
    OUTPUT_DIR: str = 'data'
    
    # Analysis parameters
    TEST_SIZE: float = 0.2
    RANDOM_STATE: int = 42
    BEST_K_CLUSTERS: int = 4
    
    # Visualization settings
    CHART_THEME: str = 'dark'
    CHART_WIDTH: str = '100%'
    CHART_HEIGHT: str = '500px'
    ECHARTS_VERSION: str = '5.4.3'
    
    # Valid ratings for filtering
    VALID_RATINGS: Set[str] = frozenset([
        'TV-MA', 'TV-14', 'TV-PG', 'TV-G', 'TV-Y', 'TV-Y7', 'TV-Y7-FV',
        'G', 'PG', 'PG-13', 'R', 'NC-17', 'NR', 'UR'
    ])
    
    # Top N counts
    TOP_COUNTRIES_COUNT: int = 15
    TOP_GENRES_COUNT: int = 10
    TOP_RATINGS_COUNT: int = 10
    
    # Color scheme (Netflix brand colors)
    COLORS: dict = None
    
    def __post_init__(self):
        if self.COLORS is None:
            self.COLORS = {
                'red': '#E50914',
                'red_light': '#FF4444',
                'gold': '#FFD700',
                'teal': '#4ECDC4',
                'bg': '#141414',
                'bg_dark': '#000000'
            }


# Global settings instance
settings = Settings()
