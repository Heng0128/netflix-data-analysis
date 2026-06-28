'use client';

import { useEffect } from 'react';

/**
 * Adds the `is-visible` class to all `.reveal` elements when they
 * scroll into the viewport. Uses IntersectionObserver for performance.
 */
export function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.reveal');

    if (!('IntersectionObserver' in window) || elements.length === 0) {
      elements.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
