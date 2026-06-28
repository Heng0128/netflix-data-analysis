import fs from 'fs';
import path from 'path';

import type { NetflixRecord } from '@/lib/netflix-data';
import type { NetflixStats } from '@/lib/netflix-data';
import type { ChartData } from '@/lib/netflix-data';

export interface NetflixRecord {
  show_id: string;
  type: 'Movie' | 'TV Show';
  title: string;
  director: string;
  cast: string;
  country: string;
  date_added: string;
  release_year: number;
  rating: string;
  duration: string;
  listed_in: string;
  description: string;
  duration_num: number;
  date_added_parsed: string;
  year_added: number;
  month_added: number;
  primary_country: string;
}

export interface NetflixStats {
  total: number;
  movieCount: number;
  tvCount: number;
  moviePercent: number;
  avgDuration: number;
  peakYear: number;
  topCountries: { country: string; count: number }[];
}

export interface ChartData {
  typeDistribution: { name: string; value: number }[];
  ratingDistribution: { name: string; value: number }[];
  yearlyTrends: { year: number; movies: number; tvShows: number }[];
  durationHistogram: { range: string; count: number }[];
  genreWordCloud: { name: string; value: number }[];
  scatterData: { x: number; y: number; name: string }[];
  correlationMatrix: number[][];
  radarData: { country: string; value: number }[];
  stackedAreaData: { year: number; movies: number; tvShows: number }[];
  treemapData: { name: string; value: number }[];
}

let cachedRecords: NetflixRecord[] | null = null;

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let inQuotes = false;
  let currentField = '';
  const currentRow: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if ((char === ',' || char === '\n' || (char === '\r' && nextChar === '\n')) && !inQuotes) {
      if (char === '\r') i++;
      currentRow.push(currentField.trim());
      currentField = '';
      if (char === ',' && currentRow.length > 0 && !currentRow[currentRow.length - 1]) {
        i++;
      }
    } else {
      currentField += char;
    }
  }
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
  }
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  return rows;
}

export function getNetflixRecords(): NetflixRecord[] {
  if (cachedRecords) return cachedRecords;

  const csvPath = path.join(process.cwd(), 'public', 'netflix_titles_cleaned.csv');
  const csvText = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(csvText);

  const headers = rows[0];
  const records: NetflixRecord[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const record: Record<string, unknown> = {};

    for (let j = 0; j < headers.length; j++) {
      record[headers[j]] = row[j] || '';
    }

    records.push(record as NetflixRecord);
  }

  cachedRecords = records;
  return records;
}

export function computeStats(): NetflixStats {
  const records = getNetflixRecords();

  const total = records.length;
  const movieCount = records.filter(r => r.type === 'Movie').length;
  const tvCount = records.filter(r => r.type === 'TV Show').length;
  const moviePercent = Math.round((movieCount / total) * 100);

  const movies = records.filter(r => r.type === 'Movie' && r.duration_num > 0);
  const avgDuration = movies.length > 0
    ? Math.round(movies.reduce((sum, r) => sum + r.duration_num, 0) / movies.length)
    : 0;

  const yearCounts: Record<number, number> = {};
  records.forEach(r => {
    if (r.release_year) {
      yearCounts[r.release_year] = (yearCounts[r.release_year] || 0) + 1;
    }
  });
  const peakYear = Object.entries(yearCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 2019;

  const countryCounts: Record<string, number> = {};
  records.forEach(r => {
    if (r.primary_country && r.primary_country !== '未知') {
      countryCounts[r.primary_country] = (countryCounts[r.primary_country] || 0) + 1;
    }
  });
  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([country, count]) => ({ country, count }));

  return { total, movieCount, tvCount, moviePercent, avgDuration, peakYear: Number(peakYear), topCountries };
}

function pearson(arr1: number[], arr2: number[]): number {
  const n = arr1.length;
  if (n === 0) return 0;

  const sum1 = arr1.reduce((a, b) => a + b, 0);
  const sum2 = arr2.reduce((a, b) => a + b, 0);
  const sum1Sq = arr1.reduce((a, b) => a + b * b, 0);
  const sum2Sq = arr2.reduce((a, b) => a + b * b, 0);
  const pSum = arr1.reduce((a, b, i) => a + b * arr2[i], 0);

  const num = pSum - (sum1 * sum2) / n;
  const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));

  return den === 0 ? 0 : num / den;
}

