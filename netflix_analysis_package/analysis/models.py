"""
Machine learning models module for Netflix dataset.
Includes Linear Regression, K-Means Clustering, and Random Forest Classification.
"""

import pandas as pd
import numpy as np
from typing import Dict, Tuple, List
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    mean_squared_error, r2_score, accuracy_score,
    classification_report, confusion_matrix, silhouette_score
)


class MLModels:
    """Handles machine learning model training and evaluation."""
    
    def __init__(self, data: pd.DataFrame, random_state: int = 42):
        """
        Initialize the MLModels.
        
        Args:
            data: Preprocessed Netflix DataFrame.
            random_state: Random seed for reproducibility.
        """
        self.data = data.copy()
        self.random_state = random_state
        self.models = {}
        self.results = {}
    
    def prepare_regression_data(self, features: List[str] = None) -> Tuple:
        """
        Prepare data for linear regression (predicting movie duration).
        
        Args:
            features: List of feature column names.
            
        Returns:
            Tuple of (X_train, X_test, y_train, y_test, feature_names).
        """
        if features is None:
            features = ['release_year', 'genre_count', 'country_count', 'cast_count']
        
        movies = self.data[self.data['type'] == 'Movie'].copy()
        
        # Drop rows with missing values in target or features
        movies = movies.dropna(subset=['duration_num'] + features)
        
        X = movies[features]
        y = movies['duration_num']
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=self.random_state
        )
        
        return X_train, X_test, y_train, y_test, features
    
    def train_linear_regression(self, features: List[str] = None) -> Dict:
        """
        Train a linear regression model to predict movie duration.
        
        Args:
            features: List of feature column names.
            
        Returns:
            Dictionary containing model results and metrics.
        """
        X_train, X_test, y_train, y_test, feature_names = self.prepare_regression_data(features)
        
        model = LinearRegression()
        model.fit(X_train, y_train)
        
        y_pred = model.predict(X_test)
        
        mse = mean_squared_error(y_test, y_pred)
        rmse = np.sqrt(mse)
        r2 = r2_score(y_test, y_pred)
        
        # Feature importance (coefficients)
        coef_df = pd.DataFrame({
            'feature': feature_names,
            'coefficient': model.coef_,
            'abs_coefficient': np.abs(model.coef_)
        }).sort_values('abs_coefficient', ascending=False)
        
        self.results['linear_regression'] = {
            'model': model,
            'metrics': {
                'mse': float(mse),
                'rmse': float(rmse),
                'r2': float(r2),
            },
            'coefficients': coef_df.to_dict('records'),
            'predictions': {
                'y_test': y_test.values.tolist(),
                'y_pred': y_pred.tolist(),
            }
        }
        
        self.models['linear_regression'] = model
        return self.results['linear_regression']
    
    def prepare_clustering_data(self, features: List[str] = None) -> Tuple:
        """
        Prepare data for K-Means clustering.
        
        Args:
            features: List of feature column names.
            
        Returns:
            Tuple of (scaled_data, original_data, feature_names).
        """
        if features is None:
            features = ['release_year', 'duration_num', 'genre_count', 
                       'country_count', 'cast_count']
        
        movies = self.data[self.data['type'] == 'Movie'].copy()
        cluster_data = movies[features].dropna().copy()
        
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(cluster_data)
        
        return X_scaled, cluster_data, features, scaler
    
    def find_optimal_k(self, k_range: range = range(2, 11)) -> Dict:
        """
        Find optimal number of clusters using elbow method.
        
        Args:
            k_range: Range of k values to test.
            
        Returns:
            Dictionary with inertia values for each k.
        """
        X_scaled, _, _, _ = self.prepare_clustering_data()
        
        inertias = []
        silhouette_scores = []
        
        for k in k_range:
            kmeans = KMeans(n_clusters=k, random_state=self.random_state, n_init=10)
            labels = kmeans.fit_predict(X_scaled)
            inertias.append(kmeans.inertia_)
            silhouette_scores.append(silhouette_score(X_scaled, labels))
        
        self.results['elbow_analysis'] = {
            'k_values': list(k_range),
            'inertias': inertias,
            'silhouette_scores': silhouette_scores,
            'recommended_k': k_range[silhouette_scores.index(max(silhouette_scores))]
        }
        
        return self.results['elbow_analysis']
    
    def train_kmeans(self, n_clusters: int = 4) -> Dict:
        """
        Train K-Means clustering model.
        
        Args:
            n_clusters: Number of clusters.
            
        Returns:
            Dictionary containing clustering results.
        """
        X_scaled, cluster_data, features, scaler = self.prepare_clustering_data()
        
        kmeans = KMeans(n_clusters=n_clusters, random_state=self.random_state, n_init=10)
        labels = kmeans.fit_predict(X_scaled)
        
        silhouette = silhouette_score(X_scaled, labels)
        
        # Cluster profiling
        cluster_data['cluster'] = labels
        profile = cluster_data.groupby('cluster')[features].mean().round(2)
        profile['count'] = cluster_data['cluster'].value_counts().sort_index()
        profile['percentage'] = (profile['count'] / len(cluster_data) * 100).round(2)
        
        self.results['kmeans'] = {
            'model': kmeans,
            'scaler': scaler,
            'n_clusters': n_clusters,
            'silhouette_score': float(silhouette),
            'cluster_profile': profile.to_dict(),
            'labels': labels.tolist(),
        }
        
        self.models['kmeans'] = kmeans
        return self.results['kmeans']
    
    def prepare_classification_data(self) -> Tuple:
        """
        Prepare data for Random Forest classification.
        
        Returns:
            Tuple of (X_train, X_test, y_train, y_test, feature_names).
        """
        ml_data = self.data.copy()
        
        # Encode categorical variables
        le_rating = LabelEncoder()
        le_genre = LabelEncoder()
        le_country = LabelEncoder()
        
        ml_data['rating_enc'] = le_rating.fit_transform(ml_data['rating'])
        ml_data['primary_genre_enc'] = le_genre.fit_transform(ml_data['primary_genre'])
        ml_data['primary_country_enc'] = le_country.fit_transform(ml_data['primary_country'])
        
        features = [
            'release_year', 'year_added', 'duration_num',
            'genre_count', 'country_count', 'cast_count',
            'has_director', 'rating_enc', 'primary_genre_enc', 'primary_country_enc'
        ]
        
        X = ml_data[features]
        y = (ml_data['type'] == 'Movie').astype(int)
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=self.random_state, stratify=y
        )
        
        return X_train, X_test, y_train, y_test, features
    
    def train_random_forest(self, n_estimators: int = 100, max_depth: int = 10) -> Dict:
        """
        Train Random Forest classifier to predict content type.
        
        Args:
            n_estimators: Number of trees in the forest.
            max_depth: Maximum depth of trees.
            
        Returns:
            Dictionary containing classification results.
        """
        X_train, X_test, y_train, y_test, features = self.prepare_classification_data()
        
        rf = RandomForestClassifier(
            n_estimators=n_estimators,
            max_depth=max_depth,
            min_samples_split=5,
            random_state=self.random_state,
            n_jobs=-1
        )
        
        rf.fit(X_train, y_train)
        y_pred = rf.predict(X_test)
        
        accuracy = accuracy_score(y_test, y_pred)
        
        # Feature importance
        importance_df = pd.DataFrame({
            'feature': features,
            'importance': rf.feature_importances_
        }).sort_values('importance', ascending=False)
        
        self.results['random_forest'] = {
            'model': rf,
            'metrics': {
                'accuracy': float(accuracy),
            },
            'classification_report': classification_report(
                y_test, y_pred, 
                target_names=['TV Show', 'Movie'],
                output_dict=True
            ),
            'confusion_matrix': confusion_matrix(y_test, y_pred).tolist(),
            'feature_importance': importance_df.to_dict('records'),
        }
        
        self.models['random_forest'] = rf
        return self.results['random_forest']
    
    def get_all_results(self) -> Dict:
        """Get all model results."""
        return {
            model_name: {k: v for k, v in result.items() if k != 'model'}
            for model_name, result in self.results.items()
        }
