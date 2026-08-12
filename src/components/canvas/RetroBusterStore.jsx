'use client';

import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, Text, PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { X, ExternalLink, Film, Clock, Calendar } from 'lucide-react';

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
  ctx.fillText(title || 'VHS MOVIE', 256, 384);

  return new THREE.CanvasTexture(canvas);
}

// Keyboard Movement Hook (WASD & Arrow Keys)
function useKeyboardControls() {
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) keys.current.forward = true;
      if (['ArrowDown', 'KeyS'].includes(e.code)) keys.current.backward = true;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keys.current.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keys.current.right = true;
    };

    const handleKeyUp = (e) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) keys.current.forward = false;
      if (['ArrowDown', 'KeyS'].includes(e.code)) keys.current.backward = false;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keys.current.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keys.current.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
}

// First-Person Player Component (Drives Camera movement with WASD / Arrow Keys)
function FirstPersonPlayer({ isModalOpen }) {
  const { camera } = useThree();
  const keys = useKeyboardControls();
  const moveSpeed = 0.12;

  useFrame(() => {
    if (isModalOpen) return;

    const forwardVector = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    const sideVector = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);

    forwardVector.y = 0;
    forwardVector.normalize();
    sideVector.y = 0;
    sideVector.normalize();

    if (keys.current.forward) camera.position.addScaledVector(forwardVector, moveSpeed);
    if (keys.current.backward) camera.position.addScaledVector(forwardVector, -moveSpeed);
    if (keys.current.left) camera.position.addScaledVector(sideVector, -moveSpeed);
    if (keys.current.right) camera.position.addScaledVector(sideVector, moveSpeed);

    // Constrain camera position inside store boundaries
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -12, 12);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -15, 12);
    camera.position.y = 1.7; // Standard 1.7m eye level
  });

  return null;
}

// Single 3D Movie Box
function MovieBox({ position, posterUrl, title, movieData, onSelect }) {
  let texture;
  try {
    texture = useTexture(posterUrl);
  } catch (err) {
    texture = useMemo(() => createFallbackTexture(title), [title]);
  }

  if (texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }

  return (
    <mesh
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(movieData);
      }}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[0.45, 0.65, 0.08]} />
      <meshStandardMaterial attach="material-0" color="#111" roughness={0.4} />
      <meshStandardMaterial attach="material-1" color="#111" roughness={0.4} />
      <meshStandardMaterial attach="material-2" color="#000" roughness={0.5} />
      <meshStandardMaterial attach="material-3" color="#000" roughness={0.5} />
      <meshStandardMaterial attach="material-4" map={texture} color={texture ? '#ffffff' : '#f59e0b'} roughness={0.3} />
      <meshStandardMaterial attach="material-5" color="#111" roughness={0.6} />
    </mesh>
  );
}

// Hanging Retro Category Sign
function HangingSign({ text, position, bgColor = '#d97706' }) {
  return (
    <group position={position}>
      {/* Hanging Chains */}
      <mesh position={[-0.8, 0.4, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.8]} />
        <meshStandardMaterial color="#888" />
      </mesh>
      <mesh position={[0.8, 0.4, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.8]} />
        <meshStandardMaterial color="#888" />
      </mesh>
      {/* Sign Board */}
      <mesh>
        <boxGeometry args={[2.2, 0.5, 0.05]} />
        <meshStandardMaterial color={bgColor} />
      </mesh>
      <Text position={[0, 0, 0.04]} fontSize={0.22} color="#ffffff">
        {text.toUpperCase()}
      </Text>
    </group>
  );
}

// Full Aisle Shelf Divider with Posters and Tapes
function AisleDivider({ position, genre, movies = [], onSelectMovie }) {
  return (
    <group position={position}>
      {/* Dark End Wall Partition */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 3.0, 0.2]} />
        <meshStandardMaterial color="#262626" roughness={0.7} />
      </mesh>

      {/* Yellow/Blue Poster Framing on Aisle Front */}
      <mesh position={[0, 1.8, 0.12]}>
        <planeGeometry args={[1.8, 1.2]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>

      {/* Hanging Category Sign */}
      <HangingSign text={genre} position={[0, 3.4, 0]} />

      {/* Shelves Grid (4 Rows x 3 Columns) */}
      <group position={[0, 0, 0]}>
        {movies.slice(0, 12).map((movie, idx) => {
          const col = idx % 3;
          const row = Math.floor(idx / 3);
          const x = (col - 1) * 0.6;
          const y = 0.6 + row * 0.7;
          const poster = movie.posterUrl || movie.poster_url || movie.poster_path;

          return (
            <Suspense key={movie.id || idx} fallback={null}>
              <MovieBox
                position={[x, y, 0.15]}
                posterUrl={poster}
                title={movie.title}
                movieData={movie}
                onSelect={onSelectMovie}
              />
            </Suspense>
          );
        })}
      </group>
    </group>
  );
}

