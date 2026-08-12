'use client';

import React, { useEffect } from 'react';
import { X, ExternalLink, Clock, Calendar, Film, Play, Star } from 'lucide-react';
import { useStore } from '@/lib/store';

export function MovieDetailModal({ movie: propMovie, onClose: propOnClose }) {
  const { selectedMovie, setSelectedMovie, setTrailerMovie, resetCamera } = useStore();

  const activeMovie = propMovie || selectedMovie;
  const handleClose = () => {
    if (propOnClose) propOnClose();
    setSelectedMovie(null);
  };

  // Close modal when pressing the Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!activeMovie) return null;

  const poster = activeMovie.posterUrl || activeMovie.poster_url || activeMovie.poster_path;
  const year = activeMovie.year || activeMovie.release_year || '1990';
  const runtime = activeMovie.runtime || '120 min';
  const wikiUrl = activeMovie.wikiUrl || activeMovie.wiki_url;
  const genresList = activeMovie.genres || activeMovie.genres_list || (activeMovie.genre ? [activeMovie.genre] : ['Bollywood']);

  const handlePlayTrailer = () => {
    setTrailerMovie(activeMovie);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0" onClick={handleClose} />

      {/* Modal Slide-in Drawer */}
      <div className="relative z-10 h-full w-full max-w-md bg-gray-950 border-l border-amber-500/30 text-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
        
        <div>
          {/* Header with Close Button */}
          <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
            <span className="text-xs font-semibold tracking-widest text-amber-400 uppercase flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              📼 VHS Archive Details
            </span>
            <button
              onClick={handleClose}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Movie Poster & Title Preview */}
          <div className="flex gap-4 mb-6">
            <img
              src={poster}
              alt={activeMovie.title}
              className="w-28 h-40 object-cover rounded-lg border border-amber-500/20 shadow-lg filter contrast-105"
            />
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
                {activeMovie.title}
              </h2>

              {/* Metadata Badges */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300 font-mono">
                <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                  <Calendar size={14} className="text-amber-400" />
                  <span>{year}</span>
                </div>
                <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                  <Clock size={14} className="text-amber-400" />
                  <span>{runtime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Genres Tag List */}
          <div className="mb-6">
            <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5 font-mono">
              <Film size={14} className="text-amber-400" /> Genres
            </h3>
            <div className="flex flex-wrap gap-2">
              {genresList && genresList.length > 0 ? (
                genresList.map((genre, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full"
                  >
                    {genre}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-500">Uncategorized</span>
              )}
            </div>
          </div>

          {/* Overview */}
          {activeMovie.overview && (
            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-2 font-mono">
                SYNOPSIS / PLOT
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed bg-black/40 p-3.5 rounded-lg border border-gray-800">
                {activeMovie.overview}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-gray-800 flex flex-col gap-2.5">
          <button
            onClick={handlePlayTrailer}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-retro-neonPink to-retro-accent hover:opacity-95 text-white font-bold text-sm rounded-xl transition shadow-neon-pink"
          >
            <Play size={16} className="fill-current" />
            <span>PLAY TRAILER VIDEO</span>
          </button>

          {wikiUrl && (
            <a
              href={wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold rounded-xl transition shadow-lg text-sm"
            >
              <span>Read on Wikipedia</span>
              <ExternalLink size={16} />
            </a>
          )}

          <button
            onClick={resetCamera}
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-mono text-xs tracking-wider border border-white/10 hover:text-white transition-all text-center"
          >
            RETURN TO OVERVIEW CAMERA
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailModal;
