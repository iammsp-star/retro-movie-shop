'use client';

import React, { useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import gsap from 'gsap';
import { BollywoodShelf } from './BollywoodShelf';

// Controller component to access R3F's useThree hook
function CameraController({ controlsRef, selectedMovie, onAnimationComplete }) {
  const { camera } = useThree();

  return (
    <BollywoodShelf
      genre="Action"
      shelfPosition={[0, 0, 0]}
      onSelectMovie={(movie, boxPosition) => {
        if (!controlsRef.current) return;

        // Lock orbit controls during animation
        controlsRef.current.enabled = false;

        const [x, y, z] = boxPosition || [0, 0, 0];

        // GSAP Timeline to animate both camera position and OrbitControls target
        const tl = gsap.timeline({
          onComplete: () => {
            controlsRef.current.enabled = true;
            // Trigger modal opening after camera finishes zooming in
            if (onAnimationComplete) onAnimationComplete(movie);
          },
        });

        // 1. Move camera to offset position directly facing the selected VHS box
        tl.to(
          camera.position,
          {
            x: x,
            y: y + 0.2,
            z: z + 2.2,
            duration: 1.4,
            ease: 'back.out(1.4)',
          },
          0
        );

        // 2. Point OrbitControls target at center of clicked box
        tl.to(
          controlsRef.current.target,
          {
            x: x,
            y: y,
            z: z,
            duration: 1.4,
            ease: 'back.out(1.4)',
            onUpdate: () => controlsRef.current.update(),
          },
          0
        );
      }}
    />
  );
}

export default function StoreCanvas({ selectedMovie, onSelectMovie, controlsRef: externalControlsRef }) {
  const internalControlsRef = useRef(null);
  const controlsRef = externalControlsRef || internalControlsRef;

  return (
    <Canvas camera={{ position: [0, 1.5, 5], fov: 50 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} />

      <OrbitControls ref={controlsRef} makeDefault enableDamping />

      <CameraController
        controlsRef={controlsRef}
        selectedMovie={selectedMovie}
        onAnimationComplete={(movie) => onSelectMovie(movie)}
      />
    </Canvas>
  );
}