// Overhead Grid Fluorescent Lights
function CeilingLights() {
  const lightPositions = [
    [-6, 4.2, -6], [0, 4.2, -6], [6, 4.2, -6],
    [-6, 4.2, 0],  [0, 4.2, 0],  [6, 4.2, 0],
    [-6, 4.2, 6],  [0, 4.2, 6],  [6, 4.2, 6],
  ];

  return (
    <group>
      {lightPositions.map((pos, idx) => (
        <group key={idx} position={pos}>
          {/* Rectangular Light Fixture */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.5, 0.8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <pointLight distance={8} intensity={0.8} color="#fff8e7" />
        </group>
      ))}
    </group>
  );
}

export default function RetroBusterStore() {
  const [data, setData] = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    fetch('/data/movies.json')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error('Error fetching dataset:', err));
  }, []);

  const actionMovies = data['Action'] || [];
  const sciFiMovies = data['SciFi'] || data['Comedy'] || [];
  const horrorMovies = data['Horror'] || data['Drama'] || [];

  return (
    <main className="relative w-screen h-screen bg-black overflow-hidden font-sans select-none">
      {/* Crosshair HUD */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-white/80 border border-black/60 shadow-lg" />
      </div>

      {/* Control Instructions Overlay */}
      <header className="absolute top-4 left-4 z-10 bg-gray-900/90 border border-gray-800 p-4 rounded-xl text-white shadow-2xl backdrop-blur-md">
        <h1 className="text-lg font-black text-amber-400 tracking-wider font-mono">📼 RETRO MOVIE SHOP 3D</h1>
        <p className="text-xs text-gray-300 mt-1">Click canvas to lock cursor & explore 3D aisles</p>
        <div className="mt-2 text-[11px] text-amber-300/90 font-mono bg-black/50 p-2 rounded border border-amber-500/20">
          🎮 Controls: Arrow Keys / WASD = Walk | Mouse = Look Around
        </div>
      </header>

      {/* 3D WebGL Canvas */}
      <Canvas camera={{ position: [0, 1.7, 8], fov: 65 }}>
        <ambientLight intensity={0.4} />
        <CeilingLights />

        {/* First Person Movement Controller */}
        <FirstPersonPlayer isModalOpen={!!selectedMovie} />
        <PointerLockControls />

        {/* Store Floor (Dark Carpet) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>

        {/* Ceiling Plane */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.3, 0]}>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#2d2d2d" />
        </mesh>

        {/* Render Store Aisles matching target Blockbuster layout */}
        {actionMovies.length > 0 && (
          <AisleDivider
            position={[-4, 0, -2]}
            genre="Action"
            movies={actionMovies}
            onSelectMovie={setSelectedMovie}
          />
        )}
        {sciFiMovies.length > 0 && (
          <AisleDivider
            position={[0, 0, -2]}
            genre="Sci-Fi / Comedy"
            movies={sciFiMovies}
            onSelectMovie={setSelectedMovie}
          />
        )}
        {horrorMovies.length > 0 && (
          <AisleDivider
            position={[4, 0, -2]}
            genre="Horror / Drama"
            movies={horrorMovies}
            onSelectMovie={setSelectedMovie}
          />
        )}
      </Canvas>

      {/* Movie Details Modal Drawer */}
      {selectedMovie && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-gray-900/95 border-l border-amber-500/30 p-6 text-white backdrop-blur-xl flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-6">
              <span className="text-xs font-bold text-amber-400 tracking-widest uppercase font-mono">📼 VHS Tape Inspection</span>
              <button onClick={() => setSelectedMovie(null)} className="p-1 text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex gap-4 mb-6">
              <img
                src={selectedMovie.posterUrl || selectedMovie.poster_url || selectedMovie.poster_path}
                alt={selectedMovie.title}
                className="w-28 h-40 object-cover rounded-lg border border-amber-500/20 shadow-md"
              />
              <div>
                <h2 className="text-2xl font-bold mb-2 leading-tight">{selectedMovie.title}</h2>
                <p className="text-sm text-gray-300 flex items-center gap-2 mb-1 font-mono">
                  <Calendar size={14} className="text-amber-400" /> {selectedMovie.year || selectedMovie.release_year}
                </p>
                <p className="text-sm text-gray-300 flex items-center gap-2 font-mono">
                  <Clock size={14} className="text-amber-400" /> {selectedMovie.runtime || '120 mins'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1 font-mono">
                <Film size={14} /> Genres
              </h3>
              <div className="flex flex-wrap gap-2">
                {(selectedMovie.genres || selectedMovie.genres_list || ['Bollywood']).map((g, i) => (
                  <span key={i} className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs rounded-full">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {(selectedMovie.wikiUrl || selectedMovie.wiki_url) && (
            <a
              href={selectedMovie.wikiUrl || selectedMovie.wiki_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold rounded-lg flex items-center justify-center gap-2 transition text-sm"
            >
              <span>Read on Wikipedia</span>
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      )}
    </main>
  );
}
