'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import styles from './ProjectsSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const projectKeys = ['p1', 'p2', 'p3', 'p4'];

// Tags estáticas (não precisam de tradução)
const tagsMap: Record<string, string[]> = {
  p1: ['Python', 'LangChain', 'OpenAI', 'FastAPI'],
  p2: ['Node.js', 'TypeScript', 'Redis', 'WebSocket', 'PostgreSQL'],
  p3: ['React', 'TypeScript', 'Storybook', 'CSS'],
  p4: ['Python', 'LLM', 'Vector DB', 'FastAPI', 'S3'],
};

export default function ProjectsSection() {
  const t = useTranslations('projects');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(`.${styles.projectRow}`, { opacity: 0, x: -24 }, {
        opacity: 1, x: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.projects-list', start: 'top 75%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className={styles.projectsContainer}>
      <div className={styles.headerContainer}>
        <div className={styles.projectsEyebrow}>
          <span className={styles.projectsEyebrowLine} />
          {t('midgameTactics')} <span className={styles.projectsEyebrowNumber}>— 04</span>
        </div>
        <h2 className={styles.projectsTitle}>
          {t('selectedWork')}
        </h2>
      </div>

      <div className="projects-list">
        {projectKeys.map(key => (
          <a
            key={key}
            href="#"
            className={styles.projectRow}
          >
            <span className={styles.projectNumber}>[{t(`${key}Num`, { defaultValue: key.replace('p', '')})}]</span>
            <div className={styles.projectInfo}>
              <div className={styles.projectTitle}>
                {t(`${key}Title`)}
              </div>
              <div className={styles.projectDesc}>{t(`${key}Desc`)}</div>
            </div>
            <div className={styles.tagsContainer}>
              {tagsMap[key].map((tag) => (
                <span key={tag} className={styles.projectTag}>{tag}</span>
              ))}
            </div>
            <span className={styles.projectArrow}>↗</span>
          </a>
        ))}
        <div className={styles.finalBorder} />
      </div>
    </section>
  );
}