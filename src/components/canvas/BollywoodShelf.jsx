'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useTexture, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Fallback procedural canvas texture if remote image fails
function createFallbackTexture(title) {
  if (typeof window === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 512, 768);
  grad.addColorStop(0, '#1c1917');
  grad.addColorStop(1, '#0c0a09');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 768);

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 16;
  ctx.strokeRect(20, 20, 472, 728);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title || 'BOLLYWOOD VHS', 256, 384);

  return new THREE.CanvasTexture(canvas);
}

function MovieBox({ position, posterUrl, title, movie, onClick }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  const url = posterUrl || movie?.posterUrl || movie?.poster_url || movie?.poster_path;

  let texture;
  try {
    texture = useTexture(url);
  } catch (err) {
    texture = useMemo(() => createFallbackTexture(title || movie?.title), [title, movie?.title]);
  }

  if (texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const targetZ = hovered ? 0.15 : 0;
    const targetScale = hovered ? 1.06 : 1.0;

    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, delta * 10);
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 10);
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
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
      >
        <boxGeometry args={[0.7, 1.0, 0.15]} />
        <meshStandardMaterial attach="material-0" color="#111" roughness={0.4} />
        <meshStandardMaterial attach="material-1" color="#111" roughness={0.4} />
        <meshStandardMaterial attach="material-2" color="#000" roughness={0.5} />
        <meshStandardMaterial attach="material-3" color="#000" roughness={0.5} />
        <meshStandardMaterial attach="material-4" map={texture} color={texture ? '#ffffff' : '#f59e0b'} roughness={0.3} />
        <meshStandardMaterial attach="material-5" color="#111" roughness={0.6} />

        {hovered && (
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(0.71, 1.01, 0.16)]} />
            <lineBasicMaterial color="#f59e0b" linewidth={2} />
          </lineSegments>
        )}
      </mesh>

      {hovered && (
        <Html position={[0, 0.7, 0.1]} center distanceFactor={6} className="pointer-events-none select-none">
          <div className="bg-gray-950/95 border border-amber-500 text-white px-3 py-1.5 rounded shadow-lg whitespace-nowrap text-xs font-semibold flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>{title || movie?.title}</span>
            <span className="text-amber-400 bg-black/60 px-1 rounded">
              {movie?.year || movie?.release_year || '2000'}
            </span>
          </div>
        </Html>
      )}
    </group>
  );
}

export function BollywoodShelf({ genre = 'Action', shelfPosition = [0, 0, 0], onSelectMovie }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch('/data/movies.json')
      .then((res) => res.json())
      .then((data) => {
        if (data[genre]) {
          setMovies(data[genre].slice(0, 7));
        } else {
          const firstCat = Object.keys(data)[0];
          if (firstCat && data[firstCat]) {
            setMovies(data[firstCat].slice(0, 7));
          }
        }
      })
      .catch((err) => console.warn('Failed to load movies.json:', err));
  }, [genre]);

  return (
    <group position={shelfPosition}>
      {/* Physical Shelf Frame */}
      <mesh position={[0, -0.05, 0]} receiveShadow castShadow>
        <boxGeometry args={[6.5, 0.08, 0.5]} />
        <meshStandardMaterial color="#292524" roughness={0.6} />
      </mesh>
      <mesh position={[-3.2, 0.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.08, 1.2, 0.4]} />
        <meshStandardMaterial color="#1c1917" roughness={0.7} />
      </mesh>
      <mesh position={[3.2, 0.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.08, 1.2, 0.4]} />
        <meshStandardMaterial color="#1c1917" roughness={0.7} />
      </mesh>

      {/* Render Movies along the 3D shelf */}
      {movies.map((movie, index) => {
        const xOffset = (index - movies.length / 2) * 0.85;
        const boxPos = [shelfPosition[0] + xOffset, shelfPosition[1] + 0.5, shelfPosition[2]];

        return (
          <MovieBox
            key={movie.id || index}
            position={[xOffset, 0.5, 0]}
            posterUrl={movie.posterUrl || movie.poster_url || movie.poster_path}
            title={movie.title}
            movie={movie}
            onClick={() => onSelectMovie(movie, boxPos)}
          />
        );
      })}
    </group>
  );
}

export default BollywoodShelf;
