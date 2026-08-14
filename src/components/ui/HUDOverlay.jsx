'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { DollarSign, Star, Calendar, Clock, ShoppingBag, RotateCcw, Crosshair } from 'lucide-react';

export function HUDOverlay() {
  const {
    cash,
    popularity,
    day,
    timeOfDay,
    isStoreOpen,
    targetedObject,
    hudMessage,
    heldTape,
    heldSlushie,
    placementMode,
    cancelPlacement
  } = useStore();

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 font-sans select-none">
      {/* TOP HUD STATUS BAR */}
      <div className="flex items-center justify-between gap-4">
        {/* Left: Store Title & Open/Closed Badge */}
        <div className="pointer-events-auto bg-slate-900/90 border border-amber-500/30 p-3 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-3">
          <span className="text-2xl">📼</span>
          <div>
            <h1 className="text-sm font-black text-amber-400 font-mono tracking-wider">RETRO REWIND SIMULATOR</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`w-2.5 h-2.5 rounded-full ${isStoreOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-xs font-mono font-bold text-gray-300">
                STORE STATUS: {isStoreOpen ? 'OPEN FOR BUSINESS' : 'CLOSED'}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Financials & Popularity HUD */}
        <div className="pointer-events-auto flex items-center gap-3 bg-slate-900/90 border border-amber-500/30 px-5 py-2.5 rounded-xl shadow-2xl backdrop-blur-md">
          {/* Cash */}
          <div className="flex items-center gap-1.5 border-r border-gray-700 pr-4">
            <div className="p-1.5 bg-green-500/20 text-green-400 rounded-lg">
              <DollarSign size={18} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-mono uppercase">Store Cash</p>
              <p className="text-base font-black text-green-400 font-mono">${cash.toFixed(2)}</p>
            </div>
          </div>

          {/* Popularity */}
          <div className="flex items-center gap-1.5 border-r border-gray-700 pr-4">
            <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
              <Star size={18} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-mono uppercase">Rating</p>
              <p className="text-base font-black text-amber-400 font-mono">{popularity} / 100</p>
            </div>
          </div>

          {/* Day & Time */}
          <div className="flex items-center gap-1.5">
            <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-mono uppercase">Calendar</p>
              <p className="text-base font-black text-blue-400 font-mono">Day {day} • {timeOfDay}</p>
            </div>
          </div>
        </div>
      </div>

      {/* CENTER CROSSHAIR & TARGET PROMPT */}
      <div className="flex flex-col items-center justify-center">
        {/* Crosshair */}
        <div className="w-3 h-3 rounded-full bg-amber-400/90 border border-black shadow-lg" />

        {/* Targeted Object Prompt Banner */}
        {targetedObject && (
          <div className="mt-4 pointer-events-auto bg-slate-950/90 border border-amber-400/80 px-4 py-2 rounded-xl text-amber-300 text-xs font-mono font-bold shadow-2xl animate-in zoom-in duration-150 backdrop-blur-md">
            🎯 {targetedObject}
          </div>
        )}
      </div>

      {/* BOTTOM HUD: STATUS MESSAGE & CARRIED ITEMS */}
      <div className="flex items-end justify-between gap-4">
        {/* Held Item Indicator */}
        <div className="pointer-events-auto">
          {heldTape && (
            <div className="bg-slate-900/90 border border-amber-500/40 p-3 rounded-xl text-white font-mono text-xs shadow-xl flex items-center gap-2">
              <span className="text-lg">📼</span>
              <div>
                <p className="text-[10px] text-amber-400 font-bold uppercase">Carrying Tape</p>
                <p className="font-bold">{heldTape.title}</p>
                <p className="text-[10px] text-gray-300">
                  {heldTape.rewound ? '✅ Rewound' : '⚠️ Needs Rewind'} • {heldTape.scanned ? '✅ Scanned' : '⚠️ Unscanned'}
                </p>
              </div>
            </div>
          )}

          {heldSlushie && (
            <div className="bg-slate-900/90 border border-blue-500/40 p-3 rounded-xl text-white font-mono text-xs shadow-xl flex items-center gap-2">
              <span className="text-lg">🥤</span>
              <div>
                <p className="text-[10px] text-blue-400 font-bold uppercase">Carrying Slushie</p>
                <p className="font-bold">{heldSlushie} Flavor Cup</p>
              </div>
            </div>
          )}

          {placementMode && (
            <div className="bg-green-950/90 border border-green-500 p-3 rounded-xl text-white font-mono text-xs shadow-xl flex items-center gap-3">
              <div>
                <p className="font-bold text-green-400">PLACING FURNITURE</p>
                <p className="text-[10px] text-gray-300">Click 3D floor to confirm placement position</p>
              </div>
              <button
                onClick={cancelPlacement}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-500 rounded text-white text-[10px] font-bold"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* HUD Notification Pill */}
        {hudMessage && (
          <div className="pointer-events-auto max-w-md bg-slate-900/95 border border-amber-500/30 p-3 rounded-xl text-amber-300 text-xs font-mono font-medium shadow-2xl backdrop-blur-md">
            💬 {hudMessage}
          </div>
        )}
      </div>
    </div>
  );
}
