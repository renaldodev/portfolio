'use client';

import type React from 'react';
import { useGLTF } from '@react-three/drei';
import type * as THREE from 'three';

interface ThreeGroupProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  children?: React.ReactNode;
  [key: string]: unknown;
}

export function Model(props: ThreeGroupProps) {
    const gltf = useGLTF('/chess_board.glb');
    const nodes = gltf.nodes as unknown as Record<string, THREE.Mesh>;
    const materials = gltf.materials as unknown as Record<string, THREE.Material>;
    return (
        <group {...props} dispose={null}>
            <group rotation={[-Math.PI / 2, 0, 0]} scale={0.003}>
                <group rotation={[Math.PI / 2, 0, 0]}>
                    <group rotation={[-Math.PI / 2, 0, 0]}>
                        <mesh
                            castShadow
                            receiveShadow
                            geometry={nodes['Chess_Board_08_-_Default_0'].geometry}
                            material={materials['08_-_Default']}
                        />
                        <mesh
                            castShadow
                            receiveShadow
                            geometry={nodes['Chess_Board_07_-_Default_0'].geometry}
                            material={materials['07_-_Default']}
                        />
                        <mesh
                            castShadow
                            receiveShadow
                            geometry={nodes['Chess_Board_03_-_Default_0'].geometry}
                            material={materials['03_-_Default']}
                        />
                        <mesh
                            castShadow
                            receiveShadow
                            geometry={nodes['Chess_Board_02_-_Default_0'].geometry}
                            material={materials['02_-_Default_0']}
                        />
                    </group>
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['B_Pawn_8_01_-_Default_0'].geometry}
                        material={materials['01_-_Default']}
                        position={[1.241, 0, 7.95]}
                        rotation={[-Math.PI / 2, 0, Math.PI]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['B_Pawn_7_01_-_Default_0'].geometry}
                        material={materials['01_-_Default']}
                        position={[1.241, 0, 7.95]}
                        rotation={[-Math.PI / 2, 0, Math.PI]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['B_Pawn_6_01_-_Default_0'].geometry}
                        material={materials['01_-_Default']}
                        position={[1.241, 0, 7.95]}
                        rotation={[-Math.PI / 2, 0, Math.PI]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['B_Pawn_5_01_-_Default_0'].geometry}
                        material={materials['01_-_Default']}
                        position={[1.241, 0, 7.95]}
                        rotation={[-Math.PI / 2, 0, Math.PI]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['B_Pawn_4_01_-_Default_0'].geometry}
                        material={materials['01_-_Default']}
                        position={[1.241, 0, 7.95]}
                        rotation={[-Math.PI / 2, 0, Math.PI]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['B_Pawn_3_01_-_Default_0'].geometry}
                        material={materials['01_-_Default']}
                        position={[1.241, 0, 7.95]}
                        rotation={[-Math.PI / 2, 0, Math.PI]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['B_Pawn_2_01_-_Default_0'].geometry}
                        material={materials['01_-_Default']}
                        position={[1.241, 0, 7.95]}
                        rotation={[-Math.PI / 2, 0, Math.PI]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['B_Pawn_1_01_-_Default_0'].geometry}
                        material={materials['01_-_Default']}
                        position={[1.241, 0, 7.95]}
                        rotation={[-Math.PI / 2, 0, Math.PI]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['B_Rook_2_01_-_Default_0'].geometry}
                        material={materials['01_-_Default']}
                        position={[1.241, 0, 7.95]}
                        rotation={[-Math.PI / 2, 0, Math.PI]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['B_Rook_1_01_-_Default_0'].geometry}
                        material={materials['01_-_Default']}
                        position={[1.241, 0, 7.95]}
                        rotation={[-Math.PI / 2, 0, Math.PI]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['B_Knight_1_01_-_Default_0'].geometry}
                        material={materials['01_-_Default']}
                        position={[1.241, 0, 7.95]}
                        rotation={[-Math.PI / 2, 0, Math.PI]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['B_Bishop_1_01_-_Default_0'].geometry}
                        material={materials['01_-_Default']}
                        position={[1.241, 0, 7.95]}
                        rotation={[-Math.PI / 2, 0, Math.PI]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['B_King_01_-_Default_0'].geometry}
                        material={materials['01_-_Default']}
                        position={[-4.414, 0, 7.951]}
                        rotation={[-Math.PI / 2, 0, Math.PI]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['B_Queen_01_-_Default_0'].geometry}
                        material={materials['01_-_Default']}
                        position={[1.241, 0, 7.95]}
                        rotation={[-Math.PI / 2, 0, Math.PI]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['B_Bishop_2_01_-_Default_0'].geometry}
                        material={materials['01_-_Default']}
                        position={[1.241, 0, 7.95]}
                        rotation={[-Math.PI / 2, 0, Math.PI]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['B_Knight_2_01_-_Default_0'].geometry}
                        material={materials['01_-_Default']}
                        position={[1.241, 0, 7.95]}
                        rotation={[-Math.PI / 2, 0, Math.PI]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['W_Bishop_2_02_-_Default_0'].geometry}
                        material={materials['02_-_Default']}
                        position={[-4.065, 0, 9.582]}
                        rotation={[-Math.PI / 2, 0, 0]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['W_Bishop_1_02_-_Default_0'].geometry}
                        material={materials['02_-_Default']}
                        position={[-4.065, 0, 9.582]}
                        rotation={[-Math.PI / 2, 0, 0]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['W_King_02_-_Default_0'].geometry}
                        material={materials['02_-_Default']}
                        position={[-4.065, 0, 78.377]}
                        rotation={[-Math.PI / 2, 0, 0]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['W_Knight_2_02_-_Default_0'].geometry}
                        material={materials['02_-_Default']}
                        position={[-4.065, 0, 9.582]}
                        rotation={[-Math.PI / 2, 0, 0]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['W_Knight_1_02_-_Default_0'].geometry}
                        material={materials['02_-_Default']}
                        position={[-4.065, 0, 9.582]}
                        rotation={[-Math.PI / 2, 0, 0]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['W_Pawn_8_02_-_Default_0'].geometry}
                        material={materials['02_-_Default']}
                        position={[-4.065, 0, 9.582]}
                        rotation={[-Math.PI / 2, 0, 0]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['W_Pawn_7_02_-_Default_0'].geometry}
                        material={materials['02_-_Default']}
                        position={[-4.065, 0, 9.582]}
                        rotation={[-Math.PI / 2, 0, 0]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['W_Pawn_6_02_-_Default_0'].geometry}
                        material={materials['02_-_Default']}
                        position={[-4.065, 0, 9.582]}
                        rotation={[-Math.PI / 2, 0, 0]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['W_Pawn_5_02_-_Default_0'].geometry}
                        material={materials['02_-_Default']}
                        position={[-4.065, 0, 9.582]}
                        rotation={[-Math.PI / 2, 0, 0]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['W_Pawn_4_02_-_Default_0'].geometry}
                        material={materials['02_-_Default']}
                        position={[-4.065, 0, 9.582]}
                        rotation={[-Math.PI / 2, 0, 0]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['W_Pawn_3_02_-_Default_0'].geometry}
                        material={materials['02_-_Default']}
                        position={[-4.065, 0, 9.582]}
                        rotation={[-Math.PI / 2, 0, 0]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['W_Pawn_2_02_-_Default_0'].geometry}
                        material={materials['02_-_Default']}
                        position={[-4.065, 0, 9.582]}
                        rotation={[-Math.PI / 2, 0, 0]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['W_Pawn_1_02_-_Default_0'].geometry}
                        material={materials['02_-_Default']}
                        position={[-4.065, 0, 9.582]}
                        rotation={[-Math.PI / 2, 0, 0]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['W_Queen_02_-_Default_0'].geometry}
                        material={materials['02_-_Default']}
                        position={[-4.065, 0, -59.213]}
                        rotation={[-Math.PI / 2, 0, 0]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['W_Rook_2_02_-_Default_0'].geometry}
                        material={materials['02_-_Default']}
                        position={[-4.065, 0, 9.582]}
                        rotation={[-Math.PI / 2, 0, 0]}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['W_Rook_1_02_-_Default_0'].geometry}
                        material={materials['02_-_Default']}
                        position={[-4.065, 0, 9.582]}
                        rotation={[-Math.PI / 2, 0, 0]}
                    />
                </group>
            </group>
        </group>
    )
}

useGLTF.preload('/chess_board.glb')