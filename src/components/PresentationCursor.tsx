import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { usePresentationNavigation } from '@/hooks/usePresentationNavigation';
import { usePresentationStore } from '@/store/presentationStore';
import { theme } from '@/domain/theme';

const INTERACTIVE =
  'button, a, [role="button"], input, select, [tabindex]:not([tabindex="-1"])';

export function PresentationCursor() {
  const hasEntered = usePresentationStore((s) => s.hasEntered);
  const { current } = usePresentationNavigation();
  const accentHex = theme.accents[current.accent ?? 'violet'].base;

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef(accentHex);
  accentRef.current = accentHex;
  const hasEnteredRef = useRef(hasEntered);
  hasEnteredRef.current = hasEntered;

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const mouse = { x: -400, y: -400 };
    const ring = { x: -400, y: -400 };
    let ringSize = 32;
    let dotScale = 1;
    let visible = false;
    let hovering = false;
    let pressing = false;

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!visible) {
        visible = true;
        ring.x = e.clientX;
        ring.y = e.clientY;
      }
    };
    const onOver = (e: PointerEvent) => {
      hovering = Boolean((e.target as HTMLElement | null)?.closest?.(INTERACTIVE));
    };
    const onLeave = () => { visible = false; };
    const onEnter = () => { visible = true; };
    const onDown = () => { pressing = true; };
    const onUp = () => { pressing = false; };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerover', onOver);
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('pointerenter', onEnter);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);

    let raf: number;
    const tick = () => {
      ring.x += (mouse.x - ring.x) * 0.068;
      ring.y += (mouse.y - ring.y) * 0.068;
      ringSize += ((hovering ? 48 : 32) - ringSize) * 0.14;
      dotScale += ((pressing ? 0.55 : 1) - dotScale) * 0.2;

      const show = visible && hasEnteredRef.current;
      const accent = accentRef.current;

      if (dotRef.current) {
        dotRef.current.style.opacity = show ? '1' : '0';
        dotRef.current.style.transform = `translate3d(${mouse.x}px,${mouse.y}px,0) translate(-50%,-50%) scale(${dotScale.toFixed(3)})`;
        dotRef.current.style.boxShadow = `0 0 8px 2px ${accent}88`;
      }
      if (ringRef.current) {
        ringRef.current.style.opacity = show ? (hovering ? '0.8' : '0.5') : '0';
        ringRef.current.style.transform = `translate3d(${ring.x}px,${ring.y}px,0) translate(-50%,-50%)`;
        ringRef.current.style.width = `${ringSize.toFixed(1)}px`;
        ringRef.current.style.height = `${ringSize.toFixed(1)}px`;
        ringRef.current.style.borderColor = hovering
          ? `${accent}cc`
          : 'rgba(255,255,255,0.3)';
        ringRef.current.style.boxShadow = hovering
          ? `0 0 20px ${accent}33`
          : 'none';
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerenter', onEnter);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  return createPortal(
    <div aria-hidden className="pointer-events-none">
      <div
        ref={ringRef}
        className="fixed left-0 top-0 rounded-full border"
        style={{ zIndex: 9998, willChange: 'transform,opacity,width,height' }}
      />
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-[6px] w-[6px] rounded-full bg-white"
        style={{ zIndex: 9999, willChange: 'transform,opacity,box-shadow' }}
      />
    </div>,
    document.body,
  );
}
