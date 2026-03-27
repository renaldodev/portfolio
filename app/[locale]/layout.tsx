import CookieBanner from '@/components/ui/CookieBanner';
import { ThemeProvider } from '@/contexts/ThemeContext';
import enMessages from '@/messages/en.json';
import ptMessages from '@/messages/pt.json';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { Inter, Syne } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});
const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Renaldo – Strategic Software Engineer',
  description:
    'Portfolio of Renaldo, a Strategic Software Engineer specializing in backend, AI/automation, and frontend engineering. Chess-themed scrollytelling experience.',
  keywords: [
    'portfolio',
    'software engineer',
    'developer',
    'AI',
    'backend',
    'fullstack',
    'React',
    'Node.js',
  ],
  openGraph: {
    title: 'Renaldo – Strategic Software Engineer',
    description: 'An Awwwards-level chess-themed portfolio experience.',
    type: 'website',
  },
};

type Messages = typeof enMessages;

const messagesMap: Record<string, Messages> = {
  en: enMessages,
  pt: ptMessages,
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = messagesMap[locale] ?? messagesMap.en;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} ${syne.variable}`}>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            {children}
            <CookieBanner />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
