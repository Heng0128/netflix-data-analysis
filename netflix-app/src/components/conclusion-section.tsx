import type { NetflixStats } from '@/lib/netflix-data';
import PageHeader from '@/components/page-header';

interface Props {
  stats: NetflixStats;
}

const KEY_FINDINGS = [
  {
    icon: '🎬',
    title: '内容结构',
    stat: `${69.7}%`,
    desc: '电影占比约 69.7%，剧集 30.3%。电影仍是 Netflix 内容主力，但剧集投入比例持续上升。',
  },
  {
    icon: '🌍',
    title: '地域分布',
    stat: '美国',
    desc: '美国内容产出量绝对领先，占比约 36%，印度、英国、日本紧随其后，呈现"美强 + 多元"格局。',
  },
  {
    icon: '⭐',
    title: '评级分布',
    stat: 'TV-MA',
    desc: 'TV-MA（成人观众）数量最多，反映 Netflix 主打成人向内容的策略，覆盖广泛受众。',
  },
  {
    icon: '📅',
    title: '时间趋势',
    stat: `${2019} / ${2020}`,
    desc: '内容添加量在 2019-2020 年达到峰值，标志流媒体竞争进入白热化阶段。',
  },
  {
    icon: '⏱️',
    title: '时长特征',
    stat: '99 min',
    desc: '电影平均时长约 99.6 分钟，90-120 分钟区间最为集中，契合主流院线标准。',
  },
  {
    icon: '🎭',
    title: '流派偏好',
    stat: 'Dramas',
    desc: '剧情类、国际电影、喜剧类内容最受欢迎，反映用户对叙事深度的偏好。',
  },
];

const MODEL_METRICS = [
  { label: '模型准确率', value: '77%', desc: '测试集准确率' },
  { label: '精确率 (Precision)', value: '0.78', desc: '加权平均' },
  { label: '召回率 (Recall)', value: '0.77', desc: '加权平均' },
  { label: 'F1 分数', value: '0.77', desc: '加权平均' },
];

const FEATURE_IMPORTANCE = [
  { name: 'duration_num', value: 100, label: '时长（分钟）' },
  { name: 'rating_encoded', value: 62, label: '评级编码' },
  { name: 'release_year', value: 38, label: '发布年份' },
  { name: 'year_added', value: 24, label: '添加年份' },
  { name: 'country_encoded', value: 12, label: '国家编码' },
];

const RECOMMENDATIONS = [
  {
    icon: '📺',
    title: '内容策略',
    items: [
      '维持电影主导地位的同时，加大原创剧集投入，平衡长短线内容生态。',
      '聚焦 90-120 分钟主流时长区间，兼顾短剧与纪录片等新兴内容形态。',
      '强化 TV-MA 等成人向内容的同时，拓展家庭与儿童细分市场。',
    ],
  },
  {
    icon: '🌐',
    title: '市场布局',
    items: [
      '深耕美国本土市场，保持内容产出绝对优势与品牌影响力。',
      '加速印度、韩国、日本等高增长市场的本土化内容采购与原创。',
      '建立国际合制机制，平衡全球化分发与本土化叙事。',
    ],
  },
  {
    icon: '🤖',
    title: '算法应用',
    items: [
      '基于内容类型预测模型，优化推荐算法的内容分发效率。',
      '利用特征重要性分析指导内容采购决策，识别高价值特征组合。',
      '构建用户偏好与内容特征的匹配模型，提升个性化推荐精度。',
    ],
  },
  {
    icon: '💡',
    title: '内容采购',
    items: [
      '优先采购剧情类、国际电影与喜剧类内容，匹配主流用户偏好。',
      '关注时长在 90-120 分钟的电影与 1-3 季的剧集，符合用户习惯。',
      '建立动态采购模型，根据年度趋势与地域热度调整投入比例。',
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
          subtitle="数据驱动的洞察总结与策略建议"
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
            条 Netflix 内容的深度分析，我们揭示了流媒体时代的内容趋势：
            <span className="text-white font-semibold">电影主导、剧集崛起、美国领先</span>。
          </p>
          <p className="text-gray-400 leading-relaxed">
            数据驱动决策贯穿内容生命周期，理解内容分布是优化推荐算法与投资策略的关键。
            未来趋势指向更多国际内容、短剧与原创制作的持续投入。
          </p>
        </div>

        {/* 关键发现 */}
        <div className="mb-10">
          <h3 className="text-white text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-1 h-7 rounded-full bg-[#E50914]" />
            关键发现
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
            <h3 className="text-white text-xl font-semibold">随机森林模型结果</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {MODEL_METRICS.map((m) => (
              <div
                key={m.label}
                className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <div className="text-3xl font-bold text-[#E50914] mb-1">
                  {m.value}
                </div>
                <div className="text-white text-sm font-medium">{m.label}</div>
                <div className="text-gray-500 text-xs mt-1">{m.desc}</div>
              </div>
            ))}
          </div>

          <h4 className="text-white font-semibold mb-4">特征重要性排序</h4>
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
                <div className="w-10 text-right text-[#E50914] font-semibold text-sm">
                  {f.value}%
                </div>
              </div>
            ))}
          </div>
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
            Netflix 内容生态呈现"电影主导、剧集增长、美国领先、全球多元"的特征。
            通过随机森林模型，我们以{' '}
            <span className="text-[#E50914] font-semibold">77%</span> 的准确率
            验证了内容类型的可预测性，为后续推荐系统与采购决策提供了量化依据。
          </p>
        </div>

        {/* 页脚信息 */}
        <div className="text-center text-gray-500 text-xs sm:text-sm glass-card rounded-xl py-4 px-6">
          数据来源：Netflix Titles Dataset &nbsp;|&nbsp; 分析工具：Python + ECharts + Next.js
        </div>
      </div>
    </section>
  );
}
