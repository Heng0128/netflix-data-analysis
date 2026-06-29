import CodeShowcase from '@/components/code-showcase';

export const metadata = {
  title: '代码实现',
  description: 'Python + Pandas + Scikit-Learn 数据分析核心代码展示：数据预处理、类型统计、年份趋势、随机森林分类、特征重要性。',
};

export default function CodePage() {
  return (
    <main>
      <CodeShowcase />
    </main>
  );
}
