"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, OrbitControls, Stars, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function Globe() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef}>
      <Sphere args={[1.2, 64, 64]}>
        <MeshDistortMaterial
          color="#17458f"
          emissive="#0d2a5e"
          emissiveIntensity={0.3}
          metalness={0.1}
          roughness={0.6}
          distort={0.15}
          speed={1.5}
          transparent
          opacity={0.92}
        />
      </Sphere>
      {/* Atmosphere glow */}
      <Sphere args={[1.35, 32, 32]}>
        <meshStandardMaterial
          color="#3b82f6"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </Sphere>
    </mesh>
  );
}

function RotatingRing() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[1.8, 0.015, 16, 100]} />
      <meshStandardMaterial
        color="#f7a800"
        emissive="#f7a800"
        emissiveIntensity={0.4}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

function SecondRing() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.25;
      ringRef.current.rotation.x = 1.0;
    }
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[2.0, 0.008, 16, 100]} />
      <meshStandardMaterial
        color="#60a5fa"
        emissive="#60a5fa"
        emissiveIntensity={0.3}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}

export default function RotaryGlobe() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 50 }}
      dpr={[1, 2]}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-5, -3, -5]} intensity={0.5} color="#3b82f6" />
      <pointLight position={[0, 5, -3]} intensity={0.3} color="#f7a800" />

      <Stars
        radius={80}
        depth={60}
        count={4000}
        factor={3}
        saturation={0}
        fade
        speed={0.5}
      />

      <Globe />
      <RotatingRing />
      <SecondRing />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
    </Canvas>
  );
}
