import fs from 'fs';
import path from 'path';

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

const CORRELATION_COUNTRIES = ['United States', 'India', 'United Kingdom', 'Canada', 'France'];
const TOP_N_COUNTRIES = 5;
const TOP_N_RATINGS = 10;
const TOP_N_GENRES = 30;
const YEAR_RANGE_START = 2008;
const YEAR_RANGE_END = 2021;
const SCATTER_SAMPLE_SIZE = 500;
const SCATTER_MIN_YEAR = 2000;

const DURATION_RANGES = [
  { range: '0-30', min: 0, max: 30 },
  { range: '31-60', min: 31, max: 60 },
  { range: '61-90', min: 61, max: 90 },
  { range: '91-120', min: 91, max: 120 },
  { range: '121-150', min: 121, max: 150 },
  { range: '151+', min: 151, max: Infinity },
] as const;

const NUMERIC_FIELDS = new Set(['release_year', 'duration_num', 'year_added', 'month_added']);

let cachedRecords: NetflixRecord[] | null = null;
let cachedStats: NetflixStats | null = null;
let cachedChartData: ChartData | null = null;

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let inQuotes = false;
  let currentField = '';
  let currentRow: string[] = [];

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
      if (char !== ',') {
        rows.push(currentRow);
        currentRow = [];
      }
    } else {
      currentField += char;
    }
  }

  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
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
      const header = headers[j];
      const rawValue = row[j] ?? '';

      if (NUMERIC_FIELDS.has(header)) {
        const num = Number(rawValue);
        record[header] = Number.isFinite(num) ? num : 0;
      } else {
        record[header] = rawValue;
      }
    }

    records.push(record as unknown as NetflixRecord);
  }

  cachedRecords = records;
  return records;
}

function countBy<T extends object>(items: T[], key: keyof T): Record<string, number> {
  const counts: Record<string, number> = {};
  items.forEach((item) => {
    const value = item[key];
    if (value) {
      const k = String(value);
      counts[k] = (counts[k] || 0) + 1;
    }
  });
  return counts;
}

function topEntries(counts: Record<string, number>, n: number): { name: string; value: number }[] {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([name, value]) => ({ name, value }));
}

export function computeStats(): NetflixStats {
  if (cachedStats) return cachedStats;

  const records = getNetflixRecords();

  const total = records.length;
  const movieCount = records.filter((r) => r.type === 'Movie').length;
  const tvCount = records.filter((r) => r.type === 'TV Show').length;
  const moviePercent = Math.round((movieCount / total) * 100);

  const movies = records.filter((r) => r.type === 'Movie' && r.duration_num > 0);
  const avgDuration =
    movies.length > 0
      ? Math.round(movies.reduce((sum, r) => sum + r.duration_num, 0) / movies.length)
      : 0;

  const yearCounts = countBy(records, 'release_year');
  const peakYear = Number(
    Object.entries(yearCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 2019,
  );

  const countryCounts: Record<string, number> = {};
  records.forEach((r) => {
    if (r.primary_country && r.primary_country !== 'Unknown') {
      countryCounts[r.primary_country] = (countryCounts[r.primary_country] || 0) + 1;
    }
  });
  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_N_COUNTRIES)
    .map(([country, count]) => ({ country, count }));

  cachedStats = { total, movieCount, tvCount, moviePercent, avgDuration, peakYear, topCountries };
  return cachedStats;
}

function pearson(arr1: number[], arr2: number[]): number {
  const n = Math.min(arr1.length, arr2.length);
  if (n === 0) return 0;

  let sum1 = 0;
  let sum2 = 0;
  let sum1Sq = 0;
  let sum2Sq = 0;
  let pSum = 0;

  for (let i = 0; i < n; i++) {
    const x = arr1[i];
    const y = arr2[i];
    sum1 += x;
    sum2 += y;
    sum1Sq += x * x;
    sum2Sq += y * y;
    pSum += x * y;
  }

  const num = pSum - (sum1 * sum2) / n;
  const den = Math.sqrt((sum1Sq - (sum1 * sum1) / n) * (sum2Sq - (sum2 * sum2) / n));

  return den === 0 ? 0 : num / den;
}

function computeTypeDistribution(records: NetflixRecord[]) {
  return [
    { name: 'Movie', value: records.filter((r) => r.type === 'Movie').length },
    { name: 'TV Show', value: records.filter((r) => r.type === 'TV Show').length },
  ];
}

