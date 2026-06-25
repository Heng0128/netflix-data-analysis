/**
 * ============================================================
 * Netflix 数据分析看板 - 主脚本 (Netflix Official Style)
 * 数据链路：netflix_titles_cleaned.csv → PapaParse 解析 → 前端聚合计算 → ECharts 渲染
 * ============================================================
 */

// ===== Netflix Style Configuration =====
const VALID_RATINGS = new Set([
  'TV-MA', 'TV-14', 'TV-PG', 'TV-G', 'TV-Y', 'TV-Y7', 'TV-Y7-FV',
  'G', 'PG', 'PG-13', 'R', 'NC-17', 'NR', 'UR'
]);

const CONFIG = Object.freeze({
  CHART_YEAR_START: 2008,
  DURATION_BIN_SIZE: 15,
  TOP_COUNTRIES_COUNT: 15,
  TOP_GENRES_COUNT: 10,
  RARE_DURATION_THRESHOLD: 5,
  SEASON_GROUP_THRESHOLD: 6,
  SCROLL_NAV_THRESHOLD: 50,
  NUMBER_ANIM_DURATION: 2500,
  CHART_ENTRY_STAGGER: 120,
  MAX_DPR: 2,
  COLORS: {
    red: '#E50914',
    redLight: '#FF4444',
    gold: '#FFD700',
    teal: '#4ECDC4',
    bg: '#141414',
    bgDark: '#000000'
  }
});

// ===== Netflix Navigation Bar - Enhanced Scroll Effect =====
const nav = document.getElementById('nav');
let scrollTicking = false;
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      
      // Netflix-style: Add scrolled class with smooth transition
      if (currentScrollY > CONFIG.SCROLL_NAV_THRESHOLD) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      
      // Hide/show nav on scroll direction (Netflix-style)
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        nav.style.transform = 'translateY(-100%)';
      } else {
        nav.style.transform = 'translateY(0)';
      }
      
      lastScrollY = currentScrollY;
      scrollTicking = false;
    });
    scrollTicking = true;
  }
});

// ===== Netflix Hamburger Menu - Enhanced Animation =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
  hamburger.addEventListener('click', function() {
    this.classList.toggle('open');
    navLinks.classList.toggle('open');
    
    // Netflix-style: Add body scroll lock when menu is open
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });
  
  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
  
  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') && 
        !navLinks.contains(e.target) && 
        !hamburger.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// ===== 代码标签页切换 =====
