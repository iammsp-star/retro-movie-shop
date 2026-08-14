'use client';

import React from 'react';
import StoreSimulatorCanvas from './StoreSimulatorCanvas';
import { HUDOverlay } from '@/components/ui/HUDOverlay';
import { ComputerTerminalModal } from '@/components/ui/ComputerTerminalModal';
import { CheckoutModal } from '@/components/ui/CheckoutModal';
import { SlushieModal } from '@/components/ui/SlushieModal';
import { StockTapeModal } from '@/components/ui/StockTapeModal';

export default function StoreScene() {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans select-none">
      {/* 2D HUD & UI Overlay Modals */}
      <HUDOverlay />
      <ComputerTerminalModal />
      <CheckoutModal />
      <SlushieModal />
      <StockTapeModal />

      {/* 3D WebGL Web Experience Canvas */}
      <StoreSimulatorCanvas />
    </div>
  );
}

export { StoreScene };
