'use client';

import { gsap } from '@/lib/gsap';
import { OPERA_GAME_FRAGMENT, OPERA_GAME_VERTEX } from '@/lib/shaders/operaGame';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const tHero = useTranslations('hero');
  const tCommon = useTranslations('common');
  const sectionRef = useRef<HTMLElement>(null);
  const shaderLayerRef = useRef<HTMLDivElement>(null);
  const shaderCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 1.9 });
      tl.fromTo(
        '.hero-eyebrow',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
        .fromTo(
          '.hero-line',
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: 'power3.out' },
          '-=0.4'
        )
        .fromTo(
          '.hero-tagline',
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.35'
        )
        .fromTo(
          '.hero-cta',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.3'
        );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const canvas = shaderCanvasRef.current;
    const layer = shaderLayerRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', {
      antialias: false,
      alpha: true,
      premultipliedAlpha: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) {
      console.warn(
        'Hero (Opera Game): WebGL2 is required — the board encoder uses 32-bit integer bitwise ops.'
      );
      return;
    }

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn('Opera Game shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, OPERA_GAME_VERTEX);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, OPERA_GAME_FRAGMENT);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('Opera Game shader link error:', gl.getProgramInfoLog(program));
      return;
    }

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = layer?.clientWidth ?? canvas.clientWidth;
      const h = layer?.clientHeight ?? canvas.clientHeight;
      const width = Math.max(1, Math.floor(w * dpr));
      const height = Math.max(1, Math.floor(h * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const ro = new ResizeObserver(() => resize());
    if (layer) ro.observe(layer);

    const render = () => {
      resize();
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, (performance.now() - start) * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    gsap.ticker.add(render);
    window.addEventListener('resize', resize, { passive: true });

    return () => {
      ro.disconnect();
      gsap.ticker.remove(render);
      window.removeEventListener('resize', resize);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <section id="hero" ref={sectionRef} className={styles.heroContainer}>
      <div ref={shaderLayerRef} className={styles.shaderLayer} aria-hidden="true">
        <canvas ref={shaderCanvasRef} className={styles.shaderCanvas} />
      </div>
      <div className={styles.gradientOverlay} />
      {/* background decoration */}
      <div className={styles.bgKing} aria-hidden="true">
        ♔
      </div>
      <span className={styles.sectionNum} aria-hidden="true">
        01 — Hero
      </span>
      <div className={styles.contentWrapper}>
        <div className={`hero-eyebrow ${styles.heroEyebrow}`}>
          <span className={styles.heroEyebrowLine} />
          {tHero('openingMove')}
        </div>

        <h1 className={styles.heroTitle}>
          <span className={styles.titleLineWrapper}>
            <span className={`hero-line ${styles.titleLine}`}>
              {tHero('titleLine1')} <span className="gradient-text">{tHero('titleLine2')}</span>
            </span>
          </span>
          <span className={styles.titleLineWrapper}>
            <span className={`hero-line ${styles.titleLine}`}>{tHero('titleLine3')}</span>
          </span>
        </h1>

        <p className={`hero-tagline ${styles.heroTagline}`}>{tHero('tagline')}</p>

        <div className={`hero-cta ${styles.heroCta}`}>
          <a href="#projects" className={styles.primaryButton}>
            {tCommon('viewWork')} <span>→</span>
          </a>
          <a href="#contact" className={styles.secondaryButton}>
            {tCommon('getInTouch')} <span>↗</span>
          </a>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <div className={`animate-scroll-pulse ${styles.scrollLine}`} />
        <span>{tCommon('scroll')}</span>
      </div>
    </section>
  );
}
