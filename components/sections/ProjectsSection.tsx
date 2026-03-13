'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ProjectsSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const projects = [
    {
        num: '01', title: 'AI Scheduling Agent',
        desc: 'Autonomous agent that manages complex scheduling, resolves conflicts, and learns from user patterns using LLMs.',
        tags: ['Python', 'LangChain', 'OpenAI', 'FastAPI'], href: '#',
    },
    {
        num: '02', title: 'Real-time Analytics Platform',
        desc: 'High-throughput event processing pipeline with live dashboards serving 100k+ events/day without breaking a sweat.',
        tags: ['Node.js', 'TypeScript', 'Redis', 'WebSocket', 'PostgreSQL'], href: '#',
    },
    {
        num: '03', title: 'Design System & Component Library',
        desc: 'Scalable, accessible component library powering multiple products. Zero external dependencies.',
        tags: ['React', 'TypeScript', 'Storybook', 'CSS'], href: '#',
    },
    {
        num: '04', title: 'Document Intelligence API',
        desc: 'RAG-powered API that extracts, classifies, and answers questions from enterprise documents at scale.',
        tags: ['Python', 'LLM', 'Vector DB', 'FastAPI', 'S3'], href: '#',
    },
];

export default function ProjectsSection() {
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
            {/* Header */}
            <div className={styles.headerContainer}>
                <div className={styles.projectsEyebrow}>
                    <span className={styles.projectsEyebrowLine} />
                    Midgame Tactics <span className={styles.projectsEyebrowNumber}>— 04</span>
                </div>
                <h2 className={styles.projectsTitle}>
                    Selected <span className="gradient-text">Work</span>
                </h2>
            </div>

            {/* Project rows */}
            <div className="projects-list">
                {projects.map(p => (
                    <a
                        key={p.num}
                        href={p.href}
                        className={styles.projectRow}
                    >
                        {/* Number */}
                        <span className={styles.projectNumber}>[{p.num}]</span>

                        {/* Info */}
                        <div className={styles.projectInfo}>
                            <div className={styles.projectTitle}>
                                {p.title}
                            </div>
                            <div className={styles.projectDesc}>{p.desc}</div>
                        </div>

                        {/* Tags (hidden on small screens) */}
                        <div className={styles.tagsContainer}>
                            {p.tags.map(t => (
                                <span key={t} className={styles.projectTag}>{t}</span>
                            ))}
                        </div>

                        {/* Arrow */}
                        <span className={styles.projectArrow}>↗</span>
                    </a>
                ))}
                <div className={styles.finalBorder} />
            </div>
        </section>
    );
}
