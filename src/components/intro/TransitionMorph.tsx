import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SaluxLogo } from './SaluxLogo';
import { usePresentationStore } from '@/store/presentationStore';
import { tracksById } from '@/domain/tracks';
import { EASE_BURST } from './logoMotion';
import { isMobileViewport } from '@/utils/isMobileViewport';

const TOTAL_MS = 2200;
const REDUCED_MS = 220;

interface Props {
  onComplete: () => void;
}

export function TransitionMorph({ onComplete }: Props) {
  const reduce = useReducedMotion();
  const trackId = usePresentationStore((s) => s.currentTrackId);
  const trackTitle = tracksById[trackId]?.meta.title ?? '';
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? isMobileViewport() : false,
  );

  useEffect(() => {
    const onResize = () => setIsMobile(isMobileViewport());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(onComplete, reduce ? REDUCED_MS : TOTAL_MS);
    return () => window.clearTimeout(t);
  }, [onComplete, reduce]);

  if (reduce) {
    return (
      <motion.div
        key="transition-reduced"
        className="absolute inset-0 z-40 bg-[#05070d]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: REDUCED_MS / 1000 }}
      />
    );
  }

  return (
    <motion.div
      key="transition-morph"
      className="absolute inset-0 z-40 overflow-hidden bg-[#05070d]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] } }}
      transition={{ duration: 0.22, ease: EASE_BURST }}
    >
      {/* ── Plano de fundo: glow radial pulsante ───────────────────── */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.7, 1] }}
        transition={{ delay: 0.28, duration: 1.4, times: [0, 0.3, 0.6, 1] }}
        style={{
          background:
            'radial-gradient(ellipse 55% 55% at 50% 50%, rgba(74,156,250,0.14), transparent 72%)',
        }}
      />

      {/* ── Grade cyberpunk ao fundo ────────────────────────────────── */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0"
        animate={{ opacity: [0, 0.06, 0] }}
        transition={{ delay: 0.25, duration: 1.5 }}
        style={{
          backgroundImage:
            'linear-gradient(rgba(74,156,250,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(74,156,250,0.15) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 25%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 25%, transparent 70%)',
        }}
      />

      {/* ── Vinheta perimetral ───────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.78) 100%)',
        }}
      />

      {/* ── Varredura horizontal (scan line) ────────────────────────── */}
      <ScanLine />

      {/* ── Anéis de ondulação centrados ────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        {[0, 1, 2].map((i) => (
          <RippleRing key={i} delay={0.52 + i * 0.28} />
        ))}
      </div>

      {/* ── Faíscas explodindo no clímax do BURST ────────────────────── */}
      <BurstSparks />

      {/* ── Varredura cônica holográfica ─────────────────────────────── */}
      <HolographicSweep />

      {/* ── Orbe Maestro: emerge atrás do logo, expande e segue para o canto ───── */}
      <MaestroOrbTransition />

      {/* ── Logo: entra em BURST canônico, balança em 3D, depois vai pro canto ───── */}
      <motion.div
        className="absolute z-20"
        initial={{ top: '50%', left: '50%', x: '-50%', y: '-50%', scale: 1 }}
        animate={{ top: '24px', left: '24px', x: '0%', y: '0%', scale: 60 / 200 }}
        transition={{ delay: 1.25, duration: 0.98, ease: EASE_BURST }}
        style={{ transformOrigin: 'top left' }}
      >
        {/* perspectiva 3D no wrapper */}
        <div style={{ perspective: '900px', perspectiveOrigin: 'center center' }}>
          {/* Balanço 3D suave antes de sair */}
          <motion.div
            style={{ transformStyle: 'preserve-3d' }}
            animate={{
              rotateX: [0, 8, -6, 4, -2, 0],
              rotateY: [0, 14, -12, 8, -4, 0],
            }}
            transition={{
              delay: 0.55,
              duration: 1.55,
              times: [0, 0.18, 0.38, 0.58, 0.78, 1],
              ease: 'easeInOut',
            }}
          >
            <SaluxLogo
              width={200}
              symbolOnly
              animate
              idle={false}
              effects={{
                glowRing: true,
                shimmer: true,
                aberration: !isMobile,
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* ── Título da trilha ─────────────────────────────────────────── */}
      <motion.div
        className="absolute inset-x-0 bottom-10 z-10 flex items-center justify-center gap-3"
        initial={{ opacity: 0, y: 14, filter: 'none' }}
        animate={{ opacity: 1, y: 0, filter: 'none' }}
        transition={{ delay: 1.0, duration: 0.55, ease: EASE_BURST }}
      >
        <motion.span
          className="h-px bg-gradient-to-r from-transparent to-white/40"
          initial={{ width: 0 }}
          animate={{ width: 32 }}
          transition={{ delay: 1.0, duration: 0.4 }}
        />
        <span className="text-[10px] font-semibold uppercase tracking-[0.34em] text-white/65">
          {trackTitle}
        </span>
        <motion.span
          className="h-px bg-gradient-to-l from-transparent to-white/40"
          initial={{ width: 0 }}
          animate={{ width: 32 }}
          transition={{ delay: 1.0, duration: 0.4 }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ─── BurstSparks ─────────────────────────────────────────────────── */

const SPARK_PALETTE = ['#ffe5a0', '#ffcc55', '#44ddff', '#22ddff', '#a8f0ff', '#fff7c0'];

interface SparkSeed {
  angle: number; // rad
  distance: number; // px (alvo radial)
  size: number;
  delay: number;
  duration: number;
  color: string;
}

const SPARKS: SparkSeed[] = Array.from({ length: 22 }, (_, i) => {
  // Mistura de 8 angulos das pétalas + 14 dispersos para parecer orgânico
  const r1 = ((i * 1664525 + 1013904223) % 1000) / 1000;
  const r2 = ((i * 22695477 + 1) % 1000) / 1000;
  const angle = (i / 22) * Math.PI * 2 + (r1 - 0.5) * 0.6;
  const distance = 140 + r2 * 220; // 140–360px
  return {
    angle,
    distance,
    size: 2 + r1 * 3.5,
    delay: 0.18 + r2 * 0.35, // chegam um pouco depois das pétalas começarem
    duration: 0.85 + r1 * 0.55,
    color: SPARK_PALETTE[i % SPARK_PALETTE.length]!,
  };
});

function BurstSparks() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      {SPARKS.map((s, i) => {
        const tx = Math.cos(s.angle) * s.distance;
        const ty = Math.sin(s.angle) * s.distance;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: s.size,
              height: s.size,
              background: s.color,
              boxShadow: `0 0 ${s.size * 4}px ${s.color}cc, 0 0 ${s.size * 9}px ${s.color}44`,
              willChange: 'transform, opacity',
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.6 }}
            animate={{
              x: [0, tx * 0.4, tx],
              y: [0, ty * 0.4, ty],
              opacity: [0, 1, 0],
              scale: [0.6, 1.15, 0.5],
            }}
            transition={{
              delay: s.delay,
              duration: s.duration,
              ease: [0.16, 1, 0.3, 1],
              times: [0, 0.45, 1],
            }}
          />
        );
      })}
    </div>
  );
}

