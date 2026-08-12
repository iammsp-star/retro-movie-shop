'use client';

import React, { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Loader } from '@react-three/drei';
import { useStore } from '@/lib/store';
import { GENRES } from '@/lib/tmdb';
import { Shelf } from './Shelf';
import { Effects } from './Effects';

// Inner component to register camera and controls in store
function SceneController() {
  const { camera } = useThree();
  const { cameraRef, controlsRef, resetCamera } = useStore();

  useEffect(() => {
    cameraRef.current = camera;
  }, [camera, cameraRef]);

  const handlePointerDown = (e) => {
    // If user clicks directly on background/floor mesh, deselect item if needed
    if (e.target === e.currentTarget) {
      // Optional background click handling
    }
  };

  return null;
}

// 3D Canvas Loading Fallback Spinner
function CanvasLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-6 bg-retro-dark/90 border border-retro-neonCyan rounded-lg shadow-neon-cyan backdrop-blur-md">
        <div className="w-12 h-12 border-4 border-retro-neonPink border-t-transparent rounded-full animate-spin mb-3" />
        <p className="font-mono text-retro-neonCyan text-sm font-semibold tracking-wider animate-pulse">
          LOADING 3D STORE ATMOSPHERE...
        </p>
      </div>
    </Html>
  );
}

export function StoreScene({ movies = {} }) {
  const { controlsRef, resetCamera } = useStore();

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 2, 6], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor('#06060c');
        }}
      >
        <SceneController />

        {/* OrbitControls with damping enabled */}
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera from going below floor
          minDistance={1.2}
          maxDistance={12}
        />

        {/* Ambient & Directional Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={20}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
        />
        <pointLight position={[-3, 3, 2]} intensity={0.6} color="#ff0055" />
        <pointLight position={[3, 3, 2]} intensity={0.6} color="#00f3ff" />

        {/* Suspense wrapper with loading fallback */}
        <Suspense fallback={<CanvasLoader />}>
          {/* Floor plane mesh receiving shadows */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.55, 0]}
            receiveShadow
            onClick={(e) => {
              // Click floor to reset camera view
              e.stopPropagation();
              resetCamera();
            }}
          >
            <planeGeometry args={[30, 30]} />
            <meshStandardMaterial
              color="#0d0e17"
              roughness={0.8}
              metalness={0.2}
            />
          </mesh>

          {/* Retro Grid Floor Accent */}
          <gridHelper
            args={[30, 30, '#ff007f', '#00f3ff']}
            position={[0, -0.54, 0]}
          />

          {/* 3 Category Shelves arranged in space */}
          {/* Action [-2.5, 0, 0] */}
          <Shelf
            categoryKey="Action"
            movies={movies.Action || []}
            position={GENRES.Action.position}
          />

          {/* Sci-Fi [0, 0, -1] */}
          <Shelf
            categoryKey="SciFi"
            movies={movies.SciFi || []}
            position={GENRES.SciFi.position}
          />

          {/* Horror [2.5, 0, 0] */}
          <Shelf
            categoryKey="Horror"
            movies={movies.Horror || []}
            position={GENRES.Horror.position}
          />

          {/* Dynamic Post-Processing Effects (ChromaticAberration + Bloom) */}
          <Effects />
        </Suspense>
      </Canvas>
    </div>
  );
}
