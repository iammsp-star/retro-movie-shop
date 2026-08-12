'use client';

import React from 'react';
import { RotateCcw, Compass, MousePointerClick, Move3d } from 'lucide-react';
import { useStore } from '@/lib/store';

export function ControlsOverlay() {
  const { resetCamera, selectCategory, activeCategory, isTransitioning } = useStore();

  return (
    <div className="fixed bottom-6 left-6 z-20 flex flex-col gap-3 pointer-events-none select-none">
      {/* Floating "Reset Camera Overview" button */}
      <button
        onClick={resetCamera}
        disabled={isTransitioning}
        className="pointer-events-auto px-4 py-2.5 rounded-xl glass-panel border border-retro-neonCyan/50 text-retro-neonCyan hover:bg-retro-neonCyan/20 hover:text-white font-mono text-xs font-bold tracking-wider shadow-neon-cyan flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50"
      >
        <RotateCcw className={`w-4 h-4 ${isTransitioning ? 'animate-spin' : ''}`} />
        <span>RESET CAMERA OVERVIEW</span>
      </button>

      {/* Interaction Tips Badge */}
      <div className="hidden sm:flex items-center gap-3 px-3.5 py-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-gray-400">
        <span className="flex items-center gap-1">
          <Move3d className="w-3.5 h-3.5 text-retro-neonPink" /> Orbit / Drag
        </span>
        <span className="text-gray-600">•</span>
        <span className="flex items-center gap-1">
          <MousePointerClick className="w-3.5 h-3.5 text-retro-neonCyan" /> Click VHS Box
        </span>
      </div>
    </div>
  );
}
