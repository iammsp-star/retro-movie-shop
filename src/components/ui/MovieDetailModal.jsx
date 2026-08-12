'use client';

import React from 'react';
import Image from 'next/image';
import { X, Play, Star, Calendar, Clock, Film, Tag } from 'lucide-react';
import { useStore } from '@/lib/store';

export function MovieDetailModal() {
  const { selectedMovie, setSelectedMovie, setTrailerMovie, resetCamera } = useStore();

  if (!selectedMovie) return null;

  const handleClose = () => {
    setSelectedMovie(null);
  };

  const handlePlayTrailer = () => {
    setTrailerMovie(selectedMovie);
  };

  return (
    <aside
      className={`fixed top-0 right-0 bottom-0 z-30 w-full sm:w-[450px] glass-panel border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-500 ease-out transform ${
        selectedMovie ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header Close Button */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-retro-neonPink" />
          <span className="font-mono text-xs uppercase tracking-widest text-retro-neonCyan font-bold">
            VHS FEATURE TAPE
          </span>
        </div>
        <button
          onClick={handleClose}
          className="p-1.5 rounded-full bg-white/5 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto my-4 pr-1 space-y-5">
        {/* Movie Poster & Backdrop */}
        <div className="relative w-full h-64 rounded-xl overflow-hidden border border-white/10 shadow-vhs group">
          <img
            src={selectedMovie.poster_url || selectedMovie.poster_path}
            alt={selectedMovie.title}
            className="w-full h-full object-cover object-top filter contrast-105 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-retro-dark via-retro-dark/40 to-transparent" />

          {/* Floating Genre Tag */}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-retro-neonPink/90 text-white font-mono text-[10px] uppercase font-bold tracking-wider shadow-neon-pink">
            {selectedMovie.genre || 'ACTION'}
          </div>

          {/* Quick Rating Badge */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/80 text-retro-neonYellow font-mono text-xs font-bold flex items-center gap-1 border border-retro-neonYellow/30">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{selectedMovie.vote_average || 8.0}</span>
          </div>
        </div>

        {/* Title & Metadata */}
        <div>
          <h2 className="text-2xl font-black tracking-wide text-white leading-tight mb-2">
            {selectedMovie.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-300">
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded border border-white/10">
              <Calendar className="w-3.5 h-3.5 text-retro-neonCyan" />
              <span>{selectedMovie.release_year || '1990'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded border border-white/10">
              <Clock className="w-3.5 h-3.5 text-retro-neonPink" />
              <span>{selectedMovie.runtime || '120 min'}</span>
            </div>
          </div>
        </div>

        {/* Overview */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono uppercase text-retro-neonCyan tracking-wider">
            SYNOPIS / PLOT OVERVIEW
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed font-sans bg-black/30 p-3.5 rounded-lg border border-white/5">
            {selectedMovie.overview}
          </p>
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
        <button
          onClick={handlePlayTrailer}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-retro-neonPink to-retro-accent text-white font-bold text-sm tracking-wide shadow-neon-pink hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-current" />
          PLAY TRAILER VIDEO
        </button>

        <button
          onClick={resetCamera}
          className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-mono text-xs tracking-wider border border-white/10 hover:text-white transition-all text-center"
        >
          RETURN TO OVERVIEW CAMERA
        </button>
      </div>
    </aside>
  );
}
