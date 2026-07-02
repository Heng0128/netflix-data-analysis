import katex from 'katex';

interface MathFormulaProps {
  formula: string;
  displayMode?: boolean;
  className?: string;
}

export default function MathFormula({
  formula,
  displayMode = true,
  className = ''
}: MathFormulaProps) {
  const html = katex.renderToString(formula, {
    displayMode,
    throwOnError: false,
    trust: true,
    strict: false,
  });

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
