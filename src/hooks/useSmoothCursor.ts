import { useEffect, useRef, useState } from 'react';
import { lerp2 } from '@/utils/lerp';
import { useMousePosition } from './useMousePosition';

export interface SmoothCursorState {
  nx: number;
  ny: number;
  x: number;
  y: number;
}

function initialSmooth(): SmoothCursorState {
  if (typeof window === 'undefined') {
    return { nx: 0, ny: 0, x: 0, y: 0 };
  }
  return {
    nx: 0,
    ny: 0,
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };
}

/**
 * Posição do rato suavizada (lerp) — um único loop rAF; raw atualizado por ref.
 */
export function useSmoothCursor(ease = 0.085): SmoothCursorState {
  const raw = useMousePosition();
  const rawRef = useRef(raw);
  rawRef.current = raw;

  const smooth = useRef<SmoothCursorState>(initialSmooth());
  const [, setTick] = useState(0);

  useEffect(() => {
    let id: number;
    const loop = () => {
      const r = rawRef.current;
      const [nx, ny] = lerp2(smooth.current.nx, smooth.current.ny, r.nx, r.ny, ease);
      const [x, y] = lerp2(smooth.current.x, smooth.current.y, r.x, r.y, ease);
      smooth.current = { nx, ny, x, y };
      setTick((t) => (t + 1) % 100000);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [ease]);

  return smooth.current;
}
