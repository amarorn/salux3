import { useEffect } from 'react';
import Lenis from 'lenis';

/** Scroll fluido + inercial (motor Lenis ligado ao `requestAnimationFrame`). */
export function useLenisRoot(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      lerp: 0.086,
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 1.85,
      wheelMultiplier: 0.95,
      infinite: false,
    });

    let rafId: number;
    const loop = (t: number) => {
      lenis.raf(t);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [enabled]);
}
