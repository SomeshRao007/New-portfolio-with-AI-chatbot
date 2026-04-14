import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Particles = ({ count = 3000 }) => {
  const mesh = useRef<THREE.Points>(null);
  
  // Generate random positions for particles
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
    }
    return positions;
  }, [count]);

  const mouse = useRef(new THREE.Vector2());

  // Update particles based on mouse and time
  useFrame((state) => {
    if (!mesh.current) return;
    
    // Slow continuous rotation
    mesh.current.rotation.x = state.clock.getElapsedTime() * 0.05;
    mesh.current.rotation.y = state.clock.getElapsedTime() * 0.05;

    // Optional: add slight movement toward cursor for a subtle interactive effect
    // We get the normalized mouse coordinates from state.pointer
    mouse.current.x = (state.pointer.x * Math.PI) * 0.1;
    mouse.current.y = (state.pointer.y * Math.PI) * 0.1;
    
    mesh.current.rotation.x += mouse.current.y * 0.05;
    mesh.current.rotation.y += mouse.current.x * 0.05;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#3b82f6" // React Blue/Tailwind Blue 500
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export const ParticleNetwork: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <Particles count={3000} />
      </Canvas>
    </div>
  );
};