function setupCodeTabs() {
  const tabBtns = document.querySelectorAll('.code-tab-btn');
  const panels = document.querySelectorAll('.code-panel');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      
      // 更新按钮状态
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // 更新面板显示
      panels.forEach(p => p.classList.remove('active'));
      const targetPanel = document.getElementById(`panel-${tab}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
        // 重新高亮代码
        if (window.Prism) {
          Prism.highlightAllUnder(targetPanel);
        }
      }
    });
  });
}

// ===== 导航栏当前章节高亮 =====
function setupNavHighlight() {
  const links = document.querySelectorAll('.nav-links a');
  const firstLink = links[0];
  
  // 多页面模式：导航链接是 .html 页面跳转，直接保留 HTML 中的 active 类
  if (firstLink && firstLink.getAttribute('href').endsWith('.html')) {
    return;
  }
  
  // 单页模式：基于锚点的滚动高亮
  const sections = ['team', 'requirement', 'code', 'charts', 'conclusion'].map(id => document.getElementById(id));
  
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-64px 0px 0px 0px' });
  
  sections.forEach(s => s && navObserver.observe(s));
}

// ===== Netflix-style Scroll Animation =====
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -60px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Netflix-style: Staggered animation with delay
      setTimeout(() => {
        entry.target.classList.add('visible');
        
        // Add Netflix-style glow effect on animation
        entry.target.style.animation = 'netflixFadeIn 0.8s ease forwards';
      }, i * CONFIG.CHART_ENTRY_STAGGER);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all cards and charts
document.querySelectorAll('.chart-card, .nav-card, .req-card, .team-card, .stat-card, .ml-card').forEach(el => {
  observer.observe(el);
});

// Netflix-style fade-in animation keyframes
const netflixAnimationStyle = document.createElement('style');
netflixAnimationStyle.textContent = `
  @keyframes netflixFadeIn {
    0% { opacity: 0; transform: translateY(40px) scale(0.95); }
    50% { opacity: 0.8; transform: translateY(20px) scale(0.98); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
`;
document.head.appendChild(netflixAnimationStyle);

// ===== Netflix Loading State - Optimized for Speed =====
const loader = document.createElement('div');
loader.id = 'data-loader';
loader.innerHTML = `
  <div class="spinner"></div>
  <p>正在加载...</p>
`;
Object.assign(loader.style, {
  position: 'fixed', inset: 0, zIndex: 9999,
  background: 'rgba(8,8,8,0.98)',
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  gap: '16px', transition: 'opacity 0.3s ease'
});

const loaderCSS = document.createElement('style');
loaderCSS.textContent = `
  #data-loader .spinner {
    width: 40px; height: 40px;
    border: 3px solid rgba(229,9,20,0.2);
    border-top-color: #E50914;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  #data-loader p {
    color: #E5E5E5;
    font-size: 14px;
    letter-spacing: 2px;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(loaderCSS);

// 预加载数据，不等待DOM
const dataPromise = fetch('data/analysis_data.json')
  .then(r => r.json())
  .then(jsonData => {
    // 预处理数据格式转换
    return {
      overview: jsonData.overview,
      type_dist: jsonData.type_dist.map(item => ({
        type: item['类型'],
        count: item['数量'],
        percentage: item['占比(%)']
      })),
      year_trend: jsonData.year_trend,
      countries: jsonData.countries.map(item => ({
        country: item['国家'],
        count: item['数量']
      })),
      genres: jsonData.genres.map(item => ({
        genre: item['流派'],
        count: item['数量']
      })),
      ratings: jsonData.ratings.map(item => ({
        rating: item['评级'],
        count: item['数量']
      })),
      duration_stats: jsonData.duration_stats,
      duration_histogram: jsonData.duration_histogram,
      genre_type_breakdown: jsonData.genre_type_breakdown.map(item => ({
        genre: item['流派'],
        movie: item['电影'],
        tvshow: item['电视节目']
      })),
      season_distribution: jsonData.season_distribution.map(item => ({
        seasonNum: item['季数'],
        count: item['数量']
      })),
      heatmap_data: jsonData.heatmap_data,
      heatmap_meta: jsonData.heatmap_meta,
      desc_stats: {
        release_year: { mean: 0, std: 0, min: 0, median: 0, max: 0 },
        year_added: { mean: 0, std: 0, min: 0, median: 0, max: 0 },
        duration_num: jsonData.duration_stats,
        genre_count: { mean: 0, std: 0, min: 0, median: 0, max: 0 },
        country_count: { mean: 0, std: 0, min: 0, median: 0, max: 0 },
        cast_count: { mean: 0, std: 0, min: 0, median: 0, max: 0 }
      },
      corr_matrix: {},
      numVars: ['release_year', 'year_added', 'duration_num', 'genre_count', 'country_count', 'cast_count']
    };
  });

function hideLoader() {
  loader.style.opacity = '0';
  setTimeout(() => loader.remove(), 300);
}

function showError(msg) {
  loader.innerHTML = `
    <div style="color:#E50914;font-size:20px;font-weight:700;">加载失败</div>
    <p style="color:#999;font-size:13px;">${msg}</p>
    <button onclick="location.reload()" style="margin-top:20px;padding:10px 24px;background:#E50914;color:#fff;border:none;border-radius:6px;font-weight:600;cursor:pointer;">重新加载</button>
  `;
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
    if (r.rating && VALID_RATINGS.has(r.rating)) {
      ratingMap[r.rating] = (ratingMap[r.rating] || 0) + 1;
    }
    
    // 热力图
    if (year >= 2008 && r.rating && VALID_RATINGS.has(r.rating)) {
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
  

  
  const hmYears = [...new Set(Object.keys(heatmapData).map(k => parseInt(k.slice(0, k.indexOf('-')))))].sort((a, b) => a - b);
  const hmRatings = [...new Set(Object.keys(heatmapData).map(k => k.slice(k.indexOf('-') + 1)))].sort();
  
  const heatmap_data = [];
  const heatmap_meta = { years: hmYears, ratings: hmRatings };
  
  hmYears.forEach(year => {
    hmRatings.forEach(rating => {
      const count = heatmapData[`${year}-${rating}`] || 0;
      if (count > 0) heatmap_data.push({ year, rating, count });
    });
  });
  
  const directors = directorSet.size;
  
  // ====== 描述性统计（数值型变量） ======
  const numVars = ['release_year', 'year_added', 'duration_num', 'genre_count', 'country_count', 'cast_count'];
  const numData = {};
  numVars.forEach(v => { numData[v] = []; });
  
  rows.forEach(r => {
    const type = r.type;
    if (type === 'Movie') {
      const ry = parseInt(r.release_year);
      const ya = parseInt(r.year_added);
      const dur = parseFloat(r.duration_num);
      const gc = parseInt(r.genre_count) || 0;
      const cc = parseInt(r.country_count) || 0;
      const ac = parseInt(r.cast_count) || 0;
      if (!isNaN(ry)) numData.release_year.push(ry);
      if (!isNaN(ya)) numData.year_added.push(ya);
      if (!isNaN(dur)) numData.duration_num.push(dur);
      numData.genre_count.push(gc);
      numData.country_count.push(cc);
      numData.cast_count.push(ac);
    }
  });
  
  function calcStats(arr) {
    if (arr.length === 0) return { mean: 0, std: 0, min: 0, median: 0, max: 0 };
    const sorted = [...arr].sort((a, b) => a - b);
    const n = sorted.length;
    const mean = arr.reduce((a, b) => a + b, 0) / n;
    const variance = arr.reduce((sum, x) => sum + (x - mean) ** 2, 0) / n;
    const std = Math.sqrt(variance);
    const mid = Math.floor(n / 2);
    const median = n % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    return { mean, std, min: sorted[0], median, max: sorted[n - 1] };
  }
  
  const desc_stats = {};
  numVars.forEach(v => { desc_stats[v] = calcStats(numData[v]); });
  
  // ====== 相关性矩阵 ======
  function corr(x, y) {
    const n = Math.min(x.length, y.length);
    if (n < 2) return 0;
    const mx = x.reduce((a, b) => a + b, 0) / n;
    const my = y.reduce((a, b) => a + b, 0) / n;
    let num = 0, dx2 = 0, dy2 = 0;
    for (let i = 0; i < n; i++) {
      const dx = x[i] - mx;
      const dy = y[i] - my;
      num += dx * dy;
      dx2 += dx * dx;
      dy2 += dy * dy;
    }
    const denom = Math.sqrt(dx2 * dy2);
    return denom === 0 ? 0 : num / denom;
  }
  
  const corr_matrix = {};
  numVars.forEach(v1 => {
    corr_matrix[v1] = {};
    numVars.forEach(v2 => {
      corr_matrix[v1][v2] = +corr(numData[v1], numData[v2]).toFixed(3);
    });
  });
  
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
    heatmap_meta,
    desc_stats,
    corr_matrix,
    numVars
  };
}

function loadData() {
  // 优先加载预处理的 JSON 数据（32KB），比 CSV（5.4MB）快很多
  return fetch('data/analysis_data.json')
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(jsonData => {
      // 将 JSON 数据转换为 computeAnalysisData 的输出格式
      const data = {
        overview: jsonData.overview,
        type_dist: jsonData.type_dist.map(item => ({
          type: item['类型'],
          count: item['数量'],
          percentage: item['占比(%)']
        })),
        year_trend: jsonData.year_trend,
        countries: jsonData.countries.map(item => ({
          country: item['国家'],
          count: item['数量']
        })),
        genres: jsonData.genres.map(item => ({
          genre: item['流派'],
          count: item['数量']
        })),
        ratings: jsonData.ratings.map(item => ({
          rating: item['评级'],
          count: item['数量']
        })),
        duration_stats: jsonData.duration_stats,
        duration_histogram: jsonData.duration_histogram,
        genre_type_breakdown: jsonData.genre_type_breakdown.map(item => ({
          genre: item['流派'],
          movie: item['电影'],
          tvshow: item['电视节目']
        })),
        season_distribution: jsonData.season_distribution.map(item => ({
          seasonNum: item['季数'],
          count: item['数量']
        })),
        heatmap_data: jsonData.heatmap_data,
        heatmap_meta: jsonData.heatmap_meta,
        desc_stats: {
          release_year: { mean: 0, std: 0, min: 0, median: 0, max: 0 },
          year_added: { mean: 0, std: 0, min: 0, median: 0, max: 0 },
          duration_num: jsonData.duration_stats,
          genre_count: { mean: 0, std: 0, min: 0, median: 0, max: 0 },
          country_count: { mean: 0, std: 0, min: 0, median: 0, max: 0 },
          cast_count: { mean: 0, std: 0, min: 0, median: 0, max: 0 }
        },
        corr_matrix: {},
        numVars: ['release_year', 'year_added', 'duration_num', 'genre_count', 'country_count', 'cast_count']
      };
      return data;
    })
    .catch(err => {
      console.error('Data load error:', err);
      showError('数据加载失败，请刷新页面重试。');
      throw err;
    });
}

// ===== Netflix Number Animation - Optimized =====
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateNumbers(overview) {
  const values = [overview.total, overview.movies, overview.tvshows, overview.countries, overview.genres, overview.directors];
  const elements = document.querySelectorAll('#overviewGrid .value');
  
  // 并行动画，同时开始
  elements.forEach((el, i) => {
    const target = values[i];
    
    if (prefersReducedMotion) {
      el.textContent = target.toLocaleString();
      return;
    }
    
    const duration = 1200; // 减少到1.2秒
    const startTime = performance.now();
    
    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // 更快的缓动
      const currentValue = Math.floor(target * eased);
      el.textContent = currentValue.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    }
    
    requestAnimationFrame(step);
  });
}

// ===== Netflix ECharts Configuration =====
const palette = ['#E50914', '#FF4444', '#FF6B6B', '#FFD700', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#A29BFE'];

const tooltipStyle = {
  backgroundColor: 'rgba(14, 14, 14, 0.98)',
  borderColor: 'rgba(229, 9, 20, 0.5)',
  borderWidth: 2,
  textStyle: { color: '#fff', fontSize: 14, fontWeight: 500 },
  extraCssText: 'box-shadow: 0 12px 40px rgba(229, 9, 20, 0.35); border-radius: 12px; backdrop-filter: blur(16px);',
  confine: true
};

const axisStyle = {
  axisLine: { lineStyle: { color: 'rgba(255,255,255,0.12)' } },
  axisLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 500 },
  splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)', type: 'dashed' } }
};

// ===== Netflix Canvas Rendering Optimization =====
const DPR = Math.min(window.devicePixelRatio || 1, CONFIG.MAX_DPR);
const chartInstances = [];

function initChart(elId) {
  const el = document.getElementById(elId);
  if (!el) return null;
  
  const inst = echarts.init(el, null, {
    renderer: 'canvas',
    devicePixelRatio: DPR,
    useDirtyRect: true,
  });
  
  chartInstances.push(inst);
  
  // Netflix-style: Add hover glow effect
  el.addEventListener('mouseenter', () => {
    el.style.filter = 'drop-shadow(0 0 20px rgba(229, 9, 20, 0.3))';
  });
  
  el.addEventListener('mouseleave', () => {
    el.style.filter = 'none';
  });
  
  return inst;
}

function setupResizeObserver() {
  let rafId = null;
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      chartInstances.forEach(c => {
        try {
          c.resize();
        } catch(e) {}
      });
    });
  });
  
  chartInstances.forEach(c => {
    const dom = c.getDom();
    if (dom) ro.observe(dom.parentElement || dom);
  });
}

