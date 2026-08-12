'use client';

import React from 'react';
import { Film, Sparkles, Tv, Clapperboard } from 'lucide-react';
import { useStore } from '@/lib/store';
import { GENRES } from '@/lib/tmdb';

export function Header({ isCrtEnabled, toggleCrt }) {
  const { selectCategory, activeCategory, resetCamera } = useStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 px-4 py-3 flex items-center justify-between glass-panel border-b border-white/10 backdrop-blur-md">
      {/* Brand / Logo */}
      <div
        onClick={resetCamera}
        className="flex items-center gap-3 cursor-pointer group select-none"
      >
        <div className="p-2 rounded-lg bg-gradient-to-br from-retro-neonPink to-retro-accent shadow-neon-pink group-hover:scale-105 transition-transform duration-200">
          <Clapperboard className="w-6 h-6 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-wider glow-title uppercase text-retro-neonCyan">
            RETRO<span className="text-retro-neonPink ml-1">VHS</span>
          </h1>
          <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-retro-neonYellow" /> 3D Video Store Experience
          </p>
        </div>
      </div>

      {/* Category Navigation Pills */}
      <nav className="hidden md:flex items-center gap-2 bg-black/50 p-1.5 rounded-full border border-white/10">
        {Object.keys(GENRES).map((catKey) => {
          const isActive = activeCategory === catKey;
          const info = GENRES[catKey];
          return (
            <button
              key={catKey}
              onClick={() => selectCategory(catKey)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-gradient-to-r from-retro-neonPink to-retro-neonCyan text-white shadow-neon-pink font-bold'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: info.color }}
              />
              {catKey === 'SciFi' ? 'SCI-FI' : catKey.toUpperCase()}
            </button>
          );
        })}
      </nav>

      {/* Action Controls & CRT Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleCrt}
          className={`px-3 py-1.5 rounded-md text-xs font-mono border flex items-center gap-1.5 transition-all duration-200 ${
            isCrtEnabled
              ? 'bg-retro-neonCyan/20 text-retro-neonCyan border-retro-neonCyan shadow-neon-cyan'
              : 'bg-black/40 text-gray-400 border-white/10 hover:text-white'
          }`}
          title="Toggle Retro CRT Scanlines Filter"
        >
          <Tv className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">CRT FILTER</span>
          <span className="font-bold">{isCrtEnabled ? 'ON' : 'OFF'}</span>
        </button>
      </div>
    </header>
  );
}
