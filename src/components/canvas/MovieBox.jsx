'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useTexture, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/lib/store';

// Fallback procedural canvas texture if remote image fails
function createFallbackCanvasTexture(title) {
  if (typeof window === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  // Gradient background
  const grad = ctx.createLinearGradient(0, 0, 512, 768);
  grad.addColorStop(0, '#1a1a2e');
  grad.addColorStop(1, '#0f0f1a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 768);

  // Border frame
  ctx.strokeStyle = '#00f3ff';
  ctx.lineWidth = 16;
  ctx.strokeRect(20, 20, 472, 728);

  // Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title || 'VHS MOVIE', 256, 384);

  return new THREE.CanvasTexture(canvas);
}

export function MovieBox({ movie, position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  const { selectMovie, selectedMovie } = useStore();
  const isSelected = selectedMovie?.id === movie.id;

  // Load poster texture
  let posterTexture;
  try {
    // R3F useTexture hook
    posterTexture = useTexture(movie.poster_url || movie.poster_path);
  } catch (err) {
    posterTexture = useMemo(() => createFallbackCanvasTexture(movie.title), [movie.title]);
  }

  if (posterTexture) {
    posterTexture.colorSpace = THREE.SRGBColorSpace;
  }

  // Smooth hover floating animation using useFrame
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const targetZ = hovered ? 0.12 : 0;
    const targetScale = hovered ? 1.06 : 1.0;

    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, delta * 10);
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 10);
  });

  // 6 Materials for BoxGeometry: [Right, Left, Top, Bottom, Front, Back]
  const materials = useMemo(() => {
    const plasticMat = new THREE.MeshStandardMaterial({
      color: '#121218',
      roughness: 0.4,
      metalness: 0.2,
    });

    const spineMat = new THREE.MeshStandardMaterial({
      color: '#181824',
      roughness: 0.5,
    });

    const frontMat = new THREE.MeshStandardMaterial({
      map: posterTexture || null,
      color: posterTexture ? '#ffffff' : '#ff0055',
      roughness: 0.3,
      metalness: 0.1,
    });

    const backMat = new THREE.MeshStandardMaterial({
      color: '#0a0a0f',
      roughness: 0.6,
    });

    return [
      spineMat,   // 0: +X Right
      spineMat,   // 1: -X Left
      plasticMat, // 2: +Y Top
      plasticMat, // 3: -Y Bottom
      frontMat,   // 4: +Z Front (Movie Poster)
      backMat,    // 5: -Z Back
    ];
  }, [posterTexture]);

  const handleClick = (e) => {
    e.stopPropagation();
    if (!meshRef.current) return;

    // Get world position of the box
    const worldPos = new THREE.Vector3();
    meshRef.current.getWorldPosition(worldPos);

    selectMovie(movie, [worldPos.x, worldPos.y, worldPos.z]);
  };

  return (
    <group position={position} rotation={rotation}>
      <mesh
        ref={meshRef}
        material={materials}
        castShadow
        receiveShadow
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={handleClick}
      >
        {/* VHS Box Geometry as requested: [0.7, 1.0, 0.15] */}
        <boxGeometry args={[0.7, 1.0, 0.15]} />

        {/* Hover / Selected Outline Glow */}
        {(hovered || isSelected) && (
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(0.71, 1.01, 0.16)]} />
            <lineBasicMaterial color={isSelected ? '#00f3ff' : '#ff007f'} linewidth={2} />
          </lineSegments>
        )}
      </mesh>

      {/* Floating 3D Title Overlay on Hover */}
      {hovered && (
        <Html
          position={[0, 0.7, 0.1]}
          center
          distanceFactor={6}
          className="pointer-events-none select-none transition-all duration-200"
        >
          <div className="bg-retro-dark/95 border border-retro-neonCyan text-white px-3 py-1.5 rounded shadow-neon-cyan whitespace-nowrap text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-retro-neonPink animate-ping" />
            <span>{movie.title}</span>
            <span className="text-retro-neonYellow font-mono text-[10px] bg-black/50 px-1 rounded">
              {movie.release_year}
            </span>
          </div>
        </Html>
      )}
    </group>
  );
}
