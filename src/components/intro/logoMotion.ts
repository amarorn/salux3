import type { Transition } from 'framer-motion';

/**
 * Vetores radiais de origem das 8 pétalas (assinatura BURST canônica).
 * Mesma estrutura que estava em TransitionMorph — fonte única de verdade.
 */
export const BURST_VECTORS: ReadonlyArray<{ x: number; y: number; rz: number; scale: number }> = [
  { x: -180, y: -130, rz: -55, scale: 0.4 },
  { x: -210, y: -10, rz: -90, scale: 0.35 },
  { x: 170, y: -130, rz: 50, scale: 0.4 },
  { x: 200, y: 30, rz: 85, scale: 0.35 },
  { x: 140, y: 140, rz: 45, scale: 0.45 },
  { x: 10, y: 175, rz: 5, scale: 0.4 },
  { x: -150, y: 140, rz: -50, scale: 0.45 },
  { x: 50, y: -185, rz: 30, scale: 0.4 },
];

export const EASE_BURST = [0.16, 1, 0.3, 1] as const;
export const EASE_SETTLE = [0.22, 1, 0.36, 1] as const;
export const EASE_EXIT = [0.4, 0, 1, 1] as const;

export const LOGO_TIMING = {
  petalBaseDelay: 0.1,
  petalStagger: 0.048,
  petalDuration: 0.72,
  glowRingDelay: 0.62,
  glowRingDuration: 0.85,
  shimmerDelay: 0.95,
  shimmerDuration: 0.9,
  aberrationStart: 0.1,
  aberrationEnd: 0.5,
  wordmarkDelay: 1.05,
  wordmarkStagger: 0.05,
  taglineDelay: 1.55,
  totalAssemblyMs: 1900,
  exitDuration: 0.22,
} as const;

export const petalInitial = (i: number) => {
  const v = BURST_VECTORS[i] ?? BURST_VECTORS[0]!;
  return { opacity: 0, x: v.x, y: v.y, rotate: v.rz, scale: v.scale };
};

export const petalTransition = (i: number): Transition => ({
  delay: LOGO_TIMING.petalBaseDelay + i * LOGO_TIMING.petalStagger,
  duration: LOGO_TIMING.petalDuration,
  ease: EASE_BURST,
});

export const reducedReveal = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: LOGO_TIMING.exitDuration },
} as const;

/** Idle pós-montagem: oscilação orgânica (sem “carrossel” contínuo). */
export const IDLE_FLOAT = {
  duration: 10.5,
  ease: [0.42, 0, 0.58, 1] as const,
  /** Micro-rotação em graus — ciclo fechado */
  rotate: [0, 3.4, 0.8, -3.1, -0.6, 0] as const,
  scale: [1, 1.032, 1.014, 1.026, 1.008, 1] as const,
  times: [0, 0.22, 0.42, 0.62, 0.82, 1] as const,
} as const;

/** Respiração 3D no wrapper CSS (rotateX/Y), ciclo ~9s — compõe com IDLE_FLOAT no SVG. */
export const IDLE_TILT_3D = {
  duration: 9,
  ease: [0.42, 0, 0.58, 1] as const,
  rotateX: [0, 3, -1, -3, 1, 0] as const,
  rotateY: [0, 3, -1, -3, 1, 0] as const,
  times: [0, 0.2, 0.4, 0.6, 0.8, 1] as const,
} as const;
