'use client';

import { gsap } from '@/lib/gsap';
import { useEffect, useRef } from 'react';
import styles from './Loader.module.css';

export default function Loader({ onCompleteAction }: { onCompleteAction: () => void }) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(loaderRef.current, {
          yPercent: -100,
          duration: 0.9,
          ease: 'power3.inOut',
          onComplete: onCompleteAction,
        });
      },
    });
    tl.to(fillRef.current, { width: '100%', duration: 1.4, ease: 'power2.inOut' }).to(
      countRef.current,
      {
        textContent: '100',
        duration: 1.4,
        ease: 'power2.inOut',
        snap: { textContent: 1 },
        roundProps: 'textContent',
      },
      0
    );
  }, [onCompleteAction]);

  return (
    <div ref={loaderRef} className={styles.loader}>
      <div className={styles.king}>
        <span className="gradient-text">♔</span>
      </div>

      <div className={styles.counter}>
        Loading — <span ref={countRef}>0</span>%
      </div>

      <div className={styles.progressTrack}>
        <div ref={fillRef} className={styles.progressFill} />
      </div>
    </div>
  );
}
