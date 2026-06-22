/**
 * Netflix Genre Word Cloud Module
 * Optimized for high-density display and interactive drilling
 */

const CloudModule = {
    chart: null,
    data: [],

    // 初始化词云
    init(containerId, rawData) {
        this.chart = echarts.init(document.getElementById(containerId));
        this.processData(rawData);
        this.render();
        
        // 响应式调整
        window.addEventListener('resize', () => this.chart.resize());
        
        // 绑定点击事件
        this.chart.on('click', (params) => {
            this.handleDrillDown(params.name);
        });

        return this;
    },

    // 数据处理：拆分多标签并统计频率
    processData(rawData) {
        const genreCount = {};
        
        rawData.forEach(item => {
            if (item.listed_in) {
                // 拆分多个流派 (e.g., "Action, Drama" -> ["Action", "Drama"])
                const genres = item.listed_in.split(',').map(g => g.trim());
                genres.forEach(genre => {
                    if (genre) {
                        genreCount[genre] = (genreCount[genre] || 0) + 1;
                    }
                });
            }
        });

        // 转换为 ECharts 格式并按频率排序
        this.data = Object.entries(genreCount)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 50); // 取前50个高频流派
    },

    // 渲染图表
    render() {
        const maxVal = this.data[0].value;
        const minVal = this.data[this.data.length - 1].value;

        const option = {
            title: {
                text: '🎬 流派关键词云 (Genre Word Cloud)',
                left: 'center',
                textStyle: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
            },
            tooltip: {
                show: true,
                formatter: '{b}: {c} 部作品',
                backgroundColor: 'rgba(0,0,0,0.8)',
                borderColor: '#E50914',
                textStyle: { color: '#fff' }
            },
            series: [{
                type: 'graph',
                layout: 'force',
                data: this.data.map(item => ({
                    name: item.name,
                    value: item.value,
                    symbolSize: this.calculateSize(item.value, minVal, maxVal),
                    label: {
                        show: true,
                        position: 'inside',
                        color: '#fff',
                        fontSize: Math.max(10, this.calculateSize(item.value, minVal, maxVal) * 0.6),
                        fontWeight: 'bold',
                        formatter: '{b}'
                    },
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                            { offset: 0, color: '#E50914' },
                            { offset: 1, color: '#B20710' }
                        ]),
                        borderColor: '#fff',
                        borderWidth: 1,
                        shadowBlur: 10,
                        shadowColor: 'rgba(229, 9, 20, 0.5)'
                    },
                    emphasis: {
                        label: { show: true, color: '#fff', fontSize: 14 },
                        itemStyle: {
                            color: '#fff',
                            borderColor: '#E50914',
                            borderWidth: 2
                        }
                    }
                })),
                force: {
                    repulsion: 150, // 斥力，防止重叠
                    edgeLength: 10,
                    gravity: 0.1
                },
                roam: true, // 允许缩放和平移
                label: {
                    rotate: Math.random() * 90 - 45 // 随机旋转角度
                }
            }]
        };

        this.chart.setOption(option);
    },

    // 计算字体大小
    calculateSize(value, min, max) {
        const minSize = 12;
        const maxSize = 40;
        if (max === min) return minSize;
        return minSize + (value - min) / (max - min) * (maxSize - minSize);
    },

    // 下钻处理：更新下方表格
    handleDrillDown(genreName) {
        const tableBody = document.getElementById('drillTableBody');
        if (!tableBody) return;

        // 模拟数据过滤 (实际项目中需传入完整数据集)
        // 这里仅做演示效果，实际需结合主数据源
        const mockData = [
            { title: `Top Movie in ${genreName}`, year: 2023, rating: 'TV-MA' },
            { title: `Popular Show in ${genreName}`, year: 2022, rating: 'TV-14' },
            { title: `New Release: ${genreName}`, year: 2024, rating: 'PG-13' }
        ];

        let html = `<tr><td colspan="3" style="text-align:center; color:#E50914;">正在加载 "${genreName}" 相关影片...</td></tr>`;
        tableBody.innerHTML = html;

        setTimeout(() => {
            html = mockData.map(row => `
                <tr>
                    <td>${row.title}</td>
                    <td>${row.year}</td>
                    <td><span class="badge">${row.rating}</span></td>
                </tr>
            `).join('');
            tableBody.innerHTML = html;
            
            // 更新标题
            document.getElementById('drillTitle').innerText = `🔍 聚焦流派：${genreName}`;
        }, 300);
    }
};

// 导出供 main.js 调用
window.CloudModule = CloudModule;