function computeRatingDistribution(records: NetflixRecord[]) {
  const ratingCounts = countBy(records, 'rating');
  return topEntries(ratingCounts, TOP_N_RATINGS);
}

function computeYearlyTrends(records: NetflixRecord[]) {
  const yearTypeCounts: Record<number, { movies: number; tvShows: number }> = {};

  records.forEach((r) => {
    const year = r.year_added || r.release_year;
    if (year) {
      if (!yearTypeCounts[year]) yearTypeCounts[year] = { movies: 0, tvShows: 0 };
      if (r.type === 'Movie') {
        yearTypeCounts[year].movies++;
      } else {
        yearTypeCounts[year].tvShows++;
      }
    }
  });

  return Object.entries(yearTypeCounts)
    .filter(([year]) => Number(year) >= YEAR_RANGE_START && Number(year) <= YEAR_RANGE_END)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([year, data]) => ({
      year: Number(year),
      movies: data.movies,
      tvShows: data.tvShows,
    }));
}

function computeDurationHistogram(records: NetflixRecord[]) {
  const buckets = DURATION_RANGES.map((d) => ({ ...d, count: 0 }));

  records
    .filter((r) => r.type === 'Movie' && r.duration_num > 0)
    .forEach((r) => {
      const bucket = buckets.find(
        (d) => r.duration_num >= d.min && r.duration_num <= d.max,
      );
      if (bucket) bucket.count++;
    });

  return buckets.map((d) => ({ range: d.range, count: d.count }));
}

function computeGenreWordCloud(records: NetflixRecord[]) {
  const genreCounts: Record<string, number> = {};

  records.forEach((r) => {
    if (r.listed_in) {
      r.listed_in.split(',').forEach((g) => {
        const genre = g.trim();
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    }
  });

  return topEntries(genreCounts, TOP_N_GENRES);
}

function computeScatterData(records: NetflixRecord[]) {
  return records
    .filter(
      (r) =>
        r.type === 'Movie' && r.duration_num > 0 && r.release_year >= SCATTER_MIN_YEAR,
    )
    .slice(0, SCATTER_SAMPLE_SIZE)
    .map((r) => ({ x: r.release_year, y: r.duration_num, name: r.title }));
}

function computeCorrelationMatrix(records: NetflixRecord[]) {
  const matrix: number[][] = [];

  for (let i = 0; i < CORRELATION_COUNTRIES.length; i++) {
    const row: number[] = [];
    for (let j = 0; j < CORRELATION_COUNTRIES.length; j++) {
      const c1Records = records.filter(
        (r) => r.primary_country === CORRELATION_COUNTRIES[i] && r.type === 'Movie' && r.duration_num > 0,
      );
      const c2Records = records.filter(
        (r) => r.primary_country === CORRELATION_COUNTRIES[j] && r.type === 'Movie' && r.duration_num > 0,
      );
      const vals1 = c1Records.map((r) => r.duration_num);
      const vals2 = c2Records.map((r) => r.duration_num);
      row.push(Number(pearson(vals1, vals2).toFixed(2)));
    }
    matrix.push(row);
  }

  return matrix;
}

function computeTopCountries(records: NetflixRecord[], n: number) {
  const countryCounts: Record<string, number> = {};
  records.forEach((r) => {
    if (r.primary_country && r.primary_country !== 'Unknown') {
      countryCounts[r.primary_country] = (countryCounts[r.primary_country] || 0) + 1;
    }
  });
  return Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([country, count]) => ({ country, value: count }));
}

export function computeChartData(): ChartData {
  if (cachedChartData) return cachedChartData;

  const records = getNetflixRecords();

  const typeDistribution = computeTypeDistribution(records);
  const ratingDistribution = computeRatingDistribution(records);
  const yearlyTrends = computeYearlyTrends(records);
  const durationHistogram = computeDurationHistogram(records);
  const genreWordCloud = computeGenreWordCloud(records);
  const scatterData = computeScatterData(records);
  const correlationMatrix = computeCorrelationMatrix(records);
  const radarData = computeTopCountries(records, 6);
  const stackedAreaData = yearlyTrends;
  const treemapData = radarData.map((d) => ({ name: d.country, value: d.value }));

  cachedChartData = {
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

  return cachedChartData;
}

export function getAllData() {
  return {
    stats: computeStats(),
    chartData: computeChartData(),
  };
}
