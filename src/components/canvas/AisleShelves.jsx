'use client';

import React, { useState } from 'react';
import { Text } from '@react-three/drei';
import { useStore } from '@/store/useStore';

function SingleShelfUnit({ shelf }) {
  const { setTargetedObject, warehouseStock, openModal } = useStore();
  const [hoveredSlot, setHoveredSlot] = useState(null);

  return (
    <group position={shelf.position} rotation={shelf.rotation}>
      {/* Category Sign Overhead */}
      <group position={[0, 3.8, 0]}>
        <mesh>
          <boxGeometry args={[2.6, 0.6, 0.08]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[2.5, 0.5, 0.08]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.4} />
        </mesh>
        <Text position={[0, 0, 0.06]} fontSize={0.24} color="#ffffff">
          {shelf.genre.toUpperCase()}
        </Text>
      </group>

      {/* Main Wood Structure (#2b1810) */}
      <group position={[0, 0, 0]}>
        {/* Center Partition Board */}
        <mesh position={[0, 1.4, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.08, 2.6, 6.0]} />
          <meshStandardMaterial color="#2b1810" roughness={0.7} />
        </mesh>
        {/* End Support Posts */}
        <mesh position={[0, 1.4, -3.0]} receiveShadow castShadow>
          <boxGeometry args={[1.3, 2.8, 0.16]} />
          <meshStandardMaterial color="#2b1810" roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.4, 3.0]} receiveShadow castShadow>
          <boxGeometry args={[1.3, 2.8, 0.16]} />
          <meshStandardMaterial color="#2b1810" roughness={0.6} />
        </mesh>
        {/* Horizontal Planks */}
        {[0.5, 1.2, 1.9, 2.6].map((y, idx) => (
          <mesh key={idx} position={[0, y, 0]} receiveShadow castShadow>
            <boxGeometry args={[1.25, 0.08, 6.0]} />
            <meshStandardMaterial color="#2b1810" roughness={0.6} />
          </mesh>
        ))}

        {/* Render Slots & Tapes */}
        {shelf.slots.map((tape, idx) => {
          const row = Math.floor(idx / 3);
          const col = idx % 3;
          const z = (col - 1) * 1.8;
          const y = 0.85 + row * 0.7;

          return (
            <group
              key={idx}
              position={[0.2, y, z]}
              onClick={(e) => {
                e.stopPropagation();
                if (!tape && warehouseStock.length > 0) {
                  openModal('stock');
                }
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredSlot(idx);
                setTargetedObject(
                  tape
                    ? `[VHS Tape]: "${tape.title}" ($${tape.rentalPrice}/day)`
                    : 'Empty Shelf Slot - Click to stock tape from warehouse'
                );
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                setHoveredSlot(null);
                setTargetedObject(null);
                document.body.style.cursor = 'auto';
              }}
            >
              {tape ? (
                /* Stocked Tape Mesh */
                <mesh position={[0.1, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
                  <boxGeometry args={[0.45, 0.65, 0.09]} />
                  <meshStandardMaterial color="#111827" roughness={0.4} />
                </mesh>
              ) : (
                /* Empty Slot Indicator */
                <mesh position={[0.1, 0, 0]}>
                  <boxGeometry args={[0.02, 0.5, 0.4]} />
                  <meshBasicMaterial
                    color={hoveredSlot === idx ? '#f59e0b' : '#374151'}
                    wireframe
                  />
                </mesh>
              )}
            </group>
          );
        })}
      </group>
    </group>
  );
}

export function AisleShelves() {
  const { shelves } = useStore();

  return (
    <group>
      {shelves.map((shelf) => (
        <SingleShelfUnit key={shelf.id} shelf={shelf} />
      ))}
    </group>
  );
}
