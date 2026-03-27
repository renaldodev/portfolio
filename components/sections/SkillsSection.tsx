'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import styles from './SkillsSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const groups = [
  {
    piece: '♜',
    color: '#9b5de5',
    translationKey: 'rooks',
    displayWord: 'SYSTEMS.',
    tags: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'REST', 'GraphQL'],
  },
  {
    piece: '♞',
    color: '#f72585',
    translationKey: 'knights',
    displayWord: 'AGENTS.',
    tags: ['LLMs', 'LangChain', 'Python', 'OpenAI', 'RAG', 'Automation', 'ML Pipelines'],
  },
  {
    piece: '♝',
    color: '#00f0ff',
    translationKey: 'bishops',
    displayWord: 'CRAFT.',
    tags: ['React', 'Next.js', 'GSAP', 'TypeScript', 'CSS', 'Figma', 'Performance'],
  },
] as const;

export default function SkillsSection() {
  const t = useTranslations('skills');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      for (const el of document.querySelectorAll(`.${styles.displayWord}`)) {
        gsap.fromTo(
          el,
          { opacity: 0, x: -60, skewX: 4 },
          {
            opacity: 1,
            x: 0,
            skewX: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 82%',
            },
          }
        );
      }
      for (const el of document.querySelectorAll(`.${styles.skillTags}`)) {
        gsap.fromTo(
          el,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
            },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className={styles.skillsContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowLine} />
          {t('piecesPatterns')}
          <span className={styles.eyebrowNum}>— 03</span>
        </div>
        <h2 className={styles.sectionTitle}>
          {t('myArsenal')}
        </h2>
      </div>

      {/* Skill groups */}
      <div className={styles.groups}>
        {groups.map((g, idx) => (
          <div key={g.translationKey} className={styles.group}>
            {/* Row header */}
            <div className={styles.groupHeader}>
              <div className={styles.groupHeaderLeft}>
                <span className={styles.groupPiece} style={{ color: g.color }}>{g.piece}</span>
                <span className={styles.groupLabel} style={{ color: g.color }}>
                  {t(g.translationKey)}
                </span>
                <span className={styles.groupSub}>— {t(`${g.translationKey}Title`)}</span>
              </div>
              <span className={styles.groupCounter} aria-hidden="true">
                0{idx + 1}&nbsp;/&nbsp;0{groups.length}
              </span>
            </div>

            {/* Huge display word */}
            <div
              className={styles.displayWord}
              style={{ color: g.color }}
            >
              {g.displayWord}
            </div>

            {/* Body: desc + tags */}
            <div className={styles.groupBody}>
              <p className={styles.groupDesc}>{t(`${g.translationKey}Desc`)}</p>
              <div className={styles.skillTags}>
                {g.tags.map((tag) => (
                  <span key={tag} className={styles.skillTag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Background decorative piece */}
            <span className={styles.bgPiece} aria-hidden="true">{g.piece}</span>
          </div>
        ))}
        {/* Final border */}
        <div className={styles.finalBorder} />
      </div>
    </section>
  );
}
