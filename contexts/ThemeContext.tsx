'use client';

import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes';
import {
  type ReactNode,
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

type Theme = 'dark' | 'light';
type Consent = 'accepted' | 'declined' | null;

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  consent: Consent;
  acceptCookies: () => void;
  declineCookies: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const CONSENT_KEY = 'cookie-consent';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days = 365) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
}

function ThemeStateProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme, setTheme } = useNextTheme();
  const theme: Theme = resolvedTheme === 'light' ? 'light' : 'dark';
  const [consent, setConsent] = useState<Consent>(null);

  useEffect(() => {
    const savedConsent = getCookie(CONSENT_KEY) as Consent | null;
    setConsent(savedConsent);
  }, []);

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }, [theme, setTheme]);

  const acceptCookies = useCallback(() => {
    setConsent('accepted');
    setCookie(CONSENT_KEY, 'accepted');
  }, []);

  const declineCookies = useCallback(() => {
    setConsent('declined');
    setCookie(CONSENT_KEY, 'declined');
  }, []);

  const value = useMemo(
    () => ({ theme, toggleTheme, consent, acceptCookies, declineCookies }),
    [theme, toggleTheme, consent, acceptCookies, declineCookies]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="theme-pref"
    >
      <ThemeStateProvider>{children}</ThemeStateProvider>
    </NextThemesProvider>
  );
}

export function useTheme(): ThemeContextType {
  const ctx = use(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