/* ─── RippleRing ──────────────────────────────────────────────────── */

function RippleRing({ delay }: { delay: number }) {
  return (
    <motion.div
      aria-hidden
      className="absolute h-14 w-14 rounded-full"
      style={{
        border: '1px solid rgba(74,156,250,0.55)',
        boxShadow: '0 0 12px rgba(74,156,250,0.2)',
      }}
      initial={{ scale: 1, opacity: 0.7 }}
      animate={{ scale: 5.5, opacity: 0 }}
      transition={{ delay, duration: 1.4, ease: 'easeOut' }}
    />
  );
}

/* ─── ScanLine ────────────────────────────────────────────────────── */

function ScanLine() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 z-10 h-px"
      style={{
        background:
          'linear-gradient(90deg, transparent 5%, rgba(84,193,237,0.8) 30%, rgba(74,156,250,0.9) 50%, rgba(84,193,237,0.8) 70%, transparent 95%)',
        boxShadow: '0 0 18px rgba(84,193,237,0.55), 0 0 4px rgba(255,255,255,0.4)',
      }}
      initial={{ top: '25%', opacity: 0 }}
      animate={{ top: ['25%', '75%'], opacity: [0, 1, 1, 0] }}
      transition={{
        delay: 0.6,
        duration: 0.88,
        ease: 'linear',
        opacity: { times: [0, 0.08, 0.88, 1] },
      }}
    />
  );
}

/* ─── HolographicSweep ────────────────────────────────────────────── */

function HolographicSweep() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ delay: 0.38, duration: 1.2, times: [0, 0.2, 1] }}
    >
      <motion.div
        className="h-52 w-52 rounded-full"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 55%, rgba(84,193,237,0.25) 72%, rgba(74,156,250,0.45) 80%, rgba(84,193,237,0.25) 88%, transparent 100%)',
        }}
        animate={{ rotate: 360 }}
        transition={{ delay: 0.38, duration: 1.3, ease: 'linear' }}
      />
    </motion.div>
  );
}