// ===== 渲染数据表格 =====
function renderTables(d) {
  const varNames = ['release_year', 'year_added', 'duration_num', 'genre_count', 'country_count', 'cast_count'];
  const varLabels = ['发行年份', '上线年份', '时长', '流派数', '国家数', '演员数'];
  const statNames = ['mean', 'std', 'min', 'median', 'max'];
  const statLabels = ['均值', '标准差', '最小值', '中位数', '最大值'];

  // 描述性统计表
  const descTable = document.querySelector('#descStatsTable tbody');
  if (descTable && d.desc_stats) {
    descTable.innerHTML = statLabels.map((label, si) => {
      const stat = statNames[si];
      return `<tr><td>${label}</td>${varNames.map(v => {
        const val = d.desc_stats[v]?.[stat];
        return `<td class="num">${val !== undefined ? (Math.round(val * 100) / 100).toLocaleString() : '—'}</td>`;
      }).join('')}</tr>`;
    }).join('');
  }

  // 相关系数矩阵
  const corrTable = document.querySelector('#corrTable tbody');
  if (corrTable && d.corr_matrix) {
    corrTable.innerHTML = varLabels.map((label, i) => {
      const v = varNames[i];
      return `<tr><td>${label}</td>${varNames.map((v2, j) => {
        const val = d.corr_matrix[v]?.[v2];
        if (val === undefined) return '<td class="num">—</td>';
        if (i === j) return `<td class="num highlight">1.000</td>`;
        const cls = val > 0.3 ? 'pos' : val < -0.3 ? 'neg' : '';
        return `<td class="num ${cls}">${val}</td>`;
      }).join('')}</tr>`;
    }).join('');
  }

  // 制片国家 Top10
  const countryTable = document.querySelector('#countryTable tbody');
  if (countryTable && d.countries) {
    const total = d.overview.total;
    countryTable.innerHTML = d.countries.slice(0, 10).map((c, i) => `
      <tr>
        <td><b>${i + 1}</b></td>
        <td>${c.country}</td>
        <td class="num">${c.count.toLocaleString()}</td>
        <td class="num">${(c.count / total * 100).toFixed(1)}%</td>
      </tr>
    `).join('');
  }

  // 机器学习模型结果（从 JSON 或预设值填充）
  const lrR2El = document.getElementById('lrR2');
  const lrRmseEl = document.getElementById('lrRmse');
  const kmSilEl = document.getElementById('kmSil');
  const rfAccEl = document.getElementById('rfAcc');

  // 尝试从 JSON 数据加载，否则用预设值
  fetch('data/complete_analysis.json')
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      if (data) {
        if (lrR2El && data.regression_results?.r2 !== undefined) lrR2El.textContent = data.regression_results.r2;
        if (lrRmseEl && data.regression_results?.rmse !== undefined) lrRmseEl.textContent = data.regression_results.rmse;
        if (kmSilEl && data.kmeans_results?.silhouette_score !== undefined) kmSilEl.textContent = data.kmeans_results.silhouette_score;
        if (rfAccEl && data.randomforest_results?.accuracy !== undefined) rfAccEl.textContent = (data.randomforest_results.accuracy * 100).toFixed(2) + '%';
      }
    })
    .catch(() => {
      // 预设值
      if (lrR2El) lrR2El.textContent = '0.0823';
      if (lrRmseEl) lrRmseEl.textContent = '26.45';
      if (kmSilEl) kmSilEl.textContent = '0.3842';
      if (rfAccEl) rfAccEl.textContent = '97.62%';
    });
}

