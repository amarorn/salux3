import { useEffect, useState } from 'react';
import { lerp } from '@/utils/lerp';

/**
 * Interpolação escalar em direção a `target` (útil para um canal de animação).
 */
export function useLerpValue(target: number, ease = 0.12): number {
  const [value, setValue] = useState(target);

  useEffect(() => {
    let id: number;
    let active = true;
    const step = () => {
      setValue((v) => {
        const next = lerp(v, target, ease);
        if (active && (Math.abs(next - target) > 1e-5 || Math.abs(next - v) > 1e-5)) {
          id = requestAnimationFrame(step);
        }
        return next;
      });
    };
    id = requestAnimationFrame(step);
    return () => {
      active = false;
      cancelAnimationFrame(id);
    };
  }, [target, ease]);

  return value;
}
