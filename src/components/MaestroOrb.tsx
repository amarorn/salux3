import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { usePresentationStore } from '@/store/presentationStore';
import { useCurrentPresentation } from '@/hooks/useCurrentPresentation';
import { theme } from '@/domain/theme';
import type { NodeKind } from '@/domain/types';

/**
 * Maestro — orbe mandala com núcleo radiante, anéis orbitais, crosshairs
 * e ondas senoidais. Viaja pela tela acompanhando o slide ativo.
 */

interface Props {
  visible: boolean;
}

/** Sussurros curtos por kind de slide. */
const WHISPERS: Record<string, string> = {
  cover: 'Vamos começar.',
  narrative: 'Olha por aqui.',
  highlight: 'Esse ponto é importante.',
  architecture: 'A estrutura sustenta tudo.',
  journey: 'Cada etapa conta.',
  integration: 'A virada de lógica.',
  governance: 'Tudo se conecta.',
  roadmap: 'Capacidades que sustentam.',
  closing: 'Até a próxima.',
};

/**
 * Estações — todas em "zonas quietas" do Stage (acima ou abaixo do card),
 * nunca sobrepondo o banner da foto ou o conteúdo central.
 * Card ativo ocupa ~y=270–1650; topo livre y<240, base livre y>1700.
 * Bounds horizontais: x ∈ [180, 900] para caber com ondas (320px largura).
 */
const STATIONS: Partial<Record<NodeKind, { x: number; y: number; whisperSide: 'left' | 'right' }>> = {
  cover:        { x: 540, y: 1770, whisperSide: 'left' },   // base centro — presença
  narrative:    { x: 820, y: 1770, whisperSide: 'left' },   // base direita
  highlight:    { x: 540, y: 180,  whisperSide: 'left' },   // topo centro — atenção
  architecture: { x: 220, y: 180,  whisperSide: 'right' },  // topo esquerda — observando
  journey:      { x: 400, y: 1770, whisperSide: 'right' },  // base esquerda
  integration:  { x: 820, y: 180,  whisperSide: 'left' },   // topo direita — a virada
  governance:   { x: 220, y: 180,  whisperSide: 'right' },  // topo esquerda
  roadmap:      { x: 820, y: 1770, whisperSide: 'left' },   // base direita
  closing:      { x: 540, y: 180,  whisperSide: 'right' },  // topo centro — finalizar
  results:      { x: 820, y: 1770, whisperSide: 'left' },
  capacities:   { x: 220, y: 180,  whisperSide: 'right' },
  pathways:     { x: 400, y: 1770, whisperSide: 'right' },
  'agents-flow':{ x: 820, y: 180,  whisperSide: 'left' },
};

const DEFAULT_STATION = { x: 820, y: 1770, whisperSide: 'left' as const };

/** Núcleo dourado quente — usado independente do accent do slide. */
const GOLD = '#fbbf24';
const GOLD_BRIGHT = '#fde68a';

