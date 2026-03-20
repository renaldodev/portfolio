'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import styles from './TimelineSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const events = [
  { key: 'e1' },
  { key: 'e2' },
  { key: 'e3' },
  { key: 'e4' },
];

export default function TimelineSection() {
  const t = useTranslations('timeline');
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      gsap.fromTo(progressRef.current, { width: '0%', height: '100%' }, {
        width: '100%', ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current, start: 'top 60%', end: 'bottom 80%', scrub: 1,
        },
      });
      gsap.fromTo('.tl-item', { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
      });
    }, sectionRef);

    mm.add("(max-width: 767px)", () => {
      gsap.fromTo(progressRef.current, { height: '0%', width: '100%' }, {
        height: '100%', ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current, start: 'top 60%', end: 'bottom 85%', scrub: 1,
        },
      });

      const items = document.querySelectorAll<HTMLElement>('.tl-item');
      items.forEach((item) => {
        gsap.fromTo(item, { opacity: 0, x: -28 }, {
          opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%'
          },
        });
      });
    }, sectionRef);

    return () => mm.revert();
  }, []);

  return (
    <section id="timeline" ref={sectionRef} className={styles.timelineContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.timelineEyebrow}>
          <span className={styles.timelineEyebrowLine} />
          {t('gameTimeline')} <span className={styles.timelineEyebrowNumber}>— 05</span>
        </div>
        <h2 className={styles.timelineTitle}>
          {t('careerMoves')}
        </h2>

        <div className={styles.progressContainer}>
          <div className={styles.progressTrack}>
            <div
              ref={progressRef}
              className={styles.progressFill}
            />
          </div>

          <div className={styles.eventsGrid}>
            {events.map((e, i) => (
              <div key={e.key} className={`tl-item ${styles.timelineItem}`}>
                <div
                  className={`${styles.timelineDot} ${i === events.length - 1 ? styles.timelineDotActive : ''}`}
                />
                <div className={styles.eventDate}>
                  {t(`${e.key}Date`)}
                </div>
                <div className={styles.eventRole}>{t(`${e.key}Role`)}</div>
                <div className={styles.eventCompany}>{t(`${e.key}Company`)}</div>
                <div className={styles.eventDesc}>{t(`${e.key}Desc`)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}