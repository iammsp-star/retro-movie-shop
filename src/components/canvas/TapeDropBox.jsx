'use client';

import React, { useState } from 'react';
import { Text } from '@react-three/drei';
import { useStore } from '@/store/useStore';

export function TapeDropBox() {
  const { dropRack, pickupDropTape, setTargetedObject, heldTape } = useStore();
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={[2.5, 0, 10.5]}
      onClick={(e) => {
        e.stopPropagation();
        if (!heldTape && dropRack.length > 0) {
          pickupDropTape(dropRack[0]);
        }
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        setTargetedObject(
          dropRack.length > 0
            ? `Tape Return Bin (${dropRack.length} returned) - Click to pick up "${dropRack[0].title}"`
            : 'Tape Return Bin (Empty)'
        );
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        setTargetedObject(null);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Wooden Bin Box */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshStandardMaterial color="#451a03" roughness={0.7} />
      </mesh>

      <Text position={[0, 0.75, 0.46]} fontSize={0.09} color="#f59e0b">
        TAPE RETURNS
      </Text>
      <Text position={[0, 0.55, 0.46]} fontSize={0.07} color="#ffffff">
        ({dropRack.length} Tapes Inside)
      </Text>

      {/* Visual Tapes inside bin */}
      {dropRack.map((tape, idx) => (
        <mesh key={tape.id} position={[(idx - 0.5) * 0.25, 0.85 + idx * 0.08, 0]} rotation={[0.2, idx * 0.5, 0.1]}>
          <boxGeometry args={[0.45, 0.08, 0.65]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      ))}
    </group>
  );
}
