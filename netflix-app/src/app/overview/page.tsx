export default function OverviewPage() {
  return (
    <section id="requirement" style={{ padding: "60px 24px", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px", display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ width: "4px", height: "28px", background: "#E50914", borderRadius: "2px", display: "inline-block", flexShrink: 0 }}></span>
        项目需求分析
      </div>
      <div style={{ color: "rgba(255,255,255,.55)", marginBottom: "32px", fontSize: "15px" }}>背景介绍 · 分析目标 · 小组分工</div>

      <div className="glass-card glass-card-hover" style={{ borderRadius: "16px", padding: "32px", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ background: "linear-gradient(135deg,#E50914,#B20710)", borderRadius: "8px", width: "32px", height: "32px", flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>&#128202;</span>
          1.1 &nbsp;数据集背景介绍
        </h3>
        <p style={{ color: "rgba(255,255,255,.75)", lineHeight: 1.9, marginBottom: "20px" }}>
          Netflix 是全球最大的流媒体平台，截至 2021 年中期拥有超过 2 亿全球订阅用户，平台上可访问超过 8,000 部电影和电视节目。
          本项目使用的 <strong style={{ color: "#E50914" }}>Netflix Titles Dataset</strong> 包含 <strong style={{ color: "#fff" }}>8,807 条记录</strong>，
          完整记录了 Netflix 平台上所有已上线内容的元数据，数据来源为 Kaggle 公开数据集，截止日期 2021 年中。
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "rgba(229,9,20,.12)" }}>
                <th style={{ padding: "10px 16px", textAlign: "left", color: "#E50914", fontWeight: 700, fontSize: "11px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>字段名</th>
                <th style={{ padding: "10px 16px", textAlign: "left", color: "#E50914", fontWeight: 700, fontSize: "11px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>变量类型</th>
                <th style={{ padding: "10px 16px", textAlign: "left", color: "#E50914", fontWeight: 700, fontSize: "11px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>说明</th>
                <th style={{ padding: "10px 16px", textAlign: "left", color: "#E50914", fontWeight: 700, fontSize: "11px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>缺失率</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>show_id</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>字符串</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>每条内容的唯一标识符（s1~s8807）</td>
                <td style={{ padding: "9px 16px", color: "#7BC67E" }}>0%</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.02)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>type</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>分类（2值）</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>Movie / TV Show，目标分类变量</td>
                <td style={{ padding: "9px 16px", color: "#7BC67E" }}>0%</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>title</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>字符串</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>内容标题</td>
                <td style={{ padding: "9px 16px", color: "#7BC67E" }}>0%</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.02)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>director</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>字符串</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>导演姓名（多人以逗号分隔）</td>
                <td style={{ padding: "9px 16px", color: "#E50914" }}>29.91%</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>cast</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>字符串</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>主要演员列表（逗号分隔）</td>
                <td style={{ padding: "9px 16px", color: "#FFD700" }}>9.22%</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.02)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>country</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>字符串</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>制作国家（可多值，逗号分隔）</td>
                <td style={{ padding: "9px 16px", color: "#FFD700" }}>9.45%</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>date_added</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>日期型</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>上架 Netflix 的日期（&quot;Month DD, YYYY&quot;）</td>
                <td style={{ padding: "9px 16px", color: "#7BC67E" }}>0.11%</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.02)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>release_year</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>数值（整型）</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>发行年份（取值范围 1925~2021）</td>
                <td style={{ padding: "9px 16px", color: "#7BC67E" }}>0%</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>rating</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>分类（14值）</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>年龄评级（TV-MA / TV-14 / PG-13 / R 等）</td>
                <td style={{ padding: "9px 16px", color: "#7BC67E" }}>0.04%</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.02)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>duration</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>字符串→数值</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>时长（电影: X min；电视: X Season(s)）</td>
                <td style={{ padding: "9px 16px", color: "#7BC67E" }}>0.04%</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>listed_in</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>字符串（多标签）</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>所属流派（可多个，逗号分隔）</td>
                <td style={{ padding: "9px 16px", color: "#7BC67E" }}>0%</td>
              </tr>
              <tr>
                <td style={{ padding: "9px 16px", fontWeight: 600, color: "#fff" }}>description</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>文本</td>
                <td style={{ padding: "9px 16px", color: "rgba(255,255,255,.6)" }}>内容简述（2 条含换行符，pandas 合并处理）</td>
                <td style={{ padding: "9px 16px", color: "#7BC67E" }}>0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-card glass-card-hover" style={{ borderRadius: "16px", padding: "32px", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ background: "linear-gradient(135deg,#4A90D9,#2563EB)", borderRadius: "8px", width: "32px", height: "32px", flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>&#127919;</span>
          1.2 &nbsp;数据分析目标与预期结果
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "16px" }}>
          <div style={{ background: "rgba(229,9,20,.08)", border: "1px solid rgba(229,9,20,.2)", borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontSize: "12px", color: "#E50914", fontWeight: 700, letterSpacing: ".5px", marginBottom: "8px" }}>目标一</div>
            <div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "8px" }}>内容结构探索</div>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,.65)", lineHeight: 1.7 }}>分析电影与电视节目的比例、上架时间分布、发行年份分布，揭示 Netflix 内容策略演变规律</p>
            <div style={{ marginTop: "10px", fontSize: "12px", color: "#7BC67E" }}>预期：上架量持续增长，2020 年前后出现峰值后回调</div>
          </div>
          <div style={{ background: "rgba(74,144,217,.08)", border: "1px solid rgba(74,144,217,.2)", borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontSize: "12px", color: "#4A90D9", fontWeight: 700, letterSpacing: ".5px", marginBottom: "8px" }}>目标二</div>
            <div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "8px" }}>地域与流派分析</div>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,.65)", lineHeight: 1.7 }}>识别主要内容来源国、热门流派，了解 Netflix 的全球化内容布局和类型偏好</p>
            <div style={{ marginTop: "10px", fontSize: "12px", color: "#7BC67E" }}>预期：美国为最大来源国，国际剧为最热门类型</div>
          </div>
          <div style={{ background: "rgba(245,166,35,.08)", border: "1px solid rgba(245,166,35,.2)", borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontSize: "12px", color: "#FFD700", fontWeight: 700, letterSpacing: ".5px", marginBottom: "8px" }}>目标三</div>
            <div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "8px" }}>异常检测与数据质量</div>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,.65)", lineHeight: 1.7 }}>识别字段混淆、缺失值分布、格式不一致等质量问题，为后续分析奠定基础</p>
            <div style={{ marginTop: "10px", fontSize: "12px", color: "#7BC67E" }}>预期：发现 rating 字段时长污染、director 高缺失率等异常</div>
          </div>
          <div style={{ background: "rgba(123,198,126,.08)", border: "1px solid rgba(123,198,126,.2)", borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontSize: "12px", color: "#7BC67E", fontWeight: 700, letterSpacing: ".5px", marginBottom: "8px" }}>目标四</div>
            <div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "8px" }}>机器学习建模</div>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,.65)", lineHeight: 1.7 }}>应用聚类、分类、回归三类算法，发现内容分群规律并建立预测模型</p>
            <div style={{ marginTop: "10px", fontSize: "12px", color: "#7BC67E" }}>预期：内容流派是最强判别特征，分类准确率超 95%</div>
          </div>
        </div>
      </div>

      <div className="glass-card glass-card-hover" style={{ borderRadius: "16px", padding: "32px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ background: "linear-gradient(135deg,#BD10E0,#7C3AED)", borderRadius: "8px", width: "32px", height: "32px", flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>&#128101;</span>
          1.3 &nbsp;小组分工
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={{ background: "rgba(229,9,20,.06)", border: "1px solid rgba(229,9,20,.15)", borderRadius: "12px", padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "44px", height: "44px", background: "linear-gradient(135deg,#E50914,#B20710)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "18px", boxShadow: "0 0 16px rgba(229,9,20,.3)", flexShrink: 0 }}>A</div>
              <div>
                <div style={{ fontSize: "16px", fontWeight: 700 }}>张泽浩</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,.5)", marginTop: "2px" }}>数据工程 &amp; 建模</div>
              </div>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "9px" }}>
              <li style={{ fontSize: "13px", color: "rgba(255,255,255,.7)", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <span style={{ color: "#E50914", fontSize: "10px", marginTop: "4px", flexShrink: 0 }}>&#9679;</span>
                数据集调研与来源确认
              </li>
              <li style={{ fontSize: "13px", color: "rgba(255,255,255,.7)", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <span style={{ color: "#E50914", fontSize: "10px", marginTop: "4px", flexShrink: 0 }}>&#9679;</span>
                数据预处理脚本编写（缺失值处理、异常检测、特征工程）
              </li>
              <li style={{ fontSize: "13px", color: "rgba(255,255,255,.7)", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <span style={{ color: "#E50914", fontSize: "10px", marginTop: "4px", flexShrink: 0 }}>&#9679;</span>
                机器学习算法实现（K-Means / 随机森林 / 梯度提升回归）
              </li>
              <li style={{ fontSize: "13px", color: "rgba(255,255,255,.7)", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <span style={{ color: "#E50914", fontSize: "10px", marginTop: "4px", flexShrink: 0 }}>&#9679;</span>
                Jupyter Notebook 整理与执行验证
              </li>
              <li style={{ fontSize: "13px", color: "rgba(255,255,255,.7)", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <span style={{ color: "#E50914", fontSize: "10px", marginTop: "4px", flexShrink: 0 }}>&#9679;</span>
                报告结论与改进建议撰写
              </li>
            </ul>
          </div>
          <div style={{ background: "rgba(74,144,217,.06)", border: "1px solid rgba(74,144,217,.15)", borderRadius: "12px", padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "44px", height: "44px", background: "linear-gradient(135deg,#4A90D9,#2563EB)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "18px", boxShadow: "0 0 16px rgba(74,144,217,.3)", flexShrink: 0 }}>B</div>
              <div>
                <div style={{ fontSize: "16px", fontWeight: 700 }}>周宇恒</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,.5)", marginTop: "2px" }}>可视化 &amp; 报告</div>
              </div>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "9px" }}>
              <li style={{ fontSize: "13px", color: "rgba(255,255,255,.7)", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <span style={{ color: "#4A90D9", fontSize: "10px", marginTop: "4px", flexShrink: 0 }}>&#9679;</span>
                Matplotlib 静态可视化图表绘制（7 张，含聚类散点图）
              </li>
              <li style={{ fontSize: "13px", color: "rgba(255,255,255,.7)", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <span style={{ color: "#4A90D9", fontSize: "10px", marginTop: "4px", flexShrink: 0 }}>&#9679;</span>
                网页前端开发（HTML/CSS/Chart.js 交互图表，共 9 张）
              </li>
              <li style={{ fontSize: "13px", color: "rgba(255,255,255,.7)", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <span style={{ color: "#4A90D9", fontSize: "10px", marginTop: "4px", flexShrink: 0 }}>&#9679;</span>
                Netflix 暗色主题 UI 设计与样式优化（玻璃拟态 + 动效）
              </li>
              <li style={{ fontSize: "13px", color: "rgba(255,255,255,.7)", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <span style={{ color: "#4A90D9", fontSize: "10px", marginTop: "4px", flexShrink: 0 }}>&#9679;</span>
                项目需求分析与报告内容撰写
              </li>
              <li style={{ fontSize: "13px", color: "rgba(255,255,255,.7)", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <span style={{ color: "#4A90D9", fontSize: "10px", marginTop: "4px", flexShrink: 0 }}>&#9679;</span>
                最终报告整合、审核与排版
              </li>
            </ul>
          </div>
        </div>
        <div style={{ marginTop: "16px", background: "rgba(255,255,255,.04)", borderRadius: "10px", padding: "14px", fontSize: "13px", color: "rgba(255,255,255,.5)" }}>
          &#128204; 两人共同参与：项目选题讨论、分析思路确认、可视化结果解读、结论审查与 PPT 制作
        </div>
      </div>
    </section>
  );
}
