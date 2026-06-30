export default function Home() {
  return (
    <>
      <div className="hero">
        <div className="hero-logo">NETFLIX</div>
        <h1>电影和电视节目收视分析</h1>
        <p>基于 8,809 条 Netflix 内容数据的深度探索 · 数据预处理 + 9 维可视化分析</p>
      </div>

      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-num">8,809</div>
          <div className="stat-label">总记录数</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">12 → 22</div>
          <div className="stat-label">字段（原始→清洗后）</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">6,131</div>
          <div className="stat-label">电影</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">2,676</div>
          <div className="stat-label">电视节目</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">9</div>
          <div className="stat-label">可视化图表</div>
        </div>
      </div>
    </>
  );
}
