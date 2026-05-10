import { useEffect, useId, useRef, useState } from 'react';
import { motion, useReducedMotion, type Transition } from 'framer-motion';
import {
  EASE_SETTLE,
  IDLE_FLOAT,
  IDLE_TILT_3D,
  LOGO_TIMING,
  petalInitial,
  petalTransition,
} from './logoMotion';

interface LogoEffects {
  shimmer?: boolean;
  glowRing?: boolean;
  aberration?: boolean;
}

interface SaluxLogoProps {
  className?: string;
  width?: number | string;
  monochrome?: boolean;
  /** quando false, o logo aparece pronto; quando true, executa a animação BURST de entrada */
  animate?: boolean;
  /** apenas o símbolo (8 pétalas), sem wordmark/tagline */
  symbolOnly?: boolean;
  /** mantém o símbolo em micro-movimento contínuo (rotate + scale + tilt 3D) após a montagem */
  idle?: boolean;
  /** saída suave por fade (substitui o antigo `explode`) */
  exiting?: boolean;
  /** efeitos modernos opcionais sobre a logo */
  effects?: LogoEffects;
  onComplete?: () => void;
}

export const SALUX_SYMBOL_PATHS: Array<{ d: string; cls: string }> = [
  {
    cls: 'sx-g6',
    d: 'M59.97,141.54c5.28-5.28,5.33-13.89.1-19.12-5.23-5.23-30-30-32.35-32.35,0,0,9.93,13.95,7.4,24.13-2.53,10.17-31.18,45.32-31.18,45.32-5.15,6.34-5.33,13.89-.1,19.12s13.84,5.19,19.12-.1l37.01-37Z',
  },
  {
    cls: 'sx-g5',
    d: 'M59.97,122.32c5.28,5.28,5.33,13.89.1,19.12-5.23,5.23-30,30-32.35,32.35,0,0,9.93-13.95,7.4-24.13-2.53-10.17-31.18-45.32-31.18-45.32-5.15-6.34-5.33-13.89-.09-19.12,5.23-5.23,13.84-5.19,19.12.1l37,37Z',
  },
  {
    cls: 'sx-g3',
    d: 'M118.27,122.32c-5.28,5.28-5.33,13.89-.1,19.12s30,30,32.35,32.35c0,0-9.93-13.95-7.4-24.13,2.53-10.17,31.18-45.32,31.18-45.32,5.15-6.34,5.33-13.89.1-19.12s-13.84-5.19-19.12.1l-37.01,37Z',
  },
  {
    cls: 'sx-cyan',
    d: 'M118.27,141.54c-5.28-5.28-5.33-13.89-.1-19.12s30-30,32.35-32.35c0,0-9.93,13.95-7.4,24.13,2.53,10.17,31.18,45.32,31.18,45.32,5.15,6.34,5.33,13.89.1,19.12s-13.84,5.19-19.12-.1l-37.01-37Z',
  },
  {
    cls: 'sx-g6-2',
    d: 'M98.73,161.08c-5.28-5.28-13.89-5.33-19.12-.1s-30,30-32.35,32.35c0,0,13.95-9.93,24.13-7.4,10.17,2.53,45.32,31.18,45.32,31.18,6.34,5.15,13.89,5.33,19.12.1s5.19-13.84-.1-19.12l-37-37.01Z',
  },
  {
    cls: 'sx-g5-2',
    d: 'M79.52,161.08c5.28-5.28,13.89-5.33,19.12-.1s30,30,32.35,32.35c0,0-13.95-9.93-24.13-7.4-10.17,2.53-45.32,31.18-45.32,31.18-6.34,5.15-13.89,5.33-19.12.1-5.23-5.23-5.19-13.84.1-19.12l37-37.01Z',
  },
  {
    cls: 'sx-g6-3',
    d: 'M79.52,102.78c5.28,5.28,13.89,5.33,19.12.1s30-30,32.35-32.35c0,0-13.95,9.93-24.13,7.4-10.18-2.53-45.33-31.18-45.33-31.18-6.34-5.15-13.89-5.33-19.12-.1s-5.19,13.84.1,19.12l37.01,37.01Z',
  },
  {
    cls: 'sx-g7',
    d: 'M98.73,102.78c-5.28,5.28-13.89,5.33-19.12.1l-32.35-32.35s13.95,9.93,24.13,7.4c10.17-2.53,45.32-31.18,45.32-31.18,6.34-5.15,13.89-5.33,19.12-.1,5.23,5.23,5.19,13.84-.1,19.12l-37,37.01Z',
  },
];

