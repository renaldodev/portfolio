'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import styles from './AboutSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const t = useTranslations('about');
  const tCommon = useTranslations('common');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-text > *', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, stagger: 0.14, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      });
      gsap.fromTo('.about-stat', { opacity: 0, y: 28, scale: 0.95 }, {
        opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.7, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: '.about-stats-grid', start: 'top 80%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const stats = [
    { number: '3+', label: tCommon('yearsExperience') },
    { number: '20+', label: tCommon('projectsShipped') },
    { number: '5+', label: tCommon('techStacksMastered') },
    { number: '∞', label: tCommon('coffeeConsumed') },
  ];

  return (
    <section id="about" ref={sectionRef} className={styles.aboutContainer}>
      <div className={styles.contentWrapper}>
        <div className="about-text">
          <div className={styles.aboutEyebrow}>
            <span className={styles.aboutEyebrowLine} />
            {t('boardSetup')} <span className={styles.aboutEyebrowNumber}>— 02</span>
          </div>

          <h2 className={styles.aboutTitle}>
            {t('theMindBehind')}<br />
            <span className="gradient-text">{t('theMoves')}</span>
          </h2>

          <p className={styles.aboutDescription}>
            {t('description1')}
          </p>
          <p className={styles.aboutDescription}>
            {t('description2')}
          </p>

          <div className={`about-stats-grid ${styles.statsGrid}`}>
            {stats.map((s, i) => (
              <div key={i} className={`about-stat ${styles.statCard}`}>
                <div className={`gradient-text ${styles.statNumber}`}>
                  {s.number}
                </div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.visualContainer}>
          <div className={`gradient-text ${styles.kingPiece}`}>♔</div>
          <div className={styles.floatingPieces}>
            {['♜', '♝', '♞', '♟'].map((p, i) => (
              <span key={i} className={`animate-float-${i} ${styles.floatingPiece}`}>{p}</span>
            ))}
          </div>
          <div className={styles.radialGlow} />
        </div>
      </div>
    </section>
  );
}