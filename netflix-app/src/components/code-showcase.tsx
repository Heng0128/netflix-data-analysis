'use client';

import { useState } from 'react';

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
yearly = df.groupby(['year_added', 'type']).size()
.unstack(fill_value=0)
yearly.plot(kind='line', figsize=(12, 6))
plt.title('Netflix Content by Year')
plt.show()`,

  '时长分析': `import pandas as pd
import seaborn as sns

movies = df[df['type'] == 'Movie']
sns.histplot(data=movies, x='duration_num', bins=30)
plt.title('Movie Duration Distribution')
plt.show()`,
};

const KEYWORDS = ['import', 'from', 'def', 'class', 'return', 'if', 'else', 'for', 'in', 'print', 'pd', 'pd.read_csv', 'groupby', 'value_counts', 'plot', 'show', 'data', 'df'];

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
    <section id="code" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title reveal">代码示例</h2>
        <p className="text-gray-400 text-center mt-4 mb-12 reveal">使用 Python + Pandas 进行数据分析的核心代码</p>

        <div className="flex flex-wrap gap-2 mb-6 justify-center reveal">
          {Object.keys(CODE_SAMPLES).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`code-tab ${activeTab === tab ? 'code-tab-active' : 'code-tab-inactive'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="reveal bg-[#1e1e1e] rounded-2xl p-6 overflow-x-auto border border-white/10 shadow-2xl shadow-black/50">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
            <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
            <span className="ml-2 text-gray-500 text-xs font-mono">analysis.py</span>
          </div>
          <pre className="text-sm font-mono leading-relaxed">
            <code dangerouslySetInnerHTML={{ __html: highlightPython(CODE_SAMPLES[activeTab]) }} />
          </pre>
        </div>
      </div>
    </section>
  );
}
