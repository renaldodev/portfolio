'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (window.matchMedia('(pointer: coarse)').matches) {
            if (cursorRef.current) cursorRef.current.style.display = 'none';
            return;
        }

        // Hide cursor until first mouse move (prevents showing at 0,0)
        if (cursorRef.current) cursorRef.current.style.opacity = '0';
        let hasMoved = false;

        const onMove = (e: MouseEvent) => {
            if (!hasMoved) {
                hasMoved = true;
                if (cursorRef.current) {
                    cursorRef.current.style.opacity = '1';
                    cursorRef.current.style.transition = 'opacity 0.3s ease';
                }
            }
            gsap.to(dotRef.current, { x: e.clientX, y: e.clientY, duration: 0.08, ease: 'power3.out' });
            gsap.to(ringRef.current, { x: e.clientX, y: e.clientY, duration: 0.28, ease: 'power3.out' });
        };

        const addHover = () => cursorRef.current?.classList.add('cursor-hover');
        const removeHover = () => cursorRef.current?.classList.remove('cursor-hover');

        document.addEventListener('mousemove', onMove);
        const els = document.querySelectorAll('a, button, [data-hoverable]');
        els.forEach(el => { el.addEventListener('mouseenter', addHover); el.addEventListener('mouseleave', removeHover); });

        return () => {
            document.removeEventListener('mousemove', onMove);
            els.forEach(el => { el.removeEventListener('mouseenter', addHover); el.removeEventListener('mouseleave', removeHover); });
        };
    }, []);

    return (
        <div ref={cursorRef} className="cursor">
            <div ref={dotRef} className="cursor-dot" />
            <div ref={ringRef} className="cursor-ring" />
        </div>
    );
}