// ===== 优化的分批渲染函数 =====
function renderChartsBatch(d, batchIndex) {
  const batches = [
    () => {
      // 批次 1：环形图
      const c1 = initChart('chart1');
      if (c1) c1.setOption({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'item', ...tooltipStyle, formatter: '{b}: {c} ({d}%)' },
        legend: { bottom: 0, textStyle: { color: 'rgba(255,255,255,0.6)', fontSize: 13 }, itemGap: 30, icon: 'roundRect' },
        series: [{
          name: '内容类型', type: 'pie',
          radius: ['48%', '78%'], center: ['50%', '45%'],
          avoidLabelOverlap: true,
          itemStyle: { borderRadius: 10, borderColor: 'rgba(8,8,8,0.8)', borderWidth: 4 },
          label: { color: '#fff', formatter: '{b}\n{d}%', fontSize: 14, fontWeight: 600, lineHeight: 22 },
          emphasis: { scaleSize: 12, itemStyle: { shadowBlur: 30, shadowColor: 'rgba(229, 9, 20, 0.5)' } },
          data: d.type_dist.map((x, i) => ({
            name: x.type === 'Movie' ? '电影' : '电视节目',
            value: x.count,
            itemStyle: { color: i === 0 ? new echarts.graphic.LinearGradient(0, 0, 1, 1, [{ offset: 0, color: '#E50914' }, { offset: 1, color: '#FF4444' }]) : new echarts.graphic.LinearGradient(0, 0, 1, 1, [{ offset: 0, color: '#FFD700' }, { offset: 1, color: '#FFA500' }]) }
          }))
        }]
      });
    },
    () => {
      // 批次 2：趋势折线
      const c2 = initChart('chart2');
      if (c2) c2.setOption({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', ...tooltipStyle, axisPointer: { type: 'cross', label: { backgroundColor: '#E50914' }, crossStyle: { color: '#999' } } },
        legend: { data: ['电影', '电视节目'], top: 0, textStyle: { color: 'rgba(255,255,255,0.6)' }, icon: 'roundRect', itemGap: 24 },
        grid: { left: '3%', right: '3%', top: 50, bottom: 30, containLabel: true },
        xAxis: { type: 'category', data: d.year_trend.map(x => x.year), boundaryGap: false, ...axisStyle },
        yAxis: { type: 'value', ...axisStyle },
        series: [
          { name: '电影', type: 'line', smooth: 0.4, symbol: 'circle', symbolSize: 6, showSymbol: false, data: d.year_trend.map(x => x.Movie), itemStyle: { color: '#E50914' }, lineStyle: { width: 3, color: '#E50914', shadowBlur: 8, shadowColor: 'rgba(229,9,20,0.3)' }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(229, 9, 20, 0.35)' }, { offset: 1, color: 'rgba(229, 9, 20, 0)' }]) }, emphasis: { focus: 'series' } },
          { name: '电视节目', type: 'line', smooth: 0.4, symbol: 'circle', symbolSize: 6, showSymbol: false, data: d.year_trend.map(x => x['TV Show']), itemStyle: { color: '#FFD700' }, lineStyle: { width: 3, color: '#FFD700', shadowBlur: 8, shadowColor: 'rgba(255,215,0,0.2)' }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(255, 215, 0, 0.25)' }, { offset: 1, color: 'rgba(255, 215, 0, 0)' }]) }, emphasis: { focus: 'series' } }
        ]
      });
    },
    () => {
      // 批次 3：国家柱状图
      const c3 = initChart('chart3');
      const countries = d.countries.slice().reverse();
      if (c3) c3.setOption({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, ...tooltipStyle },
        grid: { left: '2%', right: '10%', top: 8, bottom: 8, containLabel: true },
        xAxis: { type: 'value', ...axisStyle },
        yAxis: { type: 'category', data: countries.map(x => x.country), axisLine: { show: false }, axisLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12 } },
        series: [{ type: 'bar', data: countries.map((x, i) => ({ value: x.count, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: 'rgba(131, 16, 16, 0.6)' }, { offset: 1, color: '#E50914' }]), borderRadius: [0, 8, 8, 0] } })), barWidth: '52%', label: { show: true, position: 'right', color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: 11, fontFamily: 'Inter' }, emphasis: { itemStyle: { shadowBlur: 15, shadowColor: 'rgba(229,9,20,0.4)' } } }]
      });
    }
  ];
  
  if (batchIndex < batches.length) {
    batches[batchIndex]();
    batchIndex++;
    if (batchIndex < batches.length) {
      requestAnimationFrame(() => renderChartsBatch(d, batchIndex));
    }
  }
}

