'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ── Chess Board ── */
function ChessBoard() {
    const tiles = useMemo(() => {
        const arr = [];
        for (let x = 0; x < 8; x++) {
            for (let z = 0; z < 8; z++) {
                arr.push({ x: x - 3.5, z: z - 3.5, dark: (x + z) % 2 === 1, id: `${x}-${z}` });
            }
        }
        return arr;
    }, []);

    return (
        <group>
            <mesh position={[0, -0.08, 0]} receiveShadow>
                <boxGeometry args={[8.6, 0.14, 8.6]} />
                <meshStandardMaterial color="#0a0a14" metalness={0.3} roughness={0.7} />
            </mesh>
            {tiles.map(({ x, z, dark, id }) => (
                <mesh key={id} position={[x, 0, z]} receiveShadow>
                    <boxGeometry args={[0.93, 0.05, 0.93]} />
                    <meshStandardMaterial
                        color={dark ? '#0d0d1f' : '#1a1a38'}
                        metalness={dark ? 0.4 : 0.1}
                        roughness={0.7}
                    />
                </mesh>
            ))}
            {/* Cyan glow border */}
            <mesh position={[0, -0.01, 0]}>
                <boxGeometry args={[8.8, 0.02, 8.8]} />
                <meshBasicMaterial color="#00f0ff" transparent opacity={0.15} />
            </mesh>
        </group>
    );
}

/* ── Pieces ── */
function King({ pos, color = '#00f0ff' }: { pos: [number, number, number]; color?: string }) {
    const g = useRef<THREE.Group>(null);
    useFrame(({ clock }) => {
        if (!g.current) return;
        g.current.position.y = pos[1] + Math.sin(clock.elapsedTime * 0.8) * 0.05;
        g.current.rotation.y = Math.sin(clock.elapsedTime * 0.4) * 0.1;
    });
    return (
        <group ref={g} position={pos}>
            <mesh position={[0, 0.1, 0]} castShadow>
                <cylinderGeometry args={[0.18, 0.22, 0.2, 8]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.28, 0]} castShadow>
                <cylinderGeometry args={[0.12, 0.18, 0.18, 8]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.46, 0]} castShadow>
                <sphereGeometry args={[0.16, 12, 12]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0.65, 0]} castShadow>
                <cylinderGeometry args={[0.05, 0.05, 0.22, 4]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffaa" emissiveIntensity={1} />
            </mesh>
            <mesh position={[0, 0.65, 0]} rotation={[0, Math.PI / 4, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.22, 4]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffaa" emissiveIntensity={1} />
            </mesh>
        </group>
    );
}

