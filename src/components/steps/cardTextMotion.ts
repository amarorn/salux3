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
  const delayChildren = 0.44 + stepIndex * 0.009 + profile.delayOffset;
  const hidden = hiddenStateFor(profile, xFrom);
  const visible = visibleStateFor(profile);

  return {
    container: {
      hidden: {
        transition: {
          staggerChildren: 0.03,
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
      hidden,
      visible,
    } satisfies Variants,
  };
}

interface MotionProfile {
  name: 'wave' | 'swirl' | 'lift' | 'viscous' | 'orbital' | 'ripple';
  xBias: number;
  yFrom: number;
  scaleFrom: number;
  rotateFrom: number;
  skewFrom: number;
  blurPx: number;
  stagger: number;
  duration: number;
  delayOffset: number;
  ease: [number, number, number, number];
}

const MOTION_PROFILES: MotionProfile[] = [
  {
    name: 'wave',
    xBias: -2,
    yFrom: 10,
    scaleFrom: 0.975,
    rotateFrom: -1.4,
    skewFrom: 4.4,
    blurPx: 8,
    stagger: 0.038,
    duration: 0.52,
    delayOffset: 0.0,
    ease: [0.2, 1, 0.28, 1],
  },
  {
    name: 'swirl',
    xBias: 8,
    yFrom: -16,
    scaleFrom: 0.9,
    rotateFrom: 9,
    skewFrom: -5.5,
    blurPx: 11,
    stagger: 0.05,
    duration: 0.6,
    delayOffset: 0.024,
    ease: [0.12, 0.96, 0.26, 1],
  },
  {
    name: 'lift',
    xBias: 0,
    yFrom: 24,
    scaleFrom: 0.94,
    rotateFrom: 0,
    skewFrom: 0,
    blurPx: 6,
    stagger: 0.034,
    duration: 0.5,
    delayOffset: 0.01,
    ease: [0.22, 1, 0.32, 1],
  },
  {
    name: 'viscous',
    xBias: -10,
    yFrom: 6,
    scaleFrom: 1.06,
    rotateFrom: -3.4,
    skewFrom: 8.5,
    blurPx: 9,
    stagger: 0.058,
    duration: 0.66,
    delayOffset: 0.038,
    ease: [0.08, 0.96, 0.25, 1],
  },
  {
    name: 'orbital',
    xBias: 14,
    yFrom: -8,
    scaleFrom: 0.93,
    rotateFrom: -11,
    skewFrom: -3.5,
    blurPx: 10,
    stagger: 0.042,
    duration: 0.62,
    delayOffset: 0.03,
    ease: [0.14, 1, 0.3, 1],
  },
  {
    name: 'ripple',
    xBias: 0,
    yFrom: 0,
    scaleFrom: 0.84,
    rotateFrom: 0,
    skewFrom: 0,
    blurPx: 12,
    stagger: 0.066,
    duration: 0.74,
    delayOffset: 0.05,
    ease: [0.1, 0.98, 0.22, 1],
  },
];

function hiddenStateFor(profile: MotionProfile, xFrom: number) {
  return {
    opacity: 0,
    x: xFrom + profile.xBias,
    y: profile.yFrom,
    scale: profile.scaleFrom,
    rotate: profile.rotateFrom,
    skewX: profile.skewFrom,
    filter: `blur(${profile.blurPx}px) saturate(1.24) brightness(1.08)`,
    transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const },
  };
}

function visibleStateFor(profile: MotionProfile) {
  switch (profile.name) {
    case 'wave':
      return {
        opacity: [0, 1, 1],
        x: [0, 2, 0],
        y: [0, -7, 0],
        scale: [1, 1.018, 1],
        rotate: [0, -0.9, 0],
        skewX: [0, -2.8, 0],
        filter: [
          'blur(0px) saturate(1.14) brightness(1.06)',
          'blur(0px) saturate(1.18) brightness(1.1)',
          'blur(0px) saturate(1) brightness(1)',
        ],
        transition: { duration: profile.duration, ease: profile.ease, times: [0, 0.58, 1] },
      };
    case 'swirl':
      return {
        opacity: [0, 1, 1],
        x: [0, -10, 0],
        y: [0, 6, 0],
        scale: [1, 1.035, 1],
        rotate: [0, 4.5, 0],
        skewX: [0, 2.2, 0],
        filter: [
          'blur(0px) saturate(1.16) brightness(1.06)',
          'blur(0px) saturate(1.24) brightness(1.12)',
          'blur(0px) saturate(1) brightness(1)',
        ],
        transition: { duration: profile.duration, ease: profile.ease, times: [0, 0.46, 1] },
      };
    case 'lift':
      return {
        opacity: [0, 1, 1],
        y: [0, -13, 0],
        scale: [1, 1.028, 1],
        rotate: [0, 0.4, 0],
        filter: [
          'blur(0px) saturate(1.08) brightness(1.05)',
          'blur(0px) saturate(1.14) brightness(1.1)',
          'blur(0px) saturate(1) brightness(1)',
        ],
        transition: { duration: profile.duration, ease: profile.ease, times: [0, 0.52, 1] },
      };
    case 'viscous':
      return {
        opacity: [0, 1, 1],
        x: [0, -4, 0],
        y: [0, -3, 0],
        scale: [1, 1.08, 0.985, 1],
        rotate: [0, -2.4, 0.6, 0],
        skewX: [0, 6.5, -2.2, 0],
        filter: [
          'blur(0px) saturate(1.22) brightness(1.12)',
          'blur(0px) saturate(1.3) brightness(1.16)',
          'blur(0px) saturate(1.1) brightness(1.07)',
          'blur(0px) saturate(1) brightness(1)',
        ],
        transition: { duration: profile.duration, ease: profile.ease, times: [0, 0.35, 0.72, 1] },
      };
    case 'orbital':
      return {
        opacity: [0, 1, 1],
        x: [0, 12, -4, 0],
        y: [0, -8, 4, 0],
        scale: [1, 1.024, 1.008, 1],
        rotate: [0, -5.5, 1.2, 0],
        skewX: [0, -2.4, 0.6, 0],
        filter: [
          'blur(0px) saturate(1.2) brightness(1.1)',
          'blur(0px) saturate(1.26) brightness(1.14)',
          'blur(0px) saturate(1.08) brightness(1.06)',
          'blur(0px) saturate(1) brightness(1)',
        ],
        transition: { duration: profile.duration, ease: profile.ease, times: [0, 0.38, 0.72, 1] },
      };
    case 'ripple':
      return {
        opacity: [0, 1, 1],
        scale: [1, 1.14, 0.986, 1.012, 1],
        y: [0, -5, 1, -1, 0],
        filter: [
          'blur(0px) saturate(1.26) brightness(1.12)',
          'blur(0px) saturate(1.34) brightness(1.18)',
          'blur(0px) saturate(1.18) brightness(1.08)',
          'blur(0px) saturate(1.08) brightness(1.03)',
          'blur(0px) saturate(1) brightness(1)',
        ],
        transition: { duration: profile.duration, ease: profile.ease, times: [0, 0.28, 0.58, 0.8, 1] },
      };
  }
}

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return h;
}
