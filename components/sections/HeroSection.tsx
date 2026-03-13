'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './HeroSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const tl = gsap.timeline({ delay: 1.9 });
        tl.fromTo('.hero-eyebrow', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
            .fromTo('.hero-line', { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: 'power3.out' }, '-=0.4')
            .fromTo('.hero-tagline', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.35')
            .fromTo('.hero-cta', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');
    }, []);

    return (
        <section
            id="hero"
            ref={sectionRef}
            className={styles.heroContainer}
        >
            {/* Left gradient overlay for text readability */}
            <div className={styles.gradientOverlay} />
            <div className={styles.contentWrapper}>
                {/* Eyebrow */}
                <div className={`hero-eyebrow ${styles.heroEyebrow}`}>
                    <span className={styles.heroEyebrowLine} />
                    Opening Move — Strategic Software Engineer
                </div>

                {/* Title */}
                <h1 className={styles.heroTitle}>
                    <span className={styles.titleLineWrapper}>
                        <span className={`hero-line ${styles.titleLine}`}>I Build <span className="gradient-text">Systems</span></span>
                    </span>
                    <span className={styles.titleLineWrapper}>
                        <span className={`hero-line ${styles.titleLine}`}>That Think.</span>
                    </span>
                </h1>

                {/* Tagline */}
                <p className={`hero-tagline ${styles.heroTagline}`}>
                    Software engineer focused on backend systems, AI agents, and polished frontends.
                    Every project is a calculated move — precise, purposeful, powerful.
                </p>

                {/* CTA */}
                <div className={`hero-cta ${styles.heroCta}`}>
                    <a href="#projects" className={styles.primaryButton}>
                        View My Work <span>→</span>
                    </a>
                    <a href="#contact" className={styles.secondaryButton}>
                        Get in touch <span>↗</span>
                    </a>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className={styles.scrollIndicator}>
                <div className={`animate-scroll-pulse ${styles.scrollLine}`} />
                <span>Scroll</span>
            </div>
        </section>
    );
}
