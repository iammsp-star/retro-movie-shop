'use client';

import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, Text, PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { X, ExternalLink, Film, Clock, Calendar, Sparkles, Play, Info } from 'lucide-react';

// ==========================================
// PROCEDURAL FALLBACK VHS COVER TEXTURE
// ==========================================
function createFallbackTexture(title, genre = 'vhs') {
  if (typeof window === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  // Dark retro gradient background
  const grad = ctx.createLinearGradient(0, 0, 512, 768);
  grad.addColorStop(0, '#111827');
  grad.addColorStop(0.5, '#1f2937');
  grad.addColorStop(1, '#0f172a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 768);

  // Yellow Blockbuster-style outer border
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 18;
  ctx.strokeRect(20, 20, 472, 728);

  // Inner accent line
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 4;
  ctx.strokeRect(34, 34, 444, 700);

  // Header banner
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(36, 36, 440, 70);

  ctx.fillStyle = '#0f172a';
  ctx.font = '900 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BLOCKBUSTER CLASSIC', 256, 80);

  // Genre badge
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(156, 120, 200, 36);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(genre.toUpperCase(), 256, 144);

  // Main title box
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px sans-serif';

  // Wrap text
  const words = (title || 'RETRO MOVIE').split(' ');
  let line = '';
  let y = 360;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 400 && n > 0) {
      ctx.fillText(line, 256, y);
      line = words[n] + ' ';
      y += 45;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 256, y);

  // Footer VHS sticker
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(100, 640, 312, 50);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px monospace';
  ctx.fillText('📼 HIGH FIDELITY VHS', 256, 672);

  return new THREE.CanvasTexture(canvas);
}

