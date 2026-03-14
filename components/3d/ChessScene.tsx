'use client';

import { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/* ── Audio Engine v4 — lazy unlock após user gesture ── */
function createAudioEngine() {
    let ctx: AudioContext | null = null;
    let unlocked = false;

    function unlock() {
        if (unlocked) return;
        unlocked = true;
        if (!ctx) ctx = new AudioContext();
        if (ctx.state === 'suspended') ctx.resume();
    }

    function getCtx(): AudioContext | null {
        if (!unlocked || !ctx) return null;
        return ctx;
    }

    function playCameraTransition(segmentIndex: number) {
        const ac = getCtx();
        if (!ac) return;

        const notes = [220, 196, 165, 147, 131];
        const freq = notes[segmentIndex % notes.length];

        const osc = ac.createOscillator();
        const gain = ac.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * 2, ac.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq, ac.currentTime + 0.6);

        gain.gain.setValueAtTime(0, ac.currentTime);
        gain.gain.linearRampToValueAtTime(0.12, ac.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 1.2);

        const delay = ac.createDelay(0.5);
        const feedback = ac.createGain();
        const wet = ac.createGain();

        delay.delayTime.setValueAtTime(0.18, ac.currentTime);
        feedback.gain.setValueAtTime(0.25, ac.currentTime);
        wet.gain.setValueAtTime(0.35, ac.currentTime);

        osc.connect(gain);
        gain.connect(ac.destination);
        gain.connect(wet);
        wet.connect(delay);
        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(ac.destination);

        osc.start(ac.currentTime);
        osc.stop(ac.currentTime + 1.4);

        const sub = ac.createOscillator();
        const subG = ac.createGain();

        sub.type = 'sine';
        sub.frequency.setValueAtTime(freq / 2, ac.currentTime);

        subG.gain.setValueAtTime(0, ac.currentTime);
        subG.gain.linearRampToValueAtTime(0.04, ac.currentTime + 0.1);
        subG.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.8);

        sub.connect(subG);
        subG.connect(ac.destination);

        sub.start(ac.currentTime);
        sub.stop(ac.currentTime + 0.9);
    }

    return { playCameraTransition, unlock };
}

const audioEngine = createAudioEngine();

/* ── Responsive Hook ── */
function useViewport() {
    const getState = () => ({
        width: typeof window !== 'undefined' ? window.innerWidth : 1280,
        height: typeof window !== 'undefined' ? window.innerHeight : 800,
        isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
        isTablet: typeof window !== 'undefined'
            ? window.innerWidth >= 768 && window.innerWidth < 1024
            : false,
    });

    const [viewport, setViewport] = useStateCompat(getState);

    useEffect(() => {
        const handleResize = () => setViewport(getState());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return viewport;
}

// tiny helper to avoid importing useState directly (already imported above via React)
import { useState } from 'react';
function useStateCompat<T>(init: () => T) {
    return useState<T>(init);
}

/* ── Context Loss Recovery ── */
function ContextGuard() {
    const { gl } = useThree();
    useEffect(() => {
        const canvas = gl.domElement;
        const handleLost = (e: Event) => { e.preventDefault(); };
        const handleRestored = () => (gl as any).forceContextRestore?.();
        canvas.addEventListener('webglcontextlost', handleLost);
        canvas.addEventListener('webglcontextrestored', handleRestored);
        return () => {
            canvas.removeEventListener('webglcontextlost', handleLost);
            canvas.removeEventListener('webglcontextrestored', handleRestored);
        };
    }, [gl]);
    return null;
}

/* ── Particles ── */
function Particles({ count = 150 }: { count?: number }) {
    const positions = useMemo(() => {
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) p[i] = (Math.random() - 0.5) * 26;
        return p;
    }, [count]);

    const ref = useRef<THREE.Points>(null);

    useFrame(({ clock }) => {
        if (!ref.current) return;
        const maxScroll = document.body.scrollHeight - window.innerHeight || 1;
        const p = Math.min(Math.max((window.scrollY || 0) / maxScroll, 0), 1);
        ref.current.rotation.y = clock.elapsedTime * 0.007 + p * Math.PI;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.05} color="#00f0ff" transparent opacity={0.4} sizeAttenuation />
        </points>
    );
}

/* ── Chess Piece ── */
function ChessPiece({ geometry, material, position, rotation, index = 0 }: any) {
    const g = useRef<THREE.Group>(null);
    useFrame(({ clock }) => {
        if (!g.current) return;
        g.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.8 + index * 0.3) * 0.04;
    });
    return (
        <group ref={g} position={position} rotation={rotation}>
            <mesh castShadow receiveShadow geometry={geometry} material={material} />
        </group>
    );
}

