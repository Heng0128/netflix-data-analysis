#!/usr/bin/env python
# coding: utf-8
"""
Netflix Data Analysis - Main Entry Point
=========================================

This script demonstrates the complete Netflix data analysis pipeline
using the refactored modular package structure.

Usage:
    python main.py

The pipeline includes:
    1. Data Loading
    2. Data Preprocessing (missing values, feature engineering, outlier detection)
    3. Statistical Analysis (descriptive stats, correlations)
    4. Machine Learning (Linear Regression, K-Means, Random Forest)
    5. Visualization (pyecharts interactive charts)
    6. Export results to JSON
"""

import json
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def run_analysis():
    """Execute the complete Netflix data analysis pipeline."""
    
    print("=" * 70)
    print("NETFLIX DATA ANALYSIS PIPELINE")
    print("=" * 70)
    
    # Import package modules
    from netflix_analysis_package.data.loader import DataLoader
    from netflix_analysis_package.data.preprocessor import DataPreprocessor
    from netflix_analysis_package.analysis.statistics import StatisticalAnalyzer
    from netflix_analysis_package.analysis.models import MLModels
    from netflix_analysis_package.visualization.charts import ChartGenerator
    
    # ============================================================
    # 1. DATA LOADING
    # ============================================================
    print("\n" + "=" * 70)
    print("1. DATA LOADING")
    print("=" * 70)
    
    loader = DataLoader('netflix_titles.csv')
    df = loader.load()
    print(f"✓ Loaded {df.shape[0]} records with {df.shape[1]} columns")
    
    # ============================================================
    # 2. DATA PREPROCESSING
    # ============================================================
    print("\n" + "=" * 70)
    print("2. DATA PREPROCESSING")
    print("=" * 70)
    
    preprocessor = DataPreprocessor(df)
    preprocessor.handle_missing_values()
    print("✓ Missing values handled")
    
    preprocessor.engineer_features()
    print("✓ Feature engineering completed (11 new features added)")
    
    preprocessor.detect_outliers_iqr()
    preprocessor.detect_outliers_zscore()
    print("✓ Outlier detection completed (IQR and Z-score methods)")
    
    df_processed = preprocessor.get_processed_data()
    
    # Save cleaned data
    df_processed.to_csv('netflix_titles_cleaned.csv', index=False)
    print("✓ Cleaned data saved to netflix_titles_cleaned.csv")
    
    # ============================================================
    # 3. STATISTICAL ANALYSIS
    # ============================================================
    print("\n" + "=" * 70)
    print("3. STATISTICAL ANALYSIS")
    print("=" * 70)
    
    analyzer = StatisticalAnalyzer(df_processed)
    
    # Descriptive statistics
    desc_stats = analyzer.descriptive_statistics()
    print("\n📊 Descriptive Statistics:")
    print(desc_stats.to_string())
    
    # Type distribution
    type_dist = analyzer.type_distribution()
    print(f"\n📊 Content Type Distribution:")
    for idx, row in type_dist.iterrows():
        print(f"   {idx}: {row['count']} ({row['percentage']}%)")
    
    # Top countries
    top_countries = analyzer.top_countries(10)
    print(f"\n🌍 Top 10 Countries:")
    for i, (country, count) in enumerate(top_countries, 1):
        print(f"   {i}. {country}: {count}")
    
    # Top genres
    top_genres = analyzer.top_genres(10)
    print(f"\n🎭 Top 10 Genres:")
    for i, (genre, count) in enumerate(top_genres, 1):
        print(f"   {i}. {genre}: {count}")
    
    # Correlation matrix
    corr_matrix = analyzer.correlation_matrix()
    print(f"\n📈 Correlation Matrix computed")
    
    # ============================================================
    # 4. MACHINE LEARNING
    # ============================================================
    print("\n" + "=" * 70)
    print("4. MACHINE LEARNING MODELS")
    print("=" * 70)
    
    ml = MLModels(df_processed)
    
    # Linear Regression
    print("\n🤖 Training Linear Regression (predicting movie duration)...")
    lr_results = ml.train_linear_regression()
    print(f"   R² Score: {lr_results['metrics']['r2']:.4f}")
    print(f"   RMSE: {lr_results['metrics']['rmse']:.2f} minutes")
    
    # K-Means Clustering
    print("\n🤖 Training K-Means Clustering...")
    kmeans_results = ml.train_kmeans(n_clusters=4)
    print(f"   Silhouette Score: {kmeans_results['silhouette_score']:.4f}")
    print(f"   Number of clusters: {kmeans_results['n_clusters']}")
    
    # Random Forest Classification
    print("\n🤖 Training Random Forest Classifier (predicting content type)...")
    rf_results = ml.train_random_forest()
    print(f"   Accuracy: {rf_results['metrics']['accuracy']:.2%}")
    
    # ============================================================
    # 5. VISUALIZATION
    # ============================================================
    print("\n" + "=" * 70)
    print("5. GENERATING VISUALIZATIONS")
    print("=" * 70)
    
    chart_gen = ChartGenerator(df_processed, theme='dark')
    
    print("\n📊 Creating charts...")
    chart_gen.create_type_pie_chart()
    print("   ✓ Type distribution pie chart")
    
    chart_gen.create_yearly_trend_line()
    print("   ✓ Yearly trend line chart")
    
    chart_gen.create_country_bar_chart()
    print("   ✓ Country bar chart")
    
    chart_gen.create_genre_bar_chart()
    print("   ✓ Genre bar chart")
    
    chart_gen.create_rating_funnel()
    print("   ✓ Rating funnel chart")
    
    chart_gen.create_duration_histogram()
    print("   ✓ Duration histogram")
    
    # Render all charts to a single HTML file
    chart_gen.render_all_to_page('charts.html')
    print(f"\n✓ All charts rendered to charts.html")
    
    # ============================================================
    # 6. EXPORT RESULTS
    # ============================================================
    print("\n" + "=" * 70)
    print("6. EXPORTING RESULTS")
    print("=" * 70)
    
    # Create output directory
    output_dir = Path('data')
    output_dir.mkdir(exist_ok=True)
    
    # Compile all results
    results = {
        'overview': {
            'total_records': int(df_processed.shape[0]),
            'movies': int(df_processed[df_processed['type'] == 'Movie'].shape[0]),
            'tv_shows': int(df_processed[df_processed['type'] == 'TV Show'].shape[0]),
        },
        'preprocessing_report': preprocessor.get_preprocessing_report(),
        'statistical_analysis': analyzer.get_analysis_summary(),
        'ml_results': ml.get_all_results(),
    }
    
    # Save to JSON
    output_file = output_dir / 'complete_analysis.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print(f"✓ Results exported to {output_file}")
    
    # ============================================================
    # SUMMARY
    # ============================================================
    print("\n" + "=" * 70)
    print("🎉 ANALYSIS COMPLETE!")
    print("=" * 70)
    print(f"""
Key Findings:
    • Total Records: {results['overview']['total_records']:,}
    • Movies: {results['overview']['movies']:,} ({results['overview']['movies']/results['overview']['total_records']*100:.1f}%)
    • TV Shows: {results['overview']['tv_shows']:,} ({results['overview']['tv_shows']/results['overview']['total_records']*100:.1f}%)
    
Machine Learning Performance:
    • Linear Regression R²: {lr_results['metrics']['r2']:.4f}
    • K-Means Silhouette: {kmeans_results['silhouette_score']:.4f}
    • Random Forest Accuracy: {rf_results['metrics']['accuracy']:.2%}

Output Files:
    • netflix_titles_cleaned.csv - Cleaned dataset
    • charts.html - Interactive visualizations
    • data/complete_analysis.json - Complete analysis results
""")
    print("=" * 70)


if __name__ == '__main__':
    run_analysis()
