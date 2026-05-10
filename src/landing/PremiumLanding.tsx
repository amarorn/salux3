import { Suspense, memo, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { MouseBridgeProvider } from '@/landing/MouseBridgeContext';
import { createInitialSmooth, useSmoothCursorRef } from '@/hooks/useSmoothCursorRef';
import { isMobileViewport } from '@/utils/isMobileViewport';
import { useLenisRoot } from '@/landing/useLenisRoot';
import { LusionScene } from '@/scenes/LusionExperience';
import { HeroOverlay } from '@/landing/components/HeroOverlay';
import { CustomCursor } from '@/landing/components/CustomCursor';
import { FilmGrain } from '@/landing/components/FilmGrain';
import { RevealSection } from '@/landing/components/RevealSection';

/** Canvas fullscreen memoizado para não rerender quando o pai atualiza estado pouco relacionado. */
const LandingCanvas = memo(function LandingCanvasInner({
  particleCount,
  enablePost,
  mobile,
}: {
  particleCount: number;
  enablePost: boolean;
  mobile: boolean;
}) {
  const maxDpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio ?? 2, 2) : 2;
  const dpr: [number, number] = mobile ? [1, 1.35] : [1, maxDpr];

  return (
    <Canvas
      className="fixed inset-0 z-0 touch-none"
      dpr={dpr}
      gl={{
        alpha: false,
        antialias: true,
        powerPreference: 'high-performance',
      }}
      camera={{ position: [0, 0, 9], fov: 42 }}
    >
      <LusionScene particleCount={particleCount} enablePost={enablePost} />
    </Canvas>
  );
});

export default function PremiumLanding() {
  const [mobile, setMobile] = useState(() => isMobileViewport());
  const smoothRef = useRef(createInitialSmooth());

  useEffect(() => {
    const onResize = () => setMobile(isMobileViewport());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useSmoothCursorRef(smoothRef, mobile ? 0.138 : 0.084);
  useLenisRoot(!mobile);

  useEffect(() => {
    document.body.classList.add('landing-body');
    return () => document.body.classList.remove('landing-body');
  }, []);

  const particleCount = mobile ? 1400 : 7400;

  return (
    <MouseBridgeProvider smoothRef={smoothRef} mobile={mobile}>
      <div className="relative min-h-[220vh] cursor-none bg-[#05070d]">
        <Suspense fallback={<div className="fixed inset-0 z-0 bg-[#05070d]" aria-hidden />}>
          <LandingCanvas particleCount={particleCount} enablePost={!mobile} mobile={mobile} />
        </Suspense>

        <FilmGrain />
        <HeroOverlay />
        <RevealSection />
        <CustomCursor />
      </div>
    </MouseBridgeProvider>
  );
}
