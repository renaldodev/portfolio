'use client';

import { gsap } from '@/lib/gsap';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import styles from './TimelineSection.module.css';

const events = [{ key: 'e1' }, { key: 'e2' }, { key: 'e3' }, { key: 'e4' }];

export default function TimelineSection() {
  const t = useTranslations('timeline');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.tl-card',
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="timeline" ref={sectionRef} className={styles.timelineContainer}>
      <div className={styles.header}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowLine} />
          {t('gameTimeline')}
          <span className={styles.eyebrowNum}>— 05</span>
        </div>
        <h2 className={styles.title}>{t('careerMoves')}</h2>
      </div>

      <div className={styles.grid}>
        {events.map((e, i) => {
          const isCurrent = i === events.length - 1;
          return (
            <div
              key={e.key}
              className={`tl-card ${styles.card} ${isCurrent ? styles.cardCurrent : ''}`}
            >
              <div className={styles.cardHeader}>
                <span className={styles.cardNum}>0{i + 1}</span>
                {isCurrent && (
                  <span className={styles.currentBadge}>
                    <span className={styles.currentDot} aria-hidden="true" />
                    Now
                  </span>
                )}
              </div>

              <div className={styles.cardDate}>{t(`${e.key}Date`)}</div>

              <div className={styles.cardBody}>
                <div className={styles.cardRole}>{t(`${e.key}Role`)}</div>
                <div className={styles.cardCompany}>{t(`${e.key}Company`)}</div>
              </div>

              <p className={styles.cardDesc}>{t(`${e.key}Desc`)}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
