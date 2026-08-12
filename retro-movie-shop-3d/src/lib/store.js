'use client';

import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { GENRES } from './tmdb';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [trailerMovie, setTrailerMovie] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [chromaticOffset, setChromaticOffset] = useState([0, 0]);

  // Canvas references
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);

  // Trigger temporary motion blur impulse (Chromatic Aberration) via GSAP
  const triggerMotionBlur = useCallback((duration = 1.6) => {
    const blurObj = { intensity: 0 };
    gsap.to(blurObj, {
      intensity: 0.015,
      duration: duration * 0.4,
      ease: 'power2.out',
      onUpdate: () => {
        setChromaticOffset([blurObj.intensity, blurObj.intensity * 0.7]);
      },
      onComplete: () => {
        gsap.to(blurObj, {
          intensity: 0,
          duration: duration * 0.6,
          ease: 'power2.in',
          onUpdate: () => {
            setChromaticOffset([blurObj.intensity, blurObj.intensity * 0.7]);
          },
          onComplete: () => {
            setChromaticOffset([0, 0]);
          },
        });
      },
    });
  }, []);

  // Zoom camera to specific position & target using GSAP with back.out(1.7)
  const focusCamera = useCallback(
    (targetPosition, cameraOffset = [0, 0.3, 1.8], duration = 1.6, onComplete) => {
      if (!cameraRef.current || !controlsRef.current) return;

      const camera = cameraRef.current;
      const controls = controlsRef.current;

      setIsTransitioning(true);
      controls.enabled = false;

      triggerMotionBlur(duration);

      const targetCamX = targetPosition[0] + cameraOffset[0];
      const targetCamY = targetPosition[1] + cameraOffset[1];
      const targetCamZ = targetPosition[2] + cameraOffset[2];

      const tl = gsap.timeline({
        onComplete: () => {
          controls.enabled = true;
          controls.update();
          setIsTransitioning(false);
          if (onComplete) onComplete();
        },
      });

      tl.to(
        camera.position,
        {
          x: targetCamX,
          y: targetCamY,
          z: targetCamZ,
          duration: duration,
          ease: 'back.out(1.7)',
        },
        0
      );

      tl.to(
        controls.target,
        {
          x: targetPosition[0],
          y: targetPosition[1] + 0.1,
          z: targetPosition[2],
          duration: duration,
          ease: 'back.out(1.7)',
          onUpdate: () => controls.update(),
        },
        0
      );
    },
    [triggerMotionBlur]
  );

  // Reset camera to store overview position [0, 2, 6]
  const resetCamera = useCallback(() => {
    setSelectedMovie(null);
    setActiveCategory(null);

    if (!cameraRef.current || !controlsRef.current) return;

    const camera = cameraRef.current;
    const controls = controlsRef.current;

    setIsTransitioning(true);
    controls.enabled = false;

    triggerMotionBlur(1.6);

    const tl = gsap.timeline({
      onComplete: () => {
        controls.enabled = true;
        controls.update();
        setIsTransitioning(false);
      },
    });

    tl.to(
      camera.position,
      {
        x: 0,
        y: 2,
        z: 6,
        duration: 1.6,
        ease: 'back.out(1.7)',
      },
      0
    );

    tl.to(
      controls.target,
      {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.6,
        ease: 'back.out(1.7)',
        onUpdate: () => controls.update(),
      },
      0
    );
  }, [triggerMotionBlur]);

  // Focus camera on a specific shelf category
  const selectCategory = useCallback(
    (categoryKey) => {
      const genre = GENRES[categoryKey];
      if (!genre) return;

      setActiveCategory(categoryKey);
      setSelectedMovie(null);

      // Category shelf position offset
      const shelfPos = genre.position;
      focusCamera(shelfPos, [0, 0.8, 2.5], 1.6);
    },
    [focusCamera]
  );

  // Focus camera on a specific movie VHS box mesh
  const selectMovie = useCallback(
    (movie, boxWorldPos) => {
      setSelectedMovie(movie);
      if (movie.genre) setActiveCategory(movie.genre);

      if (boxWorldPos) {
        focusCamera(boxWorldPos, [0, 0.15, 1.4], 1.6);
      }
    },
    [focusCamera]
  );

  return (
    <StoreContext.Provider
      value={{
        selectedMovie,
        setSelectedMovie,
        activeCategory,
        setActiveCategory,
        trailerMovie,
        setTrailerMovie,
        isTransitioning,
        chromaticOffset,
        controlsRef,
        cameraRef,
        focusCamera,
        resetCamera,
        selectCategory,
        selectMovie,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