// ==========================================
// CURATED FALLBACK DATASET FOR 4 AISLES
// ==========================================
const FALLBACK_MOVIES = {
  Action: [
    {
      id: 'act_1',
      title: 'Terminator 2: Judgment Day',
      year: '1991',
      runtime: '137 mins',
      genres: ['Action', 'Sci-Fi'],
      overview: 'A cyborg must protect young John Connor from a shape-shifting liquid metal T-1000 assassin.',
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
      wikiUrl: 'https://en.wikipedia.org/wiki/Terminator_2:_Judgment_Day',
    },
    {
      id: 'act_2',
      title: 'Die Hard',
      year: '1988',
      runtime: '132 mins',
      genres: ['Action', 'Thriller'],
      overview: 'NYPD cop John McClane takes on terrorists in a Los Angeles skyscraper during Christmas.',
      posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
      wikiUrl: 'https://en.wikipedia.org/wiki/Die_Hard',
    },
    {
      id: 'act_3',
      title: 'Mad Max 2: Road Warrior',
      year: '1981',
      runtime: '95 mins',
      genres: ['Action', 'Adventure'],
      overview: 'A wasteland lone survivor helps a small gasoline community defend against marauders.',
      posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      wikiUrl: 'https://en.wikipedia.org/wiki/Mad_Max_2',
    },
    {
      id: 'act_4',
      title: 'The Matrix',
      year: '1999',
      runtime: '136 mins',
      genres: ['Action', 'Sci-Fi'],
      overview: 'A hacker discovers reality is a simulated illusion created by sentient machines.',
      posterUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      wikiUrl: 'https://en.wikipedia.org/wiki/The_Matrix',
    },
    {
      id: 'act_5',
      title: 'Predator',
      year: '1987',
      runtime: '107 mins',
      genres: ['Action', 'Horror'],
      overview: 'Special ops commandos are hunted by an extraterrestrial creature in Central America.',
      posterUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
      wikiUrl: 'https://en.wikipedia.org/wiki/Predator_(film)',
    },
    {
      id: 'act_6',
      title: 'Speed',
      year: '1994',
      runtime: '116 mins',
      genres: ['Action', 'Thriller'],
      overview: 'A young cop must prevent a bomb aboard a city bus from exploding by keeping speed above 50 mph.',
      posterUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80',
      wikiUrl: 'https://en.wikipedia.org/wiki/Speed_(1994_film)',
    },
  ],
  SciFi: [
    {
      id: 'scifi_1',
      title: 'Blade Runner 2049',
      year: '2017',
      runtime: '164 mins',
      genres: ['Sci-Fi', 'Mystery'],
      overview: 'A new blade runner uncovers a long-buried secret that leads him to Rick Deckard.',
      posterUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80',
      wikiUrl: 'https://en.wikipedia.org/wiki/Blade_Runner_2049',
    },
    {
      id: 'scifi_2',
      title: 'TRON: Legacy',
      year: '2010',
      runtime: '125 mins',
      genres: ['Sci-Fi', 'Action'],
      overview: 'The son of a virtual world designer enters the digital universe his father created.',
      posterUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&auto=format&fit=crop&q=80',
      wikiUrl: 'https://en.wikipedia.org/wiki/Tron:_Legacy',
    },
    {
      id: 'scifi_3',
      title: 'Back to the Future',
      year: '1985',
      runtime: '116 mins',
      genres: ['Sci-Fi', 'Comedy'],
      overview: 'Marty McFly travels back to 1955 in a time-traveling DeLorean built by Doc Brown.',
      posterUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
      wikiUrl: 'https://en.wikipedia.org/wiki/Back_to_the_Future',
    },
    {
      id: 'scifi_4',
      title: 'RoboCop',
      year: '1987',
      runtime: '102 mins',
      genres: ['Sci-Fi', 'Action'],
      overview: 'In dystopic Detroit, a fatally wounded officer returns as a powerful law-enforcement cyborg.',
      posterUrl: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&auto=format&fit=crop&q=80',
      wikiUrl: 'https://en.wikipedia.org/wiki/RoboCop',
    },
    {
      id: 'scifi_5',
      title: 'Alien',
      year: '1979',
      runtime: '117 mins',
      genres: ['Sci-Fi', 'Horror'],
      overview: 'The crew of a commercial space freighter encounters a deadly alien organism.',
      posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      wikiUrl: 'https://en.wikipedia.org/wiki/Alien_(film)',
    },
    {
      id: 'scifi_6',
      title: 'Interstellar',
      year: '2014',
      runtime: '169 mins',
      genres: ['Sci-Fi', 'Drama'],
      overview: 'A team of explorers travels through a wormhole in space in an attempt to ensure humanity survival.',
      posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
      wikiUrl: 'https://en.wikipedia.org/wiki/Interstellar_(film)',
    },
  ],
  Comedy: [
    {
      id: 'com_1',
      title: 'Ghostbusters',
      year: '1984',
      runtime: '105 mins',
      genres: ['Comedy', 'Fantasy'],
      overview: 'Three eccentric parapsychologists start a ghost-catching business in New York City.',
      posterUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&auto=format&fit=crop&q=80',
      wikiUrl: 'https://en.wikipedia.org/wiki/Ghostbusters',
    },
    {
      id: 'com_2',
      title: 'Dumb and Dumber',
      year: '1994',
      runtime: '107 mins',
      genres: ['Comedy'],
      overview: 'Two well-meaning but incredibly dimwitted friends cross the country to return a briefcase.',
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
      wikiUrl: 'https://en.wikipedia.org/wiki/Dumb_and_Dumber',
    },
    {
      id: 'com_3',
      title: 'Groundhog Day',
      year: '1993',
      runtime: '101 mins',
      genres: ['Comedy', 'Romance'],
      overview: 'A cynical TV weatherman finds himself trapped repeating the same day over and over in Punxsutawney.',
      posterUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
      wikiUrl: 'https://en.wikipedia.org/wiki/Groundhog_Day_(film)',
    },
    {
      id: 'com_4',
      title: 'Sunglass',
      year: '2013',
      runtime: '100 mins',
      genres: ['Comedy', 'Drama'],
      overview: 'A classic retro comedy drama starring iconic cinema legends in a hilarious mixup.',
      posterUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/Sunglass_poster.jpg/220px-Sunglass_poster.jpg',
      wikiUrl: 'https://en.wikipedia.org/wiki/Sunglass_(2007_film)',
    },
    {
      id: 'com_5',
      title: 'Home Alone',
      year: '1990',
      runtime: '103 mins',
      genres: ['Comedy', 'Family'],
      overview: 'An eight-year-old troublemaker must protect his house from a pair of burglar brothers.',
      posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
      wikiUrl: 'https://en.wikipedia.org/wiki/Home_Alone',
    },
    {
      id: 'com_6',
      title: 'The Mask',
      year: '1994',
      runtime: '101 mins',
      genres: ['Comedy', 'Action'],
      overview: 'A timid bank clerk gains superhero-like cartoon abilities when he puts on a magical wooden mask.',
      posterUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
      wikiUrl: 'https://en.wikipedia.org/wiki/The_Mask_(1994_film)',
    },
  ],
  Horror: [
    {
      id: 'hor_1',
      title: 'The Thing',
      year: '1982',
      runtime: '109 mins',
      genres: ['Horror', 'Sci-Fi'],
      overview: 'An Antarctic research team is hunted by a shape-shifting alien that assimilates its prey.',
      posterUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&auto=format&fit=crop&q=80',
      wikiUrl: 'https://en.wikipedia.org/wiki/The_Thing_(1982_film)',
    },
    {
      id: 'hor_2',
      title: 'A Nightmare on Elm Street',
      year: '1984',
      runtime: '91 mins',
      genres: ['Horror', 'Slasher'],
      overview: 'The vengeful spirit of Freddy Krueger attacks teenagers in their dreams.',
      posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      wikiUrl: 'https://en.wikipedia.org/wiki/A_Nightmare_on_Elm_Street',
    },
    {
      id: 'hor_3',
      title: 'Halloween',
      year: '1978',
      runtime: '91 mins',
      genres: ['Horror', 'Thriller'],
      overview: 'Fifteen years after murdering his sister, Michael Myers escapes and targets babysitters.',
      posterUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80',
      wikiUrl: 'https://en.wikipedia.org/wiki/Halloween_(1978_film)',
    },
    {
      id: 'hor_4',
      title: 'The Shining',
      year: '1980',
      runtime: '146 mins',
      genres: ['Horror', 'Drama'],
      overview: 'A winter caretaker in an isolated hotel descends into madness under supernatural influence.',
      posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
      wikiUrl: 'https://en.wikipedia.org/wiki/The_Shining_(film)',
    },
    {
      id: 'hor_5',
      title: 'Evil Dead II',
      year: '1987',
      runtime: '84 mins',
      genres: ['Horror', 'Comedy'],
      overview: 'A lone survivor in a secluded cabin battles demonic spirits awakened by the Book of the Dead.',
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
      wikiUrl: 'https://en.wikipedia.org/wiki/Evil_Dead_II',
    },
    {
      id: 'hor_6',
      title: 'Scream',
      year: '1996',
      runtime: '111 mins',
      genres: ['Horror', 'Mystery'],
      overview: 'A masked killer known as Ghostface targets high school students using horror trivia.',
      posterUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      wikiUrl: 'https://en.wikipedia.org/wiki/Scream_(1996_film)',
    },
  ],
};

