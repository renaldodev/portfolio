'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();

  const currentLabel = locale === 'en' ? 'EN' : 'PT';
  const otherLocale = locale === 'en' ? 'pt' : 'en';
  const otherLabel = otherLocale === 'en' ? 'EN' : 'PT';

  const handleSwitch = () => {
    // Get current path without locale prefix
    const pathname = window.location.pathname;
    // Replace locale in path or add if missing
    const newPath = pathname
      .replace(/^\/(en|pt)/, `/${otherLocale}`)
      .replace(/^\/$/, `/${otherLocale}`);
    router.replace(newPath);
  };

  return (
    <button
      type="button"
      className={styles.languageSwitcher}
      onClick={handleSwitch}
      aria-label={t('switchLanguage') || `Switch to ${otherLabel}`}
    >
      <span className={styles.current}>{currentLabel}</span>
      <span className={styles.separator}>/</span>
      <span className={styles.other}>{otherLabel}</span>
    </button>
  );
}
