'use client';

import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture, Text } from '@react-three/drei';
import gsap from 'gsap';
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
  ctx.fillText(title || 'BOLLYWOOD VHS', 256, 384);

  return new THREE.CanvasTexture(canvas);
}

// Single 3D Movie Box Mesh
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
    <group position={position}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect(movieData, position);
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
        castShadow
        receiveShadow
      >
        {/* 3D VHS Box dimensions */}
        <boxGeometry args={[0.7, 1.0, 0.15]} />
        <meshStandardMaterial attach="material-0" color="#111" roughness={0.4} />
        <meshStandardMaterial attach="material-1" color="#111" roughness={0.4} />
        <meshStandardMaterial attach="material-2" color="#000" roughness={0.5} />
        <meshStandardMaterial attach="material-3" color="#000" roughness={0.5} />
        <meshStandardMaterial attach="material-4" map={texture} color={texture ? '#ffffff' : '#f59e0b'} roughness={0.3} />
        <meshStandardMaterial attach="material-5" color="#111" roughness={0.6} />
      </mesh>
    </group>
  );
}

// 3D Shelf Component
function ShelfRow({ genre, shelfPosition, movies, onSelectMovie }) {
  return (
    <group position={shelfPosition}>
      {/* Wooden Shelf Geometry */}
      <mesh position={[0, -0.05, 0]} receiveShadow castShadow>
        <boxGeometry args={[12, 0.1, 0.8]} />
        <meshStandardMaterial color="#3e2723" roughness={0.6} />
      </mesh>

      {/* Genre Title Banner above Shelf */}
      <Text position={[-5, 0.8, 0]} fontSize={0.35} color="#f59e0b" anchorX="left">
        {genre.toUpperCase()}
      </Text>

      {/* Array of VHS Boxes */}
      {movies.slice(0, 10).map((movie, index) => {
        const xOffset = (index - 4.5) * 0.95;
        const boxPos = [shelfPosition[0] + xOffset, shelfPosition[1] + 0.5, shelfPosition[2]];
        const poster = movie.posterUrl || movie.poster_url || movie.poster_path;

        return (
          <Suspense key={movie.id || index} fallback={null}>
            <MovieBox
              position={[xOffset, 0.5, 0]}
              posterUrl={poster}
              title={movie.title}
              movieData={movie}
              onSelect={(data) => onSelectMovie(data, boxPos)}
            />
          </Suspense>
        );
      })}
    </group>
  );
}

export default function RetroStore3D() {
  const [data, setData] = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null);
  const controlsRef = useRef();

  // Load local dataset
  useEffect(() => {
    fetch('/data/movies.json')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error('Error loading dataset:', err));
  }, []);

  const handleSelectMovie = (movie, boxPosition) => {
    if (!controlsRef.current) return;

    controlsRef.current.enabled = false;
    const [x, y, z] = boxPosition;

    // Smooth camera zoom onto selected tape
    gsap.to(controlsRef.current.object.position, {
      x: x,
      y: y + 0.1,
      z: z + 2.2,
      duration: 1.4,
      ease: 'back.out(1.5)',
    });

    gsap.to(controlsRef.current.target, {
      x: x,
      y: y,
      z: z,
      duration: 1.4,
      ease: 'back.out(1.5)',
      onUpdate: () => controlsRef.current.update(),
      onComplete: () => {
        controlsRef.current.enabled = true;
        setSelectedMovie(movie);
      },
    });
  };

  const handleResetCamera = () => {
    setSelectedMovie(null);
    if (!controlsRef.current) return;

    controlsRef.current.enabled = false;
    gsap.to(controlsRef.current.object.position, {
      x: 0,
      y: 2,
      z: 7,
      duration: 1.2,
      ease: 'power2.inOut',
    });

    gsap.to(controlsRef.current.target, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate: () => controlsRef.current.update(),
      onComplete: () => {
        controlsRef.current.enabled = true;
      },
    });
  };

  return (
    <main className="relative w-screen h-screen bg-gray-950 overflow-hidden text-white font-sans select-none">
      {/* Top Banner */}
      <header className="absolute top-4 left-4 z-10 bg-gray-900/90 border border-gray-800 p-4 rounded-xl shadow-xl backdrop-blur-md">
        <h1 className="text-xl font-extrabold text-amber-400 tracking-wider">📼 RETRO BOLLYWOOD VAULT</h1>
        <p className="text-xs text-gray-400 mt-1">3D Walkable VHS Video Rental Store</p>
      </header>

      {/* Reset Camera Overview Button */}
      {selectedMovie && (
        <button
          onClick={handleResetCamera}
          className="absolute top-4 right-4 z-10 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold rounded-lg transition shadow-lg text-sm"
        >
          Reset Store Overview
        </button>
      )}

      {/* 3D WebGL Canvas */}
      <Canvas camera={{ position: [0, 2, 7], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />

        <OrbitControls ref={controlsRef} makeDefault enableDamping maxPolarAngle={Math.PI / 2} />

        {/* Store Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#111827" />
        </mesh>

        {/* 3D Shelves */}
        {Object.keys(data).map((genre, idx) => (
          <ShelfRow
            key={genre}
            genre={genre}
            shelfPosition={[0, 1.5 - idx * 2.2, 0]}
            movies={data[genre]}
            onSelectMovie={handleSelectMovie}
          />
        ))}
      </Canvas>

      {/* Right Drawer UI Modal */}
      {selectedMovie && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-gray-900/95 border-l border-gray-800 p-6 backdrop-blur-lg flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-6">
              <span className="text-xs font-bold text-amber-400 tracking-widest uppercase font-mono">VHS Tape Inspect</span>
              <button onClick={handleResetCamera} className="p-1 text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex gap-4 mb-6">
              <img
                src={selectedMovie.posterUrl || selectedMovie.poster_url || selectedMovie.poster_path}
                alt={selectedMovie.title}
                className="w-28 h-40 object-cover rounded-lg border border-gray-700 shadow-lg"
              />
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedMovie.title}</h2>
                <div className="text-sm text-gray-400 space-y-1 font-mono">
                  <p className="flex items-center gap-2"><Calendar size={14} className="text-amber-400"/> {selectedMovie.year || selectedMovie.release_year}</p>
                  <p className="flex items-center gap-2"><Clock size={14} className="text-amber-400"/> {selectedMovie.runtime}</p>
                </div>
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
