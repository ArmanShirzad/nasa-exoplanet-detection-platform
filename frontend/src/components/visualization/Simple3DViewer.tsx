'use client';

import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Stars, 
  Text, 
  Html
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Star, Info, RotateCcw } from 'lucide-react';
import * as THREE from 'three';
import { ExoplanetData, processedExoplanetData, getCategoryColor } from '@/utils/exoplanetData';

// Simple exoplanet component
function Exoplanet({ data, onSelect, isSelected }: { 
  data: ExoplanetData; 
  onSelect: (planet: ExoplanetData) => void;
  isSelected: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Convert celestial coordinates to 3D position
  const raRad = (data.ra * Math.PI) / 180;
  const decRad = (data.dec * Math.PI) / 180;
  const scaledDistance = Math.log10(data.distance + 1) * 3;
  
  const x = scaledDistance * Math.cos(decRad) * Math.cos(raRad);
  const y = scaledDistance * Math.sin(decRad);
  const z = scaledDistance * Math.cos(decRad) * Math.sin(raRad);
  
  const color = getCategoryColor(data.category);
  const scale = Math.max(0.2, Math.min(1.5, data.radius / 3));
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      const targetScale = isSelected ? scale * 1.5 : hovered ? scale * 1.2 : scale;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
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
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={data.habitability * 0.2}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>
      
      {/* Habitability indicator */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[scale * 1.3, scale * 1.5, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={data.habitability * 0.4}
        />
      </mesh>
      
      {/* Label */}
      {(hovered || isSelected) && (
        <Text
          position={[0, scale + 0.3, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {data.name}
        </Text>
      )}
    </group>
  );
}

// Earth reference
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
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial 
          color="#3b82f6" 
          emissive="#1e40af"
          emissiveIntensity={0.1}
        />
      </mesh>
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Earth
      </Text>
    </group>
  );
}

// Main component
interface Simple3DViewerProps {
  className?: string;
  onPlanetSelect?: (planet: ExoplanetData) => void;
}

export default function Simple3DViewer({ className = '', onPlanetSelect }: Simple3DViewerProps) {
  const [selectedPlanet, setSelectedPlanet] = useState<ExoplanetData | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  
  const handlePlanetSelect = (planet: ExoplanetData) => {
    setSelectedPlanet(planet);
    onPlanetSelect?.(planet);
  };
  
  return (
    <div className={`relative ${className}`}>
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
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
          onClick={() => setShowInfo(!showInfo)}
          className={`p-2 rounded-lg transition-colors ${
            showInfo ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
          title="Show Info"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
      
      {/* 3D Canvas */}
      <div className="w-full h-96 rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black">
        <Canvas
          camera={{ position: [0, 0, 15], fov: 60 }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <pointLight position={[-10, -10, -10]} intensity={0.4} />
            
            {/* Stars background */}
            <Stars radius={50} depth={30} count={2000} factor={2} saturation={0} fade speed={1} />
            
            {/* Controls */}
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              autoRotate={autoRotate}
              autoRotateSpeed={0.5}
              maxDistance={50}
              minDistance={5}
            />
            
            {/* Earth reference */}
            <EarthReference />
            
            {/* Exoplanets */}
            {processedExoplanetData.slice(0, 8).map((planet) => (
              <Exoplanet 
                key={planet.id} 
                data={planet} 
                onSelect={handlePlanetSelect}
                isSelected={selectedPlanet?.id === planet.id}
              />
            ))}
          </Suspense>
        </Canvas>
      </div>
      
      {/* Planet Info */}
      <AnimatePresence>
        {selectedPlanet && showInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 right-4"
          >
            <div className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white">{selectedPlanet.name}</h3>
                <button
                  onClick={() => setSelectedPlanet(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-400">Category:</span>
                  <span className="text-white ml-2">{selectedPlanet.category}</span>
                </div>
                <div>
                  <span className="text-gray-400">Distance:</span>
                  <span className="text-white ml-2">{selectedPlanet.distance} pc</span>
                </div>
                <div>
                  <span className="text-gray-400">Radius:</span>
                  <span className="text-white ml-2">{selectedPlanet.radius} R⊕</span>
                </div>
                <div>
                  <span className="text-gray-400">Temperature:</span>
                  <span className="text-white ml-2">{selectedPlanet.temperature} K</span>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-400 text-sm">Habitability:</span>
                  <span className="text-white text-sm font-semibold">
                    {(selectedPlanet.habitability * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${selectedPlanet.habitability * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Legend */}
      {showInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-16 right-4"
        >
          <div className="glass rounded-lg p-3">
            <h4 className="text-white font-semibold mb-2 text-sm">Categories</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-gray-300">Terrestrial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-gray-300">Super Earth</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-gray-300">Gas Giant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="text-gray-300">Neptunian</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
