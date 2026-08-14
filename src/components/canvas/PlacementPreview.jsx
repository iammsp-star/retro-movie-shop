'use client';

import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';

export function PlacementPreview() {
  const { placementMode, confirmPlacement, setPlacementGhostPos } = useStore();
  const ghostRef = useRef();
  const { camera, raycaster, pointer } = useThree();

  useFrame(() => {
    if (!placementMode || !ghostRef.current) return;

    raycaster.setFromCamera(pointer, camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const target = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, target);

    if (target) {
      // Snap to grid
      const snappedX = Math.round(target.x / 2) * 2;
      const snappedZ = Math.round(target.z / 2) * 2;
      ghostRef.current.position.set(snappedX, 0, snappedZ);
      setPlacementGhostPos([snappedX, 0, snappedZ]);
    }
  });

  if (!placementMode) return null;

  return (
    <group
      ref={ghostRef}
      onClick={(e) => {
        e.stopPropagation();
        confirmPlacement();
      }}
    >
      {/* Ghost Preview Box */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[1.3, 2.8, 6.0]} />
        <meshStandardMaterial color="#22c55e" transparent opacity={0.5} wireframe />
      </mesh>
    </group>
  );
}
