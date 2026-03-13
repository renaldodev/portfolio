'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Loader({ onComplete }: { onComplete: () => void }) {
    const loaderRef = useRef<HTMLDivElement>(null);
    const fillRef = useRef<HTMLDivElement>(null);
    const countRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                gsap.to(loaderRef.current, {
                    yPercent: -100,
                    duration: 0.9,
                    ease: 'power3.inOut',
                    onComplete,
                });
            },
        });
        tl.to(fillRef.current, { width: '100%', duration: 1.4, ease: 'power2.inOut' })
            .to(
                countRef.current,
                {
                    textContent: '100',
                    duration: 1.4,
                    ease: 'power2.inOut',
                    snap: { textContent: 1 },
                    roundProps: 'textContent',
                },
                0
            );
    }, [onComplete]);

    return (
        <div
            ref={loaderRef}
            className="fixed inset-0 z-[10000] bg-[#050509] flex flex-col items-center justify-center gap-8"
        >
            {/* Chess king glyph */}
            <div className="text-7xl" style={{ fontFamily: 'serif' }}>
                <span className="gradient-text">♔</span>
            </div>

            {/* Count */}
            <div className="text-[#6b6b8a] text-xs tracking-[0.25em] uppercase">
                Loading — <span ref={countRef}>0</span>%
            </div>

            {/* Progress bar */}
            <div className="w-48 h-px bg-white/10 rounded overflow-hidden">
                <div
                    ref={fillRef}
                    className="h-full w-0 rounded"
                    style={{ background: 'linear-gradient(90deg, #00f0ff, #9b5de5)' }}
                />
            </div>
        </div>
    );
}
