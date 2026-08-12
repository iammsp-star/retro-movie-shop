'use client';

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import MovieDetailModal from '@/components/ui/MovieDetailModal';

const StoreCanvas = dynamic(
  () => import('@/components/canvas/StoreCanvas').then((mod) => mod.default || mod),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-gray-950 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-amber-400 text-sm font-bold tracking-widest animate-pulse">
          INITIALIZING 3D RETRO VAULT...
        </p>
      </div>
    ),
  }
);

export default function StorePage() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const controlsRef = useRef(null);

  return (
    <main className="relative w-screen h-screen bg-gray-950 overflow-hidden select-none">
      {/* HUD Header Banner */}
      <header className="absolute top-4 left-4 z-10 bg-gray-900/90 backdrop-blur-md px-5 py-3 rounded-xl border border-amber-500/30 text-white shadow-xl flex items-center gap-3">
        <span className="text-2xl">📼</span>
        <div>
          <h1 className="text-lg font-bold text-amber-400 tracking-wide font-mono">
            Retro Movie Shop 3D
          </h1>
          <p className="text-xs text-gray-400 font-sans">
            Click any VHS box to zoom and inspect details
          </p>
        </div>
      </header>

      {/* 3D WebGL Canvas */}
      <StoreCanvas
        controlsRef={controlsRef}
        selectedMovie={selectedMovie}
        onSelectMovie={(movie) => setSelectedMovie(movie)}
      />

      {/* HTML Modal Overlay */}
      <MovieDetailModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </main>
  );
}
