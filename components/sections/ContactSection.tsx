'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import styles from './ContactSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const t = useTranslations('contact');
  const tCommon = useTranslations('common');
  const sectionRef = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-left > *',
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, stagger: 0.11, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      );
      gsap.fromTo(
        '.contact-right',
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.18,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const socials = [
    { key: 'socialGitHub',   href: 'https://github.com/renaldodev',        label: t('socialGitHub') },
    { key: 'socialLinkedIn', href: 'https://linkedin.com/in/renaldodev',   label: t('socialLinkedIn') },
    { key: 'socialEmail',    href: 'mailto:renaldo@example.com',           label: t('socialEmail') },
  ];

  return (
    <section id="contact" ref={sectionRef} className={styles.contactContainer}>
      <div className={styles.inner}>

        {/* ── Left: copy + socials ─────────────────────────────── */}
        <div className={`contact-left ${styles.left}`}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            {t('checkmate')}
            <span className={styles.eyebrowNum}>— 06</span>
          </div>

          <h2 className={styles.title}>
            {t('buildTogether')}<br />
            <span className="gradient-text">{t('together')}</span>
          </h2>

          <p className={styles.description}>{t('description')}</p>

          <nav className={styles.socials} aria-label="Social links">
            {socials.map(s => (
              <a
                key={s.key}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <span>{s.label}</span>
                <span className={styles.socialArrow} aria-hidden="true">↗</span>
              </a>
            ))}
          </nav>
        </div>

        {/* ── Right: form ──────────────────────────────────────── */}
        <div className={`contact-right ${styles.right}`}>
          {!submitted ? (
            <form
              onSubmit={e => { e.preventDefault(); setSubmitted(true); }}
              className={styles.form}
            >
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label htmlFor="contact-name" className={styles.formLabel}>{tCommon('name')}</label>
                  <input
                    id="contact-name"
                    className={styles.formInput}
                    type="text"
                    placeholder={tCommon('namePlaceholder')}
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formField}>
                  <label htmlFor="contact-email" className={styles.formLabel}>{tCommon('email')}</label>
                  <input
                    id="contact-email"
                    className={styles.formInput}
                    type="email"
                    placeholder={tCommon('emailPlaceholder')}
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className={styles.formField}>
                <label htmlFor="contact-message" className={styles.formLabel}>{tCommon('message')}</label>
                <textarea
                  id="contact-message"
                  className={`${styles.formInput} ${styles.formTextarea}`}
                  placeholder={tCommon('messagePlaceholder')}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                {tCommon('sendMessage')}
                <span className={styles.submitIcon} aria-hidden="true">♔</span>
              </button>
            </form>
          ) : (
            <div className={styles.success}>
              <div className={styles.successIcon} aria-hidden="true">♔</div>
              <h3 className={styles.successTitle}>{t('successTitle')}</h3>
              <p className={styles.successText}>{t('successText')}</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
