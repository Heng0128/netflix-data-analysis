'use client';

import { useState, useEffect } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export default function AnimatedNumber({ value, duration = 2000, suffix = '', prefix = '' }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    setDisplay(value);
  }, [value]);

  return (
    <span>
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  );
}
