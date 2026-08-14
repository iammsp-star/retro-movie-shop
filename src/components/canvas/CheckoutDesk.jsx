'use client';

import React, { useState } from 'react';
import { Text } from '@react-three/drei';
import { useStore } from '@/store/useStore';

export function CheckoutDesk() {
  const {
    openModal,
    setTargetedObject,
    heldTape,
    processRewind,
    processScanBarcode
  } = useStore();

  const [hoveredEquip, setHoveredEquip] = useState(null);

  return (
    <group position={[6, 0, 10]}>
      {/* 1. WOODEN COUNTER DESK STRUCTURE */}
      <mesh position={[0, 0.6, 0]} receiveShadow castShadow>
        <boxGeometry args={[4.5, 1.2, 1.8]} />
        <meshStandardMaterial color="#2a170e" roughness={0.6} />
      </mesh>
      {/* Counter Top Surface */}
      <mesh position={[0, 1.23, 0]} receiveShadow castShadow>
        <boxGeometry args={[4.7, 0.06, 2.0]} />
        <meshStandardMaterial color="#1a120b" roughness={0.3} />
      </mesh>

      {/* 2. 1990s CRT COMPUTER MONITOR (Left of desk, position [-1.4, 1.6, 0]) */}
      <group
        position={[-1.4, 1.6, 0]}
        onClick={(e) => {
          e.stopPropagation();
          openModal('computer');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredEquip('computer');
          setTargetedObject('1990s PC Terminal - Click / E to Order Inventory & Upgrades');
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredEquip(null);
          setTargetedObject(null);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* CRT Housing */}
        <mesh castShadow>
          <boxGeometry args={[0.85, 0.75, 0.8]} />
          <meshStandardMaterial color="#d1d5db" roughness={0.5} />
        </mesh>
        {/* CRT Screen Frame */}
        <mesh position={[0, 0, 0.41]}>
          <boxGeometry args={[0.75, 0.65, 0.04]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
        {/* Glowing Green Retro Screen */}
        <mesh position={[0, 0, 0.43]}>
          <planeGeometry args={[0.68, 0.58]} />
          <meshBasicMaterial color={hoveredEquip === 'computer' ? '#4ade80' : '#15803d'} />
        </mesh>
        <Text position={[0, 0.05, 0.44]} fontSize={0.08} color="#000000">
          ▶ STORE PC v1.0
        </Text>
        <Text position={[0, -0.08, 0.44]} fontSize={0.06} color="#000000">
          [CLICK TO OPEN]
        </Text>
        {/* Monitor Base Stand */}
        <mesh position={[0, -0.42, 0]}>
          <boxGeometry args={[0.4, 0.1, 0.4]} />
          <meshStandardMaterial color="#9ca3af" />
        </mesh>
      </group>

      {/* 3. BARCODE SCANNER MESH (Center of desk, position [-0.3, 1.35, 0.3]) */}
      <group
        position={[-0.3, 1.35, 0.3]}
        onClick={(e) => {
          e.stopPropagation();
          if (heldTape) {
            processScanBarcode();
          }
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredEquip('scanner');
          setTargetedObject(
            heldTape
              ? `Barcode Scanner - Click to SCAN "${heldTape.title}" into warehouse!`
              : 'Barcode Scanner (Hold returned tape to scan)'
          );
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredEquip(null);
          setTargetedObject(null);
          document.body.style.cursor = 'auto';
        }}
      >
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.18, 0.35]} />
          <meshStandardMaterial color="#1f2937" roughness={0.4} />
        </mesh>

        {/* Laser Glass Windows */}
        <mesh position={[0, 0.091, 0]}>
          <planeGeometry args={[0.22, 0.22]} />
          <meshBasicMaterial color={hoveredEquip === 'scanner' ? '#ef4444' : '#991b1b'} />
        </mesh>
      </group>

      {/* 4. TAPE REWIND DECK (Position [0.6, 1.35, 0.3]) */}
      <group
        position={[0.6, 1.35, 0.3]}
        onClick={(e) => {
          e.stopPropagation();
          if (heldTape && !heldTape.rewound) {
            processRewind();
          }
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredEquip('rewind');
          setTargetedObject(
            heldTape && !heldTape.rewound
              ? `Tape Rewinder - Click to REWIND "${heldTape.title}"`
              : 'VHS Rewind Deck ("Be Kind, Please Rewind")'
          );
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredEquip(null);
          setTargetedObject(null);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Rewinder Body */}
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.16, 0.4]} />
          <meshStandardMaterial color="#374151" roughness={0.5} />
        </mesh>
        <Text position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.06} color="#f59e0b">
          VHS REWINDER
        </Text>
      </group>

      {/* 5. SLUSHIE MACHINE (Right of desk, position [1.5, 1.7, 0.1]) */}
      <group
        position={[1.5, 1.7, 0.1]}
        onClick={(e) => {
          e.stopPropagation();
          openModal('slushie');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredEquip('slushie');
          setTargetedObject('Retro Slushie Machine - Dispense Cherry or Blue Raspberry');
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredEquip(null);
          setTargetedObject(null);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Machine Frame */}
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.9, 0.6]} />
          <meshStandardMaterial color="#e5e7eb" roughness={0.3} />
        </mesh>
        {/* Transparent Slush Bowls (Cherry Red / Blue Raspberry) */}
        <mesh position={[-0.16, 0.15, 0.18]}>
          <cylinderGeometry args={[0.12, 0.12, 0.4]} />
          <meshStandardMaterial color="#ef4444" roughness={0.1} transparent opacity={0.85} />
        </mesh>
        <mesh position={[0.16, 0.15, 0.18]}>
          <cylinderGeometry args={[0.12, 0.12, 0.4]} />
          <meshStandardMaterial color="#3b82f6" roughness={0.1} transparent opacity={0.85} />
        </mesh>
        <Text position={[0, 0.38, 0.31]} fontSize={0.07} color="#dc2626">
          ICE SLUSHIE
        </Text>
      </group>
    </group>
  );
}
