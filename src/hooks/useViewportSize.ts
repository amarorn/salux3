import { useEffect, useState } from 'react';
import type { ViewportSize } from '@/domain/types';

const initial: ViewportSize =
  typeof window === 'undefined'
    ? { width: 1440, height: 900 }
    : { width: window.innerWidth, height: window.innerHeight };

export function useViewportSize(): ViewportSize {
  const [size, setSize] = useState<ViewportSize>(initial);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        setSize({ width: window.innerWidth, height: window.innerHeight }),
      );
    };
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
      cancelAnimationFrame(frame);
    };
  }, []);

  return size;
}
