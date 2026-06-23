/**
 * ============================================================
 * Netflix 数据分析看板 - 主脚本
 * 数据链路：netflix_titles_cleaned.csv → PapaParse 解析 → 前端聚合计算 → ECharts 渲染
 * ============================================================
 */

// ===== 导航栏滚动效果 =====
const nav = document.getElementById('nav');
let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
      scrollTicking = false;
    });
    scrollTicking = true;
  }
});
// ===== 滚动入场动画 =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.chart-card').forEach(el => observer.observe(el));

// ===== 加载数据（带 Loading / Error 状态） =====
const loader = document.createElement('div');
loader.id = 'data-loader';
loader.innerHTML = '<div class="spinner"></div><p>正在加载 CSV 数据...</p>';
Object.assign(loader.style, {
  position: 'fixed', inset: 0, zIndex: 9999,
  background: 'rgba(8,8,8,0.92)', backdropFilter: 'blur(12px)',
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  gap: '16px', transition: 'opacity 0.5s'
});
const spinnerCSS = document.createElement('style');
spinnerCSS.textContent = `
#data-loader .spinner { width:40px;height:40px;border:3px solid rgba(229,9,20,0.2);border-top-color:#E50914;border-radius:50%;animation:spin 0.8s linear infinite; }
#data-loader p { color:#999;font-size:14px;letter-spacing:1px; }
@keyframes spin { to{transform:rotate(360deg)} }
`;
document.head.appendChild(spinnerCSS);
document.body.appendChild(loader);

function hideLoader() { loader.style.opacity = '0'; setTimeout(() => loader.remove(), 500); }

function showError(msg) {
  loader.innerHTML = `<div style="color:#E50914;font-size:18px;font-weight:700;margin-bottom:8px;">数据加载失败</div><p style="color:#999;font-size:13px;max-width:400px;text-align:center;line-height:1.6">${msg}</p><button onclick="location.reload()" style="margin-top:20px;padding:10px 28px;background:#E50914;color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-size:13px;">重新加载</button>`;
}

/**
 * 从 CSV 数据计算所有分析指标
 */
