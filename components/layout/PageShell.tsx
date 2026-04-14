'use client';

import styles from '@/app/[locale]/page.module.css';
import SmoothScroll from '@/components/providers/SmoothScroll';
import CustomCursor from '@/components/ui/CustomCursor';
import Loader from '@/components/ui/Loader';
import MarqueeStrip from '@/components/ui/MarqueeStrip';
import MouseGlow from '@/components/ui/MouseGlow';
import Nav from '@/components/ui/Nav';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamic imports for performance (code splitting)
const HeroSection = dynamic(() => import('@/components/sections/HeroSection'), { ssr: false });
const AboutSection = dynamic(() => import('@/components/sections/AboutSection'), { ssr: false });
const SkillsSection = dynamic(() => import('@/components/sections/SkillsSection'), { ssr: false });
const ProjectsSection = dynamic(() => import('@/components/sections/ProjectsSection'), {
  ssr: false,
});
const TimelineSection = dynamic(() => import('@/components/sections/TimelineSection'), {
  ssr: false,
});
const ContactSection = dynamic(() => import('@/components/sections/ContactSection'), {
  ssr: false,
});

interface PageShellProps {
  tAllRightsReserved: string;
  tBuiltWith: string;
}

export default function PageShell({ tAllRightsReserved, tBuiltWith }: PageShellProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Basic background setup
    document.documentElement.style.background = '#050509';
    document.body.style.background = '#050509';
  }, []);

  return (
    <div className={styles.pageWrapper}>
      {loaded ? null : <Loader onCompleteAction={() => setLoaded(true)} />}
      <MouseGlow />
      <SmoothScroll>
        <CustomCursor />
        <Nav />

        <main className={styles.mainContent}>
          <HeroSection />
          <MarqueeStrip
            items={[
              'Strategic Engineer',
              'Backend Systems',
              'AI Automation',
              'Polished Frontends',
              'Chess Theory',
              'Open to Work',
            ]}
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
          <span>© 2024 Renaldo. {tAllRightsReserved}</span>
          <span className={styles.footerBuiltWith}>
            {tBuiltWith} <span className={styles.footerIcon}>♔</span> Next.js · GSAP
          </span>
        </footer>
      </SmoothScroll>
    </div>
  );
}
