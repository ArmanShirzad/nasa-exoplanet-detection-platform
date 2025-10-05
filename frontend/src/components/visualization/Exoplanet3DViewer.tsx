'use client';

import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Stars, 
  Text, 
  Sphere, 
  Html,
  useTexture,
  Environment
} from '@react-three/drei';
import { motion } from 'framer-motion';
import { X, Info, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import * as THREE from 'three';

// Types for exoplanet data
interface ExoplanetData {
  id: string;
  name: string;
  ra: number; // Right Ascension in degrees
  dec: number; // Declination in degrees
  distance: number; // Distance in parsecs
  radius: number; // Planet radius in Earth radii
  mass: number; // Planet mass in Earth masses
  temperature: number; // Equilibrium temperature in Kelvin
  period: number; // Orbital period in days
  habitability: number; // Habitability score (0-1)
  category: 'Gas Giant' | 'Super Earth' | 'Terrestrial' | 'Neptunian';
  starType: string;
  discoveryYear: number;
}

// Sample exoplanet data (in a real app, this would come from an API)
const sampleExoplanets: ExoplanetData[] = [
  {
    id: 'kepler-442b',
    name: 'Kepler-442b',
    ra: 19.01,
    dec: 39.18,
    distance: 342,
    radius: 1.34,
    mass: 2.3,
    temperature: 233,
    period: 112.3,
    habitability: 0.84,
    category: 'Super Earth',
    starType: 'K',
    discoveryYear: 2015
  },
  {
    id: 'kepler-186f',
    name: 'Kepler-186f',
    ra: 19.54,
    dec: 43.91,
    distance: 492,
    radius: 1.17,
    mass: 1.4,
    temperature: 188,
    period: 129.9,
    habitability: 0.64,
    category: 'Terrestrial',
    starType: 'M',
    discoveryYear: 2014
  },
  {
    id: 'proxima-centauri-b',
    name: 'Proxima Centauri b',
    ra: 14.29,
    dec: -62.68,
    distance: 1.3,
    radius: 1.3,
    mass: 1.27,
    temperature: 234,
    period: 11.2,
    habitability: 0.87,
    category: 'Terrestrial',
    starType: 'M',
    discoveryYear: 2016
  },
  {
    id: 'trappist-1e',
    name: 'TRAPPIST-1e',
    ra: 23.06,
    dec: -5.04,
    distance: 12.4,
    radius: 0.92,
    mass: 0.69,
    temperature: 251,
    period: 6.1,
    habitability: 0.95,
    category: 'Terrestrial',
    starType: 'M',
    discoveryYear: 2017
  },
  {
    id: 'kepler-452b',
    name: 'Kepler-452b',
    ra: 19.44,
    dec: 44.27,
    distance: 1402,
    radius: 1.63,
    mass: 5.0,
    temperature: 265,
    period: 384.8,
    habitability: 0.83,
    category: 'Super Earth',
    starType: 'G',
    discoveryYear: 2015
  }
];

// Convert celestial coordinates to 3D position
function celestialToCartesian(ra: number, dec: number, distance: number): [number, number, number] {
  // Convert RA and Dec to radians
  const raRad = (ra * Math.PI) / 180;
  const decRad = (dec * Math.PI) / 180;
  
  // Scale distance for visualization (logarithmic scale)
  const scaledDistance = Math.log10(distance + 1) * 5;
  
  // Convert to Cartesian coordinates
  const x = scaledDistance * Math.cos(decRad) * Math.cos(raRad);
  const y = scaledDistance * Math.sin(decRad);
  const z = scaledDistance * Math.cos(decRad) * Math.sin(raRad);
  
  return [x, y, z];
}

// Get color based on exoplanet category
function getCategoryColor(category: string): string {
  switch (category) {
    case 'Terrestrial': return '#4ade80'; // Green
    case 'Super Earth': return '#60a5fa'; // Blue
    case 'Gas Giant': return '#f59e0b'; // Orange
    case 'Neptunian': return '#8b5cf6'; // Purple
    default: return '#6b7280'; // Gray
  }
}

// Exoplanet component
function Exoplanet({ data, onSelect }: { data: ExoplanetData; onSelect: (planet: ExoplanetData) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const [x, y, z] = celestialToCartesian(data.ra, data.dec, data.distance);
  const color = getCategoryColor(data.category);
  const scale = Math.max(0.1, Math.min(2, data.radius / 2)); // Scale based on radius
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.scale.setScalar(hovered ? scale * 1.2 : scale);
    }
  });
  
  return (
    <group position={[x, y, z]}>
      <mesh
        ref={meshRef}
        onClick={() => onSelect(data)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={data.habitability * 0.3}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>
      
      {/* Habitability ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[scale * 1.5, scale * 1.7, 32]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={data.habitability * 0.5}
        />
      </mesh>
      
      {/* Label */}
      <Text
        position={[0, scale + 0.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        visible={hovered}
      >
        {data.name}
      </Text>
    </group>
  );
}

// Earth reference point
function EarthReference() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });
  
  return (
    <group position={[0, 0, 0]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color="#3b82f6" 
          emissive="#1e40af"
          emissiveIntensity={0.2}
        />
      </mesh>
      <Text
        position={[0, 0.8, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Earth
      </Text>
    </group>
  );
}

// Camera controller
function CameraController() {
  const { camera } = useThree();
  
  useFrame(() => {
    // Auto-rotate camera slowly
    camera.position.x = Math.sin(Date.now() * 0.0001) * 20;
    camera.position.z = Math.cos(Date.now() * 0.0001) * 20;
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

// Main 3D viewer component
interface Exoplanet3DViewerProps {
  onClose: () => void;
  selectedPlanet?: ExoplanetData | null;
  onPlanetSelect?: (planet: ExoplanetData) => void;
}

export default function Exoplanet3DViewer({ onClose, selectedPlanet, onPlanetSelect }: Exoplanet3DViewerProps) {
  const [selectedPlanetData, setSelectedPlanetData] = useState<ExoplanetData | null>(selectedPlanet || null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  
  const handlePlanetSelect = (planet: ExoplanetData) => {
    setSelectedPlanetData(planet);
    onPlanetSelect?.(planet);
  };
  
  const resetView = () => {
    // Reset camera position
    setAutoRotate(true);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
    >
      <div className="absolute inset-0 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-black/50 backdrop-blur-sm border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white">3D Exoplanet Explorer</h2>
            <p className="text-gray-400">Explore exoplanets in 3D space</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`p-2 rounded-lg transition-colors ${
                  autoRotate ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
                title="Auto Rotate"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setShowLabels(!showLabels)}
                className={`p-2 rounded-lg transition-colors ${
                  showLabels ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
                title="Toggle Labels"
              >
                <Info className="w-4 h-4" />
              </button>
              
              <button
                onClick={resetView}
                className="p-2 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 transition-colors"
                title="Reset View"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* 3D Canvas */}
        <div className="flex-1 relative">
          <Canvas
            camera={{ position: [0, 0, 20], fov: 60 }}
            style={{ background: 'transparent' }}
          >
            <Suspense fallback={null}>
              {/* Lighting */}
              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} />
              
              {/* Environment */}
              <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
              
              {/* Controls */}
              <OrbitControls 
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                autoRotate={autoRotate}
                autoRotateSpeed={0.5}
                maxDistance={100}
                minDistance={5}
              />
              
              {/* Earth reference */}
              <EarthReference />
              
              {/* Exoplanets */}
              {sampleExoplanets.map((planet) => (
                <Exoplanet 
                  key={planet.id} 
                  data={planet} 
                  onSelect={handlePlanetSelect}
                />
              ))}
              
              {/* Grid */}
              <gridHelper args={[50, 50, '#333', '#333']} />
            </Suspense>
          </Canvas>
        </div>
        
        {/* Planet Info Panel */}
        {selectedPlanetData && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-6 left-6 right-6 max-w-md"
          >
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">{selectedPlanetData.name}</h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Category:</span>
                  <span className="text-white ml-2">{selectedPlanetData.category}</span>
                </div>
                <div>
                  <span className="text-gray-400">Distance:</span>
                  <span className="text-white ml-2">{selectedPlanetData.distance} pc</span>
                </div>
                <div>
                  <span className="text-gray-400">Radius:</span>
                  <span className="text-white ml-2">{selectedPlanetData.radius} R⊕</span>
                </div>
                <div>
                  <span className="text-gray-400">Mass:</span>
                  <span className="text-white ml-2">{selectedPlanetData.mass} M⊕</span>
                </div>
                <div>
                  <span className="text-gray-400">Temperature:</span>
                  <span className="text-white ml-2">{selectedPlanetData.temperature} K</span>
                </div>
                <div>
                  <span className="text-gray-400">Period:</span>
                  <span className="text-white ml-2">{selectedPlanetData.period} days</span>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Habitability Score:</span>
                  <span className="text-white font-semibold">
                    {(selectedPlanetData.habitability * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${selectedPlanetData.habitability * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Legend */}
        <div className="absolute top-20 right-6">
          <div className="glass rounded-xl p-4">
            <h4 className="text-white font-semibold mb-3">Planet Categories</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-300">Terrestrial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-300">Super Earth</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-gray-300">Gas Giant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-gray-300">Neptunian</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
