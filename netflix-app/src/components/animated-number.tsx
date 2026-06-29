'use client';

import { useState, useEffect, useRef, memo, useCallback } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

let idCounter = 0;

function AnimatedNumberComponent({
  value,
  duration = 2000,
  suffix = '',
  prefix = '',
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);
  const hasAnimated = useRef(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [elementId] = useState(() => `number-${++idCounter}`);

  const startAnimation = useCallback(() => {
    let startTime: number | undefined;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
  }, [value, duration]);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          startAnimation();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [startAnimation]);

  return (
    <span ref={elementRef} id={elementId}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export const AnimatedNumber = memo(AnimatedNumberComponent);
export default AnimatedNumber;