// ==========================================
// KEYBOARD MOVEMENT CONTROLS HOOK
// ==========================================
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

// ==========================================
// FIRST-PERSON PLAYER CONTROLLER & BOUNDARIES
// ==========================================
function FirstPersonPlayer({ isModalOpen }) {
  const { camera } = useThree();
  const keys = useKeyboardControls();
  const moveSpeed = 0.12;

  useFrame(() => {
    if (isModalOpen) return;

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

    // Requirement 4: Enforce strict room boundaries
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -15, 15);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -15, 12);
    camera.position.y = 1.7; // Fixed eye level height
  });

  return null;
}

// ==========================================
// RECESSED FLUORESCENT CEILING LIGHTS GRID
// ==========================================
function CeilingLights() {
  const lightPositions = [
    [-10, 4.95, -12], [0, 4.95, -12], [10, 4.95, -12],
    [-10, 4.95, -4],  [0, 4.95, -4],  [10, 4.95, -4],
    [-10, 4.95, 4],   [0, 4.95, 4],   [10, 4.95, 4],
    [-10, 4.95, 12],  [0, 4.95, 12],  [10, 4.95, 12],
  ];

  return (
    <group>
      {lightPositions.map((pos, idx) => (
        <group key={idx} position={pos}>
          {/* Metallic light fixture frame */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[2.6, 1.2]} />
            <meshStandardMaterial color="#333338" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* White Glowing Fluorescent Panel */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
            <planeGeometry args={[2.4, 1.0]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Direct Point Light Illuminating Store Below */}
          <pointLight position={[0, -0.4, 0]} intensity={1.1} distance={14} color="#fffdf0" />
        </group>
      ))}
    </group>
  );
}