const GOLD = '#fbbf24';
const GOLD_BRIGHT = '#fde68a';
const ACCENT = '#4a9cfa';

/**
 * Orbe Maestro participando da transição: emerge atrás do logo, expande
 * em pulso futurista, depois colapsa numa estela dourada que segue o logo
 * para o canto. Reaparece no slide seguinte na sua estação habitual.
 */
function MaestroOrbTransition() {
  return (
    <motion.div
      className="pointer-events-none absolute z-[15] flex items-center justify-center"
      style={{ top: '50%', left: '50%', x: '-50%', y: '-50%' }}
    >
      {/* Núcleo dourado — emerge e respira */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 140,
          height: 140,
          background: `radial-gradient(circle, ${GOLD_BRIGHT}cc 0%, ${GOLD}88 25%, ${GOLD}33 55%, transparent 78%)`,
          filter: 'blur(4px)',
        }}
        initial={{ opacity: 0, scale: 0.2 }}
        animate={{
          opacity: [0, 0.95, 1, 0.7, 0],
          scale: [0.2, 1.1, 1.25, 0.6, 0.2],
        }}
        transition={{
          duration: 2.0,
          times: [0, 0.22, 0.55, 0.82, 1],
          delay: 0.15,
          ease: [0.16, 1, 0.3, 1],
        }}
      />
      {/* Halo externo difuso */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 320,
          height: 320,
          background: `radial-gradient(circle, ${GOLD}33 0%, ${ACCENT}22 35%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: [0, 0.85, 0.5, 0], scale: [0.3, 1.0, 1.4, 1.8] }}
        transition={{
          duration: 2.1,
          times: [0, 0.3, 0.7, 1],
          delay: 0.1,
          ease: [0.16, 1, 0.3, 1],
        }}
      />
      {/* Anel iridescente — assinatura cromática */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 180,
          height: 180,
          background: `conic-gradient(from 0deg, ${ACCENT}00, ${ACCENT}88 18%, ${GOLD_BRIGHT}cc 32%, ${ACCENT}88 48%, ${ACCENT}00 64%, ${GOLD}66 82%, ${ACCENT}00 100%)`,
          maskImage:
            'radial-gradient(circle, transparent 60%, black 66%, black 78%, transparent 84%)',
          WebkitMaskImage:
            'radial-gradient(circle, transparent 60%, black 66%, black 78%, transparent 84%)',
        }}
        initial={{ opacity: 0, rotate: 0, scale: 0.5 }}
        animate={{
          opacity: [0, 0.9, 0.6, 0],
          rotate: 360,
          scale: [0.5, 1.0, 1.15, 1.4],
        }}
        transition={{
          opacity: { duration: 1.9, times: [0, 0.25, 0.7, 1], delay: 0.2 },
          rotate: { duration: 2.1, ease: 'linear', delay: 0.2 },
          scale: { duration: 2.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 },
        }}
      />
      {/* Faíscas radiando — explosão de chegada */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const dist = 140 + (i % 2) * 28;
        return (
          <motion.span
            key={`tm-spark-${i}`}
            className="absolute rounded-full"
            style={{
              left: 0,
              top: 0,
              width: 5,
              height: 5,
              background: i % 2 === 0 ? GOLD_BRIGHT : ACCENT,
              boxShadow: `0 0 12px ${i % 2 === 0 ? GOLD : ACCENT}, 0 0 22px ${i % 2 === 0 ? GOLD : ACCENT}99`,
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
            animate={{
              x: Math.cos(rad) * dist,
              y: Math.sin(rad) * dist,
              opacity: [0, 1, 0],
              scale: [0.4, 1.2, 0.2],
            }}
            transition={{
              duration: 1.0,
              delay: 0.55 + i * 0.025,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        );
      })}
      {/* Estela dourada — colapsa rumo ao canto superior esquerdo (acompanha logo) */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 60,
          height: 60,
          background: `radial-gradient(circle, ${GOLD_BRIGHT}ff 0%, ${GOLD}88 40%, transparent 75%)`,
          filter: 'blur(3px)',
        }}
        initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
        animate={{
          opacity: [0, 0.95, 0.4, 0],
          x: [0, 0, -180, -360],
          y: [0, 0, -180, -360],
          scale: [0.5, 1, 0.6, 0.3],
        }}
        transition={{
          duration: 1.1,
          times: [0, 0.2, 0.7, 1],
          delay: 1.2,
          ease: [0.16, 1, 0.3, 1],
        }}
      />
    </motion.div>
  );
}
