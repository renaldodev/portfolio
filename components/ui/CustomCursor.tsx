'use client';

import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      if (cursorRef.current) cursorRef.current.style.display = 'none';
      return;
    }

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;

    if (!cursor || !dot || !ring) return;

    // Hide cursor until first mouse move
    cursor.style.opacity = '0';
    cursor.style.transition = 'opacity 0.3s ease';

    const pos = { x: 0, y: 0 };
    const dotPos = { x: 0, y: 0 };
    const ringPos = { x: 0, y: 0 };

    const xDotSet = gsap.quickSetter(dot, 'x', 'px');
    const yDotSet = gsap.quickSetter(dot, 'y', 'px');
    const xRingSet = gsap.quickSetter(ring, 'x', 'px');
    const yRingSet = gsap.quickSetter(ring, 'y', 'px');

    let hasMoved = false;

    const onMove = (e: MouseEvent) => {
      if (!hasMoved) {
        hasMoved = true;
        cursor.style.opacity = '1';
      }
      pos.x = e.clientX;
      pos.y = e.clientY;
    };

    const ticker = () => {
      const dt = 1.0 - Math.pow(1.0 - 0.35, gsap.ticker.deltaRatio());
      const rt = 1.0 - Math.pow(1.0 - 0.15, gsap.ticker.deltaRatio());

      dotPos.x += (pos.x - dotPos.x) * dt;
      dotPos.y += (pos.y - dotPos.y) * dt;
      ringPos.x += (pos.x - ringPos.x) * rt;
      ringPos.y += (pos.y - ringPos.y) * rt;

      xDotSet(dotPos.x);
      yDotSet(dotPos.y);
      xRingSet(ringPos.x);
      yRingSet(ringPos.y);
    };

    gsap.ticker.add(ticker);
    window.addEventListener('mousemove', onMove);

    const addHover = () => cursor.classList.add('cursor-hover');
    const removeHover = () => cursor.classList.remove('cursor-hover');

    const els = document.querySelectorAll('a, button, [data-hoverable]');
    for (const el of els) {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', removeHover);
    }

    return () => {
      gsap.ticker.remove(ticker);
      window.removeEventListener('mousemove', onMove);
      for (const el of els) {
        el.removeEventListener('mouseenter', addHover);
        el.removeEventListener('mouseleave', removeHover);
      }
    };
  }, []);

  return (
    <div ref={cursorRef} className="cursor">
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </div>
  );
}
