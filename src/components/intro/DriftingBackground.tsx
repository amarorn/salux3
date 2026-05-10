import { motion } from 'framer-motion';

export function DriftingBackground() {
  return (
    <>
      <BaseGradients />
      <Grid />
      <DriftingSilhouette />
      <DriftingPetals />
      <CRTScanlines />
      <FloatingOrbs />
      <Noise />
    </>
  );
}

function BaseGradients() {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 60%, #0e1726 0%, #08101c 45%, #04060c 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-screen"
        style={{
          background:
            'radial-gradient(circle at 22% 78%, rgba(82,160,239,0.22), transparent 42%), radial-gradient(circle at 78% 22%, rgba(84,193,237,0.18), transparent 48%)',
        }}
      />
    </>
  );
}

function Grid() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 opacity-[0.18]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
      }}
    />
  );
}

function DriftingSilhouette() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute -left-[20vw] top-[8%] opacity-[0.06]"
      animate={{
        x: ['0vw', '120vw'],
        y: ['0vh', '60vh'],
        rotate: [0, 360],
      }}
      transition={{
        duration: 80,
        repeat: Infinity,
        ease: 'linear',
        repeatType: 'loop',
      }}
    >
      <svg width="640" height="640" viewBox="0 0 200 260" fill="none">
        <g stroke="white" strokeWidth="0.6" fill="none">
          <path d="M59.97,141.54c5.28-5.28,5.33-13.89.1-19.12-5.23-5.23-30-30-32.35-32.35,0,0,9.93,13.95,7.4,24.13-2.53,10.17-31.18,45.32-31.18,45.32-5.15,6.34-5.33,13.89-.1,19.12s13.84,5.19,19.12-.1l37.01-37Z" />
          <path d="M59.97,122.32c5.28,5.28,5.33,13.89.1,19.12-5.23,5.23-30,30-32.35,32.35,0,0,9.93-13.95,7.4-24.13-2.53-10.17-31.18-45.32-31.18-45.32-5.15-6.34-5.33-13.89-.09-19.12,5.23-5.23,13.84-5.19,19.12.1l37,37Z" />
          <path d="M118.27,122.32c-5.28,5.28-5.33,13.89-.1,19.12s30,30,32.35,32.35c0,0-9.93-13.95-7.4-24.13,2.53-10.17,31.18-45.32,31.18-45.32,5.15-6.34,5.33-13.89.1-19.12s-13.84-5.19-19.12.1l-37.01,37Z" />
          <path d="M118.27,141.54c-5.28-5.28-5.33-13.89-.1-19.12s30-30,32.35-32.35c0,0-9.93,13.95-7.4,24.13,2.53,10.17,31.18,45.32,31.18,45.32,5.15,6.34,5.33,13.89.1,19.12s-13.84,5.19-19.12-.1l-37.01-37Z" />
          <path d="M98.73,161.08c-5.28-5.28-13.89-5.33-19.12-.1s-30,30-32.35,32.35c0,0,13.95-9.93,24.13-7.4,10.17,2.53,45.32,31.18,45.32,31.18,6.34,5.15,13.89,5.33,19.12.1s5.19-13.84-.1-19.12l-37-37.01Z" />
          <path d="M79.52,161.08c5.28-5.28,13.89-5.33,19.12-.1s30,30,32.35,32.35c0,0-13.95-9.93-24.13-7.4-10.17,2.53-45.32,31.18-45.32,31.18-6.34,5.15-13.89,5.33-19.12.1-5.23-5.23-5.19-13.84.1-19.12l37-37.01Z" />
          <path d="M79.52,102.78c5.28,5.28,13.89,5.33,19.12.1s30-30,32.35-32.35c0,0-13.95,9.93-24.13,7.4-10.18-2.53-45.33-31.18-45.33-31.18-6.34-5.15-13.89-5.33-19.12-.1s-5.19,13.84.1,19.12l37.01,37.01Z" />
          <path d="M98.73,102.78c-5.28,5.28-13.89,5.33-19.12.1l-32.35-32.35s13.95,9.93,24.13,7.4c10.17-2.53,45.32-31.18,45.32-31.18,6.34-5.15,13.89-5.33,19.12-.1,5.23,5.23,5.19,13.84-.1,19.12l-37,37.01Z" />
        </g>
      </svg>
    </motion.div>
  );
}

function CRTScanlines() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.18]"
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)',
      }}
    />
  );
}