const WORDMARK_PATHS: string[] = [
  'M236.18,152.7c3.83,2.53,7.47,4.41,10.92,5.63,3.45,1.23,6.7,1.84,9.77,1.84,3.98,0,7.04-.88,9.19-2.64,2.14-1.76,3.22-4.17,3.22-7.24,0-2.76-.88-5.09-2.64-7.01-1.76-1.91-4.33-3.64-7.7-5.17-3.37-1.53-7.66-3.14-12.87-4.83-4.9-1.84-9.65-4.02-14.25-6.55s-8.39-5.9-11.37-10.11c-2.99-4.21-4.48-9.61-4.48-16.2s1.68-11.6,5.06-15.97c3.37-4.37,7.93-7.66,13.67-9.88,5.74-2.22,12.14-3.33,19.19-3.33,5.97,0,11.56.77,16.77,2.3,5.21,1.53,10.03,3.56,14.48,6.09,4.44,2.53,8.35,5.48,11.72,8.85l-13.1,18.38c-3.83-4.14-8.39-7.5-13.67-10.11-5.29-2.6-10.46-3.91-15.51-3.91-3.37,0-6.01.65-7.93,1.95-1.92,1.3-2.87,3.26-2.87,5.86,0,2.3.96,4.33,2.87,6.09,1.91,1.76,4.67,3.33,8.27,4.71s7.7,3.07,12.29,5.06c5.67,2.15,10.92,4.56,15.74,7.24,4.83,2.68,8.69,6.01,11.6,10s4.37,9.19,4.37,15.63c0,10.57-3.45,18.81-10.34,24.7-6.89,5.89-16.39,8.85-28.49,8.85-7.51,0-14.36-1-20.57-2.99-6.2-1.99-11.8-4.63-16.77-7.93-4.98-3.29-9.46-6.85-13.44-10.69l14.48-18.61c4.43,4.13,8.56,7.46,12.39,9.99Z',
  'M337.98,154.31c1.53,2.22,3.64,3.91,6.32,5.06s5.63,1.72,8.85,1.72c4.6,0,8.73-.96,12.41-2.87,3.68-1.91,6.66-4.67,8.96-8.27s3.45-7.93,3.45-12.98l3.68,13.79c0,6.74-1.88,12.41-5.63,17-3.76,4.6-8.58,8.04-14.48,10.34-5.9,2.3-12.06,3.45-18.5,3.45s-12.72-1.3-18.38-3.91c-5.67-2.6-10.23-6.4-13.67-11.38-3.45-4.98-5.17-11.07-5.17-18.27,0-10.26,3.6-18.38,10.8-24.36,7.2-5.97,17.39-8.96,30.56-8.96,6.74,0,12.67.69,17.81,2.07,5.13,1.38,9.46,3.07,12.98,5.06,3.52,1.99,6.05,3.91,7.58,5.75v13.79c-4.14-3.06-8.77-5.36-13.9-6.89s-10.54-2.3-16.2-2.3c-4.6,0-8.35.57-11.26,1.72s-5.06,2.76-6.43,4.83c-1.38,2.07-2.07,4.64-2.07,7.7,0,3.04.76,5.69,2.29,7.91ZM313.16,83.19c5.51-2.91,12.25-5.71,20.22-8.39,7.96-2.68,16.85-4.02,26.66-4.02,9.04,0,17.08,1.3,24.13,3.91,7.04,2.61,12.56,6.4,16.54,11.38,3.98,4.98,5.97,11.07,5.97,18.27v74.91h-28.72v-68.71c0-2.91-.46-5.4-1.38-7.47s-2.34-3.79-4.25-5.17c-1.92-1.38-4.17-2.37-6.78-2.99-2.61-.61-5.52-.92-8.73-.92-4.9,0-9.58.54-14.02,1.61s-8.27,2.38-11.49,3.91c-3.22,1.53-5.59,2.84-7.12,3.91l-11.03-20.23Z',
  'M459.31,0v179.24h-29.87V0h29.87Z',
  'M518.83,153.85c2.76,3.76,7.2,5.63,13.33,5.63,4.29,0,8-.88,11.15-2.64,3.14-1.76,5.59-4.25,7.35-7.47,1.76-3.22,2.64-7.04,2.64-11.49v-64.35h29.64v105.7h-29.64v-16.09c-3.37,5.97-7.66,10.54-12.87,13.67-5.21,3.14-11.57,4.71-19.07,4.71-12.56,0-21.95-3.6-28.15-10.8-6.21-7.2-9.31-17.08-9.31-29.64v-67.55h30.79v64.34c0,6.9,1.38,12.22,4.14,15.98Z',
  'M704.73,73.53l-39.07,51.24,41.36,54.46h-32.86l-23.9-33.55-23.44,33.55h-34.01l41.82-54.46-39.52-51.24h34.01l21.14,30.56,21.6-30.56h32.87Z',
];

