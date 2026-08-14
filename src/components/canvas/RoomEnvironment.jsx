'use client';

import React from 'react';

export function RoomEnvironment() {
  // Fluorescent lights grid positions
  const ceilingLights = [
    [-10, 4.95, -12], [0, 4.95, -12], [10, 4.95, -12],
    [-10, 4.95, -4],  [0, 4.95, -4],  [10, 4.95, -4],
    [-10, 4.95, 4],   [0, 4.95, 4],   [10, 4.95, 4],
    [-10, 4.95, 12],  [0, 4.95, 12],  [10, 4.95, 12],
  ];

  return (
    <group>
      {/* 1. STORE FLOOR (40x40 plane) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#1a1823" roughness={0.8} />
      </mesh>

      {/* Carpet / Tile Grid Overlay */}
      <gridHelper args={[40, 20, '#332e42', '#242030']} position={[0, 0.01, 0]} />

      {/* 2. CEILING PLANE */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#201f28" roughness={0.9} />
      </mesh>

      {/* Ceiling Fluorescent Lights Grid */}
      {ceilingLights.map((pos, idx) => (
        <group key={idx} position={pos}>
          {/* Light Frame */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[2.8, 1.2]} />
            <meshStandardMaterial color="#333338" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Emissive White Panel */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
            <planeGeometry args={[2.6, 1.0]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Direct Point Light */}
          <pointLight position={[0, -0.4, 0]} intensity={1.1} distance={14} color="#fffdf0" />
        </group>
      ))}

      {/* 3. PERIMETER WALLS WITH YELLOW ACCENT STRIPES (#f59e0b) */}
      {/* LEFT WALL */}
      <group position={[-20, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[40, 5]} />
          <meshStandardMaterial color="#17161d" roughness={0.7} />
        </mesh>
        <mesh position={[0, 2.1, 0.02]}>
          <planeGeometry args={[40, 0.6]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.75, 0.02]}>
          <planeGeometry args={[40, 0.1]} />
          <meshStandardMaterial color="#2563eb" />
        </mesh>
      </group>

      {/* RIGHT WALL */}
      <group position={[20, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[40, 5]} />
          <meshStandardMaterial color="#17161d" roughness={0.7} />
        </mesh>
        <mesh position={[0, 2.1, 0.02]}>
          <planeGeometry args={[40, 0.6]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.75, 0.02]}>
          <planeGeometry args={[40, 0.1]} />
          <meshStandardMaterial color="#2563eb" />
        </mesh>
      </group>

      {/* BACK WALL (WITH BACK OFFICE DOOR) */}
      <group position={[0, 2.5, -20]} rotation={[0, 0, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[40, 5]} />
          <meshStandardMaterial color="#17161d" roughness={0.7} />
        </mesh>
        <mesh position={[0, 2.1, 0.02]}>
          <planeGeometry args={[40, 0.6]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.3} />
        </mesh>

        {/* Back Office Wooden Door */}
        <group position={[-12, -0.5, 0.05]}>
          <mesh>
            <boxGeometry args={[2.2, 4.0, 0.1]} />
            <meshStandardMaterial color="#3a2010" roughness={0.6} />
          </mesh>
          {/* Door Handle */}
          <mesh position={[0.8, 0, 0.08]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} />
          </mesh>
        </group>
      </group>

      {/* FRONT STOREFRONT WALL WITH TRANSPARENT GLASS WINDOW & ENTRANCE */}
      <group position={[0, 2.5, 20]} rotation={[0, Math.PI, 0]}>
        {/* Solid Wall Sides */}
        <mesh position={[-14, 0, 0]}>
          <planeGeometry args={[12, 5]} />
          <meshStandardMaterial color="#17161d" roughness={0.7} />
        </mesh>
        <mesh position={[14, 0, 0]}>
          <planeGeometry args={[12, 5]} />
          <meshStandardMaterial color="#17161d" roughness={0.7} />
        </mesh>

        {/* Top Front Wall Header */}
        <mesh position={[0, 2.0, 0]}>
          <planeGeometry args={[16, 1]} />
          <meshStandardMaterial color="#17161d" roughness={0.7} />
        </mesh>

        {/* Glass Windows */}
        <mesh position={[-5, -0.5, 0]}>
          <planeGeometry args={[6, 4]} />
          <meshStandardMaterial color="#a5f3fc" transparent opacity={0.35} roughness={0.1} />
        </mesh>
        <mesh position={[5, -0.5, 0]}>
          <planeGeometry args={[6, 4]} />
          <meshStandardMaterial color="#a5f3fc" transparent opacity={0.35} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}
