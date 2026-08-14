'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { X, PackageCheck, Film } from 'lucide-react';

export function StockTapeModal() {
  const { activeModal, closeModal, warehouseStock } = useStore();

  if (activeModal !== 'stock') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-amber-500/50 rounded-2xl p-6 shadow-2xl text-white font-sans">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Film className="text-amber-400" size={24} />
            <div>
              <h2 className="text-lg font-black text-amber-400 font-mono tracking-wider">STOCK SHELF SLOT</h2>
              <p className="text-xs text-gray-400">Select VHS Tape from Warehouse Inventory</p>
            </div>
          </div>
          <button onClick={closeModal} className="p-1 text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {warehouseStock.length === 0 ? (
          <div className="text-center py-8 text-gray-400 font-mono text-sm space-y-2">
            <p>Warehouse Inventory is Empty!</p>
            <p className="text-xs text-amber-400">Order new movie bundles from the 1990s PC Terminal.</p>
          </div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
            {warehouseStock.map((tape, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-gray-800 p-3 rounded-xl flex items-center justify-between hover:border-amber-500/50 transition"
              >
                <div>
                  <h3 className="font-bold text-sm text-white">{tape.title}</h3>
                  <p className="text-xs text-amber-400 font-mono">Genre: {tape.genre} • Rental Price: ${tape.rentalPrice}/day</p>
                </div>

                <button
                  onClick={() => {
                    // Stock tape logic
                    closeModal();
                  }}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 font-mono"
                >
                  <PackageCheck size={14} />
                  <span>STOCK SLOT</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
