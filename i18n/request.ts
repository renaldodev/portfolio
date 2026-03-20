import { getRequestConfig } from 'next-intl/server';
import { routing } from '../routing';
import path from 'path';

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is defined
  const currentLocale = locale || routing.defaultLocale;
  console.log('[i18n] Request config - locale param:', locale, 'using:', currentLocale);
  console.log('[i18n] CWD:', process.cwd());

  let messages: Record<string, Record<string, string>> = {};

  try {
    // Load the entire messages file for the locale
    const allMessages = (await import(`../messages/${currentLocale}.json`)).default;
    messages = allMessages;
  } catch (error) {
    // If locale-specific messages don't exist, fall back to default locale
    if (currentLocale !== routing.defaultLocale) {
      messages = (await import(`../messages/${routing.defaultLocale}.json`)).default;
    }
  }

  return {
    messages,
    locale: currentLocale,
  };
});