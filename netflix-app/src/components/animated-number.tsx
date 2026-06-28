'use client';

import { useState, useEffect, useRef } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export default function AnimatedNumber({ value, duration = 2000, suffix = '', prefix = '' }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);
  const hasAnimated = useRef(false);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          setTrigger(t => t + 1);
        }
      },
      { threshold: 0.5 }
    );

    const el = document.getElementById(`number-${value}-${suffix}`);
    if (el) observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, suffix]);

  useEffect(() => {
    if (trigger === 0) return;

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

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [trigger, value, duration]);

  return (
    <span id={`number-${value}-${suffix}`}>
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  );
}
