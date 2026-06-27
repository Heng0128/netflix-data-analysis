"""
Data loading module for Netflix dataset.
"""

import pandas as pd
import logging
from typing import Optional
from pathlib import Path

logger = logging.getLogger(__name__)


class DataLoader:
    """Handles loading and initial validation of Netflix data."""
    
    def __init__(self, file_path: str = 'netflix_titles.csv'):
        """
        Initialize the DataLoader.
        
        Args:
            file_path: Path to the CSV file containing Netflix data.
        """
        self.file_path = Path(file_path)
        self.data: Optional[pd.DataFrame] = None
    
    def load(self) -> pd.DataFrame:
        """
        Load the Netflix dataset from CSV.
        
        Returns:
            DataFrame containing the loaded data.
            
        Raises:
            FileNotFoundError: If the specified file doesn't exist.
            ValueError: If required columns are missing.
        """
        if not self.file_path.exists():
            raise FileNotFoundError(f"Data file not found: {self.file_path}")
        
        logger.info(f"Loading data from {self.file_path}")
        self.data = pd.read_csv(self.file_path)
        
        logger.info(f"Loaded {self.data.shape[0]} records with {self.data.shape[1]} columns")
        self._validate_data()
        
        return self.data
    
    def _validate_data(self) -> None:
        """Validate that required columns exist in the dataset."""
        required_columns = [
            'show_id', 'type', 'title', 'director', 'cast', 'country',
            'date_added', 'release_year', 'rating', 'duration', 
            'listed_in', 'description'
        ]
        
        missing_cols = set(required_columns) - set(self.data.columns)
        if missing_cols:
            raise ValueError(f"Missing required columns: {missing_cols}")
        
        logger.info("Data validation passed")
    
    def get_summary(self) -> dict:
        """
        Get a summary of the loaded data.
        
        Returns:
            Dictionary containing data summary statistics.
        """
        if self.data is None:
            raise ValueError("No data loaded. Call load() first.")
        
        return {
            'shape': self.data.shape,
            'columns': self.data.columns.tolist(),
            'dtypes': self.data.dtypes.to_dict(),
            'missing_values': self.data.isnull().sum().to_dict(),
            'memory_usage': self.data.memory_usage(deep=True).sum(),
        }
