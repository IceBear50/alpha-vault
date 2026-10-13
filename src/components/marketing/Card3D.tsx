import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Environment, Lightformer, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import styles from "./Card3D.module.css";

function CardMesh() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const t = state.clock.getElapsedTime();
    group.position.y = Math.sin(t * 0.6) * 0.08;

    const targetRotY = 0.35 + state.pointer.x * 0.4 + Math.sin(t * 0.3) * 0.04;
    const targetRotX = -0.15 - state.pointer.y * 0.25;

    group.rotation.y += (targetRotY - group.rotation.y) * 0.06;
    group.rotation.x += (targetRotX - group.rotation.x) * 0.06;
  });

  return (
    <group ref={groupRef} rotation={[-0.15, 0.35, 0]}>
      {/* card body — glossy clearcoat metal */}
      <RoundedBox args={[3.2, 2, 0.12]} radius={0.1} smoothness={8}>
        <meshPhysicalMaterial
          color="#16161a"
          metalness={0.95}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.08}
          reflectivity={1}
          envMapIntensity={1.6}
        />
      </RoundedBox>

      {/* brushed edge highlight */}
      <RoundedBox args={[3.22, 2.02, 0.1]} radius={0.1} smoothness={8} position={[0, 0, -0.01]}>
        <meshPhysicalMaterial
          color="#2a2a2e"
          metalness={0.9}
          roughness={0.35}
        />
      </RoundedBox>

      {/* gold chip */}
      <RoundedBox
        args={[0.46, 0.34, 0.03]}
        radius={0.05}
        smoothness={4}
        position={[-1.05, 0.4, 0.07]}
      >
        <meshPhysicalMaterial
          color="#e6c288"
          metalness={0.85}
          roughness={0.25}
          clearcoat={0.6}
        />
      </RoundedBox>

      {/* embossed number blocks */}
      {[0, 1, 2, 3].map((i) => (
        <RoundedBox
          key={i}
          args={[0.42, 0.09, 0.02]}
          radius={0.02}
          smoothness={2}
          position={[-1.15 + i * 0.62, -0.35, 0.065]}
        >
          <meshPhysicalMaterial
            color="#3a3a3e"
            metalness={0.7}
            roughness={0.4}
          />
        </RoundedBox>
      ))}

      {/* glowing fractures — bloom picks these up via emissive intensity */}
      <mesh position={[0.1, -0.05, 0.065]} rotation={[0, 0, 0.45]}>
        <boxGeometry args={[3.8, 0.045, 0.01]} />
        <meshStandardMaterial
          color="#ff6a1f"
          emissive="#ff6a1f"
          emissiveIntensity={3.5}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0.5, 0.55, 0.065]} rotation={[0, 0, -0.6]}>
        <boxGeometry args={[1.7, 0.03, 0.01]} />
        <meshStandardMaterial
          color="#ff8a2a"
          emissive="#ff8a2a"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[-0.8, -0.65, 0.065]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[1.1, 0.025, 0.01]} />
        <meshStandardMaterial
          color="#ff4d1c"
          emissive="#ff4d1c"
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export default function Card3D() {
  return (
    <div className={styles.stage}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 32 }}
        dpr={[1, 2]}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.25} />
          <directionalLight position={[3, 4, 5]} intensity={1.4} color="#fff5e8" />
          <pointLight position={[-2.5, -1, 2]} intensity={3} color="#ff6a1f" />

          <Environment resolution={256}>
  <Lightformer
    intensity={3}
    color="white"
    position={[0, 4, 0]}
    rotation={[Math.PI / 2, 0, 0]}
    scale={[8, 8, 1]}
  />
  <Lightformer
    intensity={2}
    color="#ff8a2a"
    position={[-5, 1, 2]}
    rotation={[0, Math.PI / 2, 0]}
    scale={[6, 6, 1]}
  />
  <Lightformer
    intensity={1.5}
    color="#ffffff"
    position={[5, 1, 2]}
    rotation={[0, -Math.PI / 2, 0]}
    scale={[6, 6, 1]}
  />
  <Lightformer
    intensity={1}
    color="#ff4d1c"
    position={[0, -3, 2]}
    rotation={[-Math.PI / 2, 0, 0]}
    scale={[8, 8, 1]}
  />
</Environment>

          <CardMesh />

          <ContactShadows
            position={[0, -1.3, 0]}
            opacity={0.35}
            scale={6}
            blur={2.5}
            far={2}
          />

          <EffectComposer>
            <Bloom
              intensity={0.9}
              luminanceThreshold={0.25}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}