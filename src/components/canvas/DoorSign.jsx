'use client';

import React, { useState } from 'react';
import { Text } from '@react-three/drei';
import { useStore } from '@/store/useStore';

export function DoorSign() {
  const { isStoreOpen, toggleStoreOpen, setTargetedObject } = useStore();
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={[0, 2.2, 19.8]}
      onClick={(e) => {
        e.stopPropagation();
        toggleStoreOpen();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        setTargetedObject(`Entrance Sign - Click to set store ${isStoreOpen ? 'CLOSED' : 'OPEN'}`);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        setTargetedObject(null);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Hanging Strings */}
      <mesh position={[-0.45, 0.35, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.7]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.45, 0.35, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.7]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Main Sign Board */}
      <mesh scale={hovered ? [1.06, 1.06, 1.06] : [1, 1, 1]}>
        <boxGeometry args={[1.2, 0.55, 0.04]} />
        <meshStandardMaterial
          color={isStoreOpen ? '#15803d' : '#b91c1c'}
          emissive={isStoreOpen ? '#22c55e' : '#ef4444'}
          emissiveIntensity={hovered ? 0.3 : 0.1}
          roughness={0.3}
        />
      </mesh>

      {/* Sign Text Front */}
      <Text position={[0, 0, 0.03]} fontSize={0.2} color="#ffffff" font="/fonts/Inter-Bold.woff">
        {isStoreOpen ? 'OPEN' : 'CLOSED'}
      </Text>

      {/* Sign Text Back */}
      <Text position={[0, 0, -0.03]} rotation={[0, Math.PI, 0]} fontSize={0.2} color="#ffffff">
        {isStoreOpen ? 'OPEN' : 'CLOSED'}
      </Text>
    </group>
  );
}
