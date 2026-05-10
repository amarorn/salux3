import { useMouseBridge } from '@/landing/MouseBridgeContext';
import { useEffect, useRef } from 'react';

/**
 * Cursor em camadas (mercury / líquido): núcleo no rato suavizado; anel e aurora com follow retardado
 * e easings distintos — sensação de massa viscosa na superfície.
 */
export function CustomCursor() {
  const { smoothRef, mobile, interactiveHover } = useMouseBridge();
  const hoverRef = useRef(interactiveHover);
  hoverRef.current = interactiveHover;

  const auraRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const auraPos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const hoverScale = useRef(1);

  useEffect(() => {
    if (mobile || typeof window === 'undefined') return;

    const cx = smoothRef.current.x || window.innerWidth / 2;
    const cy = smoothRef.current.y || window.innerHeight / 2;
    auraPos.current = { x: cx, y: cy };
    ringPos.current = { x: cx, y: cy };

    let id: number;
    const tick = () => {
      const s = smoothRef.current;
      const ax = auraPos.current;
      const rx = ringPos.current;
      ax.x += (s.x - ax.x) * 0.028;
      ax.y += (s.y - ax.y) * 0.028;
      rx.x += (s.x - rx.x) * 0.058;
      rx.y += (s.y - rx.y) * 0.058;

      const targetScale = hoverRef.current ? 1.42 : 1;
      hoverScale.current += (targetScale - hoverScale.current) * 0.078;

      if (auraRef.current) {
        auraRef.current.style.transform = `translate3d(${ax.x}px, ${ax.y}px, 0) translate(-50%, -50%) scale(${1.05 + hoverScale.current * 0.06})`;
        auraRef.current.style.opacity = hoverRef.current ? '0.42' : '0.22';
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx.x}px, ${rx.y}px, 0) translate(-50%, -50%) scale(${hoverScale.current})`;
        ringRef.current.style.borderColor = hoverRef.current ? 'rgba(255,255,255,0.52)' : 'rgba(255,255,255,0.28)';
      }
      id = requestAnimationFrame(tick);
    };

    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [smoothRef, mobile]);

  if (mobile) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] mix-blend-difference">
      <div
        ref={auraRef}
        className="absolute left-0 top-0 h-[4.5rem] w-[4.5rem] rounded-full bg-[radial-gradient(circle_at_40%_35%,rgba(167,139,250,0.35),rgba(6,182,212,0.12)_45%,transparent_70%)] blur-[14px]"
        style={{ willChange: 'transform,opacity' }}
        aria-hidden
      />
      <div
        ref={ringRef}
        className="absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.26] bg-white/[0.04] backdrop-blur-[2px]"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={dotRef}
        className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.08]"
        style={{ willChange: 'transform' }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.92)]" />
      </div>
    </div>
  );
}
