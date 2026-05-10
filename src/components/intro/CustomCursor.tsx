import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const HOVER_SELECTOR = '[data-cursor]';

/**
 * Paleta de partículas (alinhada ao SVG "energia abstrata"):
 * — dourado: #ffe5a0, #ffcc55
 * — ciano:   #44ddff, #22ddff, #a8f0ff
 */
interface SparkConfig {
  /** raio orbital base em px */
  orbit: number;
  /** ângulo inicial em radianos */
  phase: number;
  /** velocidade angular (rad/s) — pode ser negativa */
  speed: number;
  /** tamanho do dot em px */
  size: number;
  /** opacidade base */
  opacity: number;
  /** blur em px */
  blur: number;
  /** stiffness do spring de tracking */
  stiffness: number;
  /** damping do spring */
  damping: number;
  /** mass do spring */
  mass: number;
  /** cor central + halo */
  color: string;
}

const SPARKS: SparkConfig[] = [
  // Dot quente central — segue rapidamente, sem orbitar
  { orbit: 0,  phase: 0,           speed: 0,    size: 6,  opacity: 0.9,  blur: 0, stiffness: 480, damping: 28, mass: 0.4, color: '#fff7c0' },
  // Halo pulsante difuso
  { orbit: 0,  phase: 0,           speed: 0,    size: 28, opacity: 0.28, blur: 8, stiffness: 220, damping: 24, mass: 0.7, color: '#ffcc55' },
  // Faísca dourada — órbita externa rápida
  { orbit: 22, phase: 0,           speed: 2.6,  size: 4,  opacity: 0.85, blur: 1, stiffness: 220, damping: 22, mass: 0.55, color: '#ffe5a0' },
  // Faísca dourada — órbita média
  { orbit: 16, phase: Math.PI / 3, speed: -1.9, size: 3,  opacity: 0.78, blur: 0, stiffness: 180, damping: 22, mass: 0.6,  color: '#ffcc55' },
  // Faísca ciano — órbita externa
  { orbit: 26, phase: Math.PI,     speed: 1.4,  size: 4,  opacity: 0.78, blur: 1, stiffness: 200, damping: 22, mass: 0.6,  color: '#44ddff' },
  // Faísca ciano — órbita interna
  { orbit: 14, phase: 1.6,         speed: -2.4, size: 3,  opacity: 0.7,  blur: 0, stiffness: 180, damping: 22, mass: 0.6,  color: '#22ddff' },
  // Faísca branca-azul difusa
  { orbit: 32, phase: 4.2,         speed: 1.05, size: 3,  opacity: 0.55, blur: 2, stiffness: 140, damping: 22, mass: 0.7,  color: '#a8f0ff' },
  // Faísca dourada lenta — trail visual
  { orbit: 38, phase: 5.4,         speed: -0.8, size: 3,  opacity: 0.45, blur: 2, stiffness: 110, damping: 24, mass: 0.85, color: '#ffe5a0' },
  // Faísca ciano longe — sublimação
  { orbit: 48, phase: 2.3,         speed: 0.55, size: 2.5, opacity: 0.35, blur: 3, stiffness: 80, damping: 24, mass: 1.0,  color: '#44ddff' },
  // Pontos finos errantes
  { orbit: 18, phase: 0.7,         speed: 3.4,  size: 2,  opacity: 0.6,  blur: 0, stiffness: 240, damping: 22, mass: 0.5,  color: '#fff7c0' },
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
      {SPARKS.map((cfg, i) => (
        <Spark key={i} x={x} y={y} cfg={cfg} visible={visible} hovering={hovering} index={i} />
      ))}
    </>
  );
}

interface SparkProps {
  x: ReturnType<typeof useMotionValue<number>>;
  y: ReturnType<typeof useMotionValue<number>>;
  cfg: SparkConfig;
  visible: boolean;
  hovering: boolean;
  index: number;
}

function Spark({ x, y, cfg, visible, hovering, index }: SparkProps) {
  const sx = useSpring(x, { stiffness: cfg.stiffness, damping: cfg.damping, mass: cfg.mass });
  const sy = useSpring(y, { stiffness: cfg.stiffness, damping: cfg.damping, mass: cfg.mass });

  // Tempo orbital — animado via useMotionValue + rAF para evitar setInterval/setState
  const t = useMotionValue(0);
  useEffect(() => {
    if (cfg.speed === 0 && cfg.orbit === 0) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      t.set(t.get() + dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [t, cfg.speed, cfg.orbit]);

  const offsetX = useTransform(t, (v) =>
    cfg.orbit === 0 ? 0 : Math.cos(cfg.phase + v * cfg.speed) * cfg.orbit,
  );
  const offsetY = useTransform(t, (v) =>
    cfg.orbit === 0 ? 0 : Math.sin(cfg.phase + v * cfg.speed) * cfg.orbit,
  );

  const finalX = useTransform([sx, offsetX], (vals) => (vals[0] as number) + (vals[1] as number));
  const finalY = useTransform([sy, offsetY], (vals) => (vals[0] as number) + (vals[1] as number));

  const hoverScale = hovering ? 1.6 : 1;
  const dynamicOpacity = visible ? cfg.opacity : 0;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0"
      style={{
        x: finalX,
        y: finalY,
        zIndex: 120 - index,
        opacity: dynamicOpacity,
        filter: cfg.blur ? `blur(${cfg.blur}px)` : undefined,
        transition: 'opacity 240ms ease-out',
      }}
    >
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{ width: cfg.size * hoverScale, height: cfg.size * hoverScale }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        style={{
          background: `radial-gradient(circle, ${cfg.color} 0%, ${cfg.color}aa 45%, transparent 80%)`,
          boxShadow: cfg.blur
            ? undefined
            : `0 0 ${Math.max(4, cfg.size * 1.4)}px ${cfg.color}cc, 0 0 ${cfg.size * 3}px ${cfg.color}55`,
        }}
      />
    </motion.div>
  );
}
