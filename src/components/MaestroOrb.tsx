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
    const start = window.setTimeout(() => setShowWhisper(true), 1100);
    const end = window.setTimeout(() => setShowWhisper(false), 5800);
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
              // Estações no topo: whisper ACIMA (longe do card abaixo).
              // Estações na base: whisper ABAIXO (longe do card acima).
              whisperPlacement={station.y < 800 ? 'above' : 'below'}
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

interface SpeechBubbleProps {
  text: string;
  accent: string;
  placement: 'above' | 'below';
  reduceMotion: boolean;
}

function SpeechBubble({ text, accent, placement, reduceMotion }: SpeechBubbleProps) {
  // Digitação caractere a caractere — efeito "falando"
  const [typed, setTyped] = useState(reduceMotion ? text : '');
  useEffect(() => {
    if (reduceMotion) {
      setTyped(text);
      return;
    }
    setTyped('');
    let i = 0;
    const speed = Math.max(28, Math.min(55, 1400 / text.length));
    const tick = window.setInterval(() => {
      i++;
      setTyped(text.slice(0, i));
      if (i >= text.length) window.clearInterval(tick);
    }, speed);
    return () => window.clearInterval(tick);
  }, [text, reduceMotion]);

  const isBelow = placement === 'below';

  return (
    <motion.div
      initial={{ opacity: 0, y: isBelow ? -8 : 8, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: isBelow ? -4 : 4, scale: 0.96 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="absolute whitespace-nowrap"
      style={{
        left: '50%',
        transform: 'translateX(-50%)',
        ...(isBelow
          ? { top: '100%', marginTop: 18 }
          : { bottom: '100%', marginBottom: 18 }),
      }}
    >
      {/* Tail (triangle) apontando para o orbe */}
      <span
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          width: 0,
          height: 0,
          ...(isBelow
            ? {
                top: -7,
                borderLeft: '7px solid transparent',
                borderRight: '7px solid transparent',
                borderBottom: `8px solid ${accent}88`,
                filter: `drop-shadow(0 -2px 4px ${accent}55)`,
              }
            : {
                bottom: -7,
                borderLeft: '7px solid transparent',
                borderRight: '7px solid transparent',
                borderTop: `8px solid ${accent}88`,
                filter: `drop-shadow(0 2px 4px ${accent}55)`,
              }),
        }}
      />
      {/* Tail interior (preenchimento escuro do bubble) */}
      <span
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          width: 0,
          height: 0,
          ...(isBelow
            ? {
                top: -5,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderBottom: `7px solid rgba(8,12,20,0.95)`,
              }
            : {
                bottom: -5,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: `7px solid rgba(8,12,20,0.95)`,
              }),
        }}
      />

      <div
        className="relative rounded-2xl border px-4 py-2 text-[12px] font-medium leading-snug text-white/95 backdrop-blur-md"
        style={{
          borderColor: `${accent}66`,
          background: `linear-gradient(135deg, ${accent}1f 0%, rgba(8,12,20,0.95) 100%)`,
          boxShadow: `0 10px 28px -6px ${accent}55, 0 0 0 1px ${accent}22, inset 0 1px 0 rgba(255,255,255,0.08)`,
          minWidth: 60,
        }}
      >
        <span>{typed}</span>
        {/* Cursor piscante enquanto digita */}
        {!reduceMotion && typed.length < text.length && (
          <motion.span
            aria-hidden
            className="ml-0.5 inline-block h-[12px] w-[2px] translate-y-[2px]"
            style={{ background: accent }}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </div>
    </motion.div>
  );
}

interface MaestroVisualProps {
  accent: string;
  intensity: number;
  reduceMotion: boolean;
  whisper: string;
  showWhisper: boolean;
  whisperSide: 'left' | 'right';
  whisperPlacement: 'above' | 'below';
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
  whisperPlacement,
  stepId,
}: MaestroVisualProps) {
  return (
    <div className="relative" style={{ width: TOTAL_WIDTH, height: SIZE }}>
      {/* Speech bubble — Maestro "falando" com tail apontando para o orbe */}
      <AnimatePresence>
        {showWhisper && whisper && (
          <SpeechBubble
            key={`whisper-${stepId}`}
            text={whisper}
            accent={accent}
            placement={whisperPlacement}
            reduceMotion={reduceMotion}
          />
        )}
      </AnimatePresence>

      {/* Orbe central (mandala + anéis + crosshair) */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: SIZE, height: SIZE }}
      >
        {/* Glow externo difuso — múltiplas camadas suaves */}
        <motion.div
          className="absolute inset-[-40px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${GOLD}55 0%, ${GOLD}22 25%, ${accent}11 55%, transparent 75%)`,
            filter: 'blur(22px)',
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  scale: [1, 1.18 * intensity, 1.06, 1.22 * intensity, 1],
                  opacity: [0.6, 1, 0.75, 1, 0.6],
                }
          }
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-[-15px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${GOLD_BRIGHT}40 0%, ${GOLD}25 30%, transparent 60%)`,
            filter: 'blur(10px)',
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  scale: [1, 1.08, 0.96, 1.12, 1],
                  opacity: [0.45, 0.8, 0.55, 0.85, 0.45],
                }
          }
          transition={{ duration: 3.1, repeat: Infinity, ease: 'easeInOut' }}
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
          {/* Anel externo dotted (mais sutil) */}
          <circle
            cx="100"
            cy="100"
            r="92"
            fill="none"
            stroke={accent}
            strokeWidth="0.7"
            strokeOpacity="0.22"
            strokeDasharray="2 8"
          />
          {/* Anel intermediário (mais transparente) */}
          <circle
            cx="100"
            cy="100"
            r="74"
            fill="none"
            stroke={accent}
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />
          {/* Anel interno tracejado (suave) */}
          <circle
            cx="100"
            cy="100"
            r="56"
            fill="none"
            stroke={accent}
            strokeWidth="0.7"
            strokeOpacity="0.28"
            strokeDasharray="3 6"
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
                strokeWidth="0.5"
                strokeOpacity="0.32"
                style={{ filter: 'blur(0.3px)' }}
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
            const x1 = 100 + 30 * Math.cos(rad);
            const y1 = 100 + 30 * Math.sin(rad);
            const x2 = 100 + 52 * Math.cos(rad);
            const y2 = 100 + 52 * Math.sin(rad);
            return (
              <line
                key={`ray-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={GOLD}
                strokeWidth={i % 3 === 0 ? '0.9' : '0.4'}
                strokeOpacity={i % 3 === 0 ? '0.5' : '0.28'}
                strokeLinecap="round"
                style={{ filter: `blur(0.5px) drop-shadow(0 0 2px ${GOLD}88)` }}
              />
            );
          })}
        </motion.svg>

        {/* Núcleo de luz — esfera etérea, sem bordas duras */}
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: 40,
            background: `radial-gradient(circle, ${GOLD_BRIGHT}cc 0%, ${GOLD}88 25%, ${GOLD}44 50%, transparent 80%)`,
            filter: 'blur(6px)',
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  scale: [1, 1.16, 1.04, 1.2, 1],
                  opacity: [0.7, 1, 0.85, 1, 0.7],
                }
          }
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Coração interno mais quente, ainda etéreo */}
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: 58,
            background: `radial-gradient(circle, ${GOLD_BRIGHT}99 0%, ${GOLD}55 50%, transparent 85%)`,
            filter: 'blur(3px)',
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  scale: [1, 1.08, 0.96, 1.1, 1],
                  opacity: [0.85, 1, 0.9, 1, 0.85],
                }
          }
          transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
        />

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

