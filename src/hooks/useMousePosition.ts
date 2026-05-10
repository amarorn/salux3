import { useCallback, useEffect, useState } from 'react';

export interface MousePositionState {
  /** 0..innerWidth */
  x: number;
  /** 0..innerHeight */
  y: number;
  /** -1..1 a partir do centro */
  nx: number;
  /** -1..1 a partir do centro (invertido Y para espaço cartesiano comum) */
  ny: number;
}

const initial = (): MousePositionState => ({
  x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
  y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
  nx: 0,
  ny: 0,
});

/**
 * Posição do rato em pixels e normalizada ao centro da viewport.
 */
export function useMousePosition(): MousePositionState {
  const [state, setState] = useState<MousePositionState>(initial);

  const onMove = useCallback((e: MouseEvent) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const nx = (e.clientX / w) * 2 - 1;
    const ny = -((e.clientY / h) * 2 - 1);
    setState({
      x: e.clientX,
      y: e.clientY,
      nx,
      ny,
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [onMove]);

  return state;
}