function computeAnalysisData(rows) {
  const data = rows;
  
  // ====== 单次遍历完成所有统计 ======
  const countryMap = {};
  const genreMap = {};
  const yearMap = {};
  const ratingMap = {};
  const genreTypeMap = {};
  const seasonMap = {};
  const heatmapData = {};
  const movieDurations = [];
  const directorSet = new Set();
  
  let total = 0, movies = 0, tvshows = 0;
  
  rows.forEach(r => {
    total++;
    const year = parseInt(r.release_year);
    const type = r.type;
    
    // 类型统计
    if (type === 'Movie') {
      movies++;
      const dur = parseFloat(r.duration_num);
      if (!isNaN(dur)) movieDurations.push(dur);
    } else if (type === 'TV Show') {
      tvshows++;
      const seasons = r.duration_num ? parseInt(r.duration_num) : 0;
      if (seasons > 0) {
        const key = seasons >= 6 ? '6+' : String(seasons);
        seasonMap[key] = (seasonMap[key] || 0) + 1;
      }
    }
    
    // 国家统计
    if (r.primary_country && r.primary_country !== 'Unknown') {
      countryMap[r.primary_country] = (countryMap[r.primary_country] || 0) + 1;
    }
    
    // 流派统计
    const genre = r.primary_genre || 'Unknown';
    if (r.primary_genre) {
      genreMap[genre] = (genreMap[genre] || 0) + 1;
    }
    
    // 流派×类型
    if (!genreTypeMap[genre]) genreTypeMap[genre] = { movie: 0, tvshow: 0 };
    if (type === 'Movie') genreTypeMap[genre].movie++;
    else genreTypeMap[genre].tvshow++;
    
    // 年度趋势（2008 年起）
    if (year >= 2008) {
      if (!yearMap[year]) yearMap[year] = { Movie: 0, 'TV Show': 0 };
      yearMap[year][type]++;
    }
    
    // 评级
    if (r.rating) {
      ratingMap[r.rating] = (ratingMap[r.rating] || 0) + 1;
    }
    
    // 热力图
    if (year >= 2008 && r.rating) {
      const key = `${year}-${r.rating}`;
      heatmapData[key] = (heatmapData[key] || 0) + 1;
    }
    
    // 导演
    if (r.director && r.director !== 'Unknown') {
      directorSet.add(r.director);
    }
  });
  
  const countries = Object.entries(countryMap)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);
  

  const genres = Object.entries(genreMap)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  const type_dist = [
    { type: 'Movie', count: movies, percentage: +(movies / total * 100).toFixed(2) },
    { type: 'TV Show', count: tvshows, percentage: +(tvshows / total * 100).toFixed(2) }
  ];
  

  const year_trend = Object.entries(yearMap)
    .map(([year, counts]) => ({
      year: parseInt(year),
      Movie: counts.Movie,
      'TV Show': counts['TV Show'],
      total: counts.Movie + counts['TV Show']
    }))
    .sort((a, b) => a.year - b.year);
  

  const ratings = Object.entries(ratingMap)
    .map(([rating, count]) => ({ rating, count }))
    .sort((a, b) => b.count - a.count);
  
  // movieDurations already collected in single loop above
  
  const duration_stats = {
    mean: movieDurations.reduce((a, b) => a + b, 0) / movieDurations.length || 0,
    median: 0,
    min: Math.min(...movieDurations),
    max: Math.max(...movieDurations),
    count: movieDurations.length
  };
  
  // 计算中位数
  const sortedDurs = [...movieDurations].sort((a, b) => a - b);
  const mid = Math.floor(sortedDurs.length / 2);
  duration_stats.median = sortedDurs.length % 2 === 0 
    ? (sortedDurs[mid - 1] + sortedDurs[mid]) / 2 
    : sortedDurs[mid];
  
  // 时长直方图
  const bins = [
    ['0-15', 0, 15], ['15-30', 15, 30], ['30-45', 30, 45], ['45-60', 45, 60],
    ['60-75', 60, 75], ['75-90', 75, 90], ['90-105', 90, 105], ['105-120', 105, 120],
    ['120-135', 120, 135], ['135-150', 135, 150], ['150-165', 150, 165],
    ['165-180', 165, 180], ['180-195', 180, 195], ['195-210', 195, 210],
    ['210-225', 210, 225], ['225-240', 225, 240], ['240-255', 240, 255],
    ['255-270', 255, 270], ['270-285', 270, 285], ['285-300', 285, 300],
    ['300-315', 300, 315]
  ];
  
  const BIN_SIZE = 15;
  const duration_histogram = bins.map(b => ({ range: b[0], count: 0 }));
  movieDurations.forEach(d => {
    const binIdx = Math.min(Math.floor(d / BIN_SIZE), bins.length - 1);
    if (binIdx >= 0) duration_histogram[binIdx].count++;
  });
  
  const genre_type_breakdown = Object.entries(genreTypeMap)
    .map(([genre, counts]) => ({ genre, ...counts }))
    .sort((a, b) => (b.movie + b.tvshow) - (a.movie + a.tvshow))
    .slice(0, 10);
  

  const season_distribution = Object.entries(seasonMap)
    .map(([seasons, count]) => ({ seasonNum: parseInt(seasons) || seasons, count }))
    .sort((a, b) => (typeof a.seasonNum === 'number' ? a.seasonNum : 99) - (typeof b.seasonNum === 'number' ? b.seasonNum : 99));
  

  
  const hmYears = [...new Set(Object.keys(heatmapData).map(k => parseInt(k.split('-')[0])))].sort((a, b) => a - b);
  const hmRatings = [...new Set(Object.keys(heatmapData).map(k => k.split('-')[1]))].sort();
  
  const heatmap_data = [];
  const heatmap_meta = { years: hmYears, ratings: hmRatings };
  
  hmYears.forEach(year => {
    hmRatings.forEach(rating => {
      const count = heatmapData[`${year}-${rating}`] || 0;
      if (count > 0) heatmap_data.push({ year, rating, count });
    });
  });
  
  const directors = directorSet.size;
  
  return {
    overview: {
      total,
      movies,
      tvshows,
      countries: Object.keys(countryMap).length,
      genres: Object.keys(genreMap).length,
      directors
    },
    type_dist,
    year_trend,
    countries,
    genres,
    ratings,
    duration_stats,
    duration_histogram,
    genre_type_breakdown,
    season_distribution,
    heatmap_data,
    heatmap_meta
  };
}