const TAGLINE_PATHS: string[] = [
  'M493.94,224.82v-25.51h-8.08v-4.19h20.88v4.19h-8.1v25.51h-4.7Z',
  'M517.34,225.39c-1.97,0-3.73-.43-5.28-1.28-1.55-.85-2.78-2.02-3.69-3.49-.91-1.48-1.36-3.14-1.36-4.99,0-1.37.26-2.65.77-3.83.52-1.19,1.23-2.23,2.14-3.13.91-.9,1.97-1.6,3.19-2.11,1.21-.5,2.52-.76,3.92-.76,1.92,0,3.6.4,5.05,1.19s2.57,1.9,3.38,3.31c.81,1.42,1.21,3.07,1.21,4.95,0,.16-.01.29-.02.39s-.04.27-.07.51h-15.01c0,1.12.25,2.1.76,2.94.5.85,1.21,1.51,2.12,1.98s1.95.71,3.12.71,2.11-.22,2.98-.67,1.66-1.14,2.37-2.06l3.26,1.67c-.88,1.46-2.09,2.61-3.64,3.43-1.56.83-3.29,1.24-5.2,1.24ZM511.78,213.35h10.46c-.16-.84-.47-1.57-.95-2.18-.48-.61-1.09-1.09-1.82-1.43s-1.55-.51-2.45-.51c-.95,0-1.79.17-2.54.5-.75.34-1.35.81-1.82,1.42s-.76,1.35-.88,2.2Z',
  'M540.71,225.39c-1.39,0-2.7-.25-3.93-.75s-2.31-1.19-3.25-2.08-1.67-1.93-2.21-3.11c-.53-1.19-.8-2.47-.8-3.85s.25-2.59.77-3.77c.51-1.18,1.22-2.22,2.14-3.12.92-.9,2-1.61,3.24-2.12,1.24-.52,2.58-.77,4.02-.77,1.2,0,2.35.17,3.45.52,1.1.35,2.01.8,2.73,1.37l-1.6,3.02c-1.06-.8-2.36-1.21-3.91-1.21-1.27,0-2.37.28-3.29.84s-1.63,1.3-2.12,2.23-.74,1.94-.74,3.02c0,1.14.26,2.17.77,3.09s1.24,1.65,2.18,2.19c.94.54,2.02.81,3.24.81.76,0,1.47-.11,2.13-.32s1.24-.51,1.72-.88l1.62,3.02c-.73.55-1.64,1.01-2.72,1.36s-2.23.51-3.44.51Z',
  'M551.76,224.82v-30.98h4.48v14.76c.64-.82,1.49-1.49,2.55-2.01,1.06-.52,2.28-.78,3.65-.78s2.65.3,3.72.91c1.06.61,1.89,1.46,2.47,2.56.59,1.1.88,2.41.88,3.92v11.61h-4.48v-10.67c0-1.54-.38-2.72-1.14-3.55s-1.81-1.25-3.16-1.25c-.92,0-1.72.19-2.39.57s-1.19.88-1.55,1.51-.54,1.33-.54,2.1v11.3h-4.49Z',
  'M576.11,224.82v-18.43h4.48v2.21c.64-.82,1.49-1.49,2.55-2.01,1.06-.52,2.28-.78,3.65-.78s2.65.3,3.72.91c1.06.61,1.89,1.46,2.47,2.56.59,1.1.88,2.41.88,3.92v11.61h-4.48v-10.67c0-1.54-.38-2.72-1.14-3.55s-1.81-1.25-3.16-1.25c-.92,0-1.72.19-2.39.57s-1.19.88-1.55,1.51-.54,1.33-.54,2.1v11.3h-4.49Z',
  'M609.52,225.39c-1.99,0-3.79-.41-5.39-1.24-1.6-.83-2.87-1.98-3.81-3.46-.94-1.48-1.4-3.17-1.4-5.09s.47-3.63,1.4-5.1c.94-1.47,2.2-2.62,3.8-3.45s3.4-1.24,5.4-1.24,3.79.41,5.39,1.24c1.6.83,2.87,1.98,3.8,3.45s1.4,3.17,1.4,5.1-.47,3.62-1.4,5.09-2.2,2.63-3.8,3.46c-1.6.83-3.4,1.24-5.39,1.24ZM609.52,221.54c1.13,0,2.14-.25,3.03-.76s1.6-1.21,2.12-2.11c.52-.89.77-1.92.77-3.07s-.26-2.19-.77-3.09c-.52-.89-1.22-1.59-2.12-2.1-.89-.5-1.9-.76-3.03-.76s-2.12.25-3.02.76-1.61,1.2-2.12,2.1c-.52.89-.77,1.92-.77,3.09s.26,2.17.77,3.07c.52.89,1.22,1.6,2.12,2.11s1.9.76,3.02.76Z',
  'M625.45,224.82v-30.96h4.48v30.96h-4.48Z',
  'M645.93,225.39c-1.99,0-3.79-.41-5.39-1.24-1.6-.83-2.87-1.98-3.81-3.46-.94-1.48-1.4-3.17-1.4-5.09s.47-3.63,1.4-5.1c.94-1.47,2.2-2.62,3.8-3.45s3.4-1.24,5.4-1.24,3.79.41,5.39,1.24c1.6.83,2.87,1.98,3.8,3.45s1.4,3.17,1.4,5.1-.47,3.62-1.4,5.09-2.2,2.63-3.8,3.46c-1.6.83-3.4,1.24-5.39,1.24ZM645.93,221.54c1.13,0,2.14-.25,3.03-.76s1.6-1.21,2.12-2.11c.52-.89.77-1.92.77-3.07s-.26-2.19-.77-3.09c-.52-.89-1.22-1.59-2.12-2.1-.89-.5-1.9-.76-3.03-.76s-2.12.25-3.02.76-1.61,1.2-2.12,2.1c-.52.89-.77,1.92-.77,3.09s.26,2.17.77,3.07c.52.89,1.22,1.6,2.12,2.11s1.91.76,3.02.76Z',
  'M670.54,234.72c-2.42,0-4.47-.46-6.13-1.37-1.66-.91-2.88-2.24-3.65-4l3.67-1.76c.53,1,1.34,1.79,2.45,2.38s2.32.89,3.65.89c1.18,0,2.21-.23,3.11-.7.9-.47,1.61-1.13,2.12-1.99.52-.86.77-1.87.77-3.03v-3.28c-.79,1.1-1.79,1.97-2.98,2.59s-2.5.94-3.92.94c-1.68,0-3.21-.42-4.59-1.26s-2.48-2-3.29-3.47c-.82-1.48-1.22-3.16-1.22-5.06s.4-3.56,1.2-5.03,1.89-2.63,3.28-3.48c1.39-.85,2.97-1.28,4.74-1.28,1.42,0,2.72.3,3.92.9,1.19.6,2.15,1.43,2.87,2.5v-2.83h4.48v18.94c0,1.9-.39,3.55-1.18,4.96s-1.96,2.5-3.52,3.28c-1.55.77-3.48,1.16-5.78,1.16ZM670.93,221.56c1.13,0,2.12-.25,2.99-.77.86-.51,1.54-1.21,2.03-2.11s.74-1.92.74-3.07-.25-2.18-.75-3.09-1.18-1.61-2.03-2.12c-.86-.51-1.84-.76-2.94-.76s-2.09.25-2.95.76-1.54,1.22-2.03,2.12c-.49.91-.74,1.94-.74,3.09s.24,2.18.73,3.07c.49.89,1.16,1.6,2.02,2.11.85.51,1.83.77,2.93.77Z',
  'M688.03,234.18l5.44-11-8.75-16.79h5.11l6.25,12.42,5.53-12.42h5.11l-13.57,27.79h-5.12Z',
];

