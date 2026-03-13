'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './AboutSection.module.css';

const stats = [
    { number: '3+', label: 'Years of experience' },
    { number: '20+', label: 'Projects shipped' },
    { number: '5+', label: 'Tech stacks mastered' },
    { number: '∞', label: 'Coffee consumed' },
];

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
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

    return (
        <section id="about" ref={sectionRef} className={styles.aboutContainer}>
            <div className={styles.contentWrapper}>

                {/* Text */}
                <div className="about-text">
                    <div className={styles.aboutEyebrow}>
                        <span className={styles.aboutEyebrowLine} />
                        Board Setup <span className={styles.aboutEyebrowNumber}>— 02</span>
                    </div>

                    <h2 className={styles.aboutTitle}>
                        The Mind Behind<br />
                        <span className="gradient-text">the Moves</span>
                    </h2>

                    <p className={styles.aboutDescription}>
                        I&apos;m Renaldo, a software engineer who treats every problem like a chess match — studying the board,
                        thinking several moves ahead, and executing with precision.
                    </p>
                    <p className={styles.aboutDescription}>
                        My work spans from robust backend systems and intelligent AI agents to polished,
                        performant frontends. I thrive where complex systems meet elegant user experiences.
                    </p>

                    {/* Stats */}
                    <div className={`about-stats-grid ${styles.statsGrid}`}>
                        {stats.map(s => (
                            <div key={s.label} className={`about-stat ${styles.statCard}`}>
                                <div className={`gradient-text ${styles.statNumber}`}>
                                    {s.number}
                                </div>
                                <div className={styles.statLabel}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Visual */}
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
