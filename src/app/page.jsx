'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getAllStoreMovies } from '@/lib/tmdb';
import { Header } from '@/components/ui/Header';
import { MovieDetailModal } from '@/components/ui/MovieDetailModal';
import { ControlsOverlay } from '@/components/ui/ControlsOverlay';
import { TrailerModal } from '@/components/ui/TrailerModal';

// Dynamically import 3D Canvas with ssr: false to prevent WebGL server-side issues
const StoreScene = dynamic(
  () => import('@/components/canvas/StoreScene').then((mod) => mod.StoreScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-retro-neonCyan border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-retro-neonCyan text-sm font-bold tracking-widest animate-pulse">
          INITIALIZING 3D RETRO ENVIRONMENT...
        </p>
      </div>
    ),
  }
);

export default function HomePage() {
  const [movies, setMovies] = useState({});
  const [loading, setLoading] = useState(true);
  const [isCrtEnabled, setIsCrtEnabled] = useState(true);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const data = await getAllStoreMovies();
        setMovies(data);
      } catch (err) {
        console.error('Failed to load movie store catalog:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* Optional CRT Scanlines Filter Overlay */}
      {isCrtEnabled && <div className="crt-overlay" />}

      {/* Header Bar */}
      <Header
        isCrtEnabled={isCrtEnabled}
        toggleCrt={() => setIsCrtEnabled((prev) => !prev)}
      />

      {/* 3D Store Scene */}
      <StoreScene movies={movies} />

      {/* Floating UI Controls & Overlays */}
      <ControlsOverlay />
      <MovieDetailModal />
      <TrailerModal />
    </main>
  );
}
