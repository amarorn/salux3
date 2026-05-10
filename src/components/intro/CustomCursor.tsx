import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const HOVER_SELECTOR = '[data-cursor]';

interface TrailLayer {
  stiffness: number;
  damping: number;
  mass: number;
  size: number;
  opacity: number;
  blur: number;
  hoverBoost: number;
}

const TRAIL: TrailLayer[] = [
  { stiffness: 280, damping: 22, mass: 0.5, size: 26, opacity: 0.55, blur: 2, hoverBoost: 1.4 },
  { stiffness: 180, damping: 22, mass: 0.7, size: 22, opacity: 0.4, blur: 4, hoverBoost: 1.5 },
  { stiffness: 110, damping: 22, mass: 0.9, size: 18, opacity: 0.28, blur: 6, hoverBoost: 1.6 },
  { stiffness: 70, damping: 22, mass: 1.1, size: 14, opacity: 0.18, blur: 8, hoverBoost: 1.7 },
  { stiffness: 42, damping: 22, mass: 1.3, size: 10, opacity: 0.1, blur: 10, hoverBoost: 1.8 },
];

export function CustomCursor() {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    };
    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest?.(HOVER_SELECTOR);
      setHovering(Boolean(target));
    };
    const onLeaveDoc = () => setVisible(false);
    const onEnterDoc = () => setVisible(true);

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerover', onOver);
    document.addEventListener('pointerleave', onLeaveDoc);
    document.addEventListener('pointerenter', onEnterDoc);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerleave', onLeaveDoc);
      document.removeEventListener('pointerenter', onEnterDoc);
    };
  }, [x, y, visible]);

  return (
    <>
      {TRAIL.map((layer, i) => (
        <TrailDot key={i} x={x} y={y} layer={layer} visible={visible} hovering={hovering} index={i} />
      ))}
    </>
  );
}

interface TrailDotProps {
  x: ReturnType<typeof useMotionValue<number>>;
  y: ReturnType<typeof useMotionValue<number>>;
  layer: TrailLayer;
  visible: boolean;
  hovering: boolean;
  index: number;
}

function TrailDot({ x, y, layer, visible, hovering, index }: TrailDotProps) {
  const sx = useSpring(x, {
    stiffness: layer.stiffness,
    damping: layer.damping,
    mass: layer.mass,
  });
  const sy = useSpring(y, {
    stiffness: layer.stiffness,
    damping: layer.damping,
    mass: layer.mass,
  });

  const size = hovering ? layer.size * layer.hoverBoost : layer.size;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0"
      style={{
        x: sx,
        y: sy,
        zIndex: 120 - index,
        opacity: visible ? layer.opacity : 0,
        filter: `blur(${layer.blur}px)`,
        transition: 'opacity 240ms ease-out',
      }}
    >
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{ width: size, height: size }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        style={{
          background:
            index === 0
              ? 'radial-gradient(circle, rgba(220,240,255,0.95) 0%, rgba(168,230,255,0.6) 50%, rgba(84,193,237,0.3) 80%, transparent 100%)'
              : 'radial-gradient(circle, rgba(168,230,255,0.7) 0%, rgba(84,193,237,0.35) 60%, transparent 100%)',
        }}
      />
    </motion.div>
  );
}
