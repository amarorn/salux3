import { useAnimationFrame } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { useRef, type MutableRefObject } from 'react';
import type { SmoothCursorState } from '@/hooks/useSmoothCursor';

/**
 * Parallax em camadas com inérgia independente: cada plano converge para o alvo com ease distinto —
 * planos mais “atrás” atrasam mais, reforçando sensação de profundidade fluida / líquida.
 */
export function useLandingParallax(
  smoothRef: MutableRefObject<SmoothCursorState>,
  layers: readonly { x: MotionValue<number>; y: MotionValue<number>; kx: number; ky: number }[],
) {
  const lagRef = useRef<{ x: number; y: number }[] | null>(null);

  useAnimationFrame(() => {
    const s = smoothRef.current;
    if (!lagRef.current || lagRef.current.length !== layers.length) {
      lagRef.current = layers.map(() => ({ x: 0, y: 0 }));
    }
    const lag = lagRef.current;
    for (let i = 0; i < layers.length; i++) {
      const L = layers[i]!;
      const targetX = s.nx * L.kx;
      const targetY = s.ny * L.ky;
      const ease = Math.max(0.052, 0.152 - i * 0.045);
      lag[i]!.x += (targetX - lag[i]!.x) * ease;
      lag[i]!.y += (targetY - lag[i]!.y) * ease;
      L.x.set(lag[i]!.x);
      L.y.set(lag[i]!.y);
    }
  });
}
