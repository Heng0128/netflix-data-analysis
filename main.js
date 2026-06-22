// ============================================================
//  Netflix 数据分析看板 — 前端数据渲染模块
//  数据链路：data/analysis_data.json → ECharts 渲染
// ============================================================

// ===== 配置常量 =====
const CONFIG = {
  DPR: Math.min(window.devicePixelRatio || 1, 2),
  ANIMATION_DURATION: 2000,
  COLORS: {
    primary: '#E50914',
    gold: '#FFD700',
    teal: '#4ECDC4',
    palette: ['#E50914','#FF6B6B','#FFD700','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD','#A29BFE','#81ECEC']
  }
};

// ===== ECharts 通用样式 =====
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

// ===== 图表实例管理 =====
const chartManager = {
  instances: [],
  
  create(elId) {
    const el = document.getElementById(elId);
    if (!el) return null;
    const chart = echarts.init(el, null, {
      renderer: 'canvas',
      devicePixelRatio: CONFIG.DPR,
      useDirtyRect: true,
    });
    this.instances.push(chart);
    return chart;
  },
  
  resize() {
    this.instances.forEach(c => { try { c.resize(); } catch(e) {} });
  },
  
  dispose() {
    this.instances.forEach(c => c.dispose());
    this.instances = [];
  }
};

// ===== 响应式布局 =====
function setupResizeObserver() {
  let rafId = null;
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => chartManager.resize());
  });
  document.querySelectorAll('.chart-container').forEach(el => ro.observe(el));
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

