'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import MouseGlow from '@/components/ui/MouseGlow';
import SmoothScroll from '@/components/providers/SmoothScroll';
import CustomCursor from '@/components/ui/CustomCursor';
import Loader from '@/components/ui/Loader';
import Nav from '@/components/ui/Nav';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import TimelineSection from '@/components/sections/TimelineSection';
import ContactSection from '@/components/sections/ContactSection';
import MarqueeStrip from '@/components/ui/MarqueeStrip';
import styles from './page.module.css';

export default function Home() {
  const t = useTranslations('common');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.documentElement.style.background = '#050509';
    document.body.style.background = '#050509';
  }, []);

  return (
    <>
      <div className={styles.pageWrapper}>
        {!loaded && <Loader onCompleteAction={() => setLoaded(true)} />}
        <MouseGlow />
        <SmoothScroll>
          <CustomCursor />
          <Nav />

          <main className={styles.mainContent}>
            <HeroSection />
            <MarqueeStrip
              items={['Strategic Engineer', 'Backend Systems', 'AI Automation', 'Polished Frontends', 'Chess Theory', 'Open to Work']}
              direction="left"
              speed={25}
            />
            <AboutSection />
            <SkillsSection />
            <ProjectsSection />
            <TimelineSection />
            <ContactSection />
          </main>

          <footer className={styles.appFooter}>
            <span>© 2024 Renaldo. {t('allRightsReserved')}</span>
            <span className={styles.footerBuiltWith}>
              {t('builtWith')} <span className={styles.footerIcon}>♔</span> Next.js · GSAP
            </span>
          </footer>
        </SmoothScroll>
      </div>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
