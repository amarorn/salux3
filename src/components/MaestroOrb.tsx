import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { usePresentationStore } from '@/store/presentationStore';
import { useCurrentPresentation } from '@/hooks/useCurrentPresentation';
import { theme } from '@/domain/theme';
import { dimensionsForStageAspect } from '@/domain/stageAspect';
import type { NodeKind, PresentationStep } from '@/domain/types';

/**
 * Maestro — orbe mandala com núcleo radiante, anéis orbitais e balão de fala.
 *
 * Comportamento:
 * - Posição diferente em cada slide (permutação determinística sobre uma
 *   tabela de estações seguras, sempre acima ou abaixo do card).
 * - Fala curta extraída do conteúdo do slide (attentionPhrase / closingQuestion
 *   / headline / body / fallback por kind) — nunca repete entre cards.
 * - Balão fica visível enquanto o slide está ativo (sem auto-hide).
 * - Balão é deslocado horizontalmente para nunca sair da tela.
 */

interface Props {
  visible: boolean;
}

const SIZE = 140;
const TOTAL_WIDTH = SIZE;
const ORB_HALF = SIZE / 2;
const BUBBLE_MAX_WIDTH = 320;
const SCREEN_MARGIN = 24;
const GOLD = '#fbbf24';
const GOLD_BRIGHT = '#fde68a';

interface Slot {
  x: number;
  y: number;
}

type SlotName =
  | 'top-center-outer'
  | 'top-left'
  | 'top-right'
  | 'top-left-mid'
  | 'top-right-mid'
  | 'bottom-center-outer'
  | 'bottom-left'
  | 'bottom-right'
  | 'bottom-left-mid'
  | 'bottom-right-mid';

const SLOT_ORDER: SlotName[] = [
  'top-center-outer',
  'top-left',
  'top-right',
  'top-left-mid',
  'top-right-mid',
  'bottom-center-outer',
  'bottom-left',
  'bottom-right',
  'bottom-left-mid',
  'bottom-right-mid',
];

/**
 * Constrói as estações seguras a partir das dimensões do palco. Todas estão
 * acima do topo do card (~y=290) ou abaixo do rodapé (~y=1620) no modo totem
 * — nunca sobrepondo o conteúdo do painel.
 */