// ===== 主渲染函数 =====
function renderAll(d) {
  animateNumbers(d.overview);

  // ==== 图 1：环形图 ====
  const c1 = chartManager.create('chart1');
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
        name: x.类型 === 'Movie' ? '电影' : '电视节目',
        value: x.数量,
        itemStyle: {
          color: i === 0
            ? new echarts.graphic.LinearGradient(0, 0, 1, 1, [{ offset: 0, color: '#E50914' }, { offset: 1, color: '#FF4444' }])
            : new echarts.graphic.LinearGradient(0, 0, 1, 1, [{ offset: 0, color: '#FFD700' }, { offset: 1, color: '#FFA500' }])
        }
      }))
    }]
  });

  // ==== 图 2：趋势折线 ====
  const c2 = chartManager.create('chart2');
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
  const c3 = chartManager.create('chart3');
  const countries = d.countries.slice().reverse();
  c3.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, ...tooltipStyle },
    grid: { left: '2%', right: '10%', top: 8, bottom: 8, containLabel: true },
    xAxis: { type: 'value', ...axisStyle },
    yAxis: { type: 'category', data: countries.map(x => x.国家), axisLine: { show: false }, axisLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12 } },
    series: [{
      type: 'bar',
      data: countries.map((x, i) => ({
        value: x.数量,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: 'rgba(131,16,16,0.6)' }, { offset: 1, color: '#E50914' }]),
          borderRadius: [0, 8, 8, 0]
        }
      })),
      barWidth: '52%',
      label: { show: true, position: 'right', color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: 11, fontFamily: 'Inter' },
      emphasis: { itemStyle: { shadowBlur: 15, shadowColor: 'rgba(229, 9, 20, 0.4)' } }
    }]
  });

  // ==== 图 4：流派 Top10 ====
  const c4 = chartManager.create('chart4');
  const genres = d.genres.slice().reverse();
  c4.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, ...tooltipStyle },
    grid: { left: '2%', right: '12%', top: 8, bottom: 8, containLabel: true },
    xAxis: { type: 'value', ...axisStyle },
    yAxis: { type: 'category', data: genres.map(x => x.流派), axisLine: { show: false }, axisLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11 } },
    series: [{
      type: 'bar',
      data: genres.map((x, i) => ({
        value: x.数量,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: 'rgba(78,205,196,0.5)' }, { offset: 1, color: '#4ECDC4' }]),
          borderRadius: [0, 8, 8, 0]
        }
      })),
      barWidth: '52%',
      label: { show: true, position: 'right', color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: 11, fontFamily: 'Inter' },
      emphasis: { itemStyle: { shadowBlur: 15, shadowColor: 'rgba(78, 205, 196, 0.4)' } }
    }]
  });

  // ==== 图 5：评级漏斗 ====
  const c5 = chartManager.create('chart5');
  c5.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', ...tooltipStyle, formatter: '{b}: {c} ({d}%)' },
    legend: { top: 0, textStyle: { color: 'rgba(255,255,255,0.6)' }, itemGap: 12, icon: 'circle', itemWidth: 10 },
    series: [{
      name: '评级', type: 'funnel',
      top: 50, left: '8%', width: '84%', minSize: '18%', maxSize: '100%',
      sort: 'descending', gap: 3,
      label: { show: true, position: 'inside', color: '#fff', fontWeight: 700, formatter: '{b}\\n{c}', fontSize: 12, lineHeight: 20 },
      labelLine: { show: false },
      itemStyle: { borderColor: 'rgba(8,8,8,0.8)', borderWidth: 3, borderRadius: 6 },
      emphasis: { label: { fontSize: 14 } },
      data: d.ratings.map((x, i) => ({ name: x.评级，value: x.数量，itemStyle: { color: CONFIG.COLORS.palette[i % CONFIG.COLORS.palette.length] } }))
    }]
  });

  // ==== 图 6：电影时长直方图 ====
  const c6 = chartManager.create('chart6');
  const ds = d.duration_stats;
  const histData = d.duration_histogram || [];
  const activeBins = histData.filter(b => b.count > 5);
  const meanIdx = activeBins.findIndex(b => {
    const mid = parseInt(b.range.split('-')[0]) + 7.5;
    return mid >= ds.mean && mid < ds.mean + 15;
  });
  c6.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', ...tooltipStyle, axisPointer: { type: 'shadow' }, formatter: p => `${p[0].name} min<br/>电影数：<b>${p[0].value}</b>` },
    grid: { left: '3%', right: '3%', top: 35, bottom: 30, containLabel: true },
    xAxis: { type: 'category', data: activeBins.map(b => b.range), ...axisStyle, axisLabel: { ...axisStyle.axisLabel, rotate: 45, fontSize: 10 } },
    yAxis: { type: 'value', ...axisStyle },
    series: [{
      type: 'bar',
      data: activeBins.map(() => ({
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#FF6B6B' }, { offset: 1, color: '#E50914' }]),
          borderRadius: [5, 5, 0, 0]
        }
      })),
      barWidth: '72%',
      markLine: {
        silent: true, symbol: 'none',
        lineStyle: { color: '#FFD700', type: 'dashed', width: 2 },
        label: { color: '#FFD700', fontFamily: 'Inter', fontWeight: 600, fontSize: 11, formatter: `Mean ${Math.round(ds.mean)}min` },
        data: [{ xAxis: meanIdx >= 0 ? meanIdx : 8 }]
      }
    }]
  });

  // ==== 图 7：流派×类型堆叠 ====
  const c7 = chartManager.create('chart7');
  const gtData = d.genre_type_breakdown || [];
  c7.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, ...tooltipStyle },
    legend: { top: 0, textStyle: { color: 'rgba(255,255,255,0.6)' }, icon: 'roundRect', itemGap: 24 },
    grid: { left: '2%', right: '3%', top: 40, bottom: 50, containLabel: true },
    xAxis: { type: 'category', data: gtData.map(x => x.流派), ...axisStyle, axisLabel: { ...axisStyle.axisLabel, rotate: 20, fontSize: 10, color: 'rgba(255,255,255,0.6)' } },
    yAxis: { type: 'value', ...axisStyle },
    series: [
      {
        name: '电影', type: 'bar', stack: 'total', barWidth: '50%',
        itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#E50914' }, { offset: 1, color: '#831010' }]), borderRadius: [0, 0, 0, 0] },
        emphasis: { focus: 'series' },
        data: gtData.map(x => x.电影)
      },
      {
        name: '电视节目', type: 'bar', stack: 'total', barWidth: '50%',
        itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#4ECDC4' }, { offset: 1, color: '#2E8B8B' }]), borderRadius: [6, 6, 0, 0] },
        emphasis: { focus: 'series' },
        data: gtData.map(x => x.电视节目)
      }
    ]
  });

  // ==== 图 8：词云 ====
  const c8 = chartManager.create('chart8');
  const cloudData = d.genres.map((x, i) => ({
    name: x.流派，
    value: x.数量，
    textSize: Math.max(16, Math.min(48, 12 + x.数量 / 60)),
    color: CONFIG.COLORS.palette[i % CONFIG.COLORS.palette.length],
    x: 10 + (i % 5) * 18 + Math.random() * 8,
    y: 15 + Math.floor(i / 5) * 35 + Math.random() * 10
  }));
  c8.setOption({
    backgroundColor: 'transparent',
    tooltip: { ...tooltipStyle, formatter: p => `${p.data.name}: ${p.data.value} titles` },
    xAxis: { show: false, min: 0, max: 100 },
    yAxis: { show: false, min: 0, max: 100 },
    series: [{
      type: 'scatter',
      symbolSize: 0,
      data: cloudData.map(d => ({ value: [d.x, d.y, d.value], name: d.name, color: d.color, textSize: d.textSize })),
      label: {
        show: true, position: 'inside',
        formatter: p => p.data.name,
        color: p => p.data.color,
        fontSize: p => p.textSize,
        fontWeight: 700,
        fontFamily: 'Inter,Noto Sans SC'
      },
      emphasis: { scale: 1.5 }
    }]
  });

  // ==== 图 9：季数玫瑰图 ====
  const c9 = chartManager.create('chart9');
  const sd = (d.season_distribution || []).map(s => ({
    name: (typeof s.季数 === 'number' ? s.季数 + ' Season' : s.季数),
    value: s.数量
  }));
  c9.setOption({
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
      data: sd.map((x, i) => ({
        ...x,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [{ offset: 0, color: CONFIG.COLORS.palette[i % CONFIG.COLORS.palette.length] }, { offset: 1, color: CONFIG.COLORS.palette[(i + 3) % CONFIG.COLORS.palette.length] + '88' }])
        }
      }))
    }]
  });

  // ==== 图 10：热力图 ====
  const c10 = chartManager.create('chart10');
  const hmMeta = d.heatmap_meta || { years: [], ratings: [] };
  const hmYears = hmMeta.years, hmRatings = hmMeta.ratings;
  const hmRaw = d.heatmap_data || [], hmData = [];
  hmRaw.forEach(item => {
    const yi = hmYears.indexOf(item.year), ri = hmRatings.indexOf(item.rating);
    if (yi >= 0 && ri >= 0) hmData.push([yi, ri, item.count]);
  });
  c10.setOption({
    backgroundColor: 'transparent',
    tooltip: { ...tooltipStyle, formatter: p => `${hmYears[p.data[0]]} · ${hmRatings[p.data[1]]}<br/>数量：<b>${p.data[2]}</b>` },
    grid: { left: '8%', right: '8%', top: 20, bottom: 70, containLabel: true },
    xAxis: { type: 'category', data: hmYears, splitArea: { show: true, areastyle: { color: 'rgba(255,255,255,0.01)' } }, ...axisStyle, axisLabel: { ...axisStyle.axisLabel, color: 'rgba(255,255,255,0.6)' } },
    yAxis: { type: 'category', data: hmRatings, splitArea: { show: true, areastyle: { color: 'rgba(255,255,255,0.01)' } }, ...axisStyle, axisLabel: { ...axisStyle.axisLabel, color: 'rgba(255,255,255,0.7)' } },
    visualMap: {
      min: 0, max: Math.max(...hmData.map(x => x[2])), calculable: true,
      orient: 'horizontal', left: 'center', bottom: 5,
      inRange: { color: ['#0d0d0d', '#3d0808', '#831010', '#E50914', '#FFD700'] },
      textStyle: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },
      itemWidth: 16, itemHeight: 160, handleStyle: { borderColor: '#E50914' }
    },
    series: [{
      name: '数量', type: 'heatmap', data: hmData,
      label: { show: true, color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600, fontFamily: 'Inter' },
      emphasis: { itemStyle: { shadowBlur: 20, shadowColor: 'rgba(255,215,0,0.5)' } }
    }]
  });

  setupResizeObserver();
  hideLoader();
}

// ===== Loading / Error 状态 =====
const loader = document.createElement('div');
loader.id = 'data-loader';
loader.innerHTML = '<div class="spinner"></div><p>正在加载数据...</p>';
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

function hideLoader() {
  loader.style.opacity = '0';
  setTimeout(() => loader.remove(), 500);
}

function showError(msg) {
  loader.innerHTML = `
    <div style="color:#E50914;font-size:18px;font-weight:700;margin-bottom:8px;">数据加载失败</div>
    <p style="color:#999;font-size:13px;max-width:400px;text-align:center;line-height:1.6">${msg}</p>
    <button onclick="location.reload()" style="margin-top:20px;padding:10px 28px;background:#E50914;color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-size:13px;">重新加载</button>
  `;
}

// ===== 启动：从 JSON 加载数据 =====
fetch('data/analysis_data.json')
  .then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  })
  .then(data => {
    console.log('数据加载成功:', data.overview);
    renderAll(data);
  })
  .catch(err => {
    console.error(err);
    showError(err.message || '无法加载 analysis_data.json，请确认文件存在。');
  });
