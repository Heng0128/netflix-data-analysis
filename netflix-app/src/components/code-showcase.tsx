'use client';

import { useState } from 'react';
import PageHeader from '@/components/page-header';

const CODE_SAMPLES: Record<string, string> = {
  '数据读取': `import pandas as pd

df = pd.read_csv('netflix_titles.csv')
print(f"数据集大小: {df.shape}")
print(f"列名: {df.columns.tolist()}")`,

  '类型统计': `import pandas as pd

df = pd.read_csv('netflix_titles.csv')
type_counts = df['type'].value_counts()
print(type_counts)
# Movie      6126
# TV Show    2674`,

  '年份趋势': `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('netflix_titles.csv')
yearly = df.groupby(['year_added', 'type']).size()\\
           .unstack(fill_value=0)
yearly.plot(kind='line', figsize=(12, 6))
plt.title('Netflix Content by Year')
plt.show()`,

  '时长分析': `import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

movies = df[df['type'] == 'Movie']
sns.histplot(data=movies, x='duration_num', bins=30)
plt.title('Movie Duration Distribution')
plt.show()`,
};

const KEYWORDS = ['import', 'from', 'def', 'class', 'return', 'if', 'else', 'for', 'in', 'print', 'pd', 'groupby', 'value_counts', 'plot', 'show', 'data', 'df'];

function highlightPython(code: string): string {
  const lines = code.split('\n');
  return lines.map(line => {
    let result = line
      .replace(/(#.*)$/gm, '<span style="color:#6a9955">$1</span>')
      .replace(/(".*?"|'.*?')/g, '<span style="color:#ce9178">$1</span>');

    KEYWORDS.forEach(kw => {
      const regex = new RegExp(`\\b(${kw})\\b`, 'g');
      result = result.replace(regex, '<span style="color:#569cd6">$1</span>');
    });

    result = result.replace(/\b(\d+)\b/g, '<span style="color:#b5cea8">$1</span>');

    return result;
  }).join('\n');
}

export default function CodeShowcase() {
  const [activeTab, setActiveTab] = useState('数据读取');

  return (
    <section className="nfl-bg-radial min-h-screen pt-28 pb-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        <PageHeader
          eyebrow="Code"
          title="代码实现"
          subtitle="Python + Pandas 数据分析核心片段"
        />

        {/* Tab 切换 */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {Object.keys(CODE_SAMPLES).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-[#E50914] text-white shadow-[0_4px_20px_rgba(229,9,20,0.4)]'
                  : 'glass-card text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 代码块 */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
            <span className="ml-2 text-gray-500 text-xs font-mono">analysis.py</span>
          </div>
          <pre className="p-6 overflow-x-auto text-sm font-mono leading-relaxed bg-[#0d0d0d]">
            <code dangerouslySetInnerHTML={{ __html: highlightPython(CODE_SAMPLES[activeTab]) }} />
          </pre>
        </div>
      </div>
    </section>
  );
}
