'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './SkillsSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const groups = [
    {
        piece: '♜', color: '#9b5de5', cat: 'Rooks — Backend',
        title: 'Server & Infrastructure',
        desc: 'Rock-solid backends that hold the board together. APIs, databases, cloud infra — the foundation of every system.',
        tags: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'REST', 'GraphQL'],
    },
    {
        piece: '♞', color: '#f72585', cat: 'Knights — AI & Automation',
        title: 'Intelligent Agents',
        desc: 'Knights move in unexpected ways — so do AI systems. Building autonomous agents, pipelines, and smart automation.',
        tags: ['LLMs', 'LangChain', 'Python', 'OpenAI', 'RAG', 'Agents', 'Automation', 'ML Pipelines'],
    },
    {
        piece: '♝', color: '#00f0ff', cat: 'Bishops — Frontend & UX',
        title: 'Interfaces & Experience',
        desc: 'Diagonal thinking for frontend. Fast, beautiful, interactive experiences that make users feel something.',
        tags: ['React', 'Next.js', 'Three.js', 'GSAP', 'TypeScript', 'CSS', 'Figma', 'Performance'],
    },
];

export default function SkillsSection() {
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
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.skillsEyebrow}>
                    <span className={styles.skillsEyebrowLine} />
                    Pieces &amp; Patterns <span className={styles.skillsEyebrowNumber}>— 03</span>
                    <span className={styles.skillsEyebrowLine} />
                </div>
                <h2 className={styles.skillsTitle}>
                    My <span className="gradient-text">Arsenal</span>
                </h2>
                <p className={styles.skillsDescription}>
                    Every piece has a unique power. My skills are no different — each stack plays a distinct, vital role.
                </p>
            </div>

            {/* Cards */}
            <div className={`skills-grid ${styles.skillsGrid}`}>
                {groups.map(g => (
                    <div
                        key={g.cat}
                        className={`skill-card ${styles.skillCard}`}
                    >
                        <span className={styles.skillPiece} style={{ color: g.color }}>{g.piece}</span>
                        <div className={styles.skillCategory} style={{ color: g.color }}>{g.cat}</div>
                        <h3 className={styles.skillCardTitle}>{g.title}</h3>
                        <p className={styles.skillCardDesc}>{g.desc}</p>
                        <div className={styles.tagsContainer}>
                            {g.tags.map(t => (
                                <span key={t} className={styles.skillTag}>
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
