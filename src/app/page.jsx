'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { HUDOverlay } from '@/components/ui/HUDOverlay';
import { ComputerTerminalModal } from '@/components/ui/ComputerTerminalModal';
import { CheckoutModal } from '@/components/ui/CheckoutModal';
import { SlushieModal } from '@/components/ui/SlushieModal';
import { StockTapeModal } from '@/components/ui/StockTapeModal';

// Dynamically import 3D R3F Canvas to prevent SSR hydration issues
const StoreSimulatorCanvas = dynamic(
  () => import('@/components/canvas/StoreSimulatorCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-slate-950 flex flex-col items-center justify-center text-white font-mono">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-amber-400 text-sm font-bold tracking-widest animate-pulse">
          INITIALIZING 1990S VIDEO STORE SIMULATOR...
        </p>
      </div>
    ),
  }
);

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-screen bg-slate-950 flex flex-col items-center justify-center text-white font-mono">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-amber-400 text-sm font-bold tracking-widest animate-pulse">
          LOADING STORE SIMULATOR...
        </p>
      </div>
    );
  }

  return (
    <main className="relative w-screen h-screen bg-black overflow-hidden font-sans select-none">
      {/* 2D Tailwind HUD & Interactive Modals */}
      <HUDOverlay />
      <ComputerTerminalModal />
      <CheckoutModal />
      <SlushieModal />
      <StockTapeModal />

      {/* 3D WebGL Web Experience Canvas */}
      <StoreSimulatorCanvas />
    </main>
  );
}