function loadData() {
  return fetch('netflix_titles_cleaned.csv')
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.text();
    })
    .then(csvText => {
      return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors && results.errors.length > 0) {
              console.warn('CSV parsing warnings:', results.errors);
            }
            try {
              const analysisData = computeAnalysisData(results.data);
              resolve(analysisData);
            } catch (err) {
              reject(err);
            }
          },
          error: (err) => reject(err)
        });
      });
    })
    .catch(err => {
      console.error('Data load error:', err);
      showError(err.message || '无法加载 CSV 数据文件，请确认网络连接正常后重试。');
      throw err;
    });
}

// ===== 数字动画 =====
function animateNumbers(overview) {
  const values = [overview.total, overview.movies, overview.tvshows, overview.countries, overview.genres, overview.directors];
  document.querySelectorAll('#overviewGrid .value').forEach((el, i) => {
    const target = values[i];
    const duration = 2000;
    const startTime = performance.now();
    function step(now) {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = Math.floor(target * eased).toLocaleString();
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(step);
  });
}

// ===== ECharts 通用配置 =====
const palette = ['#E50914','#FF6B6B','#FFD700','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD','#A29BFE','#81ECEC'];

const tooltipStyle = {
  backgroundColor: 'rgba(10, 10, 10, 0.96)',
  borderColor: 'rgba(229, 9, 20, 0.4)',
  borderWidth: 1,
  textStyle: { color: '#fff', fontSize: 13 },
  extraCssText: 'box-shadow: 0 8px 32px rgba(229, 9, 20, 0.25); border-radius: 12px; backdrop-filter: blur(10px);'
};

const axisStyle = {
  axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
  axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },
  splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)', type: 'dashed' } }
};

// ===== Canvas 渲染优化配置 =====
const DPR = Math.min(window.devicePixelRatio || 1, 2);
const chartInstances = [];

/** 统一初始化图表（高清 + 脏矩形优化） */
function initChart(elId) {
  const el = document.getElementById(elId);
  if (!el) return null;
  const inst = echarts.init(el, null, {
    renderer: 'canvas',
    devicePixelRatio: DPR,
    useDirtyRect: true,
  });
  chartInstances.push(inst);
  return inst;
}

/** 统一防抖 ResizeObserver */
function setupResizeObserver() {
  let rafId = null;
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      chartInstances.forEach(c => { try { c.resize(); } catch(e) {} });
    });
  });
  chartInstances.forEach(c => {
    const dom = c.getDom();
    if (dom) ro.observe(dom.parentElement || dom);
  });
}

