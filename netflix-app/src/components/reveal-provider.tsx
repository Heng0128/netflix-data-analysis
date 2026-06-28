'use client';

import { useReveal } from '@/hooks/use-reveal';

export default function RevealProvider({ children }: { children: React.ReactNode }) {
  useReveal();
  return <>{children}</>;
}
