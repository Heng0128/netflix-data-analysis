export default function DataOverviewPage() {
  return (
    <section id="data-overview" style={{ padding: "60px 24px", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px", display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ width: "4px", height: "28px", background: "#E50914", borderRadius: "2px", display: "inline-block", flexShrink: 0 }}></span>
        数据概况
      </div>
      <div style={{ color: "rgba(255,255,255,.55)", marginBottom: "32px", fontSize: "15px" }}>
        Pandas 数据处理与统计结果展示
      </div>

      {/* 数据集基本信息 */}
      <div className="glass-card glass-card-hover" style={{ borderRadius: "16px", padding: "32px", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ background: "linear-gradient(135deg,#E50914,#B20710)", borderRadius: "8px", width: "32px", height: "32px", flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>📊</span>
          1.1 数据集基本信息
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "rgba(229,9,20,.12)" }}>
                <th style={{ padding: "10px 16px", textAlign: "left", color: "#E50914", fontWeight: 700, fontSize: "11px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>项目</th>
                <th style={{ padding: "10px 16px", textAlign: "left", color: "#E50914", fontWeight: 700, fontSize: "11px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>值</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>数据总量</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>8,807</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.02)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>字段数量</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>17</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>Movie 数量</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>6,131</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.02)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>TV Show 数量</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>2,676</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>国家数量</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>85</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.02)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>导演数量</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>4,993</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>演员数量</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>36,439</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.02)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>最早年份</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>1925</td>
              </tr>
              <tr>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>最新年份</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>2021</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 缺失值统计 */}
      <div className="glass-card glass-card-hover" style={{ borderRadius: "16px", padding: "32px", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ background: "linear-gradient(135deg,#4A90D9,#2563EB)", borderRadius: "8px", width: "32px", height: "32px", flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>📋</span>
          1.2 缺失值统计
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "rgba(74,144,217,.12)" }}>
                <th style={{ padding: "10px 16px", textAlign: "left", color: "#4A90D9", fontWeight: 700, fontSize: "11px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>字段</th>
                <th style={{ padding: "10px 16px", textAlign: "left", color: "#4A90D9", fontWeight: 700, fontSize: "11px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>缺失值数量</th>
                <th style={{ padding: "10px 16px", textAlign: "left", color: "#4A90D9", fontWeight: 700, fontSize: "11px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>缺失率</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>director</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>2,634</td>
                <td style={{ padding: "9px 16px", color: "#E50914" }}>29.91%</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.02)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>cast</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>825</td>
                <td style={{ padding: "9px 16px", color: "#FFD700" }}>9.37%</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>country</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>831</td>
                <td style={{ padding: "9px 16px", color: "#FFD700" }}>9.44%</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.02)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>primary_country</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>833</td>
                <td style={{ padding: "9px 16px", color: "#FFD700" }}>9.46%</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>date_added</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>10</td>
                <td style={{ padding: "9px 16px", color: "#7BC67E" }}>0.11%</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.02)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>rating</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>7</td>
                <td style={{ padding: "9px 16px", color: "#7BC67E" }}>0.08%</td>
              </tr>
              <tr>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>title</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>1</td>
                <td style={{ padding: "9px 16px", color: "#7BC67E" }}>0.01%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* describe() 统计描述 */}
      <div className="glass-card glass-card-hover" style={{ borderRadius: "16px", padding: "32px", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ background: "linear-gradient(135deg,#F5A623,#FFD700)", borderRadius: "8px", width: "32px", height: "32px", flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>📈</span>
          1.3 数值字段统计描述 (describe)
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "rgba(245,166,35,.12)" }}>
                <th style={{ padding: "10px 16px", textAlign: "left", color: "#F5A623", fontWeight: 700, fontSize: "11px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>指标</th>
                <th style={{ padding: "10px 16px", textAlign: "left", color: "#F5A623", fontWeight: 700, fontSize: "11px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>release_year</th>
                <th style={{ padding: "10px 16px", textAlign: "left", color: "#F5A623", fontWeight: 700, fontSize: "11px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>duration_num</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>count</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>8,807</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>6,131</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.02)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>mean</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>2,014.2</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>99.6</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>std</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>8.8</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>—</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.02)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>min</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>1,925</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>1</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>25%</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>2,013</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>—</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.02)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>50% (median)</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>2,017</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>—</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>75%</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>2,019</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>—</td>
              </tr>
              <tr>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>max</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>2,021</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>312</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 数据预览 (df.head()) */}
      <div className="glass-card glass-card-hover" style={{ borderRadius: "16px", padding: "32px", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ background: "linear-gradient(135deg,#7BC67E,#4CAF50)", borderRadius: "8px", width: "32px", height: "32px", flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>📄</span>
          1.4 数据预览 (df.head())
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "rgba(123,198,126,.12)" }}>
                <th style={{ padding: "10px 16px", textAlign: "left", color: "#7BC67E", fontWeight: 700, fontSize: "11px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>show_id</th>
                <th style={{ padding: "10px 16px", textAlign: "left", color: "#7BC67E", fontWeight: 700, fontSize: "11px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>type</th>
                <th style={{ padding: "10px 16px", textAlign: "left", color: "#7BC67E", fontWeight: 700, fontSize: "11px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>title</th>
                <th style={{ padding: "10px 16px", textAlign: "left", color: "#7BC67E", fontWeight: 700, fontSize: "11px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>country</th>
                <th style={{ padding: "10px 16px", textAlign: "left", color: "#7BC67E", fontWeight: 700, fontSize: "11px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>rating</th>
                <th style={{ padding: "10px 16px", textAlign: "left", color: "#7BC67E", fontWeight: 700, fontSize: "11px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>release_year</th>
                <th style={{ padding: "10px 16px", textAlign: "left", color: "#7BC67E", fontWeight: 700, fontSize: "11px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>duration</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>s1</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>Movie</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>Dick Johnson Is Dead</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>United States</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>PG-13</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>2020</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>90 min</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.02)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>s2</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>TV Show</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>Blood & Water</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>South Africa</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>TV-MA</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>2021</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>2 Seasons</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>s3</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>TV Show</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>Ganglands</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>Unknown</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>TV-MA</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>2021</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>1 Season</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.02)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>s4</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>TV Show</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>Jailbirds New Orleans</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>Unknown</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>TV-MA</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>2021</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>1 Season</td>
              </tr>
              <tr>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>s5</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>TV Show</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>Kota Factory</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>India</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>TV-MA</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>2021</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>2 Seasons</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* EDA 统计摘要 */}
      <div className="glass-card glass-card-hover" style={{ borderRadius: "16px", padding: "32px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ background: "linear-gradient(135deg,#BD10E0,#7C3AED)", borderRadius: "8px", width: "32px", height: "32px", flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>🎯</span>
          1.5 EDA 统计摘要
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "rgba(189,16,224,.12)" }}>
                <th style={{ padding: "10px 16px", textAlign: "left", color: "#BD10E0", fontWeight: 700, fontSize: "11px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>指标</th>
                <th style={{ padding: "10px 16px", textAlign: "left", color: "#BD10E0", fontWeight: 700, fontSize: "11px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>数值</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>平均上映年份</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>2,014</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.02)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>中位上映年份</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>2,017</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>最长电影</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>312 min</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.02)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>平均电影时长</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>99.6 min</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>最多电影国家</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>United States (3,211 部)</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.02)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>最多作品导演</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>Rajiv Chilaka (22 部)</td>
              </tr>
              <tr>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>最多评级</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>TV-MA (3,207 部)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