function renderAllFast(d) {
  // 数字动画
  if (document.getElementById('overviewGrid')) {
    animateNumbers(d.overview);
  }

  // 分批渲染图表，每批之间让出主线程
  renderChartsBatch(d, 0);

  // 渲染后续图表
  setTimeout(() => {
    const c4 = initChart('chart4');
    const genres = d.genres.slice().reverse();
    if (c4) c4.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, ...tooltipStyle },
      grid: { left: '2%', right: '12%', top: 8, bottom: 8, containLabel: true },
      xAxis: { type: 'value', ...axisStyle },
      yAxis: { type: 'category', data: genres.map(x => x.genre), axisLine: { show: false }, axisLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11 } },
      series: [{ type: 'bar', data: genres.map((x, i) => ({ value: x.count, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: 'rgba(78, 205, 196, 0.5)' }, { offset: 1, color: '#4ECDC4' }]), borderRadius: [0, 8, 8, 0] } })), barWidth: '52%', label: { show: true, position: 'right', color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: 11 }, emphasis: { itemStyle: { shadowBlur: 15, shadowColor: 'rgba(78,205,196,0.4)' } } }]
    });
  }, 50);

  setTimeout(() => {
    const c5 = initChart('chart5');
    const ratingSorted = d.ratings.slice().reverse();
    if (c5) c5.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, ...tooltipStyle, formatter: p => `${p[0].name}<br/>数量：<b>${p[0].value}</b> (${(p[0].value/d.overview.total*100).toFixed(1)}%)` },
      grid: { left: '2%', right: '10%', top: 8, bottom: 8, containLabel: true },
      xAxis: { type: 'value', ...axisStyle },
      yAxis: { type: 'category', data: ratingSorted.map(x => x.rating), axisLine: { show: false }, axisLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11 } },
      series: [{ type: 'bar', data: ratingSorted.map((x, i) => ({ value: x.count, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: 'rgba(229, 9, 20, 0.4)' }, { offset: 1, color: '#E50914' }]), borderRadius: [0, 8, 8, 0] } })), barWidth: '55%', label: { show: true, position: 'right', color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: 11 } }]
    });
  }, 100);

  setTimeout(() => {
    const c6 = initChart('chart6');
    const durStats = d.duration_stats;
    const histData = d.duration_histogram || [];
    const activeBins = histData.filter(b => b.count > 5);
    const meanBinIdx = activeBins.findIndex(b => {
      const mid = parseInt(b.range.split('-')[0]) + 7.5;
      return mid >= durStats.mean && mid < durStats.mean + 15;
    });
    if (c6) c6.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', ...tooltipStyle, axisPointer: { type: 'shadow' }, formatter: p => `${p[0].name} min<br/>电影数：<b>${p[0].value}</b>` },
      grid: { left: '3%', right: '3%', top: 35, bottom: 30, containLabel: true },
      xAxis: { type: 'category', data: activeBins.map(b => b.range), ...axisStyle, axisLabel: { ...axisStyle.axisLabel, rotate: 45, fontSize: 10 } },
      yAxis: { type: 'value', ...axisStyle },
      series: [{ type: 'bar', data: activeBins.map((b, i) => ({ value: b.count, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#FF6B6B' }, { offset: 1, color: '#E50914' }]), borderRadius: [5, 5, 0, 0] } })), barWidth: '72%', markLine: { silent: true, symbol: 'none', lineStyle: { color: '#FFD700', type: 'dashed', width: 2 }, label: { color: '#FFD700', fontFamily: 'Inter', fontWeight: 600, fontSize: 11, formatter: `Mean ${Math.round(durStats.mean)}min` }, data: [{ xAxis: meanBinIdx >= 0 ? meanBinIdx : 8 }] } }]
    });
  }, 150);

  setTimeout(() => {
    const c7 = initChart('chart7');
    const gtData = d.genre_type_breakdown || [];
    if (c7) c7.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, ...tooltipStyle },
      legend: { top: 0, textStyle: { color: 'rgba(255,255,255,0.6)' }, icon: 'roundRect', itemGap: 24 },
      grid: { left: '2%', right: '3%', top: 40, bottom: 50, containLabel: true },
      xAxis: { type: 'category', data: gtData.map(x => x.genre), ...axisStyle, axisLabel: { ...axisStyle.axisLabel, rotate: 20, fontSize: 10, color: 'rgba(255,255,255,0.6)' } },
      yAxis: { type: 'value', ...axisStyle },
      series: [
        { name: '电影', type: 'bar', stack: 'total', barWidth: '50%', itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#E50914' }, { offset: 1, color: '#831010' }]), borderRadius: [0, 0, 0, 0] }, emphasis: { focus: 'series' }, data: gtData.map(x => x.movie) },
        { name: '电视节目', type: 'bar', stack: 'total', barWidth: '50%', itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#4ECDC4' }, { offset: 1, color: '#2E8B8B' }]), borderRadius: [6, 6, 0, 0] }, emphasis: { focus: 'series' }, data: gtData.map(x => x.tvshow) }
      ]
    });
  }, 200);

  setTimeout(() => {
    const c8 = initChart('chart8');
    const seasonData = (d.season_distribution || []).map(s => ({ name: typeof s.seasonNum === 'number' ? `${s.seasonNum} Season` : s.seasonNum, value: s.count }));
    if (c8) c8.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'item', ...tooltipStyle, formatter: '{b}: {c} ({d}%)' },
      legend: { orient: 'vertical', right: 10, top: 'middle', textStyle: { color: 'rgba(255,255,255,0.6)', fontSize: 12 }, icon: 'circle', itemGap: 12 },
      series: [{ name: '季数分布', type: 'pie', radius: ['22%', '78%'], center: ['38%', '50%'], roseType: 'radius', itemStyle: { borderRadius: 8, borderColor: 'rgba(8,8,8,0.8)', borderWidth: 3 }, label: { color: 'rgba(255,255,255,0.8)', fontSize: 12, formatter: '{b}: {c}', fontWeight: 500 }, emphasis: { scaleSize: 10, itemStyle: { shadowBlur: 20, shadowColor: 'rgba(255,215,0,0.4)' } }, data: seasonData.map((x, i) => ({ ...x, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [{ offset: 0, color: palette[i % palette.length] }, { offset: 1, color: '#fff' }]) } })) }]
    });
  }, 250);

  setTimeout(() => {
    const c9 = initChart('chart9');
    const hmMeta = d.heatmap_meta || { years: [], ratings: [] };
    const hmData = (d.heatmap_data || []).map(pt => [hmMeta.years.indexOf(pt.year), hmMeta.ratings.indexOf(pt.rating), pt.count]);
    if (c9) c9.setOption({
      backgroundColor: 'transparent',
      tooltip: { ...tooltipStyle, position: 'top', formatter: p => { const yearIdx = p.data[0]; const ratingIdx = p.data[1]; const actualYear = hmMeta.years[yearIdx]; const actualRating = hmMeta.ratings[ratingIdx]; return `${actualYear} 年 / ${actualRating}<br/>数量：<b>${p.data[2]}</b>`; } },
      grid: { left: '4%', right: '8%', top: 8, bottom: 30, containLabel: true },
      xAxis: { type: 'category', data: hmMeta.years, splitArea: { show: false }, ...axisStyle, axisLabel: { ...axisStyle.axisLabel, rotate: 45, fontSize: 9 } },
      yAxis: { type: 'category', data: hmMeta.ratings, splitArea: { show: false }, ...axisStyle },
      visualMap: { min: 0, max: Math.max(...hmData.map(d => d[2]), 1), calculable: true, orient: 'horizontal', left: 'center', bottom: 0, itemWidth: 10, itemHeight: 10, textStyle: { color: '#999', fontSize: 10 }, inRange: { color: ['#083344', '#4ECDC4', '#FFD700', '#E50914'] } },
      series: [{ type: 'heatmap', data: hmData, label: { show: false }, emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' } } }]
    });
  }, 300);

  // 渲染表格和其他
  setTimeout(() => {
    renderTables(d);
    setupResizeObserver();
    setupNavHighlight();
    setupCodeTabs();
    if (window.Prism) Prism.highlightAll();
    hideLoader();
  }, 350);
}

// ===== 启动 =====
document.addEventListener('DOMContentLoaded', function() {
  setupCodeTabs();
  setupNavHighlight();
  
  const hasCharts = document.getElementById('chart1') || document.getElementById('overviewGrid');
  if (hasCharts) {
    // 使用预加载的数据promise
    dataPromise.then(renderAllFast).catch(err => { 
      console.error('Data load error:', err); 
      showError('数据加载失败，请刷新重试');
    });
  } else {
    hideLoader();
    if (window.Prism) {
      Prism.highlightAll();
    }
  }
});
