'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './Nav.module.css';

const links = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Timeline', href: '#timeline' },
    { label: 'Contact', href: '#contact' },
];

export default function Nav() {
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        gsap.fromTo(
            navRef.current,
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 2.2 }
        );
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <nav
            ref={navRef}
            className={styles.navContainer}
            style={{ opacity: 0 }}
        >
            {/* Logo */}
            <div className={styles.logo}>
                <span className={styles.logoIcon}>♔</span> Renaldo
            </div>

            {/* Links */}
            <ul className={styles.linksList}>
                {links.map(l => (
                    <li key={l.href}>
                        <a
                            href={l.href}
                            onClick={e => handleClick(e, l.href)}
                            className={styles.navLink}
                        >
                            {l.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
