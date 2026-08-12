'use client';

import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { MovieBox } from './MovieBox';
import { useStore } from '@/lib/store';
import { GENRES } from '@/lib/tmdb';

export function Shelf({ categoryKey, movies = [], position = [0, 0, 0] }) {
  const { selectCategory, activeCategory } = useStore();
  const [hoveredSign, setHoveredSign] = useState(false);

  const genreInfo = GENRES[categoryKey] || {
    label: categoryKey,
    color: '#00f3ff',
  };

  const isActive = activeCategory === categoryKey;

  const handleSignClick = (e) => {
    e.stopPropagation();
    selectCategory(categoryKey);
  };

  return (
    <group position={position}>
      {/* --- Physical Wooden/Metal Shelf Frame --- */}

      {/* Vertical Side Pillars */}
      <mesh position={[-1.8, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.08, 3.2, 0.4]} />
        <meshStandardMaterial color="#1a1423" roughness={0.7} metalness={0.3} />
      </mesh>
      <mesh position={[1.8, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.08, 3.2, 0.4]} />
        <meshStandardMaterial color="#1a1423" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Horizontal Shelves (3 Tiers) */}
      {[-0.6, 0.4, 1.4].map((yPos, idx) => (
        <mesh key={idx} position={[0, yPos - 0.52, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.6, 0.06, 0.45]} />
          <meshStandardMaterial color="#2d2238" roughness={0.5} metalness={0.4} />
        </mesh>
      ))}

      {/* Shelf Backing Panel */}
      <mesh position={[0, 0.4, -0.2]} receiveShadow>
        <boxGeometry args={[3.6, 3.0, 0.02]} />
        <meshStandardMaterial color="#0e0a14" roughness={0.9} />
      </mesh>

      {/* --- Neon Signage Header --- */}
      <group position={[0, 1.75, 0]}>
        {/* Neon Sign Board Frame */}
        <mesh
          castShadow
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredSign(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHoveredSign(false);
            document.body.style.cursor = 'auto';
          }}
          onClick={handleSignClick}
        >
          <boxGeometry args={[2.8, 0.5, 0.1]} />
          <meshStandardMaterial
            color={isActive || hoveredSign ? '#1a1d2e' : '#10121d'}
            emissive={genreInfo.color}
            emissiveIntensity={isActive ? 0.4 : hoveredSign ? 0.25 : 0.08}
            roughness={0.3}
          />
        </mesh>

        {/* 2D HTML/Text Neon Sign Overlay */}
        <Html position={[0, 0, 0.06]} center distanceFactor={8} className="pointer-events-none select-none">
          <div
            onClick={handleSignClick}
            className={`cursor-pointer px-4 py-1.5 rounded text-center tracking-widest font-black uppercase text-sm sm:text-base border transition-all duration-300 ${
              isActive
                ? 'bg-black/90 border-current shadow-lg scale-105'
                : 'bg-black/75 border-white/20 hover:border-current'
            }`}
            style={{
              color: genreInfo.color,
              borderColor: genreInfo.color,
              boxShadow: isActive ? `0 0 20px ${genreInfo.color}` : 'none',
              fontFamily: "'VT323', monospace",
            }}
          >
            {categoryKey} SELECTION
          </div>
        </Html>
      </group>

      {/* --- Movie VHS Boxes arranged on Shelf Tiers --- */}
      {movies.map((movie, index) => {
        // Arrange items on the middle shelf tier (y = 0.4)
        const total = movies.length;
        const spacing = 0.65;
        const startX = -((total - 1) * spacing) / 2;
        const xPos = startX + index * spacing;

        return (
          <MovieBox
            key={movie.id || index}
            movie={movie}
            position={[xPos, 0, 0]}
            rotation={[0, 0, 0]}
          />
        );
      })}
    </group>
  );
}
