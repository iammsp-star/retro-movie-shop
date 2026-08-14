'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';

export function CustomerNPC({ id, name, preferredGenre }) {
  const { isStoreOpen, setCustomerAtCounter, setTargetedObject, openModal } = useStore();
  const meshRef = useRef();

  // Customer AI States: 'OUTSIDE' -> 'WALKING_IN' -> 'BROWSING' -> 'TO_REGISTER' -> 'AT_REGISTER' -> 'LEAVING'
  const [aiState, setAiState] = useState('OUTSIDE');
  const [targetPos, setTargetPos] = useState(new THREE.Vector3(0, 1.3, 22)); // Start outside
  const [hasTape, setHasTape] = useState(false);

  useEffect(() => {
    if (isStoreOpen && aiState === 'OUTSIDE') {
      // Walk into store through front door
      setAiState('WALKING_IN');
      setTargetPos(new THREE.Vector3(0, 1.3, 16));
    }
  }, [isStoreOpen, aiState]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const currentPos = meshRef.current.position;
    const dist = currentPos.distanceTo(targetPos);

    if (dist > 0.3) {
      const dir = new THREE.Vector3().subVectors(targetPos, currentPos).normalize();
      meshRef.current.position.addScaledVector(dir, delta * 2.2);
    } else {
      // Transition State Machine
      if (aiState === 'WALKING_IN') {
        setAiState('BROWSING');
        setTargetPos(new THREE.Vector3(-4, 1.3, -2)); // Walk down aisle
      } else if (aiState === 'BROWSING') {
        setHasTape(true);
        setAiState('TO_REGISTER');
        setTargetPos(new THREE.Vector3(5.5, 1.3, 10)); // Walk to checkout counter
      } else if (aiState === 'TO_REGISTER') {
        setAiState('AT_REGISTER');
        setCustomerAtCounter({ id, name, preferredGenre, tapeTitle: 'Terminator 2', price: 4.99 });
      } else if (aiState === 'LEAVING') {
        setTargetPos(new THREE.Vector3(0, 1.3, 25)); // Exit store
      }
    }
  });

  if (!isStoreOpen && aiState === 'OUTSIDE') return null;

  return (
    <group
      ref={meshRef}
      position={[0, 1.3, 22]}
      onClick={(e) => {
        e.stopPropagation();
        if (aiState === 'AT_REGISTER') {
          openModal('checkout');
        }
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (aiState === 'AT_REGISTER') {
          setTargetedObject(`Customer ${name} at Register - Click to process checkout rental!`);
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => setTargetedObject(null)}
    >
      {/* Customer Mesh Body */}
      <mesh castShadow position={[0, 0, 0]}>
        <capsuleGeometry args={[0.35, 1.1, 8, 16]} />
        <meshStandardMaterial color={aiState === 'AT_REGISTER' ? '#f59e0b' : '#3b82f6'} roughness={0.5} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>

      {/* Held Tape when checking out */}
      {hasTape && (
        <mesh position={[0.25, 0, -0.2]} rotation={[0.3, 0.5, 0]}>
          <boxGeometry args={[0.3, 0.45, 0.06]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
      )}

      {/* Name Tag */}
      <Text position={[0, 1.4, 0]} fontSize={0.2} color="#ffffff">
        {name} {aiState === 'AT_REGISTER' ? '(Waiting at Counter!)' : ''}
      </Text>
    </group>
  );
}

export function CustomerManager() {
  const { isStoreOpen } = useStore();

  return (
    <group>
      {isStoreOpen && (
        <>
          <CustomerNPC id="cust_1" name="Alex (Retro Cinephile)" preferredGenre="Action" />
        </>
      )}
    </group>
  );
}