// ==========================================
// FULL 3D ROOM ENCLOSURE (FLOOR, WALLS, CEILING)
// ==========================================
function RoomEnclosure() {
  return (
    <group>
      {/* 1. FLOOR PLANE (40x40 dark carpet) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#1e1e24" roughness={0.85} metalness={0.1} />
      </mesh>

      {/* Carpet Tile Grid Pattern Accent lines */}
      <gridHelper args={[40, 20, '#2d2d38', '#262630']} position={[0, 0.01, 0]} />

      {/* 2. CEILING PLANE (#222226) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#222226" roughness={0.9} />
      </mesh>

      {/* 3. WALL MESHES (LEFT, RIGHT, BACK) WITH YELLOW ACCENT BANNERS (#f59e0b) */}
      {/* LEFT WALL */}
      <group position={[-20, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        {/* Dark Gray Base Wall */}
        <mesh receiveShadow>
          <planeGeometry args={[40, 5]} />
          <meshStandardMaterial color="#1a1a20" roughness={0.7} />
        </mesh>
        {/* Top Yellow Accent Banner */}
        <mesh position={[0, 2.1, 0.02]}>
          <planeGeometry args={[40, 0.6]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Top Blue Secondary Line */}
        <mesh position={[0, 1.75, 0.02]}>
          <planeGeometry args={[40, 0.1]} />
          <meshStandardMaterial color="#1d4ed8" />
        </mesh>
      </group>

      {/* RIGHT WALL */}
      <group position={[20, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[40, 5]} />
          <meshStandardMaterial color="#1a1a20" roughness={0.7} />
        </mesh>
        <mesh position={[0, 2.1, 0.02]}>
          <planeGeometry args={[40, 0.6]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.2} />
        </mesh>
        <mesh position={[0, 1.75, 0.02]}>
          <planeGeometry args={[40, 0.1]} />
          <meshStandardMaterial color="#1d4ed8" />
        </mesh>
      </group>

      {/* BACK WALL */}
      <group position={[0, 2.5, -20]} rotation={[0, 0, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[40, 5]} />
          <meshStandardMaterial color="#1a1a20" roughness={0.7} />
        </mesh>
        <mesh position={[0, 2.1, 0.02]}>
          <planeGeometry args={[40, 0.6]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.2} />
        </mesh>
        <mesh position={[0, 1.75, 0.02]}>
          <planeGeometry args={[40, 0.1]} />
          <meshStandardMaterial color="#1d4ed8" />
        </mesh>

        {/* Massive Store Logo Sign on Back Wall */}
        <group position={[0, 0.5, 0.05]}>
          <mesh>
            <planeGeometry args={[14, 2.2]} />
            <meshStandardMaterial color="#1e3a8a" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[14.4, 2.6]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
          <Text position={[0, 0.4, 0.06]} fontSize={0.8} color="#f59e0b" font="/fonts/Inter-Bold.woff">
            BLOCKBUSTER RETRO
          </Text>
          <Text position={[0, -0.4, 0.06]} fontSize={0.45} color="#ffffff">
            VIDEO RENTAL VAULT
          </Text>
        </group>
      </group>
    </group>
  );
}

// ==========================================
// SUSPENDED 3D CATEGORY SIGN ABOVE AISLE
// ==========================================
function SuspendedCategorySign({ text, position }) {
  return (
    <group position={position}>
      {/* Steel Hanging Chains from Ceiling */}
      <mesh position={[-1.1, 0.55, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 1.1]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[1.1, 0.55, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 1.1]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Outer Golden/Yellow Border Frame */}
      <mesh>
        <boxGeometry args={[2.8, 0.65, 0.08]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.3} />
      </mesh>
      {/* Inner Blue Sign Board */}
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[2.68, 0.53, 0.08]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.4} />
      </mesh>

      {/* Front 3D Text */}
      <Text position={[0, 0, 0.06]} fontSize={0.28} color="#ffffff">
        {text.toUpperCase()}
      </Text>
      {/* Back 3D Text */}
      <Text position={[0, 0, -0.06]} rotation={[0, Math.PI, 0]} fontSize={0.28} color="#ffffff">
        {text.toUpperCase()}
      </Text>
    </group>
  );
}

// ==========================================
// "NOW SHOWING" FRAMED POSTER STAND AT AISLE END
// ==========================================
function NowShowingStand({ position, movie, onSelect }) {
  let texture;
  const poster = movie?.posterUrl || movie?.poster_url || movie?.poster_path;
  try {
    texture = useTexture(poster);
  } catch (err) {
    texture = null;
  }
  const fallbackTex = useMemo(() => createFallbackTexture(movie?.title || 'NOW SHOWING', 'NOW SHOWING'), [movie]);
  const activeTexture = texture || fallbackTex;

  if (activeTexture) activeTexture.colorSpace = THREE.SRGBColorSpace;

  return (
    <group position={position}>
      {/* Wooden Base Frame (#2b1810) */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 2.2, 0.15]} />
        <meshStandardMaterial color="#2b1810" roughness={0.6} />
      </mesh>

      {/* Header Banner Frame */}
      <mesh position={[0, 2.05, 0.09]}>
        <boxGeometry args={[1.4, 0.28, 0.04]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.3} />
      </mesh>

      <Text position={[0, 2.05, 0.12]} fontSize={0.12} color="#0f172a">
        ★ NOW SHOWING ★
      </Text>

      {/* Poster Display */}
      <mesh
        position={[0, 1.0, 0.09]}
        onClick={(e) => {
          e.stopPropagation();
          if (movie) onSelect(movie);
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <planeGeometry args={[1.25, 1.7]} />
        <meshStandardMaterial map={activeTexture} roughness={0.3} />
      </mesh>

      {/* Stand Base Legs */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.6, 0.2, 0.4]} />
        <meshStandardMaterial color="#2b1810" roughness={0.6} />
      </mesh>
    </group>
  );
}

// ==========================================
// SINGLE 3D MOVIE VHS BOX
// ==========================================
function MovieBox({ position, rotation = [0, 0, 0], movie, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const poster = movie?.posterUrl || movie?.poster_url || movie?.poster_path;
  const title = movie?.title || 'VHS TAPE';

  let texture;
  try {
    texture = useTexture(poster);
  } catch (err) {
    texture = null;
  }

  const fallbackTex = useMemo(() => createFallbackTexture(title, movie?.genres?.[0] || 'CLASSIC'), [title, movie]);
  const activeTex = texture || fallbackTex;

  if (activeTex) activeTex.colorSpace = THREE.SRGBColorSpace;

  return (
    <group position={position} rotation={rotation}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect(movie);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        scale={hovered ? [1.08, 1.08, 1.08] : [1, 1, 1]}
        castShadow
        receiveShadow
      >
        {/* 3D VHS Box dimensions: width 0.45, height 0.68, depth 0.09 */}
        <boxGeometry args={[0.45, 0.68, 0.09]} />
        <meshStandardMaterial attach="material-0" color="#111115" roughness={0.4} />
        <meshStandardMaterial attach="material-1" color="#111115" roughness={0.4} />
        <meshStandardMaterial attach="material-2" color="#050508" roughness={0.5} />
        <meshStandardMaterial attach="material-3" color="#050508" roughness={0.5} />
        {/* Front Cover Poster */}
        <meshStandardMaterial
          attach="material-4"
          map={activeTex}
          color={hovered ? '#ffffff' : '#f3f4f6'}
          roughness={0.25}
          emissive={hovered ? '#f59e0b' : '#000000'}
          emissiveIntensity={hovered ? 0.25 : 0}
        />
        {/* Back Cover */}
        <meshStandardMaterial attach="material-5" color="#18181b" roughness={0.6} />
      </mesh>
    </group>
  );
}

// ==========================================
// DOUBLE-SIDED AISLE UNIT (#2b1810 WOOD FRAME)
// ==========================================
function DoubleSidedAisleUnit({ position, genre, movies = [], onSelectMovie }) {
  const xPos = position[0];
  const zPos = position[2];

  // Divide movies for front side and back side
  const frontMovies = movies.slice(0, 6);
  const backMovies = movies.slice(6, 12).length > 0 ? movies.slice(6, 12) : movies.slice(0, 6);

  return (
    <group position={[xPos, 0, zPos]}>
      {/* Overhead Suspended 3D Category Sign */}
      <SuspendedCategorySign text={genre} position={[0, 4.0, -2]} />

      {/* Main Wood Structure Frame (#2b1810) */}
      <group position={[0, 0, -2]}>
        {/* Center Partition Board */}
        <mesh position={[0, 1.4, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.08, 2.6, 7.6]} />
          <meshStandardMaterial color="#2b1810" roughness={0.7} />
        </mesh>

        {/* End Support Posts */}
        <mesh position={[0, 1.4, -3.8]} receiveShadow castShadow>
          <boxGeometry args={[1.3, 2.8, 0.16]} />
          <meshStandardMaterial color="#2b1810" roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.4, 3.8]} receiveShadow castShadow>
          <boxGeometry args={[1.3, 2.8, 0.16]} />
          <meshStandardMaterial color="#2b1810" roughness={0.6} />
        </mesh>

        {/* Horizontal Wooden Shelf Planks (4 Height Levels) */}
        {[0.5, 1.1, 1.7, 2.3].map((yHeight, idx) => (
          <mesh key={idx} position={[0, yHeight, 0]} receiveShadow castShadow>
            <boxGeometry args={[1.25, 0.08, 7.6]} />
            <meshStandardMaterial color="#2b1810" roughness={0.6} />
          </mesh>
        ))}

        {/* FRONT SIDE TAPES (+X Side facing walkway) */}
        <group position={[0.2, 0, 0]}>
          {frontMovies.map((movie, idx) => {
            const row = Math.floor(idx / 3); // 2 rows
            const col = idx % 3; // 3 columns per row
            const z = (col - 1) * 2.2;
            const y = 0.85 + row * 0.6;

            return (
              <Suspense key={`front_${movie.id || idx}`} fallback={null}>
                <MovieBox
                  position={[0.12, y, z]}
                  rotation={[0, Math.PI / 2, 0]}
                  movie={movie}
                  onSelect={onSelectMovie}
                />
              </Suspense>
            );
          })}
        </group>

        {/* BACK SIDE TAPES (-X Side facing walkway) */}
        <group position={[-0.2, 0, 0]}>
          {backMovies.map((movie, idx) => {
            const row = Math.floor(idx / 3);
            const col = idx % 3;
            const z = (col - 1) * 2.2;
            const y = 0.85 + row * 0.6;

            return (
              <Suspense key={`back_${movie.id || idx}`} fallback={null}>
                <MovieBox
                  position={[-0.12, y, z]}
                  rotation={[0, -Math.PI / 2, 0]}
                  movie={movie}
                  onSelect={onSelectMovie}
                />
              </Suspense>
            );
          })}
        </group>
      </group>

      {/* "NOW SHOWING" Framed Poster Stand at Aisle End Cap (z = 2.4) */}
      <NowShowingStand position={[0, 0, 2.4]} movie={movies[0]} onSelect={onSelectMovie} />
    </group>
  );
}

// ==========================================
// MAIN RETRO 3D VIDEO STORE APPLICATION
// ==========================================
export default function HomePage() {
  const [data, setData] = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/data/movies.json')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error('Using fallback dataset:', err));
  }, []);

  const actionMovies = data['Action'] && data['Action'].length > 0 ? data['Action'] : FALLBACK_MOVIES.Action;
  const sciFiMovies = data['SciFi'] && data['SciFi'].length > 0 ? data['SciFi'] : FALLBACK_MOVIES.SciFi;
  const comedyMovies = data['Comedy'] && data['Comedy'].length > 0 ? data['Comedy'] : FALLBACK_MOVIES.Comedy;
  const horrorMovies = data['Horror'] && data['Horror'].length > 0 ? data['Horror'] : FALLBACK_MOVIES.Horror;

  if (!mounted) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center text-white font-sans">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-amber-400 text-sm font-bold tracking-widest animate-pulse">
          INITIALIZING BLOCKBUSTER 3D ROOM...
        </p>
      </div>
    );
  }

  return (
    <main className="relative w-screen h-screen bg-black overflow-hidden font-sans select-none">
      {/* Center Screen Crosshair HUD */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400/90 border border-black shadow-lg" />
      </div>

      {/* Control Instructions Overlay */}
      <header className="absolute top-4 left-4 z-10 bg-slate-900/90 border border-amber-500/30 p-4 rounded-xl text-white shadow-2xl backdrop-blur-md max-w-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl">📼</span>
          <h1 className="text-lg font-black text-amber-400 tracking-wider font-mono">BLOCKBUSTER 3D VAULT</h1>
        </div>
        <p className="text-xs text-gray-300 mt-1">Fully enclosed retro video rental store</p>
        <div className="mt-3 text-[11px] text-amber-300 font-mono bg-black/60 p-2.5 rounded-lg border border-amber-500/20 space-y-1">
          <p>🎮 <strong>Controls:</strong> Click screen to look around</p>
          <p>🚶 <strong>Walk:</strong> WASD / Arrow Keys</p>
          <p>🔍 <strong>Inspect:</strong> Click any VHS Tape poster</p>
          <p>🔑 <strong>Unlock Mouse:</strong> Press ESC</p>
        </div>
      </header>

      {/* 3D WebGL Canvas */}
      <Canvas camera={{ position: [0, 1.7, 9], fov: 65 }} shadows>
        {/* Requirement 3: Ambient Light 1.2 & Soft Fill Directional Light */}
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 12, 10]} intensity={0.8} color="#ffffff" castShadow />

        {/* First Person Player & Movement Clamp Controller */}
        <FirstPersonPlayer isModalOpen={!!selectedMovie} />
        <PointerLockControls />

        {/* Requirement 1: Full 3D Room Enclosure (Floor, Walls, Ceiling) */}
        <RoomEnclosure />

        {/* Recessed Fluorescent Lights Grid */}
        <CeilingLights />

        {/* Requirement 2: 4 Multi-Row Double-Sided Aisles with Suspended Signs */}
        <DoubleSidedAisleUnit
          position={[-9, 0, -2]}
          genre="ACTION"
          movies={actionMovies}
          onSelectMovie={setSelectedMovie}
        />
        <DoubleSidedAisleUnit
          position={[-3, 0, -2]}
          genre="SCI-FI"
          movies={sciFiMovies}
          onSelectMovie={setSelectedMovie}
        />
        <DoubleSidedAisleUnit
          position={[3, 0, -2]}
          genre="COMEDY"
          movies={comedyMovies}
          onSelectMovie={setSelectedMovie}
        />
        <DoubleSidedAisleUnit
          position={[9, 0, -2]}
          genre="HORROR"
          movies={horrorMovies}
          onSelectMovie={setSelectedMovie}
        />
      </Canvas>

      {/* Movie Details Modal Drawer */}
      {selectedMovie && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900/95 border-l border-amber-500/40 p-6 text-white backdrop-blur-xl flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-amber-400">📼</span>
                <span className="text-xs font-bold text-amber-400 tracking-widest uppercase font-mono">
                  VHS Rental Inspection
                </span>
              </div>
              <button
                onClick={() => setSelectedMovie(null)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex gap-4 mb-6">
              <img
                src={selectedMovie.posterUrl || selectedMovie.poster_url || selectedMovie.poster_path}
                alt={selectedMovie.title}
                className="w-28 h-40 object-cover rounded-lg border-2 border-amber-500/30 shadow-xl"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-black mb-2 leading-tight text-white">{selectedMovie.title}</h2>
                <div className="space-y-1.5 text-sm text-gray-300 font-mono">
                  <p className="flex items-center gap-2">
                    <Calendar size={14} className="text-amber-400" /> {selectedMovie.year || selectedMovie.release_year}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={14} className="text-amber-400" /> {selectedMovie.runtime || '120 mins'}
                  </p>
                </div>
              </div>
            </div>

            {/* Overview Plot */}
            <div className="mb-6 bg-black/40 p-3.5 rounded-xl border border-gray-800">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1 font-mono">
                <Info size={13} className="text-amber-400" /> Plot Summary
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {selectedMovie.overview || 'A classic blockbuster rental favorite from our 3D retro video store vault.'}
              </p>
            </div>

            {/* Genres */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1 font-mono">
                <Film size={14} className="text-amber-400" /> Genres
              </h3>
              <div className="flex flex-wrap gap-2">
                {(selectedMovie.genres || selectedMovie.genres_list || ['Classic']).map((g, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs rounded-full font-mono font-medium"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {(selectedMovie.wikiUrl || selectedMovie.wiki_url) && (
            <a
              href={selectedMovie.wikiUrl || selectedMovie.wiki_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl flex items-center justify-center gap-2 transition shadow-lg text-sm mt-6"
            >
              <span>Read Full Details on Wikipedia</span>
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      )}
    </main>
  );
}
