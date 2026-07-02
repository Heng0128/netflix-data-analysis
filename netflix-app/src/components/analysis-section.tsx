import type { NetflixStats } from '@/lib/netflix-data';
import PageHeader from '@/components/page-header';

interface Props {
  stats: NetflixStats;
}

const DATASET_INFO = [
  { label: '数据来源', value: 'Netflix 公开数据集' },
  { label: '总记录数', value: '8,807 条' },
  { label: '字段数', value: '12 列原始 + 5 列衍生' },
  { label: '时间跨度', value: '1925 — 2021' },
  { label: '内容类型', value: '电影 / 电视节目' },
  { label: '覆盖国家', value: '120+ 个' },
];

const VARIABLES = [
  { name: 'show_id', type: '字符串', desc: '每条内容的唯一标识符' },
  { name: 'type', type: '分类', desc: '内容类型：Movie 或 TV Show' },
  { name: 'title', type: '字符串', desc: '电影或电视节目名称' },
  { name: 'director', type: '字符串', desc: '导演（电视节目可能缺失）' },
  { name: 'cast', type: '字符串', desc: '主要演员列表' },
  { name: 'country', type: '字符串', desc: '制作国家' },
  { name: 'date_added', type: '日期', desc: '添加到 Netflix 的日期' },
  { name: 'release_year', type: '数值', desc: '原始发布年份' },
  { name: 'rating', type: '分类', desc: '年龄评级（如 TV-MA, PG-13）' },
  { name: 'duration', type: '字符串', desc: '电影（分钟）/ 剧集（季）' },
  { name: 'listed_in', type: '字符串', desc: '所属流派分类' },
  { name: 'description', type: '文本', desc: '内容简短概述' },
];

const DERIVED_VARS = [
  { name: 'duration_num', desc: '从 duration 提取的数值时长（分钟）' },
  { name: 'date_added_parsed', desc: '从 date_added 解析的标准日期格式' },
  { name: 'year_added', desc: '从 date_added 解析的添加年份' },
  { name: 'month_added', desc: '从 date_added 解析的添加月份' },
  { name: 'primary_country', desc: '多国家取首个作为主要制作国' },
];

const GOALS = [
  {
    icon: '🔍',
    title: '探索内容分布特征',
    desc: '分析电影与剧集的比例、时长分布、评级构成，理解 Netflix 平台内容的整体结构。',
  },
  {
    icon: '🌍',
    title: '研究地域与时间趋势',
    desc: '考察不同国家内容产出、年度发布趋势，识别流媒体市场的全球化与本土化特征。',
  },
  {
    icon: '🤖',
    title: '建立内容类型预测模型',
    desc: '基于时长、评级、年份等特征，使用随机森林分类算法预测内容类型（电影 / 剧集）。',
  },
  {
    icon: '💡',
    title: '提出策略性建议',
    desc: '基于数据洞察，为内容采购、市场布局、推荐算法优化提供数据驱动的决策依据。',
  },
];

export default function AnalysisSection({ stats }: Props) {
  const insights = [
    {
      title: '电影主导市场',
      desc: `电影占比达 ${stats.moviePercent}%，远超剧集，反映 Netflix 早期以电影为核心的内容策略。`,
      icon: '🎬',
      stat: `${stats.moviePercent}%`,
    },
    {
      title: '时长集中趋势',
      desc: `平均时长 ${stats.avgDuration} 分钟，契合通勤观影场景，长篇内容需分段呈现。`,
      icon: '⏱️',
      stat: `${stats.avgDuration} min`,
    },
    {
      title: `${stats.peakYear} 年内容爆发`,
      desc: `平台在 ${stats.peakYear} 年达到内容发布峰值，此后趋于稳定，标志流媒体竞争进入新阶段。`,
      icon: '📈',
      stat: `${stats.peakYear}`,
    },
    {
      title: '美国绝对领先',
      desc: '美国内容产出量远超其他国家，体现全球化与本土化的平衡策略。',
      icon: '🌎',
      stat: stats.topCountries[0]?.country ?? '美国',
    },
  ];

  return (
    <section className="nfl-bg-radial min-h-screen pt-28 pb-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <PageHeader
          eyebrow="Analysis"
          title="深度分析"
          subtitle="数据集背景、变量说明与分析目标"
        />

        {/* 数据集背景 */}
        <div className="glass-card rounded-2xl p-8 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#E50914] to-[#B20710] flex items-center justify-center text-white font-bold">
              📋
            </div>
            <h3 className="text-white text-xl font-semibold">数据集背景</h3>
          </div>
          <p className="text-gray-400 leading-relaxed mb-6">
            Netflix 作为全球领先的流媒体平台，截至 2021 年中期在平台上提供超过 8,000 部电影和电视节目，全球订阅用户超过 2 亿。本数据集全面编录了 Netflix 的所有内容，涵盖演员、导演、评分、发行年份、时长等关键信息，是分析内容趋势与流派受欢迎程度的宝贵资源。
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {DATASET_INFO.map((d) => (
              <div
                key={d.label}
                className="rounded-xl p-4 bg-white/[0.02] border border-white/5"
              >
                <div className="text-gray-500 text-xs mb-1">{d.label}</div>
                <div className="text-white font-semibold text-sm">{d.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 关键发现 */}
        <div className="mb-10">
          <h3 className="text-white text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-1 h-7 rounded-full bg-[#E50914]" />
            关键发现
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insights.map((insight) => (
              <div
                key={insight.title}
                className="glass-card glass-card-hover rounded-2xl p-8 flex gap-5"
              >
                <div className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#E50914]/20 to-transparent border border-[#E50914]/30 flex items-center justify-center text-3xl">
                  {insight.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3 mb-2">
                    <h4 className="text-white text-xl font-semibold">{insight.title}</h4>
                    <span className="text-[#E50914] font-bold text-sm whitespace-nowrap">
                      {insight.stat}
                    </span>
                  </div>
                  <p className="text-gray-400 leading-relaxed text-sm">{insight.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 变量说明 */}
        <div className="glass-card rounded-2xl p-8 mb-10 overflow-hidden">
          <h3 className="text-white text-xl font-semibold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#E50914] to-[#B20710] flex items-center justify-center text-white">
              🗂
            </span>
            变量说明
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="py-3 px-4 text-[#E50914] font-semibold">字段名</th>
                  <th className="py-3 px-4 text-[#E50914] font-semibold">类型</th>
                  <th className="py-3 px-4 text-[#E50914] font-semibold">说明</th>
                </tr>
              </thead>
              <tbody>
                {VARIABLES.map((v) => (
                  <tr
                    key={v.name}
                    className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-white">{v.name}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-xs bg-[#E50914]/20 text-[#E50914]">
                        {v.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{v.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="text-white text-base font-semibold mt-8 mb-4">衍生特征（数据预处理生成）</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DERIVED_VARS.map((v) => (
              <div
                key={v.name}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5"
              >
                <span className="text-[#E50914] mt-0.5">▸</span>
                <div>
                  <code className="text-white font-mono text-sm">{v.name}</code>
                  <p className="text-gray-500 text-xs mt-1">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 分析目标 */}
        <div>
          <h3 className="text-white text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-1 h-7 rounded-full bg-[#E50914]" />
            分析目标
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GOALS.map((g, i) => (
              <div
                key={g.title}
                className="glass-card glass-card-hover rounded-2xl p-6 flex gap-4"
              >
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                    {g.icon}
                  </div>
                  <div className="text-center text-[#E50914] font-bold text-xs mt-2">
                    0{i + 1}
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">{g.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
