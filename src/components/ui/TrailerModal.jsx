'use client';

import React from 'react';
import { X, Film } from 'lucide-react';
import { useStore } from '@/lib/store';

export function TrailerModal() {
  const { trailerMovie, setTrailerMovie } = useStore();

  if (!trailerMovie) return null;

  const trailerId = trailerMovie.trailer_id || 'CRRLbXDHOKE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl glass-panel rounded-2xl border border-retro-neonPink/40 overflow-hidden shadow-2xl">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-retro-neonPink" />
            <h3 className="font-mono text-sm uppercase text-white font-bold tracking-wider">
              {trailerMovie.title} - Official VHS Trailer
            </h3>
          </div>
          <button
            onClick={() => setTrailerMovie(null)}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Embed */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&rel=0`}
            title={`${trailerMovie.title} Trailer`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
