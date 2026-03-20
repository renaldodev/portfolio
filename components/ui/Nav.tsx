'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import styles from './Nav.module.css';

export default function Nav() {
  const t = useTranslations('nav');
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

  const links = [
    { label: t('about'), href: '#about' },
    { label: t('skills'), href: '#skills' },
    { label: t('projects'), href: '#projects' },
    { label: t('timeline'), href: '#timeline' },
    { label: t('contact'), href: '#contact' },
  ];

  return (
    <nav
      ref={navRef}
      className={styles.navContainer}
      style={{ opacity: 0 }}
    >
      {/* Logo */}
      <div className={styles.logo}>
        <span className={styles.logoIcon}>♔</span> {t('logo')}
      </div>

      {/* Language Switcher */}
      <LanguageSwitcher />

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