export function MaestroOrb({ visible }: Props) {
  const reduceMotion = useReducedMotion();
  const stepId = usePresentationStore((s) => s.currentStepId);
  const { stepsById } = useCurrentPresentation();
  const current = stepsById[stepId];
  const accent = current ? theme.accents[current.accent].base : '#54c1ed';
  const whisper = current ? WHISPERS[current.kind] ?? '' : '';
  const station = current ? STATIONS[current.kind] ?? DEFAULT_STATION : DEFAULT_STATION;

  const [showWhisper, setShowWhisper] = useState(false);
  useEffect(() => {
    if (!visible || !whisper || reduceMotion) return;
    const start = window.setTimeout(() => setShowWhisper(true), 900);
    const end = window.setTimeout(() => setShowWhisper(false), 4400);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(end);
    };
  }, [stepId, visible, whisper, reduceMotion]);

  const intensity = useMemo(() => {
    if (!current) return 1;
    const high: NodeKind[] = ['cover', 'closing', 'highlight'];
    return high.includes(current.kind) ? 1.18 : 1;
  }, [current]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="maestro"
          className="pointer-events-none absolute z-30 select-none"
          style={{ top: 0, left: 0 }}
          initial={{ opacity: 0, x: station.x, y: station.y, scale: 0.6 }}
          animate={{ opacity: 1, x: station.x, y: station.y, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{
            opacity: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
            scale: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
            x: { duration: 1.6, ease: [0.65, 0, 0.35, 1] },
            y: { duration: 1.6, ease: [0.65, 0, 0.35, 1] },
          }}
        >
          <motion.div
            animate={
              reduceMotion
                ? undefined
                : {
                    x: [0, 6, -4, 8, -2, 0],
                    y: [0, -5, 4, -3, 6, 0],
                  }
            }
            transition={{ duration: 9.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative -translate-x-1/2 -translate-y-1/2"
          >
            <MaestroVisual
              accent={accent}
              intensity={intensity}
              reduceMotion={Boolean(reduceMotion)}
              whisper={whisper}
              showWhisper={showWhisper}
              whisperSide={station.whisperSide}
              stepId={stepId}
            />
          </motion.div>

          {/* Rastro/halo expansivo ao chegar em nova parada */}
          {!reduceMotion && (
            <motion.span
              key={`trail-${stepId}`}
              aria-hidden
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
              initial={{ opacity: 0.6, scale: 0.3 }}
              animate={{ opacity: 0, scale: 4 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{
                width: 120,
                height: 120,
                background: `radial-gradient(circle, ${accent}55, transparent 70%)`,
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface MaestroVisualProps {
  accent: string;
  intensity: number;
  reduceMotion: boolean;
  whisper: string;
  showWhisper: boolean;
  whisperSide: 'left' | 'right';
  stepId: string;
}

/** Tamanho do orbe (mandala). */
const SIZE = 140;
const TOTAL_WIDTH = SIZE;

function MaestroVisual({
  accent,
  intensity,
  reduceMotion,
  whisper,
  showWhisper,
  whisperSide,
  stepId,
}: MaestroVisualProps) {
  return (
    <div className="relative" style={{ width: TOTAL_WIDTH, height: SIZE }}>
      {/* Whisper bubble */}
      <AnimatePresence>
        {showWhisper && whisper && (
          <motion.div
            key={`whisper-${stepId}`}
            initial={{ opacity: 0, x: whisperSide === 'right' ? -8 : 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: whisperSide === 'right' ? -8 : 8 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-white/90 backdrop-blur-md"
            style={{
              [whisperSide]: -28,
              top: '50%',
              transform: 'translateY(-50%)',
              borderColor: `${accent}44`,
              background: `linear-gradient(135deg, ${accent}1a 0%, rgba(8,12,20,0.85) 100%)`,
              boxShadow: `0 8px 24px -6px ${accent}55, inset 0 1px 0 rgba(255,255,255,0.08)`,
            }}
          >
            {whisper}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Orbe central (mandala + anéis + crosshair) */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: SIZE, height: SIZE }}
      >
        {/* Glow externo difuso */}
        <motion.div
          className="absolute inset-[-20px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${GOLD}33 0%, ${accent}22 35%, transparent 70%)`,
            filter: 'blur(14px)',
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  scale: [1, 1.15 * intensity, 1.05, 1.18 * intensity, 1],
                  opacity: [0.5, 0.85, 0.65, 0.9, 0.5],
                }
          }
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* SVG principal */}
        <motion.svg
          viewBox="0 0 200 200"
          width={SIZE}
          height={SIZE}
          className="absolute inset-0"
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        >
          {/* Anel externo dotted */}
          <circle
            cx="100"
            cy="100"
            r="92"
            fill="none"
            stroke={accent}
            strokeWidth="1"
            strokeOpacity="0.4"
            strokeDasharray="2 6"
          />
          {/* Anel intermediário */}
          <circle
            cx="100"
            cy="100"
            r="74"
            fill="none"
            stroke={accent}
            strokeWidth="0.8"
            strokeOpacity="0.55"
          />
          {/* Anel interno tracejado */}
          <circle
            cx="100"
            cy="100"
            r="56"
            fill="none"
            stroke={accent}
            strokeWidth="1"
            strokeOpacity="0.5"
            strokeDasharray="4 4"
          />

          {/* Pontos nos anéis */}
          {[0, 60, 120, 180, 240, 300].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <circle
                key={`pt-out-${deg}`}
                cx={100 + 92 * Math.cos(rad)}
                cy={100 + 92 * Math.sin(rad)}
                r="2"
                fill={deg % 120 === 0 ? GOLD : accent}
              />
            );
          })}
          {[30, 90, 150, 210, 270, 330].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <circle
                key={`pt-mid-${deg}`}
                cx={100 + 74 * Math.cos(rad)}
                cy={100 + 74 * Math.sin(rad)}
                r="1.5"
                fill={accent}
                fillOpacity="0.7"
              />
            );
          })}
        </motion.svg>

        {/* Mandala interna — flor de 6 pétalas (rotação contra-direção) */}
        <motion.svg
          viewBox="0 0 200 200"
          width={SIZE}
          height={SIZE}
          className="absolute inset-0"
          animate={reduceMotion ? undefined : { rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        >
          {[0, 60, 120, 180, 240, 300].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const cx = 100 + 18 * Math.cos(rad);
            const cy = 100 + 18 * Math.sin(rad);
            return (
              <circle
                key={`petal-${deg}`}
                cx={cx}
                cy={cy}
                r="22"
                fill="none"
                stroke={GOLD}
                strokeWidth="0.7"
                strokeOpacity="0.55"
              />
            );
          })}
        </motion.svg>

        {/* Sun-burst (12 raios) — gold */}
        <motion.svg
          viewBox="0 0 200 200"
          width={SIZE}
          height={SIZE}
          className="absolute inset-0"
          animate={
            reduceMotion
              ? undefined
              : { rotate: 360, opacity: [0.6, 0.95, 0.7, 1, 0.6] }
          }
          transition={{
            rotate: { duration: 45, repeat: Infinity, ease: 'linear' },
            opacity: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => {
            const deg = i * 30;
            const rad = (deg * Math.PI) / 180;
            const x1 = 100 + 18 * Math.cos(rad);
            const y1 = 100 + 18 * Math.sin(rad);
            const x2 = 100 + 48 * Math.cos(rad);
            const y2 = 100 + 48 * Math.sin(rad);
            return (
              <line
                key={`ray-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={GOLD}
                strokeWidth={i % 3 === 0 ? '1.4' : '0.7'}
                strokeOpacity={i % 3 === 0 ? '0.9' : '0.55'}
                strokeLinecap="round"
              />
            );
          })}
        </motion.svg>

        {/* Núcleo brilhante */}
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: 56,
            background: `radial-gradient(circle at 35% 35%, ${GOLD_BRIGHT} 0%, ${GOLD} 30%, ${GOLD}88 60%, transparent 100%)`,
            boxShadow: `0 0 22px ${GOLD}, 0 0 50px ${GOLD}aa, 0 0 80px ${accent}55, inset 0 0 12px rgba(255,255,255,0.7)`,
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  scale: [1, 1.12, 1.04, 1.14, 1],
                  opacity: [0.92, 1, 0.96, 1, 0.92],
                }
          }
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Estrela central de 4 pontas — flare */}
        {!reduceMotion && (
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ scale: [0.8, 1.3, 0.9, 1.4, 0.8], opacity: [0.6, 1, 0.7, 1, 0.6] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="60" height="60" viewBox="0 0 60 60">
              <line x1="30" y1="0" x2="30" y2="60" stroke={GOLD_BRIGHT} strokeWidth="1.4" strokeOpacity="0.95" strokeLinecap="round" />
              <line x1="0" y1="30" x2="60" y2="30" stroke={GOLD_BRIGHT} strokeWidth="1.4" strokeOpacity="0.95" strokeLinecap="round" />
              <line x1="6" y1="6" x2="54" y2="54" stroke={GOLD} strokeWidth="0.8" strokeOpacity="0.65" strokeLinecap="round" />
              <line x1="54" y1="6" x2="6" y2="54" stroke={GOLD} strokeWidth="0.8" strokeOpacity="0.65" strokeLinecap="round" />
            </svg>
          </motion.div>
        )}

        {/* Centelhas orbitais */}
        {!reduceMotion &&
          [0, 1, 2, 3].map((i) => (
            <motion.span
              key={`spark-${i}`}
              className="absolute h-1 w-1 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                background: i % 2 === 0 ? GOLD : accent,
                boxShadow: `0 0 8px ${i % 2 === 0 ? GOLD : accent}`,
                transformOrigin: '0 0',
              }}
              animate={{
                rotate: i % 2 === 0 ? 360 : -360,
                x: [50 + i * 4, 46 + i * 4, 52 + i * 4],
              }}
              transition={{
                rotate: {
                  duration: 9 + i * 2,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: i * 0.8,
                },
                x: {
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
            />
          ))}
      </div>
    </div>
  );
}