/* ── Board position helpers ── */
const Y = -0.58;
const col = (c: 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h') =>
    ({ a: -1.1, b: -0.825, c: -0.55, d: -0.275, e: 0, f: 0.275, g: 0.55, h: 0.825 }[c]);
const row = (r: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8) =>
    ([1.1, 0.825, 0.55, 0.275, 0, -0.275, -0.55, -0.825] as const)[r - 1];

/* ── Board + Pieces ── */
function ChessBoardAndPieces() {
    const { nodes, materials } = useGLTF('/chess_board.glb') as any;
    const wRot: [number, number, number] = [-Math.PI / 2, 0, 0];
    const bRot: [number, number, number] = [-Math.PI / 2, 0, Math.PI];

    return (
        <group scale={2 * 0.003} position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <group rotation={[Math.PI / 2, 0, 0]}>
                <group rotation={[-Math.PI / 2, 0, 0]}>
                    <mesh castShadow receiveShadow geometry={nodes['Chess_Board_08_-_Default_0'].geometry} material={materials['08_-_Default']} />
                    <mesh castShadow receiveShadow geometry={nodes['Chess_Board_07_-_Default_0'].geometry} material={materials['07_-_Default']} />
                    <mesh castShadow receiveShadow geometry={nodes['Chess_Board_03_-_Default_0'].geometry} material={materials['03_-_Default']} />
                    <mesh castShadow receiveShadow geometry={nodes['Chess_Board_02_-_Default_0'].geometry} material={materials['02_-_Default_0']} />
                </group>

                {/* ♔ White King — e4 */}
                <ChessPiece geometry={nodes['W_King_02_-_Default_0'].geometry} material={materials['02_-_Default']} position={[col('e'), Y, row(4)]} rotation={wRot} index={0} />
                {/* ♕ White Queen — d6 */}
                <ChessPiece geometry={nodes['W_Queen_02_-_Default_0'].geometry} material={materials['02_-_Default']} position={[col('d'), Y, row(6)]} rotation={wRot} index={1} />
                {/* ♖ White Rook — h1 */}
                <ChessPiece geometry={nodes['W_Rook_1_02_-_Default_0'].geometry} material={materials['02_-_Default']} position={[col('h'), Y, row(1)]} rotation={wRot} index={2} />
                {/* ♚ Black King — e8 */}
                <ChessPiece geometry={nodes['B_King_01_-_Default_0'].geometry} material={materials['01_-_Default']} position={[col('e'), Y, row(8)]} rotation={bRot} index={3} />
                {/* ♜ Black Rook — a8 */}
                <ChessPiece geometry={nodes['B_Rook_1_01_-_Default_0'].geometry} material={materials['01_-_Default']} position={[col('a'), Y, row(8)]} rotation={bRot} index={4} />
                {/* ♟ Black Pawn — f7 */}
                <ChessPiece geometry={nodes['B_Pawn_1_01_-_Default_0'].geometry} material={materials['01_-_Default']} position={[col('f'), Y, row(7)]} rotation={bRot} index={5} />
            </group>
        </group>
    );
}

/* ── Scene ── */
function Scene({ particleCount }: { particleCount: number }) {
    const g = useRef<THREE.Group>(null);
    useFrame(({ clock }) => {
        if (!g.current) return;
        g.current.rotation.y = Math.sin(clock.elapsedTime * 0.05) * 0.08;
    });
    return (
        <group ref={g}>
            <ChessBoardAndPieces />
            <Particles count={particleCount} />
        </group>
    );
}

/* ── Responsive Camera Points ── */
function getCameraPoints(isMobile: boolean, isTablet: boolean) {
    if (isMobile) {
        return [
            { pos: new THREE.Vector3(0, 4.0, 5.5), look: new THREE.Vector3(0, -0.4, 0) },
            { pos: new THREE.Vector3(0.2, 1.4, 2.8), look: new THREE.Vector3(0, -0.5, 0.27) },
            { pos: new THREE.Vector3(-1.2, 0.8, 1.5), look: new THREE.Vector3(-0.275, -0.4, -0.275) },
            { pos: new THREE.Vector3(1.5, 1.5, -0.3), look: new THREE.Vector3(0, -0.4, -0.825) },
            { pos: new THREE.Vector3(-0.3, 1.0, 3.5), look: new THREE.Vector3(0, -0.5, 0) },
        ];
    }
    if (isTablet) {
        return [
            { pos: new THREE.Vector3(0, 3.6, 5.0), look: new THREE.Vector3(0, -0.4, 0) },
            { pos: new THREE.Vector3(0.3, 1.1, 2.3), look: new THREE.Vector3(0, -0.5, 0.27) },
            { pos: new THREE.Vector3(-1.4, 0.6, 1.2), look: new THREE.Vector3(-0.275, -0.4, -0.275) },
            { pos: new THREE.Vector3(1.7, 1.3, -0.4), look: new THREE.Vector3(0, -0.4, -0.825) },
            { pos: new THREE.Vector3(-0.4, 0.8, 3.2), look: new THREE.Vector3(0, -0.5, 0) },
        ];
    }
    return [
        { pos: new THREE.Vector3(0, 3.2, 4.5), look: new THREE.Vector3(0, -0.4, 0) },
        { pos: new THREE.Vector3(0.3, 1.0, 2.0), look: new THREE.Vector3(0, -0.5, 0.27) },
        { pos: new THREE.Vector3(-1.5, 0.5, 1.0), look: new THREE.Vector3(-0.275, -0.4, -0.275) },
        { pos: new THREE.Vector3(1.8, 1.2, -0.5), look: new THREE.Vector3(0, -0.4, -0.825) },
        { pos: new THREE.Vector3(-0.5, 0.7, 3.0), look: new THREE.Vector3(0, -0.5, 0) },
    ];
}

/* ── Camera + Sound ── */
function CameraRig({ isMobile, isTablet }: { isMobile: boolean; isTablet: boolean }) {
    const { camera } = useThree();
    const targetPos = useRef(new THREE.Vector3());
    const targetLook = useRef(new THREE.Vector3());
    const lastSegment = useRef(-1);
    const hasInteracted = useRef(false);
    const cameraPoints = useMemo(
        () => getCameraPoints(isMobile, isTablet),
        [isMobile, isTablet]
    );

    useEffect(() => {
        const onInteract = () => {
            if (hasInteracted.current) return;
            hasInteracted.current = true;
            audioEngine.unlock(); // ← desbloqueia AudioContext no primeiro gesture
        };
        window.addEventListener('scroll', onInteract, { once: true });
        window.addEventListener('click', onInteract, { once: true });
        window.addEventListener('touchstart', onInteract, { once: true });
        return () => {
            window.removeEventListener('scroll', onInteract);
            window.removeEventListener('click', onInteract);
            window.removeEventListener('touchstart', onInteract);
        };
    }, []);

    useFrame(({ clock }) => {
        const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
        const p = Math.min(Math.max((window.scrollY || 0) / maxScroll, 0), 1);
        const totalSegs = cameraPoints.length - 1;
        const rawIndex = p * totalSegs;
        const startIndex = Math.floor(rawIndex);
        const endIndex = Math.min(startIndex + 1, totalSegs);
        const factor = Math.sin((rawIndex - startIndex) * (Math.PI / 2));

        if (
            startIndex !== lastSegment.current &&
            hasInteracted.current &&
            (rawIndex - startIndex) < 0.15
        ) {
            lastSegment.current = startIndex;
            audioEngine.playCameraTransition(startIndex);
        }

        const startPt = cameraPoints[startIndex];
        const endPt = cameraPoints[endIndex];

        targetPos.current.copy(startPt.pos).lerp(endPt.pos, factor);
        targetPos.current.x += Math.sin(clock.elapsedTime * 0.3) * 0.05;
        targetPos.current.y += Math.sin(clock.elapsedTime * 0.4) * 0.05;

        targetLook.current.copy(startPt.look).lerp(endPt.look, factor);

        camera.position.lerp(targetPos.current, 0.04);
        if (!camera.userData.currentLook)
            camera.userData.currentLook = new THREE.Vector3(0, 0, 0);
        camera.userData.currentLook.lerp(targetLook.current, 0.04);
        camera.lookAt(camera.userData.currentLook);
    });

    return null;
}

/* ── Responsive FOV ── */
function ResponsiveFOV({ isMobile, isTablet }: { isMobile: boolean; isTablet: boolean }) {
    const { camera, size } = useThree();
    useEffect(() => {
        if (camera instanceof THREE.PerspectiveCamera) {
            camera.fov = isMobile ? 60 : isTablet ? 52 : 45;
            camera.updateProjectionMatrix();
        }
    }, [camera, isMobile, isTablet, size]);
    return null;
}

/* ── DPR ── */
const baseDpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1;

/* ── Main Export ── */
export default function ChessScene() {
    const { isMobile, isTablet } = useViewport();

    const particleCount = isMobile ? 60 : isTablet ? 100 : 150;
    const dpr = isMobile ? Math.min(baseDpr, 1.5) : baseDpr;

    const initialCameraPos = useMemo<[number, number, number]>(() => {
        if (isMobile) return [0, 4.0, 5.5];
        if (isTablet) return [0, 3.6, 5.0];
        return [0, 3.2, 4.5];
    }, [isMobile, isTablet]);

    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                touchAction: 'pan-y',
            }}
        >
            <Canvas
                shadows
                dpr={dpr}
                gl={{
                    antialias: !isMobile,
                    alpha: true,
                    powerPreference: isMobile ? 'low-power' : 'default',
                    failIfMajorPerformanceCaveat: false,
                }}
                camera={{
                    fov: isMobile ? 60 : isTablet ? 52 : 45,
                    position: initialCameraPos,
                    near: 0.1,
                    far: 200,
                }}
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    position: 'absolute',
                    inset: 0,
                }}
            >
                <ContextGuard />
                <ResponsiveFOV isMobile={isMobile} isTablet={isTablet} />
                <CameraRig isMobile={isMobile} isTablet={isTablet} />

                <ambientLight intensity={0.5} color="#1a1a3a" />
                <directionalLight
                    position={[5, 10, 5]}
                    intensity={1.5}
                    color="#ffffff"
                    castShadow={!isMobile}
                />
                <pointLight position={[0, 6, 0]} intensity={2} color="#00f0ff" distance={18} decay={2} />
                <pointLight position={[-4, 4, 4]} intensity={1.5} color="#9b5de5" distance={15} decay={2} />
                {!isMobile && (
                    <pointLight position={[4, 4, -4]} intensity={1} color="#f72585" distance={12} decay={2} />
                )}

                <Suspense fallback={null}>
                    <Scene particleCount={particleCount} />
                </Suspense>
            </Canvas>
        </div>
    );
}
