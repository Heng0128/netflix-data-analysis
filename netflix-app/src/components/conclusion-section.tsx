import type { NetflixStats } from '@/lib/netflix-data';
import PageHeader from '@/components/page-header';

interface Props {
  stats: NetflixStats;
}

const KEY_FINDINGS = [
  {
    icon: '🎬',
    title: '内容结构',
    stat: '69.6%',
    desc: '电影占比约 69.6%（6,131 部），剧集 30.4%（2,676 部）。电影仍是 Netflix 内容主力，但剧集增长速度更快。',
  },
  {
    icon: '📈',
    title: '增长趋势',
    stat: '2019 峰值',
    desc: '内容上架量在 2019 年达峰值（762 部/年），2020 年因疫情下滑约 25%，2021 年继续回调。',
  },
  {
    icon: '🌍',
    title: '地域分布',
    stat: '美国 32%',
    desc: '美国以 2,818 部占绝对主导（32%），印度 972 部、英国 419 部分列二三位，韩国日本快速崛起。',
  },
  {
    icon: '⭐',
    title: '评级分布',
    stat: 'TV-MA 36%',
    desc: 'TV-MA（成人向）3,207 部占比最高（36.4%），TV-14 次之（24.5%），家庭向内容合计不足 10%。',
  },
  {
    icon: '⏱️',
    title: '时长特征',
    stat: '90-120 min',
    desc: '电影时长集中在 90-120 分钟区间（约 3,134 部，占 51%），契合主流院线标准时长。',
  },
  {
    icon: '🎭',
    title: '流派偏好',
    stat: '纪录片第一',
    desc: '纪录片（879）、戏剧（785）、喜剧（653）位列前三，国际内容与真实类内容需求强劲。',
  },
];

const MODEL_METRICS = [
  { label: '模型准确率', value: '99.55%', desc: '测试集准确率' },
  { label: '5 折交叉验证', value: '97.5%', desc: 'Cross-Val Mean' },
  { label: '最强特征 genre', value: '0.807', desc: '特征重要性' },
  { label: '聚类最佳 K', value: '4', desc: '肘部法则确定' },
];

const FEATURE_IMPORTANCE = [
  { name: 'primary_genre', value: 100, label: '内容类型 genre' },
  { name: 'rating_encoded', value: 14, label: '年龄评级 rating' },
  { name: 'primary_country', value: 6, label: '制作国家 country' },
  { name: 'release_year', value: 4, label: '发行年份 year' },
];

const RECOMMENDATIONS = [
  {
    icon: '📺',
    title: '内容策略',
    items: [
      '保持电影内容优势的同时，加速原创剧集投入，缩小与电影的数量差距。',
      '90-120 分钟是电影黄金时长区间，采购与自制应优先匹配该时长带。',
      'TV-MA 成人内容已饱和，建议扩充 TV-G/TV-PG 家庭向内容矩阵。',
    ],
  },
  {
    icon: '🌐',
    title: '市场布局',
    items: [
      '巩固美国本土基本盘，同时降低对单一市场的依赖（现占 32%）。',
      '重点加码印度、韩国、日本三大高增长市场的本土化原创内容。',
      '发挥纪录片与国际内容优势，打造差异化内容标签吸引全球用户。',
    ],
  },
  {
    icon: '🤖',
    title: '算法应用',
    items: [
      'K-Means 4 簇内容群体可直接用于推荐系统的内容画像分层。',
      '随机森林 99.5% 的高准确率验证了 genre 特征的强区分度，可用于内容自动归类。',
      '回归模型 R²=0.48 的上限提示：需引入用户行为数据提升时长预测能力。',
    ],
  },
  {
    icon: '💡',
    title: '数据治理',
    items: [
      'director 字段缺失率高达 30%，建议加强电视节目导演元数据录入规范。',
      '建立 rating/duration 字段校验机制，避免类似 3 条 Louis C.K. 记录的污染问题。',
      '补充 content_age、years_to_netflix 等衍生字段，丰富内容特征维度。',
    ],
  },
];

