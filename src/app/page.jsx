'use client';

import dynamic from 'next/dynamic';

// Import the 3D Scene dynamically with SSR disabled
const StoreScene = dynamic(
  () => import('@/components/canvas/StoreScene').then((mod) => mod.default || mod.StoreScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-screen h-screen bg-black flex items-center justify-center text-amber-400 font-mono">
        📼 Loading 3D Engine & Physics...
      </div>
    ),
  }
);

export default function Home() {
  return (
    <main className="w-screen h-screen bg-black overflow-hidden">
      <StoreScene />
    </main>
  );
}
