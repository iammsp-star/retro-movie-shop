'use client';

import React from 'react';
import { EffectComposer, ChromaticAberration, Vignette, Bloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useStore } from '@/lib/store';

export function Effects() {
  const { chromaticOffset } = useStore();

  const offsetVector = new THREE.Vector2(chromaticOffset[0], chromaticOffset[1]);

  return (
    <EffectComposer disableNormalPass>
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={offsetVector}
        radialModulation={false}
        modulationOffset={0}
      />
      <Bloom
        intensity={0.4}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.9}
        height={300}
      />
      <Vignette eskil={false} offset={0.2} darkness={0.7} />
    </EffectComposer>
  );
}