function Rook({ pos, color = '#9b5de5' }: { pos: [number, number, number]; color?: string }) {
    return (
        <group position={pos}>
            <mesh castShadow position={[0, 0.12, 0]}>
                <cylinderGeometry args={[0.19, 0.22, 0.24, 8]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh castShadow position={[0, 0.3, 0]}>
                <cylinderGeometry args={[0.13, 0.19, 0.18, 8]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh castShadow position={[0, 0.42, 0]}>
                <boxGeometry args={[0.3, 0.12, 0.3]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.6} roughness={0.3} />
            </mesh>
        </group>
    );
}

function Knight({ pos, color = '#f72585' }: { pos: [number, number, number]; color?: string }) {
    const g = useRef<THREE.Group>(null);
    useFrame(({ clock }) => {
        if (!g.current) return;
        g.current.position.y = pos[1] + Math.sin(clock.elapsedTime * 1.2 + 1) * 0.04;
    });
    return (
        <group ref={g} position={pos}>
            <mesh castShadow position={[0, 0.12, 0]}>
                <cylinderGeometry args={[0.15, 0.2, 0.24, 8]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} metalness={0.5} roughness={0.5} />
            </mesh>
            <mesh castShadow position={[0.04, 0.35, 0.04]} rotation={[0.3, 0, -0.1]}>
                <icosahedronGeometry args={[0.16, 1]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.7} roughness={0.3} />
            </mesh>
        </group>
    );
}

function Bishop({ pos, color = '#00e5ff' }: { pos: [number, number, number]; color?: string }) {
    return (
        <group position={pos}>
            <mesh castShadow position={[0, 0.12, 0]}>
                <cylinderGeometry args={[0.15, 0.2, 0.24, 8]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh castShadow position={[0, 0.36, 0]}>
                <coneGeometry args={[0.13, 0.3, 8]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.6} roughness={0.3} />
            </mesh>
            <mesh castShadow position={[0, 0.53, 0]}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
            </mesh>
        </group>
    );
}

function Pawn({ pos, color = '#5a5a7a' }: { pos: [number, number, number]; color?: string }) {
    return (
        <group position={pos}>
            <mesh castShadow position={[0, 0.08, 0]}>
                <cylinderGeometry args={[0.11, 0.15, 0.16, 8]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.15} metalness={0.3} roughness={0.7} />
            </mesh>
            <mesh castShadow position={[0, 0.22, 0]}>
                <cylinderGeometry args={[0.07, 0.11, 0.12, 8]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.15} metalness={0.3} roughness={0.7} />
            </mesh>
            <mesh castShadow position={[0, 0.32, 0]}>
                <sphereGeometry args={[0.1, 10, 10]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} metalness={0.3} roughness={0.7} />
            </mesh>
        </group>
    );
}

/* ── Particles ── */
function Particles() {
    const positions = useMemo(() => {
        const p = new Float32Array(200 * 3);
        for (let i = 0; i < 200 * 3; i++) p[i] = (Math.random() - 0.5) * 26;
        return p;
    }, []);
    const ref = useRef<THREE.Points>(null);
    useFrame(({ clock }) => {
        if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.007;
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

/* ── All pieces ── */
const PAWN_XS = [-3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5];

function Scene() {
    const g = useRef<THREE.Group>(null);
    useFrame(({ clock }) => {
        if (g.current) g.current.rotation.y = Math.sin(clock.elapsedTime * 0.05) * 0.08;
    });
    return (
        <group ref={g}>
            <ChessBoard />
            <King pos={[0, 0.04, 0]} color="#00f0ff" />
            <Rook pos={[-3.5, 0.04, -3.5]} color="#9b5de5" />
            <Rook pos={[3.5, 0.04, -3.5]} color="#9b5de5" />
            <Knight pos={[-2.5, 0.04, -3.5]} color="#f72585" />
            <Knight pos={[2.5, 0.04, -3.5]} color="#f72585" />
            <Bishop pos={[-1.5, 0.04, -3.5]} color="#00e5ff" />
            <Bishop pos={[1.5, 0.04, -3.5]} color="#00e5ff" />
            {PAWN_XS.map((x, i) => (
                <Pawn key={i} pos={[x, 0.04, -2.5]} color="#5a5a7a" />
            ))}
            <Particles />
        </group>
    );
}

/* ── Camera ── */
function CameraRig() {
    const { camera } = useThree();
    useFrame(({ clock }) => {
        const t = clock.elapsedTime;
        camera.position.x += (Math.sin(t * 0.04) * 1.5 - camera.position.x) * 0.012;
        camera.position.y += (7 + Math.sin(t * 0.06) * 0.5 - camera.position.y) * 0.012;
        camera.position.z += (9.5 + Math.cos(t * 0.05) - camera.position.z) * 0.012;
        camera.lookAt(0, 0, 0);
    });
    return null;
}

/* ── Main export ── */
export default function ChessScene() {
    return (
        <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <Canvas
                shadows
                dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                    failIfMajorPerformanceCaveat: false,
                }}
                camera={{ fov: 45, position: [2, 8, 10], near: 0.1, far: 200 }}
                style={{ width: '100%', height: '100%', display: 'block', position: 'absolute', inset: 0 }}
            >
                <CameraRig />

                {/* Lighting — no external HDR/Environment asset, pure manual lights */}
                <ambientLight intensity={0.5} color="#1a1a3a" />
                <directionalLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" castShadow />
                <pointLight position={[0, 6, 0]} intensity={2} color="#00f0ff" distance={18} decay={2} />
                <pointLight position={[-4, 4, 4]} intensity={1.5} color="#9b5de5" distance={15} decay={2} />
                <pointLight position={[4, 4, -4]} intensity={1} color="#f72585" distance={12} decay={2} />

                <Scene />
            </Canvas>
        </div>
    );
}
