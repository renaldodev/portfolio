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
      gsap.fromTo(
        '.about-text > *',
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.13,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      );
      gsap.fromTo(
        '.about-stat',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.09,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.about-stats-col', start: 'top 75%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const stats = [
    { number: '3+',  label: tCommon('yearsExperience') },
    { number: '20+', label: tCommon('projectsShipped') },
    { number: '5+',  label: tCommon('techStacksMastered') },
    { number: '∞',   label: tCommon('coffeeConsumed') },
  ];

  return (
    <section id="about" ref={sectionRef} className={styles.aboutContainer}>
      <div className={styles.contentWrapper}>

        {/* ── Left: text ─────────────────────────────────────────── */}
        <div className="about-text">
          <div className={styles.aboutEyebrow}>
            <span className={styles.aboutEyebrowLine} />
            {t('boardSetup')}
            <span className={styles.aboutEyebrowNumber}>— 02</span>
          </div>

          <h2 className={styles.aboutTitle}>
            {t('theMindBehind')}<br />
            <span className="gradient-text">{t('theMoves')}</span>
          </h2>

          <p className={styles.aboutDescription}>{t('description1')}</p>
          <p className={styles.aboutDescription}>{t('description2')}</p>
        </div>

        {/* ── Right: 2×2 stats grid ──────────────────────────── */}
        <div className={`about-stats-col ${styles.statsGrid}`}>
          {stats.map((s) => (
            <div key={s.number} className={`about-stat ${styles.statCard}`}>
              <div className={`gradient-text ${styles.statNumber}`}>{s.number}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
