import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float, Points, PointMaterial, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Custom shader for the iris/accretion disk effect
const accretionShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#8b5cf6') },
    uSecondaryColor: { value: new THREE.Color('#3b82f6') }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uSecondaryColor;
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      float dist = distance(vUv, vec2(0.5));
      float ring = smoothstep(0.2, 0.25, dist) * (1.0 - smoothstep(0.45, 0.5, dist));
      
      // Animated noise/void streaks
      float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
      float strength = pow(abs(sin(angle * 10.0 + uTime * 2.0)), 3.0);
      
      vec3 finalColor = mix(uColor, uSecondaryColor, sin(uTime + dist * 10.0));
      gl_FragColor = vec4(finalColor, ring * (0.5 + 0.5 * strength));
      
      if (gl_FragColor.a < 0.01) discard;
    }
  `
};

function AccretionDisk() {
  const meshRef = useRef();
  useFrame((state) => {
    meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.5;
    meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.5, 0, 0]}>
      <planeGeometry args={[6, 6]} />
      <shaderMaterial
        args={[accretionShader]}
        transparent
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function DataStream() {
  const pointsRef = useRef();
  const count = 2000;

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
      spd[i] = Math.random() * 0.1 + 0.05;
    }
    return [pos, spd];
  }, []);

  useFrame(() => {
    const array = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      array[i * 3 + 1] -= speeds[i];
      if (array[i * 3 + 1] < -10) array[i * 3 + 1] = 10;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y += 0.001;
  });

  return (
    <Points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.2}
      />
    </Points>
  );
}

function InfiniteVortex() {
  const groupRef = useRef();
  useFrame((state) => {
    groupRef.current.rotation.z = state.clock.getElapsedTime() * 0.1;
  });

  return (
    <group ref={groupRef}>
      <Stars radius={100} depth={50} count={20000} factor={4} saturation={1} fade speed={1} />
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh scale={20} rotation={[0, 0, 0]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color="#1e1b4b"
            side={THREE.BackSide}
            transparent
            opacity={0.15}
            wireframe
          />
        </mesh>
      </Float>
    </group>
  );
}

function Singularity() {
  return (
    <group>
      {/* The Core Void */}
      <mesh>
        <sphereGeometry args={[0.95, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Event Horizon Glow */}
      <mesh scale={1.05}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshWobbleMaterial
          color="#8b5cf6"
          transparent
          opacity={0.4}
          factor={0.4}
          speed={2}
          emissive="#3b82f6"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Accretion Ring */}
      <AccretionDisk />
    </group>
  );
}

function Rig() {
  const { camera, mouse } = useThree();
  const vec = new THREE.Vector3();
  useFrame(() => {
    camera.position.lerp(vec.set(mouse.x * 3, mouse.y * 3, 8), 0.05);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Background3D() {
  return (
    <div className="absolute inset-0 -z-10 bg-black overflow-hidden">
      {/* Cinematic Flash & Vignette */}
      <div className="lightning-flash absolute inset-0 bg-white/10 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_80%)] z-[5] pointer-events-none" />

      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <fog attach="fog" args={['#000', 5, 25]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 5]} intensity={2} color="#8b5cf6" />

        <InfiniteVortex />
        <DataStream />
        <Singularity />
        <Rig />
      </Canvas>
    </div>
  );
}
