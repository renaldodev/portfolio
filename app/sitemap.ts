import type { MetadataRoute } from 'next';

const SITE_URL = 'https://renaldo.dev';
const locales = ['en', 'pt'];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [''].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 1,
    alternates: {
      languages: Object.fromEntries(
        locales.map((locale) => [locale, `${SITE_URL}/${locale}${route}`])
      ),
    },
  }));

  const localeRoutes = locales.flatMap((locale) =>
    [''].map((route) => ({
      url: `${SITE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${route}`])),
      },
    }))
  );

  return [...routes, ...localeRoutes];
}