export default function ConclusionSection({ stats }: Props) {
  return (
    <section className="nfl-bg-radial min-h-screen pt-28 pb-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <PageHeader
          eyebrow="Conclusion"
          title="结论与展望"
          subtitle="基于 9 维可视化分析与机器学习建模的数据驱动洞察"
        />

        {/* 主结论卡 */}
        <div className="glass-card glass-card-hover rounded-2xl p-8 sm:p-10 mb-10">
          <div className="text-5xl sm:text-6xl font-extrabold mb-6 bg-gradient-to-br from-[#E50914] to-[#B20710] bg-clip-text text-transparent">
            {stats.total.toLocaleString()}+
          </div>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            通过对{' '}
            <span className="text-[#E50914] font-semibold">
              {stats.total.toLocaleString()}
            </span>{' '}
            条 Netflix 内容的 9 维可视化分析，我们揭示了流媒体内容生态的核心特征：
            <span className="text-white font-semibold">电影主导、美国领先、成人向为主、纪录片最热</span>。
          </p>
          <p className="text-gray-400 leading-relaxed">
            机器学习进一步验证了内容流派的强区分力（随机森林准确率 99.5%），
            K-Means 聚类识别出 4 类天然内容群体，均可直接应用于推荐系统优化与内容采购决策。
          </p>
        </div>

        {/* 关键发现 */}
        <div className="mb-10">
          <h3 className="text-white text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-1 h-7 rounded-full bg-[#E50914]" />
            关键发现（基于可视化图表）
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {KEY_FINDINGS.map((f) => (
              <div
                key={f.title}
                className="glass-card glass-card-hover rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{f.icon}</span>
                  <span className="text-[#E50914] font-bold text-lg">{f.stat}</span>
                </div>
                <h4 className="text-white font-semibold mb-2">{f.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 算法结果 */}
        <div className="glass-card rounded-2xl p-8 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#E50914] to-[#B20710] flex items-center justify-center text-white font-bold">
              🤖
            </div>
            <h3 className="text-white text-xl font-semibold">机器学习模型结果</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {MODEL_METRICS.map((m) => (
              <div
                key={m.label}
                className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <div className="text-2xl sm:text-3xl font-bold text-[#E50914] mb-1">
                  {m.value}
                </div>
                <div className="text-white text-sm font-medium">{m.label}</div>
                <div className="text-gray-500 text-xs mt-1">{m.desc}</div>
              </div>
            ))}
          </div>

          <h4 className="text-white font-semibold mb-4">特征重要性排序（随机森林分类）</h4>
          <div className="space-y-3">
            {FEATURE_IMPORTANCE.map((f) => (
              <div key={f.name} className="flex items-center gap-4">
                <div className="w-40 shrink-0">
                  <code className="text-white font-mono text-sm">{f.name}</code>
                  <div className="text-gray-500 text-xs">{f.label}</div>
                </div>
                <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#E50914] to-[#FF4D58] transition-all duration-700"
                    style={{ width: `${f.value}%` }}
                  />
                </div>
                <div className="w-14 text-right text-[#E50914] font-semibold text-sm">
                  {f.value}%
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-xs mt-4">
            * 以 genre 特征重要性为基准（100%），其余特征按比例归一化展示
          </p>
        </div>

        {/* 商业建议 */}
        <div className="mb-10">
          <h3 className="text-white text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-1 h-7 rounded-full bg-[#E50914]" />
            策略建议
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {RECOMMENDATIONS.map((r) => (
              <div
                key={r.title}
                className="glass-card glass-card-hover rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E50914]/20 to-transparent border border-[#E50914]/30 flex items-center justify-center text-2xl">
                    {r.icon}
                  </div>
                  <h4 className="text-white text-lg font-semibold">{r.title}</h4>
                </div>
                <ul className="space-y-3">
                  {r.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-gray-400 leading-relaxed"
                    >
                      <span className="text-[#E50914] mt-1 shrink-0">●</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 总结 */}
        <div className="glass-card rounded-2xl p-8 mb-8 text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-white text-xl font-semibold mb-3">核心结论</h3>
          <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Netflix 内容生态呈现&ldquo;电影主导、剧集增长、美国领先、亚洲崛起、成人向为主&rdquo;的整体格局。
            机器学习分析表明，<span className="text-[#E50914] font-semibold">内容流派（genre）是区分电影与剧集的最强特征（重要性 80.7%）</span>，
            4 类 K-Means 聚类群体结构清晰，均可直接应用于推荐系统优化。
            电影时长预测 R² 上限（0.48）提示元数据层面存在信息瓶颈，引入用户行为数据可进一步提升预测能力。
          </p>
        </div>

        {/* 页脚信息 */}
        <div className="text-center text-gray-500 text-xs sm:text-sm glass-card rounded-xl py-4 px-6">
          数据来源：Netflix Titles Dataset &nbsp;|&nbsp; 分析工具：Python + ECharts + Chart.js + Next.js
        </div>
      </div>
    </section>
  );
}
