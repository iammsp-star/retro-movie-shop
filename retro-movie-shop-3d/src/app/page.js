'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const RetroBusterStore = dynamic(
  () => import('@/components/canvas/RetroBusterStore').then((mod) => mod.default || mod),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-amber-400 text-sm font-bold tracking-widest animate-pulse">
          ENTER-ING FIRST-PERSON 3D STORE...
        </p>
      </div>
    ),
  }
);

export default function HomePage() {
  return <RetroBusterStore />;
}
