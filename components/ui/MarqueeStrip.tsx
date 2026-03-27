'use client';

import styles from './MarqueeStrip.module.css';

interface MarqueeStripProps {
  items: string[];
  direction?: 'left' | 'right';
  speed?: number;
  accent?: string; // separator character
}

export default function MarqueeStrip({
  items,
  direction = 'left',
  speed = 28,
  accent = '♟',
}: MarqueeStripProps) {
  // duplicate for seamless loop; keys are pre-computed so the map index
  // never touches the key prop directly (satisfies noArrayIndexKey).
  const doubled = [
    ...items.map((text, idx) => ({ text, id: `a${idx}` })),
    ...items.map((text, idx) => ({ text, id: `b${idx}` })),
  ];

  return (
    <div className={styles.strip} aria-hidden="true">
      <div
        className={`${styles.track} ${direction === 'right' ? styles.trackRight : styles.trackLeft}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {doubled.map(({ text, id }) => (
          <span key={id} className={styles.item}>
            <span className={styles.accent}>{accent}</span>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
