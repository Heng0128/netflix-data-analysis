interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

/**
 * 子页面统一标题区：眉标 + 主标题 + 红色装饰下划线
 */
export default function PageHeader({ eyebrow, title, subtitle }: Props) {
  return (
    <div className="text-center mb-14">
      <div className="inline-block px-3 py-1 mb-4 rounded-full glass-card text-xs tracking-widest uppercase text-[#E50914]">
        {eyebrow}
      </div>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
        {title}
      </h2>
      <div className="w-16 h-1 mx-auto rounded-full bg-gradient-to-r from-transparent via-[#E50914] to-transparent" />
      {subtitle && (
        <p className="mt-5 text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
