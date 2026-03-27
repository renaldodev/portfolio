'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { useTranslations } from 'next-intl';
import styles from './CookieBanner.module.css';

export default function CookieBanner() {
  const t = useTranslations('cookieBanner');
  const { consent, acceptCookies, declineCookies } = useTheme();

  if (consent !== null) return null;

  return (
    <dialog open className={styles.banner} aria-label={t('ariaLabel')}>
      <div className={styles.content}>
        <span className={styles.icon} aria-hidden="true">
          ♟
        </span>
        <p className={styles.text}>
          {t.rich('description', {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
      </div>
      <div className={styles.actions}>
        <button type="button" onClick={declineCookies} className={styles.decline}>
          {t('decline')}
        </button>
        <button type="button" onClick={acceptCookies} className={styles.accept}>
          {t('accept')}
        </button>
      </div>
    </dialog>
  );
}