export function computeChartData(): ChartData {
  const records = getNetflixRecords();

  const typeDistribution = [
    { name: 'Movie', value: records.filter(r => r.type === 'Movie').length },
    { name: 'TV Show', value: records.filter(r => r.type === 'TV Show').length },
  ];

  const ratingCounts: Record<string, number> = {};
  records.forEach(r => {
    if (r.rating) ratingCounts[r.rating] = (ratingCounts[r.rating] || 0) + 1;
  });
  const ratingDistribution = Object.entries(ratingCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }));

  const yearTypeCounts: Record<number, { movies: number; tvShows: number }> = {};
  records.forEach(r => {
    const year = r.year_added || r.release_year;
    if (year) {
      if (!yearTypeCounts[year]) yearTypeCounts[year] = { movies: 0, tvShows: 0 };
      if (r.type === 'Movie') yearTypeCounts[year].movies++;
      else yearTypeCounts[year].tvShows++;
    }
  });
  const yearlyTrends = Object.entries(yearTypeCounts)
    .filter(([year]) => Number(year) >= 2008 && Number(year) <= 2021)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([year, data]) => ({ year: Number(year), movies: data.movies, tvShows: data.tvShows }));

  const durationRanges = [
    { range: '0-30', min: 0, max: 30, count: 0 },
    { range: '31-60', min: 31, max: 60, count: 0 },
    { range: '61-90', min: 61, max: 90, count: 0 },
    { range: '91-120', min: 91, max: 120, count: 0 },
    { range: '121-150', min: 121, max: 150, count: 0 },
    { range: '151+', min: 151, max: Infinity, count: 0 },
  ];
  records.filter(r => r.type === 'Movie' && r.duration_num > 0).forEach(r => {
    const bucket = durationRanges.find(d => r.duration_num >= d.min && r.duration_num <= d.max);
    if (bucket) bucket.count++;
  });
  const durationHistogram = durationRanges.map(d => ({ range: d.range, count: d.count }));

  const genreCounts: Record<string, number> = {};
  records.forEach(r => {
    if (r.listed_in) {
      r.listed_in.split(',').forEach(g => {
        const genre = g.trim();
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    }
  });
  const genreWordCloud = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([name, value]) => ({ name, value }));

  const scatterData = records
    .filter(r => r.type === 'Movie' && r.duration_num > 0 && r.release_year >= 2000)
    .slice(0, 500)
    .map(r => ({ x: r.release_year, y: r.duration_num, name: r.title }));

  const countries = ['United States', 'India', 'United Kingdom', 'Canada', 'France'];
  const matrix: number[][] = [];
  for (let i = 0; i < countries.length; i++) {
    const row: number[] = [];
    for (let j = 0; j < countries.length; j++) {
      const c1Records = records.filter(r => r.primary_country === countries[i] && r.type === 'Movie' && r.duration_num > 0);
      const c2Records = records.filter(r => r.primary_country === countries[j] && r.type === 'Movie' && r.duration_num > 0);
      const vals1 = c1Records.map(r => r.duration_num);
      const vals2 = c2Records.map(r => r.duration_num);
      row.push(Number(pearson(vals1, vals2).toFixed(2)));
    }
    matrix.push(row);
  }
  const correlationMatrix = matrix;

  const topCountriesForRadar = Object.entries(
    records.reduce((acc, r) => {
      if (r.primary_country && r.primary_country !== '未知') {
        acc[r.primary_country] = (acc[r.primary_country] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const radarData = topCountriesForRadar.map(([country, count]) => ({ country, value: count }));

  const stackedAreaData = yearlyTrends;

  const treemapData = topCountriesForRadar.map(([name, value]) => ({ name, value }));

  return {
    typeDistribution,
    ratingDistribution,
    yearlyTrends,
    durationHistogram,
    genreWordCloud,
    scatterData,
    correlationMatrix,
    radarData,
    stackedAreaData,
    treemapData,
  };
}

export function getAllData() {
  return {
    stats: computeStats(),
    chartData: computeChartData(),
  };
}
