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
    tags: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'REST', 'GraphQL'],
  },
  {
    piece: '♞',
    color: '#f72585',
    translationKey: 'knights',
    tags: ['LLMs', 'LangChain', 'Python', 'OpenAI', 'RAG', 'Agents', 'Automation', 'ML Pipelines'],
  },
  {
    piece: '♝',
    color: '#00f0ff',
    translationKey: 'bishops',
    tags: ['React', 'Next.js', 'Three.js', 'GSAP', 'TypeScript', 'CSS', 'Figma', 'Performance'],
  },
];

export default function SkillsSection() {
  const t = useTranslations('skills');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.skill-card', { opacity: 0, y: 50, scale: 0.96 }, {
        opacity: 1, y: 0, scale: 1, stagger: 0.14, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '.skills-grid', start: 'top 75%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className={styles.skillsContainer}
    >
      <div className={styles.header}>
        <div className={styles.skillsEyebrow}>
          <span className={styles.skillsEyebrowLine} />
          {t('piecesPatterns')} <span className={styles.skillsEyebrowNumber}>— 03</span>
          <span className={styles.skillsEyebrowLine} />
        </div>
        <h2 className={styles.skillsTitle}>
          {t('myArsenal')}
        </h2>
        <p className={styles.skillsDescription}>
          {t('description')}
        </p>
      </div>

      <div className={`skills-grid ${styles.skillsGrid}`}>
        {groups.map(g => (
          <div
            key={g.translationKey}
            className={`skill-card ${styles.skillCard}`}
          >
            <span className={styles.skillPiece} style={{ color: g.color }}>{g.piece}</span>
            <div className={styles.skillCategory} style={{ color: g.color }}>{t(`${g.translationKey}`)}</div>
            <h3 className={styles.skillCardTitle}>{t(`${g.translationKey}Title`)}</h3>
            <p className={styles.skillCardDesc}>{t(`${g.translationKey}Desc`)}</p>
            <div className={styles.tagsContainer}>
              {g.tags.map((tag) => (
                <span key={tag} className={styles.skillTag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}