function buildSlots(stageWidth: number, stageHeight: number): Record<SlotName, Slot> {
  const cx = stageWidth / 2;
  const left = Math.max(ORB_HALF + SCREEN_MARGIN, stageWidth * 0.2);
  const right = Math.min(stageWidth - ORB_HALF - SCREEN_MARGIN, stageWidth * 0.8);
  const leftMid = cx - (cx - left) * 0.55;
  const rightMid = cx + (right - cx) * 0.55;
  const topInner = Math.max(ORB_HALF + 40, stageHeight * 0.075);
  const topOuter = Math.max(ORB_HALF + 16, stageHeight * 0.055);
  const bottomInner = Math.min(stageHeight - ORB_HALF - 40, stageHeight * 0.92);
  const bottomOuter = Math.min(stageHeight - ORB_HALF - 16, stageHeight * 0.945);
  return {
    'top-center-outer': { x: cx, y: topOuter },
    'top-left': { x: left, y: topInner },
    'top-right': { x: right, y: topInner },
    'top-left-mid': { x: leftMid, y: topInner },
    'top-right-mid': { x: rightMid, y: topInner },
    'bottom-center-outer': { x: cx, y: bottomOuter },
    'bottom-left': { x: left, y: bottomInner },
    'bottom-right': { x: right, y: bottomInner },
    'bottom-left-mid': { x: leftMid, y: bottomInner },
    'bottom-right-mid': { x: rightMid, y: bottomInner },
  };
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Zonas seguras por `stepId`. Cada slide declara quais slots pode usar.
 * O orbe rotaciona entre eles conforme o offset da trilha — assim a mesma
 * "capa" pousa em pontos diferentes quando o usuário troca de trilha.
 */
const STEP_SLOTS: Record<string, SlotName[]> = {
  cover: ['top-center-outer', 'bottom-center-outer'],
  limit: ['bottom-left', 'top-right-mid'],
  'why-agents': ['top-left', 'bottom-right-mid'],
  architecture: ['top-left-mid', 'bottom-right'],
  journey: ['top-right', 'bottom-left'],
  integration: ['top-right-mid', 'bottom-left-mid'],
  governance: ['top-left', 'bottom-right'],
  roadmap: ['bottom-left-mid', 'top-right'],
  'tecnologia-que-age': ['top-left', 'bottom-right'],
  closing: ['top-center-outer', 'bottom-center-outer'],
  capacities: ['top-left', 'bottom-right-mid'],
  pathways: ['top-right', 'bottom-left-mid'],
  'agents-flow': ['top-left-mid', 'bottom-right'],
  results: ['bottom-right', 'top-left'],
  'highlight-context': ['top-center-outer', 'bottom-center-outer'],
  'gestao-results': ['bottom-right', 'top-left'],
};

/** Fallback por tipo de slide quando o `stepId` não tem zona declarada. */
const KIND_SLOTS: Record<NodeKind, SlotName[]> = {
  cover: ['top-center-outer', 'bottom-center-outer'],
  narrative: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
  highlight: ['top-center-outer', 'bottom-center-outer'],
  architecture: ['top-left-mid', 'bottom-right'],
  journey: ['top-right', 'bottom-left'],
  integration: ['top-right-mid', 'bottom-left-mid'],
  governance: ['top-left', 'bottom-right'],
  roadmap: ['bottom-left-mid', 'top-right'],
  closing: ['top-center-outer', 'bottom-center-outer'],
  capacities: ['top-left', 'bottom-right-mid'],
  pathways: ['top-right', 'bottom-left-mid'],
  'agents-flow': ['top-left-mid', 'bottom-right'],
  results: ['bottom-right', 'top-left'],
};

/** Lista de zonas permitidas para o slide atual. */
function allowedSlotsFor(step: PresentationStep): SlotName[] {
  return STEP_SLOTS[step.id] ?? KIND_SLOTS[step.kind] ?? SLOT_ORDER;
}

/** Escolha determinística dentro das zonas permitidas pelo slide. */
function pickSlot(
  slotMap: Record<SlotName, Slot>,
  trackId: string,
  step: PresentationStep,
): Slot {
  const allowed = allowedSlotsFor(step);
  const trackOffset = hashString(trackId);
  const idx = (step.index + trackOffset) % allowed.length;
  const name = allowed[idx] ?? allowed[0]!;
  return slotMap[name];
}

/** Fallback curto por tipo de slide. */
const KIND_WHISPERS: Record<NodeKind, string> = {
  cover: 'Vamos começar por aqui.',
  narrative: 'Olha por aqui.',
  highlight: 'Esse ponto é importante.',
  architecture: 'A estrutura sustenta tudo.',
  journey: 'Cada etapa conta.',
  integration: 'Aqui acontece a virada.',
  governance: 'Tudo se conecta.',
  roadmap: 'O caminho ganha forma.',
  closing: 'Vamos fechar essa ideia.',
  capacities: 'Capacidades que sustentam.',
  pathways: 'Há um caminho para cada dor.',
  'agents-flow': 'Os agentes entram em cena.',
  results: 'O resultado aparece aqui.',
};

function firstSentence(text?: string): string | undefined {
  if (!text) return undefined;
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return undefined;
  const match = cleaned.match(/^[^.!?\n]+[.!?]?/);
  const candidate = (match?.[0] ?? cleaned).trim();
  if (candidate.length <= 140) return candidate;
  return candidate.slice(0, 138).trimEnd() + '…';
}

/** Extrai uma frase curta a partir do conteúdo do slide. */
function pickWhisper(step: PresentationStep): string {
  const candidates = [
    step.content.attentionPhrase,
    step.content.closingQuestion,
    step.content.valueStagesLead,
    step.content.headline,
    step.content.body,
  ];
  for (const c of candidates) {
    const phrase = firstSentence(c);
    if (phrase) return phrase;
  }
  return KIND_WHISPERS[step.kind] ?? 'Olha por aqui.';
}

/**
 * Quanto o balão precisa ser deslocado em X para caber na tela.
 * Positivo = empurra para a direita; negativo = para a esquerda.
 */
function computeBubbleShift(orbX: number, stageWidth: number): number {
  const half = BUBBLE_MAX_WIDTH / 2;
  const leftOver = orbX - half - SCREEN_MARGIN;
  const rightOver = orbX + half - (stageWidth - SCREEN_MARGIN);
  if (leftOver < 0) return -leftOver;
  if (rightOver > 0) return -rightOver;
  return 0;
}

export function MaestroOrb({ visible }: Props) {
  const reduceMotion = useReducedMotion();
  const stepId = usePresentationStore((s) => s.currentStepId);
  const trackId = usePresentationStore((s) => s.currentTrackId);
  const stageAspectMode = usePresentationStore((s) => s.stageAspectMode);
  const { stepsById } = useCurrentPresentation();
  const current = stepsById[stepId];

  const stage = useMemo(() => dimensionsForStageAspect(stageAspectMode), [stageAspectMode]);
  const slotMap = useMemo(
    () => buildSlots(stage.width, stage.height),
    [stage.width, stage.height],
  );

  const accent = current ? theme.accents[current.accent].base : '#54c1ed';
  const whisper = useMemo(() => (current ? pickWhisper(current) : ''), [current]);
  const slot = useMemo(
    () => (current ? pickSlot(slotMap, trackId, current) : slotMap['top-center-outer']),
    [current, slotMap, trackId],
  );

  const placement: 'above' | 'below' = slot.y < stage.height / 2 ? 'below' : 'above';
  const bubbleShift = useMemo(
    () => computeBubbleShift(slot.x, stage.width),
    [slot.x, stage.width],
  );

  // Balão persiste enquanto o slide está ativo — só some na troca de slide
  // (curto delay para reaparecer alinhado à chegada do orbe na nova estação).
  const [showWhisper, setShowWhisper] = useState(false);
  useEffect(() => {
    if (!visible || !whisper) {
      setShowWhisper(false);
      return;
    }
    setShowWhisper(false);
    const start = window.setTimeout(() => setShowWhisper(true), 900);
    return () => window.clearTimeout(start);
  }, [stepId, visible, whisper]);

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
          initial={{ opacity: 0, x: slot.x, y: slot.y, scale: 0.6 }}
          animate={{ opacity: 1, x: slot.x, y: slot.y, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{
            opacity: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
            scale: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
            x: { duration: 1.4, ease: [0.65, 0, 0.35, 1] },
            y: { duration: 1.4, ease: [0.65, 0, 0.35, 1] },
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
              whisperPlacement={placement}
              bubbleShift={bubbleShift}
              stepId={stepId}
            />
          </motion.div>

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
  /** Deslocamento horizontal do balão para manter dentro da tela. */
  shiftX: number;
}

function SpeechBubble({ text, accent, placement, reduceMotion, shiftX }: SpeechBubbleProps) {
  const [typed, setTyped] = useState(reduceMotion ? text : '');
  useEffect(() => {
    if (reduceMotion) {
      setTyped(text);
      return;
    }
    setTyped('');
    let i = 0;
    const speed = Math.max(22, Math.min(50, 1500 / Math.max(text.length, 1)));
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
      initial={{ opacity: 0, y: isBelow ? -8 : 8, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: isBelow ? -4 : 4, scale: 0.96 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="absolute"
      style={{
        left: '50%',
        transform: `translateX(calc(-50% + ${shiftX}px))`,
        maxWidth: BUBBLE_MAX_WIDTH,
        width: 'max-content',
        ...(isBelow
          ? { top: '100%', marginTop: 18 }
          : { bottom: '100%', marginBottom: 18 }),
      }}
    >
      {/* Cauda apontando para o orbe — fica ancorada na posição original do
          orbe (compensa o deslocamento horizontal do balão). */}
      <span
        aria-hidden
        className="absolute"
        style={{
          left: '50%',
          transform: `translateX(calc(-50% - ${shiftX}px))`,
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
      <span
        aria-hidden
        className="absolute"
        style={{
          left: '50%',
          transform: `translateX(calc(-50% - ${shiftX}px))`,
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
        className="relative rounded-2xl border px-4 py-2.5 text-[12px] font-medium leading-snug text-white/95 backdrop-blur-md"
        style={{
          borderColor: `${accent}66`,
          background: `linear-gradient(135deg, ${accent}1f 0%, rgba(8,12,20,0.95) 100%)`,
          boxShadow: `0 10px 28px -6px ${accent}55, 0 0 0 1px ${accent}22, inset 0 1px 0 rgba(255,255,255,0.08)`,
          minWidth: 60,
          whiteSpace: 'pre-wrap',
        }}
      >
        <span>{typed}</span>
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
  whisperPlacement: 'above' | 'below';
  bubbleShift: number;
  stepId: string;
}

function MaestroVisual({
  accent,
  intensity,
  reduceMotion,
  whisper,
  showWhisper,
  whisperPlacement,
  bubbleShift,
  stepId,
}: MaestroVisualProps) {
  return (
    <div className="relative" style={{ width: TOTAL_WIDTH, height: SIZE }}>
      <AnimatePresence>
        {showWhisper && whisper && (
          <SpeechBubble
            key={`whisper-${stepId}`}
            text={whisper}
            accent={accent}
            placement={whisperPlacement}
            reduceMotion={reduceMotion}
            shiftX={bubbleShift}
          />
        )}
      </AnimatePresence>

      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: SIZE, height: SIZE }}
      >
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

        <motion.svg
          viewBox="0 0 200 200"
          width={SIZE}
          height={SIZE}
          className="absolute inset-0"
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        >
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
          <circle
            cx="100"
            cy="100"
            r="74"
            fill="none"
            stroke={accent}
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />
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
