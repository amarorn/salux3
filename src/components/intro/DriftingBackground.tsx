import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export function DriftingBackground() {
  return (
    <>
      <BaseGradients />
      <Grid />
      <DriftingSilhouette />
      <DriftingPetals />
      <MagneticParticles />
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
        className="absolute h-[420px] w-[420px] rounded-full opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(74,156,250,0.55), transparent 70%)',
        }}
        animate={{ x: ['-10vw', '20vw', '-10vw'], y: ['10vh', '70vh', '10vh'] }}
        transition={{ duration: 36, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute right-0 h-[520px] w-[520px] rounded-full opacity-35"
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

/* ─── MagneticParticles ───────────────────────────────────────────── */

interface ParticleSeed {
  /** posição base em viewport units (0..1) */
  bx: number;
  by: number;
  /** offset orgânico (drift) — params do ciclo */
  driftAmpX: number; // px
  driftAmpY: number;
  driftPeriod: number; // s
  driftPhase: number;
  /** raio em px */
  size: number;
  /** cor (hex) */
  color: string;
  /** opacidade base */
  opacity: number;
  /** força do campo magnético (multiplicador) */
  magnet: number;
}

const PARTICLE_PALETTE = ['#ffe5a0', '#ffcc55', '#44ddff', '#22ddff', '#a8f0ff', '#fff7c0'];

// Posições orgânicas distribuídas (32 partículas) — seeds curados pra evitar alinhamento.
// Cada tupla: [bx 0..1, by 0..1, ampX, ampY, period, phase 0..1, size, opacityIdx, paletteIdx, magnet]
const PARTICLE_SEEDS: ReadonlyArray<readonly [number, number, number, number, number, number, number, number, number, number]> = [
  [0.08, 0.18, 14,  9, 11.0, 0.12, 2.4, 0.62, 0, 1.05],
  [0.92, 0.22, 11, 16, 13.0, 0.74, 3.0, 0.55, 3, 0.85],
  [0.34, 0.08, 18, 10,  8.5, 0.41, 2.0, 0.48, 1, 0.9 ],
  [0.65, 0.12, 10, 14, 14.0, 0.28, 3.6, 0.7,  4, 1.2 ],
  [0.12, 0.55,  9, 18, 10.0, 0.83, 2.6, 0.58, 2, 0.95],
  [0.22, 0.78, 17, 11,  9.5, 0.06, 4.0, 0.66, 5, 1.1 ],
  [0.85, 0.62, 12, 17, 12.5, 0.55, 3.2, 0.6,  0, 0.8 ],
  [0.50, 0.92,  8, 12,  8.0, 0.91, 2.2, 0.5,  3, 1.0 ],
  [0.95, 0.86, 14,  9, 15.0, 0.33, 2.8, 0.7,  4, 0.9 ],
  [0.18, 0.32, 11, 13, 11.5, 0.22, 3.4, 0.62, 1, 1.05],
  [0.42, 0.42, 16, 16, 10.5, 0.71, 4.2, 0.55, 2, 0.85],
  [0.72, 0.34,  9, 11,  7.5, 0.48, 2.0, 0.45, 5, 1.0 ],
  [0.05, 0.72, 13, 14, 14.5, 0.65, 3.0, 0.65, 1, 0.95],
  [0.38, 0.62,  7, 19,  9.0, 0.18, 1.8, 0.4,  3, 0.7 ],
  [0.58, 0.18, 19,  8, 13.5, 0.85, 2.4, 0.5,  4, 0.9 ],
  [0.78, 0.48, 10, 13, 10.0, 0.04, 3.8, 0.68, 0, 1.1 ],
  [0.28, 0.88, 12, 15, 11.0, 0.39, 2.6, 0.55, 2, 1.0 ],
  [0.48, 0.22, 15, 10,  8.5, 0.62, 2.0, 0.6,  5, 0.85],
  [0.62, 0.78, 11, 17, 12.0, 0.27, 3.6, 0.72, 1, 0.95],
  [0.88, 0.05, 17,  9, 13.0, 0.81, 2.8, 0.5,  4, 1.05],
  [0.04, 0.42,  9, 12, 10.5, 0.58, 1.8, 0.42, 3, 0.8 ],
  [0.16, 0.95, 14, 11,  9.5, 0.46, 3.2, 0.55, 5, 1.0 ],
  [0.32, 0.28, 10, 14, 14.0, 0.13, 2.2, 0.48, 2, 0.95],
  [0.55, 0.55, 16, 16, 11.5, 0.72, 4.0, 0.7,  0, 1.15],
  [0.68, 0.05,  8, 10,  8.0, 0.36, 1.6, 0.4,  3, 0.75],
  [0.82, 0.92, 13, 15, 12.5, 0.92, 3.0, 0.6,  4, 1.0 ],
  [0.42, 0.74, 11, 12, 10.0, 0.05, 2.4, 0.52, 1, 0.9 ],
  [0.96, 0.45, 18, 13, 13.5, 0.43, 3.4, 0.65, 2, 1.05],
  [0.10, 0.04,  9, 11,  9.0, 0.69, 2.0, 0.45, 5, 0.85],
  [0.74, 0.65, 14, 14, 11.0, 0.16, 3.8, 0.7,  0, 1.1 ],
  [0.24, 0.48, 12, 17, 10.5, 0.84, 2.6, 0.58, 4, 0.95],
  [0.55, 0.36, 10, 12, 12.0, 0.31, 2.0, 0.5,  3, 0.85],
];

const PARTICLES: ParticleSeed[] = PARTICLE_SEEDS.map((s) => ({
  bx: s[0],
  by: s[1],
  driftAmpX: s[2],
  driftAmpY: s[3],
  driftPeriod: s[4],
  driftPhase: s[5] * Math.PI * 2,
  size: s[6],
  color: PARTICLE_PALETTE[s[8]]!,
  opacity: s[7],
  magnet: s[9],
}));
const MAGNET_RADIUS = 180; // px
const MAGNET_FORCE = 70; // px de deslocamento máximo

function MagneticParticles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<Array<HTMLDivElement | null>>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const sizeRef = useRef({ w: 0, h: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const measure = () => {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      sizeRef.current = { w: r.width, h: r.height };
      setReady(true);
    };
    measure();
    window.addEventListener('resize', measure);

    const onMove = (e: PointerEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    window.addEventListener('pointermove', onMove);
    document.addEventListener('pointerleave', onLeave);

    let raf = 0;
    let last = performance.now();
    let elapsed = 0;
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      elapsed += dt;

      const { w, h } = sizeRef.current;
      const { x: mx, y: my } = mouseRef.current;

      for (let i = 0; i < PARTICLES.length; i++) {
        const node = dotRefs.current[i];
        if (!node) continue;
        const p = PARTICLES[i]!;
        const baseX = p.bx * w;
        const baseY = p.by * h;
        // Drift senoidal
        const phase = (elapsed / p.driftPeriod) * Math.PI * 2 + p.driftPhase;
        const dx = Math.cos(phase) * p.driftAmpX;
        const dy = Math.sin(phase * 1.2 + 0.5) * p.driftAmpY;

        // Repulsão magnética (cursor empurra)
        let mxOff = 0;
        let myOff = 0;
        const px = baseX + dx;
        const py = baseY + dy;
        const ddx = px - mx;
        const ddy = py - my;
        const dist2 = ddx * ddx + ddy * ddy;
        if (dist2 < MAGNET_RADIUS * MAGNET_RADIUS) {
          const dist = Math.sqrt(dist2) || 1;
          const falloff = 1 - dist / MAGNET_RADIUS;
          const force = falloff * falloff * MAGNET_FORCE * p.magnet;
          mxOff = (ddx / dist) * force;
          myOff = (ddy / dist) * force;
        }

        node.style.transform = `translate3d(${baseX + dx + mxOff}px, ${baseY + dy + myOff}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ contain: 'layout paint' }}
    >
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          ref={(el) => {
            dotRefs.current[i] = el;
          }}
          className="absolute left-0 top-0"
          style={{
            width: p.size,
            height: p.size,
            marginLeft: -p.size / 2,
            marginTop: -p.size / 2,
            borderRadius: '50%',
            background: p.color,
            opacity: ready ? p.opacity : 0,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}aa, 0 0 ${p.size * 6}px ${p.color}33`,
            willChange: 'transform',
            transition: 'opacity 600ms ease-out',
          }}
        />
      ))}
    </div>
  );
}

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
