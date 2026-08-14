'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { X, CupSoda } from 'lucide-react';

export function SlushieModal() {
  const { activeModal, closeModal, dispenseSlushie } = useStore();

  if (activeModal !== 'slushie') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-blue-500/50 rounded-2xl p-6 shadow-2xl text-white font-sans">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <CupSoda className="text-blue-400" size={24} />
            <div>
              <h2 className="text-lg font-black text-blue-400 font-mono tracking-wider">RETRO SLUSHIE DISPENSER</h2>
              <p className="text-xs text-gray-400">Dispense Drink Add-on ($0.50 cost)</p>
            </div>
          </div>
          <button onClick={closeModal} className="p-1 text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => {
              if (dispenseSlushie('Cherry')) closeModal();
            }}
            className="p-5 bg-red-950/60 border-2 border-red-500/50 hover:border-red-400 rounded-2xl flex flex-col items-center justify-center gap-2 transition group shadow-lg"
          >
            <span className="text-4xl group-hover:scale-110 transition">🍒</span>
            <span className="font-mono font-bold text-red-400 text-sm">CHERRY RED</span>
            <span className="text-[10px] text-gray-400">$0.50 syrup cost</span>
          </button>

          <button
            onClick={() => {
              if (dispenseSlushie('Blue Raspberry')) closeModal();
            }}
            className="p-5 bg-blue-950/60 border-2 border-blue-500/50 hover:border-blue-400 rounded-2xl flex flex-col items-center justify-center gap-2 transition group shadow-lg"
          >
            <span className="text-4xl group-hover:scale-110 transition">🫐</span>
            <span className="font-mono font-bold text-blue-400 text-sm">BLUE RASPBERRY</span>
            <span className="text-[10px] text-gray-400">$0.50 syrup cost</span>
          </button>
        </div>
      </div>
    </div>
  );
}