function FloatingOrbs() {
  return (
    <>
      <motion.div
        aria-hidden
        className="absolute h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(74,156,250,0.55), transparent 70%)',
        }}
        animate={{ x: ['-10vw', '20vw', '-10vw'], y: ['10vh', '70vh', '10vh'] }}
        transition={{ duration: 36, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute right-0 h-[520px] w-[520px] rounded-full opacity-35 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(84,193,237,0.45), transparent 70%)',
        }}
        animate={{ x: ['10vw', '-15vw', '10vw'], y: ['60vh', '5vh', '60vh'] }}
        transition={{ duration: 44, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  );
}

function Noise() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06] mix-blend-overlay"
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id="intro-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#intro-noise)" />
    </svg>
  );
}

const PETAL_PATHS = [
  'M59.97,141.54c5.28-5.28,5.33-13.89.1-19.12-5.23-5.23-30-30-32.35-32.35,0,0,9.93,13.95,7.4,24.13-2.53,10.17-31.18,45.32-31.18,45.32-5.15,6.34-5.33,13.89-.1,19.12s13.84,5.19,19.12-.1l37.01-37Z',
  'M118.27,141.54c-5.28-5.28-5.33-13.89-.1-19.12s30-30,32.35-32.35c0,0-9.93,13.95-7.4,24.13,2.53,10.17,31.18,45.32,31.18,45.32,5.15,6.34,5.33,13.89.1,19.12s-13.84,5.19-19.12-.1l-37.01-37Z',
  'M98.73,161.08c-5.28-5.28-13.89-5.33-19.12-.1s-30,30-32.35,32.35c0,0,13.95-9.93,24.13-7.4,10.17,2.53,45.32,31.18,45.32,31.18,6.34,5.15,13.89,5.33,19.12.1s5.19-13.84-.1-19.12l-37-37.01Z',
  'M79.52,102.78c5.28,5.28,13.89,5.33,19.12.1s30-30,32.35-32.35c0,0-13.95,9.93-24.13,7.4-10.18-2.53-45.33-31.18-45.33-31.18-6.34-5.15-13.89-5.33-19.12-.1s-5.19,13.84.1,19.12l37.01,37.01Z',
];

interface PetalConfig {
  pathIndex: number;
  startX: string;
  startY: string;
  size: number;
  duration: number;
  delay: number;
  rotateBase: number;
  driftX: [string, string, string];
  driftY: [string, string, string];
  opacity: number;
}

const PETALS: PetalConfig[] = [
  { pathIndex: 0, startX: '68%', startY: '18%', size: 130, duration: 52, delay: 0, rotateBase: 20, driftX: ['0vw', '6vw', '-3vw'], driftY: ['0vh', '4vh', '-2vh'], opacity: 0.06 },
  { pathIndex: 1, startX: '82%', startY: '62%', size: 90, duration: 44, delay: 4, rotateBase: -30, driftX: ['0vw', '-5vw', '3vw'], driftY: ['0vh', '-6vh', '3vh'], opacity: 0.05 },
  { pathIndex: 2, startX: '38%', startY: '78%', size: 80, duration: 60, delay: 7, rotateBase: 60, driftX: ['0vw', '4vw', '-2vw'], driftY: ['0vh', '-5vh', '2vh'], opacity: 0.07 },
  { pathIndex: 3, startX: '78%', startY: '32%', size: 110, duration: 50, delay: 2, rotateBase: 120, driftX: ['0vw', '-4vw', '5vw'], driftY: ['0vh', '5vh', '-3vh'], opacity: 0.05 },
  { pathIndex: 0, startX: '60%', startY: '88%', size: 70, duration: 48, delay: 6, rotateBase: 210, driftX: ['0vw', '5vw', '-3vw'], driftY: ['0vh', '-4vh', '3vh'], opacity: 0.07 },
  { pathIndex: 2, startX: '26%', startY: '24%', size: 100, duration: 56, delay: 3, rotateBase: 150, driftX: ['0vw', '-3vw', '4vw'], driftY: ['0vh', '4vh', '-3vh'], opacity: 0.05 },
  { pathIndex: 1, startX: '88%', startY: '8%', size: 60, duration: 38, delay: 5, rotateBase: 80, driftX: ['0vw', '-3vw', '2vw'], driftY: ['0vh', '4vh', '-2vh'], opacity: 0.08 },
];

function DriftingPetals() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {PETALS.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: p.startX, top: p.startY, opacity: p.opacity }}
          animate={{
            x: [...p.driftX, p.driftX[0]],
            y: [...p.driftY, p.driftY[0]],
            rotate: [p.rotateBase, p.rotateBase + 360],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <svg
            width={p.size}
            height={p.size}
            viewBox="0 30 200 220"
            fill="none"
            style={{ display: 'block' }}
          >
            <path
              d={PETAL_PATHS[p.pathIndex]!}
              stroke="rgba(168,230,255,0.7)"
              strokeWidth="0.6"
              fill="rgba(168,230,255,0.18)"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
