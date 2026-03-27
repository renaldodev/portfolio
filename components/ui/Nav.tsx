'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import styles from './Nav.module.css';

const SECTION_IDS = ['hero', 'about', 'skills', 'projects', 'timeline', 'contact'];

export default function Nav() {
  const t = useTranslations('nav');
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // ── Scroll state ────────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Active section via scroll position ──────────────────────────────────────
  useEffect(() => {
    const update = () => {
      const mid = window.scrollY + window.innerHeight * 0.35;
      let current = 0;
      SECTION_IDS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= mid) current = i;
      });
      setActiveIndex(current);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  // ── Lock body scroll when menu open ─────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // ── Entry animation ──────────────────────────────────────────────────────────
  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -24, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', delay: 2.3 }
    );
  }, []);

  const links = [
    { label: t('about'),    href: '#about',    idx: 1 },
    { label: t('skills'),   href: '#skills',   idx: 2 },
    { label: t('projects'), href: '#projects', idx: 3 },
    { label: t('timeline'), href: '#timeline', idx: 4 },
    { label: t('contact'),  href: '#contact',  idx: 5 },
  ];

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollTo(href);
  };

  const pad = (n: number) => String(n + 1).padStart(2, '0');
  const total = String(SECTION_IDS.length).padStart(2, '0');

  return (
    <>
      {/* ── Main bar ─────────────────────────────────────────────────────────── */}
      <nav
        ref={navRef}
        style={{ opacity: 0 }}
        className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}
      >
        {/* Logo */}
        <button
          type="button"
          onClick={() => scrollTo('#hero')}
          className={styles.logo}
        >
          <span className={styles.logoPiece}>♔</span>
          {t('logo')}
        </button>

        {/* Centre links – desktop */}
        <ul className={styles.links}>
          {links.map(l => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={e => handleClick(e, l.href)}
                className={`${styles.link} ${activeIndex === l.idx ? styles.linkActive : ''}`}
              >
                <span className={styles.linkInner}>
                  <span className={styles.linkTop}>{l.label}</span>
                  <span className={styles.linkBottom} aria-hidden="true">{l.label}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* Right cluster */}
        <div className={styles.right}>
          {/* Section counter */}
          <span className={styles.counter} aria-hidden="true">
            <span className={styles.counterCurrent}>{pad(activeIndex)}</span>
            <span className={styles.counterSlash}>/</span>
            <span className={styles.counterTotal}>{total}</span>
          </span>

          <ThemeToggle />
          <LanguageSwitcher />

          {/* CTA pill */}
          <button
            type="button"
            onClick={() => { setMenuOpen(false); scrollTo('#contact'); }}
            className={styles.cta}
          >
            Let&apos;s Talk
            <span className={styles.ctaDot} aria-hidden="true" />
          </button>

          {/* Hamburger – mobile only */}
          <button
            type="button"
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* ── Mobile overlay ───────────────────────────────────────────────────── */}
      <div
        className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ''}`}
        aria-hidden={!menuOpen}
      >
        <ul className={styles.overlayLinks}>
          {links.map((l, i) => (
            <li
              key={l.href}
              className={styles.overlayItem}
              style={{ transitionDelay: menuOpen ? `${i * 0.055 + 0.05}s` : '0s' }}
            >
              <a
                href={l.href}
                onClick={e => handleClick(e, l.href)}
                className={styles.overlayLink}
              >
                <span className={styles.overlayNum}>0{l.idx}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.overlayFooter}>
          <LanguageSwitcher />
        </div>
      </div>
    </>
  );
}
