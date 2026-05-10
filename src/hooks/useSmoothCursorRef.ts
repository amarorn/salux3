import { type MutableRefObject, useEffect, useRef } from 'react';
import { useMousePosition } from './useMousePosition';
import { lerp2 } from '@/utils/lerp';
import type { SmoothCursorState } from './useSmoothCursor';

export function createInitialSmooth(): SmoothCursorState {
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
 * Atualiza `ref.current` com posição do rato suavizada (lerp) a cada frame — sem re-renders do React.
 */
export function useSmoothCursorRef(ref: MutableRefObject<SmoothCursorState>, ease = 0.085): void {
  const raw = useMousePosition();
  const rawRef = useRef(raw);
  rawRef.current = raw;

  useEffect(() => {
    let id: number;
    const loop = () => {
      const r = rawRef.current;
      const s = ref.current;
      const [nx, ny] = lerp2(s.nx, s.ny, r.nx, r.ny, ease);
      const [x, y] = lerp2(s.x, s.y, r.x, r.y, ease);
      ref.current = { nx, ny, x, y };
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [ease, ref]);
}
