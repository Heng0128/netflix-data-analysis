export default function Footer() {
  return (
    <footer>
      <div className="nf-mini">N</div>
      <p style={{ fontSize: "15px", fontWeight: 600, marginBottom: "4px" }}>
        Netflix 电影和电视节目收视分析
      </p>
      <p style={{ color: "rgba(255,255,255,.45)", fontSize: "13px" }}>
        需求分析 &nbsp;·&nbsp; 数据预处理 &nbsp;·&nbsp; 可视化 &nbsp;·&nbsp; 机器学习 &nbsp;·&nbsp; 结论
      </p>
      <p style={{ marginTop: "8px", fontSize: "12px", color: "rgba(255,255,255,.3)" }}>
        数据来源：Netflix Titles Dataset &nbsp;·&nbsp; 8,807 条记录
      </p>
    </footer>
  );
}
