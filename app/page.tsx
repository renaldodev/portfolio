'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Analytics } from "@vercel/analytics/next"
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
import styles from './page.module.css';

/**
 * Load ChessScene with next/dynamic (SSR=false).
 * This avoids SSR issues and ensures the module is only loaded once.
 * Critically: we never conditionally unmount this component once mounted,
 * which would destroy the WebGL context.
 */
const ChessScene = dynamic(() => import('@/components/3d/ChessScene'), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.documentElement.style.background = '#050509';
    document.body.style.background = '#050509';
  }, []);

  return (
    <>
      <div className="relative min-h-screen w-full bg-[#050509]">
        {/* Loader */}
        {!loaded && <Loader onComplete={() => setLoaded(true)} />}

        {/*
        Fixed 3D canvas — ALWAYS in the DOM once we first render.
        We hide it with opacity while loading to prevent flash,
        but we NEVER unmount it (that would destroy the WebGL context).
        The canvas itself uses position:absolute inset-0 to fill this wrapper.
      */}
        <div
          className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
          style={{
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        >
          <ChessScene />
        </div>

        <SmoothScroll>
          <CustomCursor />
          <Nav />

          <main className="relative z-10">
            <HeroSection />
            <AboutSection />
            <SkillsSection />
            <ProjectsSection />
            <TimelineSection />
            <ContactSection />
          </main>

          <footer className={styles.appFooter}>
            <span>© 2024 Renaldo. All rights reserved.</span>
            <span className={styles.footerBuiltWith}>
              Built with <span className={styles.footerIcon}>♔</span> Next.js · Three.js · GSAP
            </span>
          </footer>
        </SmoothScroll>
      </div>
      <Analytics />
    </>
  );
}
