import { useFrame } from '@react-three/fiber';
import { memo, Suspense, useEffect, useMemo, useRef } from 'react';
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  FogExp2,
  Group,
  IcosahedronGeometry,
  PointsMaterial,
  ShaderMaterial,
  Vector2,
  Points as PointsImpl,
  Mesh as MeshImpl,
  PointLight,
} from 'three';
import * as THREE from 'three';
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useMouseBridge } from '@/landing/MouseBridgeContext';
import { abstractBlobFragment, abstractBlobVertex } from '@/shaders/abstractBlob';

const chromaOffset = new Vector2(0.00072, 0.00115);

function ParticleFieldComponent({ count }: { count: number }) {
  const ref = useRef<PointsImpl>(null);
  const groupRef = useRef<Group>(null);
  const { smoothRef } = useMouseBridge();

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.2 + Math.random() * 5;
      const u = Math.random();
      const v = Math.random();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  const material = useMemo(
    () =>
      new PointsMaterial({
        color: new Color('#a78bfa'),
        size: 0.038,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
        blending: AdditiveBlending,
        sizeAttenuation: true,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((_, delta) => {
    const p = ref.current;
    const g = groupRef.current;
    if (!p || !g) return;
    const s = smoothRef.current;
    p.rotation.y += delta * 0.04;
    p.rotation.x += s.ny * delta * 0.14;
    p.rotation.z += s.nx * delta * 0.07;
    g.position.x = THREE.MathUtils.lerp(g.position.x, s.nx * 0.42, 0.05);
    g.position.y = THREE.MathUtils.lerp(g.position.y, s.ny * 0.36, 0.05);
  });

  return (
    <group ref={groupRef}>
      <points ref={ref} geometry={geometry} material={material} />
    </group>
  );
}

const ParticleField = memo(ParticleFieldComponent);

function AbstractBlobComponent() {
  const meshRef = useRef<MeshImpl>(null);
  const velRef = useRef(0);
  const prevNx = useRef(0);
  const prevNy = useRef(0);
  const { smoothRef } = useMouseBridge();

  const { geometry, material } = useMemo(() => {
    const geo = new IcosahedronGeometry(1, 64);
    const mat = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new Vector2(0, 0) },
        uWarp: { value: 0 },
        uColorCore: { value: new Color('#07040f') },
        uColorEdge: { value: new Color('#8b5cf6') },
      },
      vertexShader: abstractBlobVertex,
      fragmentShader: abstractBlobFragment,
      transparent: true,
    });
    return { geometry: geo, material: mat };
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((state, delta) => {
    const m = meshRef.current;
    if (!m) return;
    const s = smoothRef.current;

    const dnx = s.nx - prevNx.current;
    const dny = s.ny - prevNy.current;
    prevNx.current = s.nx;
    prevNy.current = s.ny;
    const spd = Math.hypot(dnx, dny) / Math.max(delta, 0.001);
    velRef.current = THREE.MathUtils.lerp(velRef.current, Math.min(spd * 0.022, 3.8), 0.14);

    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uMouse.value.set(s.nx, s.ny);
    material.uniforms.uWarp.value = velRef.current;

    m.rotation.x = THREE.MathUtils.lerp(m.rotation.x, s.ny * 0.6, 0.065);
    m.rotation.y = THREE.MathUtils.lerp(m.rotation.y, s.nx * 0.74, 0.065);

    m.position.x = THREE.MathUtils.lerp(m.position.x, s.nx * 0.78, 0.042);
    m.position.y = THREE.MathUtils.lerp(m.position.y, s.ny * 0.62, 0.042);

    const targetScale = 1.35 + Math.hypot(s.nx, s.ny) * 0.085;
    m.scale.setScalar(THREE.MathUtils.lerp(m.scale.x, targetScale, 0.055));
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}

const AbstractBlob = memo(AbstractBlobComponent);

/** Iluminação que segue o rato por refs; névoa exp² sugere ambiente volumétrico sem pass extra. */
const rimHueA = new Color('#aab8ff');
const rimHueB = new Color('#c4b5fd');

function RigLightsAndVolume() {
  const { smoothRef } = useMouseBridge();
  const keyRef = useRef<PointLight>(null);
  const fillRef = useRef<PointLight>(null);
  const rimRef = useRef<PointLight>(null);

  useFrame(() => {
    const s = smoothRef.current;
    if (keyRef.current) {
      keyRef.current.position.set(s.nx * 6.4, s.ny * 5.35 + 0.45, 7.35);
    }
    if (fillRef.current) {
      fillRef.current.position.set(-s.nx * 4.35, -s.ny * 2 - 1.95, 4.55);
    }
    if (rimRef.current) {
      rimRef.current.position.set(s.nx * 3.8, -s.ny * 5.2 + 3.8, -2.2);
      const t = Math.min(Math.hypot(s.nx, s.ny), 1);
      rimRef.current.color.copy(rimHueA).lerp(rimHueB, t);
    }
  });

  return (
    <>
      <ambientLight intensity={0.11} />
      <directionalLight position={[-5.5, 8.5, 6]} intensity={0.34} color="#38bdf8" />
      <pointLight ref={keyRef} intensity={1.62} color="#e9e5ff" distance={30} decay={2} />
      <pointLight ref={fillRef} intensity={0.62} color="#22d3ee" distance={25} decay={2} />
      <pointLight ref={rimRef} intensity={0.38} distance={42} decay={2} />
    </>
  );
}

function PostFxComponent({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom luminanceThreshold={0.105} mipmapBlur intensity={0.74} radius={0.52} />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={chromaOffset}
        radialModulation={false}
        modulationOffset={0}
      />
      <Vignette eskil={false} offset={0.36} darkness={0.54} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.04} />
    </EffectComposer>
  );
}

const PostFX = memo(PostFxComponent);

function SceneFog() {
  return <primitive attach="fog" object={new FogExp2('#05070d', 0.068)} />;
}

/** Cena memoizada: partículas, blob shader + magnet/warp, spot volumoso, névoa exp², pós. */
export const LusionScene = memo(function LusionSceneInner({
  particleCount,
  enablePost,
}: {
  particleCount: number;
  enablePost: boolean;
}) {
  return (
    <>
      <color attach="background" args={['#05070d']} />
      <SceneFog />
      <RigLightsAndVolume />
      <Suspense fallback={null}>
        <ParticleField count={particleCount} />
        <AbstractBlob />
        <PostFX enabled={enablePost} />
      </Suspense>
    </>
  );
});
