import type { Variants } from 'framer-motion';

/**
 * Texto do slide — entra depois da foto lateral e do painel (`delayChildren`).
 * Ordem no DOM: primeiro blocos visuais (ex.: hero), depois títulos e parágrafos.
 */
export function getCardTextVariants(
  reducedMotion: boolean,
  stepIndex: number,
  stepSeed: string,
  flipPhoto: boolean = false,
) {
  if (reducedMotion) {
    return {
      container: { hidden: {}, visible: {} } satisfies Variants,
      item: { hidden: {}, visible: {} } satisfies Variants,
    };
  }
  const xFrom = flipPhoto ? 18 : -18;
  const seed = `${stepSeed}:${stepIndex}:${flipPhoto ? 'flip' : 'normal'}`;
  const profileIndex = Math.abs(hashSeed(seed)) % MOTION_PROFILES.length;
  const profile = MOTION_PROFILES[profileIndex]!;
  /** Espera foto lateral + painel (delay 0.14s + duração ~0.48s) antes do texto começar. */
  const delayChildren = 0.56 + stepIndex * 0.014 + profile.delayOffset;

  return {
    container: {
      hidden: {
        transition: {
          staggerChildren: 0.035,
          staggerDirection: -1,
        },
      },
      visible: {
        transition: {
          staggerChildren: profile.stagger,
          delayChildren,
        },
      },
    } satisfies Variants,
    item: {
      hidden: {
        opacity: 0,
        x: xFrom + profile.xBias,
        y: profile.yFrom,
        scale: profile.scaleFrom,
        rotate: profile.rotateFrom,
        filter: `blur(${profile.blurPx}px)`,
        transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        filter: 'blur(0px)',
        transition: { duration: profile.duration, ease: profile.ease },
      },
    } satisfies Variants,
  };
}

interface MotionProfile {
  xBias: number;
  yFrom: number;
  scaleFrom: number;
  rotateFrom: number;
  blurPx: number;
  stagger: number;
  duration: number;
  delayOffset: number;
  ease: [number, number, number, number];
}

const MOTION_PROFILES: MotionProfile[] = [
  {
    xBias: -3,
    yFrom: 12,
    scaleFrom: 0.985,
    rotateFrom: -1.2,
    blurPx: 9,
    stagger: 0.05,
    duration: 0.5,
    delayOffset: 0.0,
    ease: [0.16, 1, 0.3, 1],
  },
  {
    xBias: 2,
    yFrom: 14,
    scaleFrom: 0.99,
    rotateFrom: 1.1,
    blurPx: 8,
    stagger: 0.06,
    duration: 0.52,
    delayOffset: 0.018,
    ease: [0.18, 1, 0.32, 1],
  },
  {
    xBias: -1,
    yFrom: 18,
    scaleFrom: 0.965,
    rotateFrom: 0,
    blurPx: 10,
    stagger: 0.046,
    duration: 0.58,
    delayOffset: 0.028,
    ease: [0.2, 1, 0.28, 1],
  },
  {
    xBias: 4,
    yFrom: 10,
    scaleFrom: 0.975,
    rotateFrom: -0.7,
    blurPx: 7,
    stagger: 0.054,
    duration: 0.46,
    delayOffset: 0.012,
    ease: [0.22, 1, 0.36, 1],
  },
  {
    xBias: -4,
    yFrom: 16,
    scaleFrom: 0.972,
    rotateFrom: 0.9,
    blurPx: 11,
    stagger: 0.064,
    duration: 0.6,
    delayOffset: 0.036,
    ease: [0.14, 1, 0.3, 1],
  },
  {
    xBias: 1,
    yFrom: 13,
    scaleFrom: 0.982,
    rotateFrom: -1.4,
    blurPx: 8,
    stagger: 0.048,
    duration: 0.54,
    delayOffset: 0.022,
    ease: [0.17, 1, 0.31, 1],
  },
];

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return h;
}
