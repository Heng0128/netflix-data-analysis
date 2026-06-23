const fs = require('fs');
const Papa = require('papaparse');

const csvText = fs.readFileSync('netflix_titles_cleaned.csv', 'utf8');
const results = Papa.parse(csvText, { header: true, skipEmptyLines: true });
const data = results.data;

console.log('Total rows:', data.length);
console.log('First row keys:', Object.keys(data[0]));
console.log('Sample type:', data[0].type);
console.log('Sample release_year:', data[0].release_year);
console.log('Sample primary_genre:', data[0].primary_genre);
console.log('Sample rating:', data[0].rating);
console.log('Sample duration_num:', data[0].duration_num);
console.log('Sample primary_country:', data[0].primary_country);

// Count types
const movies = data.filter(r => r.type === 'Movie').length;
const tvShows = data.filter(r => r.type === 'TV Show').length;
console.log('Movies:', movies);
console.log('TV Shows:', tvShows);