function renderAll(d) {
  animateNumbers(d.overview);

  // ==== 图 1：环形图 ====
  const c1 = initChart('chart1');
  c1.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', ...tooltipStyle, formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, textStyle: { color: 'rgba(255,255,255,0.6)', fontSize: 13 }, itemGap: 30, icon: 'roundRect' },
    series: [{
      name: '内容类型', type: 'pie',
      radius: ['48%', '78%'], center: ['50%', '45%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 10, borderColor: 'rgba(8,8,8,0.8)', borderWidth: 4 },
      label: { color: '#fff', formatter: '{b}\\n{d}%', fontSize: 14, fontWeight: 600, lineHeight: 22 },
      emphasis: { scaleSize: 12, itemStyle: { shadowBlur: 30, shadowColor: 'rgba(229, 9, 20, 0.5)' } },
      data: d.type_dist.map((x, i) => ({
        name: x.type === 'Movie' ? '电影' : '电视节目',
        value: x.count,
        itemStyle: { color: i === 0 ? new echarts.graphic.LinearGradient(0, 0, 1, 1, [{ offset: 0, color: '#E50914' }, { offset: 1, color: '#FF4444' }]) : new echarts.graphic.LinearGradient(0, 0, 1, 1, [{ offset: 0, color: '#FFD700' }, { offset: 1, color: '#FFA500' }]) }
      }))
    }]
  });

  // ==== 图 2：趋势折线 ====
  const c2 = initChart('chart2');
  c2.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', ...tooltipStyle, axisPointer: { type: 'cross', label: { backgroundColor: '#E50914' }, crossStyle: { color: '#999' } } },
    legend: { data: ['电影', '电视节目'], top: 0, textStyle: { color: 'rgba(255,255,255,0.6)' }, icon: 'roundRect', itemGap: 24 },
    grid: { left: '3%', right: '3%', top: 50, bottom: 30, containLabel: true },
    xAxis: { type: 'category', data: d.year_trend.map(x => x.year), boundaryGap: false, ...axisStyle },
    yAxis: { type: 'value', ...axisStyle },
    series: [
      {
        name: '电影', type: 'line', smooth: 0.4, symbol: 'circle', symbolSize: 6, showSymbol: false,
        data: d.year_trend.map(x => x.Movie),
        itemStyle: { color: '#E50914' },
        lineStyle: { width: 3, color: '#E50914', shadowBlur: 8, shadowColor: 'rgba(229,9,20,0.3)' },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(229, 9, 20, 0.35)' }, { offset: 0.5, color: 'rgba(229, 9, 20, 0.08)' }, { offset: 1, color: 'rgba(229, 9, 20, 0)' }]) },
        emphasis: { focus: 'series' }
      },
      {
        name: '电视节目', type: 'line', smooth: 0.4, symbol: 'circle', symbolSize: 6, showSymbol: false,
        data: d.year_trend.map(x => x['TV Show']),
        itemStyle: { color: '#FFD700' },
        lineStyle: { width: 3, color: '#FFD700', shadowBlur: 8, shadowColor: 'rgba(255,215,0,0.2)' },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(255, 215, 0, 0.25)' }, { offset: 0.5, color: 'rgba(255, 215, 0, 0.05)' }, { offset: 1, color: 'rgba(255, 215, 0, 0)' }]) },
        emphasis: { focus: 'series' }
      }
    ]
  });

  // ==== 图 3：国家 Top15 ====
  const c3 = initChart('chart3');
  const countries = d.countries.slice().reverse();
  c3.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, ...tooltipStyle },
    grid: { left: '2%', right: '10%', top: 8, bottom: 8, containLabel: true },
    xAxis: { type: 'value', ...axisStyle },
    yAxis: { type: 'category', data: countries.map(x => x.country), axisLine: { show: false }, axisLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12 } },
    series: [{
      type: 'bar',
      data: countries.map((x, i) => ({
        value: x.count,
        itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: 'rgba(131, 16, 16, 0.6)' }, { offset: 1, color: '#E50914' }]), borderRadius: [0, 8, 8, 0] }
      })),
      barWidth: '52%',
      label: { show: true, position: 'right', color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: 11, fontFamily: 'Inter' },
      emphasis: { itemStyle: { shadowBlur: 15, shadowColor: 'rgba(229,9,20,0.4)' } }
    }]
  });

  // ==== 图 4：流派 Top10 ====
  const c4 = initChart('chart4');
  const genres = d.genres.slice().reverse();
  c4.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, ...tooltipStyle },
    grid: { left: '2%', right: '12%', top: 8, bottom: 8, containLabel: true },
    xAxis: { type: 'value', ...axisStyle },
    yAxis: { type: 'category', data: genres.map(x => x.genre), axisLine: { show: false }, axisLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11 } },
    series: [{
      type: 'bar',
      data: genres.map((x, i) => ({
        value: x.count,
        itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: 'rgba(78, 205, 196, 0.5)' }, { offset: 1, color: '#4ECDC4' }]), borderRadius: [0, 8, 8, 0] }
      })),
      barWidth: '52%',
      label: { show: true, position: 'right', color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: 11, fontFamily: 'Inter' },
      emphasis: { itemStyle: { shadowBlur: 15, shadowColor: 'rgba(78,205,196,0.4)' } }
    }]
  });

  // ==== 图 5：评级漏斗 ====
  const c5 = initChart('chart5');
  c5.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', ...tooltipStyle, formatter: '{b}: {c} ({d}%)' },
    legend: { top: 0, textStyle: { color: 'rgba(255,255,255,0.6)' }, itemGap: 12, icon: 'circle', itemWidth: 10 },
    series: [{
      name: '评级', type: 'funnel',
      top: 50, left: '8%', width: '84%',
      minSize: '18%', maxSize: '100%',
      sort: 'descending', gap: 3,
      label: { show: true, position: 'inside', color: '#fff', fontWeight: 700, formatter: '{b}\\n{c}', fontSize: 12, lineHeight: 20 },
      labelLine: { show: false },
      itemStyle: { borderColor: 'rgba(8,8,8,0.8)', borderWidth: 3, borderRadius: 6 },
      emphasis: { label: { fontSize: 14 } },
      data: d.ratings.map((x, i) => ({ name: x.rating, value: x.count, itemStyle: { color: palette[i % palette.length] } }))
    }]
  });

  // ==== 图 6：电影时长直方图 ====
  const c6 = initChart('chart6');
  const durStats = d.duration_stats;
  const histData = d.duration_histogram || [];
  const activeBins = histData.filter(b => b.count > 5);
  const meanBinIdx = activeBins.findIndex(b => {
    const mid = parseInt(b.range.split('-')[0]) + 7.5;
    return mid >= durStats.mean && mid < durStats.mean + 15;
  });
  c6.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', ...tooltipStyle, axisPointer: { type: 'shadow' }, formatter: p => `${p[0].name} min<br/>电影数：<b>${p[0].value}</b>` },
    grid: { left: '3%', right: '3%', top: 35, bottom: 30, containLabel: true },
    xAxis: { type: 'category', data: activeBins.map(b => b.range), ...axisStyle, axisLabel: { ...axisStyle.axisLabel, rotate: 45, fontSize: 10 } },
    yAxis: { type: 'value', ...axisStyle },
    series: [{
      type: 'bar',
      data: activeBins.map((b, i) => ({
        value: b.count,
        itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#FF6B6B' }, { offset: 1, color: '#E50914' }]), borderRadius: [5, 5, 0, 0] }
      })),
      barWidth: '72%',
      markLine: {
        silent: true, symbol: 'none',
        lineStyle: { color: '#FFD700', type: 'dashed', width: 2 },
        label: { color: '#FFD700', fontFamily: 'Inter', fontWeight: 600, fontSize: 11, formatter: `Mean ${Math.round(durStats.mean)}min` },
        data: [{ xAxis: meanBinIdx >= 0 ? meanBinIdx : 8 }]
      }
    }]
  });

  // ==== 图 7：流派 × 类型 堆叠 ====
  const c7 = initChart('chart7');
  const gtData = d.genre_type_breakdown || [];
  c7.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, ...tooltipStyle },
    legend: { top: 0, textStyle: { color: 'rgba(255,255,255,0.6)' }, icon: 'roundRect', itemGap: 24 },
    grid: { left: '2%', right: '3%', top: 40, bottom: 50, containLabel: true },
    xAxis: { type: 'category', data: gtData.map(x => x.genre), ...axisStyle, axisLabel: { ...axisStyle.axisLabel, rotate: 20, fontSize: 10, color: 'rgba(255,255,255,0.6)' } },
    yAxis: { type: 'value', ...axisStyle },
    series: [
      {
        name: '电影', type: 'bar', stack: 'total', barWidth: '50%',
        itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#E50914' }, { offset: 1, color: '#831010' }]), borderRadius: [0, 0, 0, 0] },
        emphasis: { focus: 'series' },
        data: gtData.map(x => x.movie)
      },
      {
        name: '电视节目', type: 'bar', stack: 'total', barWidth: '50%',
        itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#4ECDC4' }, { offset: 1, color: '#2E8B8B' }]), borderRadius: [6, 6, 0, 0] },
        emphasis: { focus: 'series' },
        data: gtData.map(x => x.tvshow)
      }
    ]
  });

  // ==== 图 8：季数玫瑰图 ====
  const c8 = initChart('chart8');
  const seasonData = (d.season_distribution || []).map(s => ({
    name: typeof s.seasonNum === 'number' ? `${s.seasonNum} Season` : s.seasonNum,
    value: s.count
  }));
  c8.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', ...tooltipStyle, formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', right: 10, top: 'middle', textStyle: { color: 'rgba(255,255,255,0.6)', fontSize: 12 }, icon: 'circle', itemGap: 12 },
    series: [{
      name: '季数分布', type: 'pie',
      radius: ['22%', '78%'], center: ['38%', '50%'],
      roseType: 'radius',
      itemStyle: { borderRadius: 8, borderColor: 'rgba(8,8,8,0.8)', borderWidth: 3 },
      label: { color: 'rgba(255,255,255,0.8)', fontSize: 12, formatter: '{b}: {c}', fontWeight: 500 },
      emphasis: { scaleSize: 10, itemStyle: { shadowBlur: 20, shadowColor: 'rgba(255,215,0,0.4)' } },
      data: seasonData.map((x, i) => ({
        ...x,
        itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [{ offset: 0, color: palette[i % palette.length] }, { offset: 1, color: '#fff' }]) }
      }))
    }]
  });

  // ==== 图 9：热力图 ====
  const c9 = initChart('chart9');
  const hmMeta = d.heatmap_meta || { years: [], ratings: [] };
  const hmData = (d.heatmap_data || []).map(pt => [hmMeta.years.indexOf(pt.year), hmMeta.ratings.indexOf(pt.rating), pt.count]);
  c9.setOption({
    backgroundColor: 'transparent',
    tooltip: { ...tooltipStyle, position: 'top', formatter: p => { const yearIdx = p.data[0]; const ratingIdx = p.data[1]; const actualYear = hmMeta.years[yearIdx]; const actualRating = hmMeta.ratings[ratingIdx]; return `${actualYear} 年 / ${actualRating}<br/>数量：<b>${p.data[2]}</b>`; } },
    grid: { left: '4%', right: '8%', top: 8, bottom: 30, containLabel: true },
    xAxis: { type: 'category', data: hmMeta.years, splitArea: { show: false }, ...axisStyle, axisLabel: { ...axisStyle.axisLabel, rotate: 45, fontSize: 9 } },
    yAxis: { type: 'category', data: hmMeta.ratings, splitArea: { show: false }, ...axisStyle },
    visualMap: { min: 0, max: Math.max(...hmData.map(d => d[2]), 1), calculable: true, orient: 'horizontal', left: 'center', bottom: 0, itemWidth: 10, itemHeight: 10, textStyle: { color: '#999', fontSize: 10 }, inRange: { color: ['#083344', '#4ECDC4', '#FFD700', '#E50914'] } },
    series: [{ type: 'heatmap', data: hmData, label: { show: false }, emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' } } }]
  });

  // 启动统一 Resize Observer
  setupResizeObserver();
  hideLoader();
}

// ===== 启动 =====
loadData().then(renderAll).catch(err => { console.error('Bootstrap error:', err); });
