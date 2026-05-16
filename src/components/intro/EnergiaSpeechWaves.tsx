import { useId } from 'react';
import { motion } from 'framer-motion';

const VIEW_CENTER = { x: 800, y: 450 };

const SPEECH_STROKES: ReadonlyArray<{
  d: string;
  stroke: 'waveBlue' | 'waveGold' | string;
  strokeWidth: number;
  baseOpacity: number;
}> = [
  {
    d: 'M-60 372 C80 332 195 362 305 322 C418 282 488 398 598 388 C675 381 738 418 800 450 C862 482 922 515 1002 484 C1102 448 1184 366 1295 388 C1402 408 1500 438 1660 392',
    stroke: 'waveBlue',
    strokeWidth: 6,
    baseOpacity: 0.68,
  },
  {
    d: 'M-60 372 C80 332 195 362 305 322 C418 282 488 398 598 388 C675 381 738 418 800 450 C862 482 922 515 1002 484 C1102 448 1184 366 1295 388 C1402 408 1500 438 1660 392',
    stroke: '#b8f6ff',
    strokeWidth: 1.1,
    baseOpacity: 0.92,
  },
  {
    d: 'M-60 528 C88 568 218 534 328 574 C438 614 518 502 618 518 C698 530 750 492 800 450 C850 408 912 388 1012 418 C1118 450 1202 544 1308 512 C1408 483 1505 565 1660 528',
    stroke: 'waveBlue',
    strokeWidth: 5,
    baseOpacity: 0.58,
  },
  {
    d: 'M-60 528 C88 568 218 534 328 574 C438 614 518 502 618 518 C698 530 750 492 800 450 C850 408 912 388 1012 418 C1118 450 1202 544 1308 512 C1408 483 1505 565 1660 528',
    stroke: '#88f0ff',
    strokeWidth: 0.9,
    baseOpacity: 0.72,
  },
  {
    d: 'M-60 344 C140 308 272 348 392 302 C508 258 564 374 664 360 C738 350 768 400 800 450',
    stroke: '#55e8ff',
    strokeWidth: 0.8,
    baseOpacity: 0.48,
  },
  {
    d: 'M800 450 C840 502 882 540 984 508 C1085 475 1164 385 1272 410 C1375 433 1472 458 1660 415',
    stroke: '#55e8ff',
    strokeWidth: 0.8,
    baseOpacity: 0.48,
  },
  {
    d: 'M-60 422 C118 356 258 386 372 348 C484 312 532 428 642 416 C720 408 758 428 800 450 C842 472 884 492 982 462 C1092 430 1174 348 1284 368 C1392 388 1485 418 1660 385',
    stroke: 'waveGold',
    strokeWidth: 5.5,
    baseOpacity: 0.75,
  },
  {
    d: 'M-60 422 C118 356 258 386 372 348 C484 312 532 428 642 416 C720 408 758 428 800 450 C842 472 884 492 982 462 C1092 430 1174 348 1284 368 C1392 388 1485 418 1660 385',
    stroke: '#fff8b8',
    strokeWidth: 1.2,
    baseOpacity: 0.92,
  },
  {
    d: 'M-60 478 C148 548 278 514 388 550 C498 586 558 472 658 488 C738 500 768 474 800 450 C832 426 872 408 972 438 C1082 470 1168 558 1278 528 C1382 500 1472 482 1660 525',
    stroke: 'waveGold',
    strokeWidth: 4,
    baseOpacity: 0.62,
  },
  {
    d: 'M-60 478 C148 548 278 514 388 550 C498 586 558 472 658 488 C738 500 768 474 800 450 C832 426 872 408 972 438 C1082 470 1168 558 1278 528 C1382 500 1472 482 1660 525',
    stroke: '#fff2a0',
    strokeWidth: 0.9,
    baseOpacity: 0.75,
  },
];

interface EnergiaSpeechWavesProps {
  reduceMotion: boolean;
  /** Hover nos cards — intensifica o “ritmo” da voz */
  boosted: boolean;
}

export function EnergiaSpeechWaves({ reduceMotion, boosted }: EnergiaSpeechWavesProps) {
  const uid = useId().replace(/:/g, '');
  const gid = (name: string) => `${uid}-${name}`;

  const strokeRef = (key: 'waveBlue' | 'waveGold') =>
    key === 'waveBlue' ? `url(#${gid('waveBlue')})` : `url(#${gid('waveGold')})`;

  return (
    <>
      <defs>
        <linearGradient id={gid('waveBlue')} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#00ccff" stopOpacity="0" />
          <stop offset="18%" stopColor="#44ddff" stopOpacity="0.45" />
          <stop offset="44%" stopColor="#aaf8ff" stopOpacity="0.88" />
          <stop offset="62%" stopColor="#22ccff" stopOpacity="0.72" />
          <stop offset="86%" stopColor="#0099ee" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#0099ee" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={gid('waveGold')} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#ffaa22" stopOpacity="0" />
          <stop offset="14%" stopColor="#ffcc66" stopOpacity="0.45" />
          <stop offset="42%" stopColor="#fff5cc" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#ffcc44" stopOpacity="0.75" />
          <stop offset="84%" stopColor="#ffaa33" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ffaa33" stopOpacity="0" />
        </linearGradient>
        <filter id={gid('waveGlow')} x="-10%" y="-120%" width="120%" height="340%">
          <feGaussianBlur stdDeviation="0" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter={`url(#${gid('waveGlow')})`}>
      {SPEECH_STROKES.map((layer, i) => {
        const strokePaint =
          layer.stroke === 'waveBlue' || layer.stroke === 'waveGold'
            ? strokeRef(layer.stroke)
            : layer.stroke;

        const base = layer.baseOpacity;
        const yAmp = boosted ? 26 : 18;
        const phase = i * 0.07;

        return (
          <motion.g
            key={`${i}-${layer.stroke}-${layer.strokeWidth}`}
            style={{
              transformOrigin: `${VIEW_CENTER.x}px ${VIEW_CENTER.y}px`,
            }}
            initial={false}
            animate={
              reduceMotion
                ? { y: 0, scaleY: 1, opacity: base }
                : {
                    y: [0, -yAmp, yAmp * 0.55, -yAmp * 0.72, yAmp * 0.38, 0],
                    scaleY: [1, 1.18, 0.88, 1.22, 0.94, 1],
                    opacity: [
                      base,
                      Math.min(1, base + 0.22),
                      base * 0.88,
                      Math.min(1, base + 0.14),
                      base * 0.92,
                      base,
                    ],
                  }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: 1.05 + (i % 5) * 0.13,
                    repeat: Infinity,
                    ease: [0.45, 0, 0.55, 1],
                    delay: phase,
                  }
            }
          >
            <path
              d={layer.d}
              fill="none"
              stroke={strokePaint}
              strokeWidth={layer.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.g>
        );
      })}
      </g>
    </>
  );
}