const SYMBOL_CENTER = { cx: 99, cy: 130 } as const;

export function SaluxLogo({
  className,
  width = 480,
  monochrome = false,
  animate = true,
  symbolOnly = false,
  idle = true,
  exiting = false,
  effects,
  onComplete,
}: SaluxLogoProps) {
  const reduceMotion = useReducedMotion();
  const uid = useId().replace(/:/g, '');
  const gid = (name: string) => `${uid}-${name}`;

  const wordmarkFill = monochrome ? '#ffffff' : '#e8eef5';
  const taglineFill = monochrome ? 'rgba(255,255,255,0.6)' : '#9bb0c5';

  const fillForPetal = (cls: string) => {
    if (monochrome) return '#ffffff';
    if (cls === 'sx-cyan') return '#54c1ed';
    return `url(#${gid(cls)})`;
  };

  const wantBurst = animate && !reduceMotion && !exiting;
  const wantIdle = idle && !exiting && !reduceMotion;

  const fxShimmer = effects?.shimmer ?? false;
  const fxGlowRing = effects?.glowRing ?? false;
  const fxAberration = effects?.aberration ?? false;

  const [assembled, setAssembled] = useState(!animate);
  const assembledOnceRef = useRef(false);

  useEffect(() => {
    if (!animate || reduceMotion) {
      setAssembled(true);
      assembledOnceRef.current = true;
    }
  }, [animate, reduceMotion]);

  const markBurstAssembled = () => {
    if (assembledOnceRef.current) return;
    assembledOnceRef.current = true;
    setAssembled(true);
  };

  // viewBox e dimensões do símbolo (versão symbolOnly = só pétalas)
  const symbolViewBox = '0 30 200 220';
  const fullViewBox = '0 0 707.02 234.72';

  const symbolGradientDefs = (
    <>
      <linearGradient
        id={gid('sx-g6')}
        x1="51.03"
        y1="131.36"
        x2="4.34"
        y2="56.65"
        gradientTransform="translate(0 236) scale(1 -1)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#08394d" />
        <stop offset=".2" stopColor="#19537a" />
        <stop offset=".47" stopColor="#2e72b1" />
        <stop offset=".7" stopColor="#3d89d9" />
        <stop offset=".89" stopColor="#4797f1" />
        <stop offset="1" stopColor="#4a9cfa" />
      </linearGradient>
      <linearGradient
        id={gid('sx-g5')}
        x1="0"
        y1="108.44"
        x2="63.96"
        y2="108.44"
        gradientTransform="translate(0 236) scale(1 -1)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset=".04" stopColor="#52a0ef" />
        <stop offset="1" stopColor="#52a0ef" />
      </linearGradient>
      <linearGradient
        id={gid('sx-g3')}
        x1="122.61"
        y1="693.12"
        x2="75.92"
        y2="618.4"
        gradientTransform="translate(249.82 -533.9) rotate(-180) scale(1 -1)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#08394d" />
        <stop offset=".15" stopColor="#17556d" />
        <stop offset=".44" stopColor="#3183a4" />
        <stop offset=".69" stopColor="#44a5cc" />
        <stop offset=".88" stopColor="#50b9e4" />
        <stop offset="1" stopColor="#54c1ed" />
      </linearGradient>
      <linearGradient
        id={gid('sx-g6-2')}
        x1="-123.53"
        y1="518.56"
        x2="-170.22"
        y2="443.84"
        gradientTransform="translate(580.39 46.49) rotate(-90) scale(1 -1)"
        xlinkHref={`#${gid('sx-g6')}`}
      />
      <linearGradient
        id={gid('sx-g5-2')}
        x1="38.53"
        y1="46.93"
        x2="130.99"
        y2="46.93"
        xlinkHref={`#${gid('sx-g5')}`}
      />
      <linearGradient
        id={gid('sx-g6-3')}
        x1="297.17"
        y1="305.94"
        x2="250.48"
        y2="231.21"
        gradientTransform="translate(-189.51 -203.33) rotate(90) scale(1 -1)"
        xlinkHref={`#${gid('sx-g6')}`}
      />
      <linearGradient
        id={gid('sx-g7')}
        x1="47.26"
        y1="161.21"
        x2="139.73"
        y2="161.21"
        gradientTransform="translate(0 236) scale(1 -1)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset=".04" stopColor="#52a0ef" />
        <stop offset="1" stopColor="#4a9cfa" />
      </linearGradient>
    </>
  );

  // Mask que contém o sheen na silhueta da logo
  const sheenMask = fxShimmer ? (
    <mask id={gid('sheen-mask')} maskUnits="userSpaceOnUse">
      {SALUX_SYMBOL_PATHS.map((p, i) => (
        <path key={i} d={p.d} fill="#ffffff" />
      ))}
    </mask>
  ) : null;

  const sheenGradient = fxShimmer ? (
    <linearGradient id={gid('sheen-g')} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="rgba(255,255,255,0)" />
      <stop offset="45%" stopColor="rgba(255,255,255,0)" />
      <stop offset="50%" stopColor="rgba(255,255,255,0.85)" />
      <stop offset="55%" stopColor="rgba(255,255,255,0)" />
      <stop offset="100%" stopColor="rgba(255,255,255,0)" />
    </linearGradient>
  ) : null;

  // Petal initials (BURST) ou estado pronto, dependendo do modo
  const petalInitialFor = (i: number) => (wantBurst ? petalInitial(i) : false);
  const petalAnimateFor = () =>
    exiting ? { opacity: 0 } : { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 };
  const petalTransitionFor = (i: number): Transition =>
    exiting
      ? { duration: LOGO_TIMING.exitDuration, ease: 'easeOut', delay: i * 0.01 }
      : wantBurst
      ? petalTransition(i)
      : { duration: 0 };

  const symbolGroup = (
    <>
      {/* Aberration: cópias coloridas deslocadas (clímax do encontro) */}
      {fxAberration && wantBurst && (
        <>
          <motion.g
            style={{ mixBlendMode: 'screen' as const }}
            initial={{ opacity: 0, x: -2 }}
            animate={{ opacity: [0, 0.55, 0], x: [-2, -2, 0] }}
            transition={{
              delay: LOGO_TIMING.aberrationStart,
              duration: LOGO_TIMING.aberrationEnd - LOGO_TIMING.aberrationStart,
              ease: 'easeOut',
              times: [0, 0.5, 1],
            }}
          >
            {SALUX_SYMBOL_PATHS.map((p, i) => (
              <path key={`ab-r-${i}`} d={p.d} fill="rgba(255,80,120,0.85)" />
            ))}
          </motion.g>
          <motion.g
            style={{ mixBlendMode: 'screen' as const }}
            initial={{ opacity: 0, x: 2 }}
            animate={{ opacity: [0, 0.55, 0], x: [2, 2, 0] }}
            transition={{
              delay: LOGO_TIMING.aberrationStart,
              duration: LOGO_TIMING.aberrationEnd - LOGO_TIMING.aberrationStart,
              ease: 'easeOut',
              times: [0, 0.5, 1],
            }}
          >
            {SALUX_SYMBOL_PATHS.map((p, i) => (
              <path key={`ab-b-${i}`} d={p.d} fill="rgba(80,170,255,0.85)" />
            ))}
          </motion.g>
        </>
      )}

      {/* Pétalas principais com animação BURST */}
      {SALUX_SYMBOL_PATHS.map((p, i) => (
        <motion.path
          key={i}
          d={p.d}
          fill={fillForPetal(p.cls)}
          initial={petalInitialFor(i)}
          animate={petalAnimateFor()}
          transition={petalTransitionFor(i)}
          style={{ transformOrigin: `${SYMBOL_CENTER.cx}px ${SYMBOL_CENTER.cy}px`, transformBox: 'view-box' }}
          onAnimationComplete={
            i === 7 && wantBurst ? () => markBurstAssembled() : undefined
          }
        />
      ))}

      {/* Glow ring expandindo no clímax */}
      {fxGlowRing && wantBurst && (
        <motion.circle
          cx={SYMBOL_CENTER.cx}
          cy={SYMBOL_CENTER.cy}
          r={45}
          fill="none"
          stroke="#54c1ed"
          strokeWidth={0.8}
          initial={{ opacity: 0, r: 45 }}
          animate={{ opacity: [0, 0.75, 0], r: [45, 78, 100] }}
          transition={{
            delay: LOGO_TIMING.glowRingDelay,
            duration: LOGO_TIMING.glowRingDuration,
            ease: 'easeOut',
          }}
        />
      )}

      {/* Shimmer sheen varrendo a logo */}
      {fxShimmer && wantBurst && (
        <motion.rect
          x={-220}
          y={20}
          width={220}
          height={240}
          fill={`url(#${gid('sheen-g')})`}
          mask={`url(#${gid('sheen-mask')})`}
          initial={{ x: -220, opacity: 0 }}
          animate={{ x: [-220, 220], opacity: [0, 1, 0] }}
          transition={{
            delay: LOGO_TIMING.shimmerDelay,
            duration: LOGO_TIMING.shimmerDuration,
            ease: [0.22, 1, 0.36, 1],
            times: [0, 0.5, 1],
            opacity: { times: [0, 0.5, 1], duration: LOGO_TIMING.shimmerDuration },
          }}
        />
      )}
    </>
  );

  // Idle só roda DEPOIS que o burst termina — evita conflito de transforms aninhados.
  const idleActive = wantIdle && assembled;

  const symbolGroupTree = (
    <motion.g
      style={{
        transformOrigin: `${SYMBOL_CENTER.cx}px ${SYMBOL_CENTER.cy}px`,
        transformBox: 'view-box',
      }}
      animate={
        idleActive
          ? {
              rotate: [...IDLE_FLOAT.rotate],
              scale: [...IDLE_FLOAT.scale],
            }
          : { rotate: 0, scale: 1 }
      }
      transition={
        idleActive
          ? {
              duration: IDLE_FLOAT.duration,
              repeat: Infinity,
              ease: IDLE_FLOAT.ease,
              times: [...IDLE_FLOAT.times],
            }
          : { duration: 0 }
      }
    >
      {symbolGroup}
    </motion.g>
  );

  // Quando reduced motion, fade simples
  if (reduceMotion) {
    return (
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={symbolOnly ? symbolViewBox : fullViewBox}
        width={width}
        className={className}
        aria-label="Salux"
        role="img"
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: LOGO_TIMING.exitDuration }}
        onAnimationComplete={() => {
          if (!exiting && onComplete) onComplete();
        }}
      >
        <defs>{symbolGradientDefs}</defs>
        {SALUX_SYMBOL_PATHS.map((p, i) => (
          <path key={i} d={p.d} fill={fillForPetal(p.cls)} />
        ))}
        {!symbolOnly &&
          WORDMARK_PATHS.map((d, i) => <path key={`wm-${i}`} d={d} fill={wordmarkFill} />)}
        {!symbolOnly &&
          TAGLINE_PATHS.map((d, i) => <path key={`tg-${i}`} d={d} fill={taglineFill} />)}
      </motion.svg>
    );
  }

  const idleTiltActive = idleActive;

  return (
    <div
      className={className}
      style={{
        display: 'inline-block',
        perspective: idleTiltActive ? '900px' : undefined,
      }}
    >
      <motion.div
        style={{
          display: 'inline-block',
          transformStyle: 'preserve-3d',
          willChange: idleTiltActive ? 'transform' : undefined,
        }}
        animate={
          idleTiltActive
            ? {
                rotateX: [...IDLE_TILT_3D.rotateX],
                rotateY: [...IDLE_TILT_3D.rotateY],
              }
            : { rotateX: 0, rotateY: 0 }
        }
        transition={
          idleTiltActive
            ? {
                duration: IDLE_TILT_3D.duration,
                repeat: Infinity,
                ease: IDLE_TILT_3D.ease,
                times: [...IDLE_TILT_3D.times],
              }
            : { duration: 0 }
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={symbolOnly ? symbolViewBox : fullViewBox}
          width={width}
          aria-label="Salux"
          role="img"
        >
          <defs>
            {symbolGradientDefs}
            {sheenGradient}
            {sheenMask}
          </defs>

          {symbolGroupTree}

          {!symbolOnly && (
            <motion.g
              initial={wantBurst ? { opacity: 0, y: 16 } : false}
              animate={exiting ? { opacity: 0, y: 8 } : { opacity: 1, y: 0 }}
              transition={
                exiting
                  ? { duration: LOGO_TIMING.exitDuration, ease: 'easeOut' }
                  : { delay: LOGO_TIMING.wordmarkDelay, duration: 0.7, ease: EASE_SETTLE }
              }
            >
              {WORDMARK_PATHS.map((d, i) => (
                <motion.path
                  key={i}
                  d={d}
                  fill={wordmarkFill}
                  initial={wantBurst ? { opacity: 0, y: 18 } : false}
                  animate={exiting ? { opacity: 0, y: 8 } : { opacity: 1, y: 0 }}
                  transition={
                    exiting
                      ? { duration: LOGO_TIMING.exitDuration, ease: 'easeOut' }
                      : {
                          delay: LOGO_TIMING.wordmarkDelay + i * LOGO_TIMING.wordmarkStagger,
                          duration: 0.65,
                          ease: EASE_SETTLE,
                        }
                  }
                />
              ))}
            </motion.g>
          )}

          {!symbolOnly && (
            <motion.g
              initial={wantBurst ? { opacity: 0, y: 8 } : false}
              animate={exiting ? { opacity: 0 } : { opacity: 0.95, y: 0 }}
              transition={
                exiting
                  ? { duration: LOGO_TIMING.exitDuration, ease: 'easeOut' }
                  : { delay: LOGO_TIMING.taglineDelay, duration: 0.6, ease: 'easeOut' }
              }
              onAnimationComplete={() => {
                if (!exiting && assembled && onComplete) onComplete();
              }}
            >
              {TAGLINE_PATHS.map((d, i) => (
                <path key={i} d={d} fill={taglineFill} />
              ))}
            </motion.g>
          )}

          {symbolOnly && wantBurst && (
            <motion.rect
              x={0}
              y={0}
              width={1}
              height={1}
              fill="transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0 }}
              transition={{ duration: LOGO_TIMING.totalAssemblyMs / 1000 }}
              onAnimationComplete={() => {
                if (onComplete) onComplete();
              }}
            />
          )}
        </svg>
      </motion.div>
    </div>
  );
}

interface SaluxSymbolProps {
  width?: number | string;
  className?: string;
  monochrome?: boolean;
  idle?: boolean;
}

/** Símbolo simples e estável (idle/estático) — usado em HeroCluster, RoadmapStep, canto da apresentação. */
export function SaluxSymbol({
  width = 220,
  className,
  monochrome = false,
  idle = true,
}: SaluxSymbolProps) {
  return (
    <SaluxLogo
      width={width}
      className={className}
      monochrome={monochrome}
      animate={false}
      symbolOnly
      idle={idle}
    />
  );
}
