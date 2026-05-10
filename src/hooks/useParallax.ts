import { useMemo } from 'react';
import type { SmoothCursorState } from './useSmoothCursor';

export interface ParallaxOffset {
  shiftX: number;
  shiftY: number;
}

/**
 * Deslocamento em px derivado do cursor suavizado (camadas com intensidades diferentes).
 */
export function useParallax(
  smooth: SmoothCursorState,
  strengthX = 24,
  strengthY = 18,
): ParallaxOffset {
  return useMemo(
    () => ({
      shiftX: smooth.nx * strengthX,
      shiftY: smooth.ny * strengthY,
    }),
    [smooth.nx, smooth.ny, strengthX, strengthY],
  );
}
