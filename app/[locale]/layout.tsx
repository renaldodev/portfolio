import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import "./globals.css";

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
  title: "Renaldo – Strategic Software Engineer",
  description:
    "Portfolio of Renaldo, a Strategic Software Engineer specializing in backend, AI/automation, and frontend engineering. Chess-themed scrollytelling experience.",
  keywords: ["portfolio", "software engineer", "developer", "AI", "backend", "fullstack", "React", "Node.js"],
  openGraph: {
    title: "Renaldo – Strategic Software Engineer",
    description: "An Awwwards-level chess-themed portfolio experience.",
    type: "website",
  },
};

// Import all messages statically
import enMessages from '@/messages/en.json';
import ptMessages from '@/messages/pt.json';

const messagesMap: Record<string, Record<string, any>> = {
  en: enMessages as Record<string, any>,
  pt: ptMessages as Record<string, any>,
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Get messages for the locale, fallback to English
  const messages = messagesMap[locale] || messagesMap.en;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} ${syne.variable}`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}