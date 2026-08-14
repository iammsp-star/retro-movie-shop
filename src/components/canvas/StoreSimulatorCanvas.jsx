'use client';

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import { RoomEnvironment } from './RoomEnvironment';
import { DoorSign } from './DoorSign';
import { CheckoutDesk } from './CheckoutDesk';
import { TapeDropBox } from './TapeDropBox';
import { AisleShelves } from './AisleShelves';
import { CustomerManager } from './CustomerNPC';
import { PlacementPreview } from './PlacementPreview';

// Keyboard WASD / Arrow Movement Hook
function useKeyboardControls() {
  const keys = useRef({ forward: false, backward: false, left: false, right: false });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) keys.current.forward = true;
      if (['ArrowDown', 'KeyS'].includes(e.code)) keys.current.backward = true;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keys.current.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keys.current.right = true;
    };

    const handleKeyUp = (e) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) keys.current.forward = false;
      if (['ArrowDown', 'KeyS'].includes(e.code)) keys.current.backward = false;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keys.current.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keys.current.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
}

// First Person Player Physics & Raycasting Controller
function PlayerController() {
  const { camera } = useThree();
  const keys = useKeyboardControls();
  const activeModal = useStore((state) => state.activeModal);
  const moveSpeed = 0.12;

  useFrame(() => {
    if (activeModal) return;

    const forwardVector = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    const sideVector = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);

    forwardVector.y = 0;
    forwardVector.normalize();
    sideVector.y = 0;
    sideVector.normalize();

    if (keys.current.forward) camera.position.addScaledVector(forwardVector, moveSpeed);
    if (keys.current.backward) camera.position.addScaledVector(forwardVector, -moveSpeed);
    if (keys.current.left) camera.position.addScaledVector(sideVector, -moveSpeed);
    if (keys.current.right) camera.position.addScaledVector(sideVector, moveSpeed);

    // Enforce Store Room Physical Boundaries
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -16, 16);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -16, 17);
    camera.position.y = 1.7; // Fixed Eye Level
  });

  return null;
}

export default function StoreSimulatorCanvas() {
  return (
    <Canvas camera={{ position: [0, 1.7, 14], fov: 65 }} shadows>
      <ambientLight intensity={1.2} />
      <directionalLight position={[10, 12, 10]} intensity={0.8} color="#ffffff" castShadow />

      {/* Physics World Simulation Wrapper (@react-three/rapier) */}
      <Physics gravity={[0, -9.81, 0]}>
        <PlayerController />
        <PointerLockControls />

        {/* RigidBody Enclosure & Store Objects */}
        <RigidBody type="fixed" colliders="trimesh">
          <RoomEnvironment />
        </RigidBody>

        <DoorSign />
        <CheckoutDesk />
        <TapeDropBox />
        <AisleShelves />
        <CustomerManager />
        <PlacementPreview />
      </Physics>
    </Canvas>
  );
}
