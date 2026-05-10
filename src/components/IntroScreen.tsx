import { useEffect, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { CustomCursor } from './intro/CustomCursor';
import { SaluxLogo } from './intro/SaluxLogo';
import { tracks } from '@/domain/tracks';
import type { TrackPresentation, TrackId } from '@/domain/tracks';
import { usePresentationStore } from '@/store/presentationStore';
import { theme } from '@/domain/theme';
import type { Accent } from '@/domain/types';

const TRACK_ACCENTS: Accent[] = ['cyan', 'violet', 'emerald', 'amber', 'rose'];

export function IntroScreen() {
  const setTrack = usePresentationStore((s) => s.setTrack);
  const enter = usePresentationStore((s) => s.enter);
  const setShowCornerLogo = usePresentationStore((s) => s.setShowCornerLogo);
  const [logoReady, setLogoReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const reduceMotion = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.9 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.9 });
  const parallaxX = useTransform(sx, (v) => v * 18);
  const parallaxY = useTransform(sy, (v) => v * 18);
  const counterParallaxX = useTransform(sx, (v) => v * -10);
  const counterParallaxY = useTransform(sy, (v) => v * -10);

  useEffect(() => {
    const handler = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mx.set(x);
      my.set(y);
    };
    window.addEventListener('pointermove', handler);
    return () => window.removeEventListener('pointermove', handler);
  }, [mx, my]);

  const handleTrackSelect = (trackId: TrackId) => {
    if (isExiting) return;
    setIsExiting(true);
    setShowCornerLogo(true);
    setTrack(trackId);
    enter();
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] } }}
      className="absolute inset-0 z-50 overflow-hidden text-white outline-none"
    >
      {!reduceMotion && <CustomCursor />}

      {/* Header */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-8">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2.5"
        >
          <span
            aria-hidden
            className="block h-1 w-1 rounded-full"
            style={{ background: '#54c1ed', boxShadow: '0 0 6px #54c1ed88' }}
          />
          <span className="text-[10px] font-semibold uppercase tracking-[0.36em] text-white/35">
            beAnalytic
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-right text-[10px] font-semibold uppercase tracking-[0.32em] text-white/35"
        >
          Edição 01 · 2026
          <br />
          <span className="text-white/20">duração ~12 min</span>
        </motion.div>
      </header>

      {/* Logo — acima do centro para dar respiro aos cards */}
      <motion.div
        className="absolute left-1/2 top-[40%] z-10 -translate-x-1/2 -translate-y-1/2"
        style={{ x: parallaxX, y: parallaxY }}
      >
        <div className="flex flex-col items-center gap-7">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-[10px] font-semibold uppercase tracking-[0.36em] text-white/35"
          >
            ◆ A apresentação
          </motion.div>

          <motion.div
            className="relative"
            animate={{
              y: [0, -9, -4, -11, 0],
              rotate: [0, 0.35, -0.25, 0.2, 0],
            }}
            transition={{
              duration: 7.5,
              repeat: Infinity,
              ease: [0.45, 0, 0.55, 1],
              times: [0, 0.28, 0.52, 0.78, 1],
            }}
          >
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -inset-32 -z-10 rounded-full blur-3xl"
              style={{
                background:
                  'radial-gradient(circle, rgba(74,156,250,0.32), rgba(82,160,239,0.09) 48%, transparent 72%)',
              }}
              animate={{
                opacity: [0.42, 0.78, 0.55, 0.72, 0.42],
                scale: [0.94, 1.06, 1, 1.04, 0.94],
              }}
              transition={{
                duration: 5.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <SaluxLogo
              width={460}
              animate
              idle={!isExiting}
              exiting={isExiting}
              effects={{ glowRing: true, shimmer: true, aberration: true }}
              onComplete={() => setLogoReady(true)}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Seção inferior — track cards + marquee */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-3 pb-3"
        style={{ x: counterParallaxX, y: counterParallaxY }}
      >
        <LoadingBar ready={logoReady} />

        <AnimatePresence>
          {logoReady && (
            <motion.div
              key="tracks"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto grid w-full max-w-5xl grid-cols-5 gap-2.5 px-8"
            >
              {tracks.map((track, i) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  index={i}
                  accent={TRACK_ACCENTS[i % TRACK_ACCENTS.length]!}
                  disabled={isExiting}
                  onClick={() => handleTrackSelect(track.id as TrackId)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: logoReady ? 1 : 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-white/20"
        >
          <span>ou</span>
          <kbd className="rounded border border-white/[0.10] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[9px] text-white/45">
            Enter
          </kbd>
          <kbd className="rounded border border-white/[0.10] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[9px] text-white/45">
            Espaço
          </kbd>
        </motion.div>

        <SectionMarquee ready={logoReady} />
      </motion.div>
    </motion.div>
  );
}

/* ─── Track Card ──────────────────────────────────────────────────── */

interface TrackCardProps {
  track: TrackPresentation;
  index: number;
  accent: Accent;
  disabled: boolean;
  onClick: () => void;
}


function TrackCard({ track, index, accent, disabled, onClick }: TrackCardProps) {
  const [hovered, setHovered] = useState(false);
  const ac = theme.accents[accent];

  return (
    <motion.button
      type="button"
      disabled={disabled}
      initial={{ opacity: 0, y: 20, scale: 0.97, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{ delay: 0.08 + index * 0.06, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl p-5 text-left outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-40"
      style={{
        background: hovered
          ? `linear-gradient(160deg, ${ac.base}14 0%, #080c1400 60%)`
          : 'rgba(255,255,255,0.025)',
        border: `1px solid ${hovered ? `${ac.base}40` : 'rgba(255,255,255,0.07)'}`,
        boxShadow: hovered
          ? `0 0 0 1px ${ac.base}25, 0 12px 40px -10px ${ac.base}30, inset 0 1px 0 rgba(255,255,255,0.07)`
          : 'inset 0 1px 0 rgba(255,255,255,0.03)',
        transition: 'background 350ms, border 350ms, box-shadow 350ms',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
      }}
    >
      {/* Número watermark ao fundo */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-2 right-3 select-none font-black leading-none"
        style={{
          fontSize: 64,
          color: ac.base,
          opacity: hovered ? 0.1 : 0.045,
          transition: 'opacity 400ms',
          letterSpacing: '-0.04em',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Linha superior accent */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 5%, ${ac.base} 50%, transparent 95%)`,
          opacity: hovered ? 0.65 : 0.18,
          transition: 'opacity 400ms',
        }}
      />

      {/* Badge numérico */}
      <span
        className="mb-4 inline-flex h-[22px] w-[22px] items-center justify-center self-start rounded-full text-[9px] font-bold"
        style={{
          background: `${ac.base}20`,
          color: ac.base,
          border: `1px solid ${ac.base}45`,
          boxShadow: hovered ? `0 0 10px ${ac.base}30` : 'none',
          transition: 'box-shadow 350ms',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Título */}
      <h3 className="text-[13px] font-bold uppercase leading-tight tracking-[0.08em] text-white">
        {track.meta.title}
      </h3>

      {/* Subtítulo sempre visível */}
      <p
        className="mt-2 line-clamp-2 text-[10px] leading-relaxed"
        style={{
          color: hovered ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.28)',
          transition: 'color 350ms',
        }}
      >
        {track.meta.subtitle}
      </p>

      {/* Rodapé */}
      <div className="mt-auto flex items-center justify-between pt-4">
        <span
          className="text-[9px] font-semibold uppercase tracking-[0.28em]"
          style={{
            color: hovered ? ac.base : 'rgba(255,255,255,0.2)',
            transition: 'color 350ms',
          }}
        >
          Selecionar
        </span>
        <motion.div
          animate={hovered ? { x: 2, y: -2 } : { x: 0, y: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <ArrowUpRight
            className="h-3.5 w-3.5"
            style={{
              color: hovered ? ac.base : 'rgba(255,255,255,0.22)',
              transition: 'color 350ms',
            }}
            strokeWidth={2}
          />
        </motion.div>
      </div>

      {/* Glow radial no hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 40% 120%, ${ac.base}20, transparent 65%)`,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 500ms',
        }}
      />
    </motion.button>
  );
}

/* ─── Loading Bar ─────────────────────────────────────────────────── */

function LoadingBar({ ready }: { ready: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-white/35"
    >
      <span>{ready ? 'Pronto' : 'Carregando'}</span>
      <span className="relative block h-px w-32 overflow-hidden bg-white/[0.08]">
        <motion.span
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#54c1ed] to-[#4a9cfa]"
          initial={{ width: '0%' }}
          animate={{ width: ready ? '100%' : '40%' }}
          transition={{ duration: ready ? 0.55 : 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </span>
      <motion.span
        key={ready ? 'done' : 'loading'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {ready ? '100' : '··'}
      </motion.span>
    </motion.div>
  );
}

/* ─── Marquee ─────────────────────────────────────────────────────── */

function SectionMarquee({ ready }: { ready: boolean }) {
  const items = tracks.map((t) => t.meta.title);
  const doubled = [...items, ...items];

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 0.5 : 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="relative w-screen overflow-hidden border-t border-white/[0.05] bg-black/15 py-2.5 backdrop-blur-sm"
      style={{
        maskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)',
      }}
    >
      <motion.div
        className="flex w-max gap-12 whitespace-nowrap text-[10px] uppercase tracking-[0.32em] text-white/40"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-12">
            <span className="inline-flex items-center gap-2.5">
              <span className="h-[3px] w-[3px] rounded-full bg-[#54c1ed]" />
              {item}
            </span>
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}
