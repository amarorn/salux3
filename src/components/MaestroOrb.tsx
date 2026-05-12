import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { usePresentationStore } from '@/store/presentationStore';
import { useCurrentPresentation } from '@/hooks/useCurrentPresentation';
import { theme } from '@/domain/theme';
import type { NodeKind } from '@/domain/types';

/**
 * Maestro — orbe de luz pulsante que viaja pela tela acompanhando
 * a apresentação. Muda de posição, cor e intensidade conforme o
 * slide ativo, e sussurra uma frase curta a cada transição.
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
 * Posições por kind no sistema de coordenadas do Stage (1080×1920).
 * O Maestro se desloca entre essas paradas conforme navegamos.
 * `whisperSide` controla de que lado o balão de fala aparece.
 */
const STATIONS: Partial<Record<NodeKind, { x: number; y: number; whisperSide: 'left' | 'right' }>> = {
  cover:        { x: 540,  y: 1620, whisperSide: 'left' },   // centro-baixo, "presença"
  narrative:    { x: 940,  y: 1740, whisperSide: 'left' },   // canto inferior direito
  highlight:    { x: 940,  y: 220,  whisperSide: 'left' },   // alto à direita — "olha aqui!"
  architecture: { x: 140,  y: 900,  whisperSide: 'right' },  // lado esquerdo, observando
  journey:      { x: 320,  y: 1780, whisperSide: 'right' },  // base, percorrendo a jornada
  integration:  { x: 940,  y: 940,  whisperSide: 'left' },   // direita meio — virada
  governance:   { x: 140,  y: 220,  whisperSide: 'right' },  // canto superior esquerdo
  roadmap:      { x: 940,  y: 1560, whisperSide: 'left' },   // direita-baixo
  closing:      { x: 540,  y: 960,  whisperSide: 'right' },  // centro — fechamento
  results:      { x: 940,  y: 1740, whisperSide: 'left' },
  capacities:   { x: 140,  y: 900,  whisperSide: 'right' },
  pathways:     { x: 320,  y: 1780, whisperSide: 'right' },
  'agents-flow':{ x: 940,  y: 940,  whisperSide: 'left' },
};

const DEFAULT_STATION = { x: 940, y: 1740, whisperSide: 'left' as const };

export function MaestroOrb({ visible }: Props) {
  const reduceMotion = useReducedMotion();
  const stepId = usePresentationStore((s) => s.currentStepId);
  const { stepsById } = useCurrentPresentation();
  const current = stepsById[stepId];
  const accent = current ? theme.accents[current.accent].base : '#54c1ed';
  const whisper = current ? WHISPERS[current.kind] ?? '' : '';
  const station = current ? STATIONS[current.kind] ?? DEFAULT_STATION : DEFAULT_STATION;

  // Mostra o whisper brevemente a cada troca de slide
  const [showWhisper, setShowWhisper] = useState(false);
  useEffect(() => {
    if (!visible || !whisper || reduceMotion) return;
    // pequena espera para o orbe chegar antes do whisper
    const start = window.setTimeout(() => setShowWhisper(true), 900);
    const end = window.setTimeout(() => setShowWhisper(false), 4400);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(end);
    };
  }, [stepId, visible, whisper, reduceMotion]);

  // Intensidade do pulso por kind
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
          {/* Drift idle — pequeno movimento aleatório em volta do ponto */}
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
            <OrbContent
              accent={accent}
              intensity={intensity}
              reduceMotion={Boolean(reduceMotion)}
              whisper={whisper}
              showWhisper={showWhisper}
              whisperSide={station.whisperSide}
              stepId={stepId}
            />
          </motion.div>

          {/* Trilha/rastro do movimento entre paradas */}
          {!reduceMotion && (
            <motion.span
              key={`trail-${stepId}`}
              aria-hidden
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
              initial={{ opacity: 0.7, scale: 0.3 }}
              animate={{ opacity: 0, scale: 3.5 }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              style={{
                width: 72,
                height: 72,
                background: `radial-gradient(circle, ${accent}55, transparent 70%)`,
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface OrbContentProps {
  accent: string;
  intensity: number;
  reduceMotion: boolean;
  whisper: string;
  showWhisper: boolean;
  whisperSide: 'left' | 'right';
  stepId: string;
}

function OrbContent({
  accent,
  intensity,
  reduceMotion,
  whisper,
  showWhisper,
  whisperSide,
  stepId,
}: OrbContentProps) {
  const SIZE = 72;
  return (
    <div className="relative flex items-center" style={{ width: SIZE, height: SIZE }}>
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
              [whisperSide]: SIZE + 14,
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

      {/* Orbe */}
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        {/* Glow externo difuso */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${accent}66 0%, ${accent}22 40%, transparent 70%)`,
            filter: 'blur(8px)',
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  scale: [1, 1.18 * intensity, 1.08, 1.22 * intensity, 1],
                  opacity: [0.55, 0.9, 0.7, 0.95, 0.55],
                }
          }
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Anel orbital 1 */}
        <motion.div
          className="absolute inset-1 rounded-full border"
          style={{
            borderColor: `${accent}88`,
            boxShadow: `0 0 16px ${accent}, inset 0 0 12px ${accent}44`,
          }}
          animate={
            reduceMotion
              ? undefined
              : { scale: [1, 1.08, 1], rotate: 360, opacity: [0.7, 1, 0.7] }
          }
          transition={{
            scale: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
            opacity: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 18, repeat: Infinity, ease: 'linear' },
          }}
        />

        {/* Anel orbital 2 (contra-rotação) */}
        <motion.div
          className="absolute rounded-full border"
          style={{
            inset: 8,
            borderColor: `${accent}55`,
            borderStyle: 'dashed',
          }}
          animate={reduceMotion ? undefined : { rotate: -360 }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        />

        {/* Núcleo de luz */}
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: 18,
            background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${accent} 35%, ${accent}88 70%, transparent 100%)`,
            boxShadow: `0 0 24px ${accent}, 0 0 60px ${accent}88, inset 0 0 16px rgba(255,255,255,0.6)`,
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  scale: [1, 1.14, 1.02, 1.12, 1],
                  opacity: [0.9, 1, 0.95, 1, 0.9],
                }
          }
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Feixe horizontal (lens flare) */}
        {!reduceMotion && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-px -translate-x-1/2 -translate-y-1/2"
            style={{
              width: 120,
              background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
              boxShadow: `0 0 10px ${accent}`,
            }}
            animate={{
              opacity: [0, 0.6, 0.3, 0.7, 0],
              scaleX: [0.6, 1, 0.85, 1.1, 0.6],
            }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Centelhas orbitais */}
        {!reduceMotion &&
          [0, 1, 2].map((i) => (
            <motion.span
              key={`spark-${i}`}
              className="absolute h-1 w-1 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                background: accent,
                boxShadow: `0 0 8px ${accent}`,
                transformOrigin: '0 0',
              }}
              animate={{
                rotate: 360,
                x: [28, 24, 30, 26, 28],
                y: 0,
              }}
              transition={{
                rotate: {
                  duration: 6 + i * 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: i * 1.2,
                },
              }}
            />
          ))}
      </div>
    </div>
  );
}
