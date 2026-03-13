'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './TimelineSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const events = [
    {
        date: '2021 — 2022', role: 'Software Developer', company: 'Early Career',
        desc: 'Built the foundation. Mastered core web technologies, shipped first production systems.',
    },
    {
        date: '2022 — 2023', role: 'Full Stack Engineer', company: 'Universidade do Porto',
        desc: 'Academic research, complex system design, distributed systems and AI fundamentals.',
    },
    {
        date: '2023 — 2024', role: 'Software Engineer', company: 'Tuamateka',
        desc: 'Led product development from zero to production. Built AI automation and scalable APIs.',
    },
    {
        date: '2024 — Present', role: 'Strategic Engineer', company: 'Independent',
        desc: 'Building intelligent systems at the frontier of AI and software. Agents, automation, high-impact products.',
    },
];

export default function TimelineSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(progressRef.current, { width: '0%' }, {
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
        return () => ctx.revert();
    }, []);

    return (
        <section id="timeline" ref={sectionRef} className={styles.timelineContainer}>
            <div className={styles.contentWrapper}>
                <div className={styles.timelineEyebrow}>
                    <span className={styles.timelineEyebrowLine} />
                    Game Timeline <span className={styles.timelineEyebrowNumber}>— 05</span>
                </div>
                <h2 className={styles.timelineTitle}>
                    Career <span className="gradient-text">Moves</span>
                </h2>

                <div className={styles.progressContainer}>
                    {/* Progress line */}
                    <div className={styles.progressTrack}>
                        <div
                            ref={progressRef}
                            className={styles.progressFill}
                        />
                    </div>

                    {/* Items */}
                    <div className={styles.eventsGrid}>
                        {events.map((e, i) => (
                            <div key={i} className="tl-item">
                                <div
                                    className={`${styles.timelineDot} ${i === events.length - 1 ? styles.timelineDotActive : ''}`}
                                />
                                <div className={styles.eventDate}>{e.date}</div>
                                <div className={styles.eventRole}>{e.role}</div>
                                <div className={styles.eventCompany}>{e.company}</div>
                                <div className={styles.eventDesc}>{e.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
