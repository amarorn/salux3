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

const SIZE = 160;
const TOTAL_WIDTH = SIZE;
const ORB_HALF = SIZE / 2;
const BUBBLE_MAX_WIDTH = 320;
const SCREEN_MARGIN = 150;
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
 * Caixa proibida (card central) e corredores permitidos para o orbe.
 * O orbe nunca entra na caixa do card; circula pelos corredores top/bottom/left/right.
 */
const CARD_WIDTH = 920;
const CARD_GAP = 24;

function buildForbiddenBox(stageWidth: number, stageHeight: number) {
  const cardH = Math.min(stageHeight * 0.72, 1400);
  const left = (stageWidth - CARD_WIDTH) / 2;
  const top = (stageHeight - cardH) / 2;
  return {
    left,
    right: left + CARD_WIDTH,
    top,
    bottom: top + cardH,
  };
}

/**
 * Pontos da órbita contínua, no sentido horário. Atravessa todos os
 * corredores disponíveis (topo, lateral direita, fundo, lateral esquerda),
 * saltando lateralmente quando o corredor é mais estreito que o orbe.
 */
function buildOrbitWaypoints(stageWidth: number, stageHeight: number): Slot[] {
  const box = buildForbiddenBox(stageWidth, stageHeight);
  const m = ORB_HALF + SCREEN_MARGIN;
  const topY = Math.max(m, box.top / 2);
  const bottomY = Math.min(stageHeight - m, (box.bottom + stageHeight) / 2);
  const leftX = Math.max(m, box.left / 2);
  const rightX = Math.min(stageWidth - m, (box.right + stageWidth) / 2);
  const cx = stageWidth / 2;
  // Faixas topo/fundo podem usar toda a largura disponível: o card está
  // verticalmente separado, então não há conflito horizontal nessas faixas.
  const xLeftEdge = m;
  const xRightEdge = stageWidth - m;
  const lateralFits = box.left - CARD_GAP >= m;
  const yTopInner = box.top + (box.bottom - box.top) * 0.32;
  const yBotInner = box.top + (box.bottom - box.top) * 0.68;

  const points: Slot[] = [];
  // Topo: esquerda → centro → direita
  points.push({ x: xLeftEdge, y: topY });
  points.push({ x: cx, y: topY });
  points.push({ x: xRightEdge, y: topY });
  if (lateralFits) {
    points.push({ x: rightX, y: yTopInner });
    points.push({ x: rightX, y: yBotInner });
  }
  // Fundo: direita → centro → esquerda
  points.push({ x: xRightEdge, y: bottomY });
  points.push({ x: cx, y: bottomY });
  points.push({ x: xLeftEdge, y: bottomY });
  if (lateralFits) {
    points.push({ x: leftX, y: yBotInner });
    points.push({ x: leftX, y: yTopInner });
  }
  return points;
}

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

/** Slides em que o Maestro voa ao centro do palco e decompõe em fragmentos para cada ponta. */
const PILGRIMAGE_STEP_IDS = new Set<string>(['tecnologia-que-age']);
const PILGRIMAGE_ARM_MS = 2800;
const PILGRIMAGE_FLY_MS = 1150;
const PILGRIMAGE_BURST_MS = 920;
const PILGRIMAGE_RETURN_MS = 1380;

type PilgrimagePhase = 'off' | 'fly' | 'burst' | 'back';

const RADIAL_SHARD_COUNT = 8;

/**
 * Pulso reativo de toque/clique — cicla determinísticamente entre 5 variantes
 * para que cada interação seja visualmente diferente.
 */
function TapPulse({ pulseKey, accent }: { pulseKey: number; accent: string }) {
  const variant = pulseKey % 5;
  const ease = [0.16, 1, 0.3, 1] as const;

  // 0 — HUD reticle: cruz + cantos + dois anéis
  if (variant === 0) {
    return (
      <>
        <motion.span
          key={`hud-ring-${pulseKey}`}
          aria-hidden
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
          initial={{ opacity: 0.9, scale: 0.4 }}
          animate={{ opacity: 0, scale: 1.9 }}
          transition={{ duration: 0.45, ease }}
          style={{
            width: 110,
            height: 110,
            border: `1.5px solid ${GOLD_BRIGHT}`,
            boxShadow: `0 0 22px ${GOLD}cc, inset 0 0 12px ${accent}66`,
          }}
        />
        <motion.span
          key={`hud-cross-h-${pulseKey}`}
          aria-hidden
          className="absolute -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scaleX: 0.2 }}
          animate={{ opacity: [0, 1, 0], scaleX: 1.4 }}
          transition={{ duration: 0.55, ease }}
          style={{
            width: 220,
            height: 1.5,
            background: `linear-gradient(90deg, transparent, ${GOLD_BRIGHT}, ${accent}, ${GOLD_BRIGHT}, transparent)`,
            boxShadow: `0 0 12px ${GOLD}cc`,
          }}
        />
        <motion.span
          key={`hud-cross-v-${pulseKey}`}
          aria-hidden
          className="absolute -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scaleY: 0.2 }}
          animate={{ opacity: [0, 0.9, 0], scaleY: 1.3 }}
          transition={{ duration: 0.55, ease }}
          style={{
            width: 1.5,
            height: 200,
            background: `linear-gradient(180deg, transparent, ${GOLD_BRIGHT}, ${accent}, ${GOLD_BRIGHT}, transparent)`,
            boxShadow: `0 0 12px ${GOLD}cc`,
          }}
        />
        {[
          { x: -1, y: -1 },
          { x: 1, y: -1 },
          { x: -1, y: 1 },
          { x: 1, y: 1 },
        ].map((c, i) => (
          <motion.span
            key={`hud-bracket-${pulseKey}-${i}`}
            aria-hidden
            className="absolute"
            initial={{ opacity: 0, x: c.x * 26, y: c.y * 26, scale: 0.4 }}
            animate={{ opacity: [0, 1, 0], x: c.x * 56, y: c.y * 56, scale: 1 }}
            transition={{ duration: 0.6, ease, delay: 0.04 }}
            style={{
              left: 0,
              top: 0,
              width: 8,
              height: 8,
              borderTop: c.y === -1 ? `1.5px solid ${accent}` : 'none',
              borderBottom: c.y === 1 ? `1.5px solid ${accent}` : 'none',
              borderLeft: c.x === -1 ? `1.5px solid ${accent}` : 'none',
              borderRight: c.x === 1 ? `1.5px solid ${accent}` : 'none',
              boxShadow: `0 0 8px ${accent}cc`,
              transform: `translate(-50%, -50%)`,
            }}
          />
        ))}
      </>
    );
  }

  // 1 — Triplo choque: 3 anéis concêntricos com timings escalonados
  if (variant === 1) {
    return (
      <>
        {[0, 0.08, 0.18].map((delay, i) => (
          <motion.span
            key={`shock-${pulseKey}-${i}`}
            aria-hidden
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            initial={{ opacity: 0.85 - i * 0.2, scale: 0.4 }}
            animate={{ opacity: 0, scale: 2.4 + i * 0.6 }}
            transition={{ duration: 0.7 + i * 0.2, ease, delay }}
            style={{
              width: 100 + i * 20,
              height: 100 + i * 20,
              border: `${1.5 - i * 0.3}px solid ${i === 0 ? GOLD_BRIGHT : accent}`,
              boxShadow: `0 0 ${20 - i * 4}px ${i === 0 ? GOLD : accent}aa`,
            }}
          />
        ))}
      </>
    );
  }

  // 2 — Faíscas radiais: 12 partículas explodindo em todas as direções
  if (variant === 2) {
    return (
      <>
        {Array.from({ length: 12 }).map((_, i) => {
          const deg = i * 30;
          const rad = (deg * Math.PI) / 180;
          const dist = 80 + (i % 3) * 18;
          const isGold = i % 2 === 0;
          return (
            <motion.span
              key={`spark-${pulseKey}-${i}`}
              aria-hidden
              className="absolute rounded-full"
              initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
              animate={{
                x: Math.cos(rad) * dist,
                y: Math.sin(rad) * dist,
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 0.2],
              }}
              transition={{ duration: 0.7, ease, delay: 0.02 + i * 0.018 }}
              style={{
                left: 0,
                top: 0,
                width: 3.5,
                height: 3.5,
                background: isGold ? GOLD_BRIGHT : accent,
                boxShadow: `0 0 8px ${isGold ? GOLD : accent}, 0 0 16px ${isGold ? GOLD : accent}aa`,
              }}
            />
          );
        })}
        <motion.span
          key={`spark-core-${pulseKey}`}
          aria-hidden
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
          initial={{ opacity: 0.9, scale: 0.2 }}
          animate={{ opacity: 0, scale: 1.6 }}
          transition={{ duration: 0.4, ease }}
          style={{
            width: 80,
            height: 80,
            background: `radial-gradient(circle, ${GOLD_BRIGHT}aa, ${GOLD}55 40%, transparent 70%)`,
            filter: 'blur(2px)',
          }}
        />
      </>
    );
  }

  // 3 — Hexágono rotacional: forma geométrica + glow
  if (variant === 3) {
    return (
      <>
        <motion.div
          key={`hex-${pulseKey}`}
          aria-hidden
          className="absolute -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0.3, rotate: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.3, 1.3, 2], rotate: 60 }}
          transition={{ duration: 0.85, ease }}
          style={{ width: 110, height: 110 }}
        >
          <svg viewBox="0 0 100 100" width="110" height="110">
            <polygon
              points="50,5 90,27 90,73 50,95 10,73 10,27"
              fill="none"
              stroke={GOLD_BRIGHT}
              strokeWidth="1.5"
              style={{ filter: `drop-shadow(0 0 6px ${GOLD}cc)` }}
            />
            <polygon
              points="50,18 78,33 78,67 50,82 22,67 22,33"
              fill="none"
              stroke={accent}
              strokeWidth="0.8"
              style={{ filter: `drop-shadow(0 0 4px ${accent}aa)` }}
            />
          </svg>
        </motion.div>
        <motion.div
          key={`hex-counter-${pulseKey}`}
          aria-hidden
          className="absolute -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
          animate={{ opacity: [0, 0.8, 0], scale: 1.6, rotate: -90 }}
          transition={{ duration: 0.85, ease, delay: 0.05 }}
          style={{ width: 70, height: 70 }}
        >
          <svg viewBox="0 0 100 100" width="70" height="70">
            <polygon
              points="50,10 85,30 85,70 50,90 15,70 15,30"
              fill={`${GOLD}22`}
              stroke={`${accent}cc`}
              strokeWidth="1"
              style={{ filter: `drop-shadow(0 0 5px ${accent}aa)` }}
            />
          </svg>
        </motion.div>
      </>
    );
  }

  // 4 — Raios divergentes: 4 traços diagonais como faíscas elétricas
  return (
    <>
      {[30, 120, 210, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <motion.span
            key={`bolt-${pulseKey}-${i}`}
            aria-hidden
            className="absolute -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scaleX: 0.1, rotate: deg }}
            animate={{
              opacity: [0, 1, 0.7, 0],
              scaleX: [0.1, 1, 1.2, 1.5],
            }}
            transition={{ duration: 0.55, ease, delay: 0.02 + i * 0.04 }}
            style={{
              left: Math.cos(rad) * 14,
              top: Math.sin(rad) * 14,
              width: 90,
              height: 1.5,
              background: `linear-gradient(90deg, ${GOLD_BRIGHT} 0%, ${accent} 60%, transparent 100%)`,
              boxShadow: `0 0 10px ${GOLD}cc`,
              transformOrigin: 'left center',
            }}
          />
        );
      })}
      <motion.span
        key={`bolt-core-${pulseKey}`}
        aria-hidden
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        initial={{ opacity: 1, scale: 0.2 }}
        animate={{ opacity: 0, scale: 1.4 }}
        transition={{ duration: 0.45, ease }}
        style={{
          width: 50,
          height: 50,
          background: `radial-gradient(circle, ${GOLD_BRIGHT}, ${accent}66 50%, transparent 75%)`,
          filter: 'blur(1px)',
        }}
      />
      <motion.span
        key={`bolt-ring-${pulseKey}`}
        aria-hidden
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        initial={{ opacity: 0.6, scale: 0.6 }}
        animate={{ opacity: 0, scale: 2.6 }}
        transition={{ duration: 0.7, ease, delay: 0.05 }}
        style={{
          width: 100,
          height: 100,
          border: `1px dashed ${accent}`,
          boxShadow: `0 0 14px ${accent}aa`,
        }}
      />
    </>
  );
}

function MaestroRadialShards({
  accent,
  burstKey,
  stageW,
  stageH,
}: {
  accent: string;
  burstKey: number;
  stageW: number;
  stageH: number;
}) {
  const dist = Math.min(stageW, stageH) * 0.4;
  return (
    <>
      {Array.from({ length: RADIAL_SHARD_COUNT }).map((_, i) => {
        const angle = (i / RADIAL_SHARD_COUNT) * Math.PI * 2 - Math.PI / 2;
        const w = 9 + (i % 3);
        const h = 14 + (i % 4) * 2;
        return (
          <motion.span
            key={`shard-${burstKey}-${i}`}
            className="absolute rounded-full"
            style={{
              width: w,
              height: h,
              left: -w / 2,
              top: -h / 2,
              background: `linear-gradient(${135 + i * 25}deg, ${GOLD_BRIGHT} 0%, ${GOLD} 45%, ${accent} 100%)`,
              boxShadow: `0 0 16px ${GOLD}aa, 0 0 4px ${accent}`,
            }}
            initial={{ x: 0, y: 0, scale: 0.2, opacity: 0, rotate: 0 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              scale: [0.2, 1.15, 0.35],
              opacity: [0, 1, 0.9, 0],
              rotate: i % 2 === 0 ? 220 : -200,
            }}
            transition={{ duration: 0.88, ease: [0.16, 1, 0.28, 1], delay: i * 0.025 }}
          />
        );
      })}
      {Array.from({ length: RADIAL_SHARD_COUNT }).map((_, i) => {
        const angle = (i / RADIAL_SHARD_COUNT) * Math.PI * 2 - Math.PI / 2 + Math.PI / RADIAL_SHARD_COUNT;
        const dist2 = dist * 0.72;
        const tiny = 3 + (i % 2);
        return (
          <motion.span
            key={`spark-${burstKey}-${i}`}
            className="absolute rounded-full"
            style={{
              width: tiny,
              height: tiny,
              left: -tiny / 2,
              top: -tiny / 2,
              background: i % 2 === 0 ? GOLD : accent,
              boxShadow: `0 0 10px ${GOLD}`,
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x: Math.cos(angle) * dist2,
              y: Math.sin(angle) * dist2,
              opacity: [0, 0.95, 0],
              scale: [0, 1.4, 0.2],
            }}
            transition={{ duration: 0.75, ease: [0.12, 0.95, 0.2, 1], delay: 0.08 + i * 0.03 }}
          />
        );
      })}
    </>
  );
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
  const orbit = useMemo(
    () => buildOrbitWaypoints(stage.width, stage.height),
    [stage.width, stage.height],
  );

  const accent = current ? theme.accents[current.accent].base : '#54c1ed';
  const whisper = useMemo(() => (current ? pickWhisper(current) : ''), [current]);
  // Fase determinística por slide: o orbe começa num ponto diferente da órbita.
  const orbitRotated = useMemo(() => {
    if (!current) return orbit;
    const offset = (hashString(`${trackId}|${current.id}`) + current.index) % orbit.length;
    return [...orbit.slice(offset), ...orbit.slice(0, offset)];
  }, [orbit, current, trackId]);
  const slot = useMemo(
    () => orbitRotated[0] ?? slotMap['top-center-outer'],
    [orbitRotated, slotMap],
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

  const [pilgrimage, setPilgrimage] = useState<PilgrimagePhase>('off');
  const [burstKey, setBurstKey] = useState(0);

  // Pulso reativo a cada clique/toque do utilizador (independente de mudar slide).
  const [pulseKey, setPulseKey] = useState(0);
  useEffect(() => {
    if (!visible || reduceMotion) return;
    const onTap = () => setPulseKey((k) => k + 1);
    window.addEventListener('pointerdown', onTap, { passive: true });
    return () => window.removeEventListener('pointerdown', onTap);
  }, [visible, reduceMotion]);

  const stageCenter = useMemo(
    () => ({ x: stage.width * 0.5, y: stage.height * 0.43 }),
    [stage.width, stage.height],
  );

  const pilgrimageActive =
    Boolean(visible && current && PILGRIMAGE_STEP_IDS.has(current.id) && !reduceMotion);

  useEffect(() => {
    if (!pilgrimageActive) {
      setPilgrimage('off');
      return;
    }
    setPilgrimage('off');
    const arm = window.setTimeout(() => setPilgrimage('fly'), PILGRIMAGE_ARM_MS);
    return () => window.clearTimeout(arm);
  }, [stepId, visible, current?.id, pilgrimageActive]);

  useEffect(() => {
    if (pilgrimage !== 'fly') return;
    const t = window.setTimeout(() => {
      setBurstKey((k) => k + 1);
      setPilgrimage('burst');
    }, PILGRIMAGE_FLY_MS);
    return () => window.clearTimeout(t);
  }, [pilgrimage]);

  useEffect(() => {
    if (pilgrimage !== 'burst') return;
    const t = window.setTimeout(() => setPilgrimage('back'), PILGRIMAGE_BURST_MS);
    return () => window.clearTimeout(t);
  }, [pilgrimage]);

  useEffect(() => {
    if (pilgrimage !== 'back') return;
    const t = window.setTimeout(() => setPilgrimage('off'), PILGRIMAGE_RETURN_MS);
    return () => window.clearTimeout(t);
  }, [pilgrimage]);

  const targetSlot = pilgrimage === 'fly' || pilgrimage === 'burst' ? stageCenter : slot;

  const moveTransition = useMemo(() => {
    if (pilgrimage === 'back') return { duration: 1.18, ease: [0.22, 1, 0.36, 1] as const };
    if (pilgrimage === 'fly') return { duration: 1.08, ease: [0.16, 1, 0.3, 1] as const };
    return { duration: 1.65, ease: [0.16, 1, 0.3, 1] as const };
  }, [pilgrimage]);

  const whisperDuringPilgrimage = pilgrimage === 'off';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="maestro"
          className="pointer-events-none absolute z-30 select-none"
          style={{ top: 0, left: 0 }}
          initial={{ opacity: 0, x: slot.x, y: slot.y, scale: 0.6 }}
          animate={{ opacity: 1, x: targetSlot.x, y: targetSlot.y, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{
            opacity: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
            scale: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
            x: moveTransition,
            y: moveTransition,
          }}
        >
          <motion.div
            animate={
              reduceMotion || pilgrimage !== 'off'
                ? undefined
                : {
                    x: [0, 6, -4, 8, -2, 0],
                    y: [0, -5, 4, -3, 6, 0],
                  }
            }
            transition={{ duration: 9.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative -translate-x-1/2 -translate-y-1/2"
            style={{ width: TOTAL_WIDTH, height: SIZE }}
          >
            <MaestroVisual
              accent={accent}
              intensity={intensity}
              reduceMotion={Boolean(reduceMotion)}
              whisper={whisper}
              showWhisper={showWhisper && whisperDuringPilgrimage}
              whisperPlacement={placement}
              bubbleShift={bubbleShift}
              stepId={stepId}
              hideCore={pilgrimage === 'burst'}
            />
            {pilgrimage === 'burst' && (
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-0 w-0 overflow-visible"
                style={{ transform: 'translate(-50%, -50%)' }}
              >
                <MaestroRadialShards
                  accent={accent}
                  burstKey={burstKey}
                  stageW={stage.width}
                  stageH={stage.height}
                />
              </div>
            )}
          </motion.div>

          {!reduceMotion && pilgrimage === 'off' && (
            <>
              {/* Onda dourada principal — colapso + expansão suave */}
              <motion.span
                key={`arrival-glow-${stepId}`}
                aria-hidden
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                initial={{ opacity: 0.85, scale: 0.2 }}
                animate={{ opacity: 0, scale: 3.6 }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  width: 140,
                  height: 140,
                  background: `radial-gradient(circle, ${GOLD}88 0%, ${GOLD}33 40%, transparent 75%)`,
                  filter: 'blur(2px)',
                }}
              />
              {/* Anel fino accent — assinatura cromática do slide */}
              <motion.span
                key={`arrival-ring-${stepId}`}
                aria-hidden
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: [0, 0.9, 0], scale: 2.4 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], times: [0, 0.4, 1] }}
                style={{
                  width: 160,
                  height: 160,
                  border: `1.5px solid ${accent}`,
                  boxShadow: `0 0 24px ${accent}88, inset 0 0 18px ${accent}55`,
                }}
              />
              {/* Faíscas radiais — 6 partículas correm para fora */}
              {[0, 60, 120, 180, 240, 300].map((deg, i) => {
                const rad = (deg * Math.PI) / 180;
                const dist = 70 + (i % 2) * 18;
                return (
                  <motion.span
                    key={`arrival-spark-${stepId}-${i}`}
                    aria-hidden
                    className="absolute rounded-full"
                    initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
                    animate={{
                      x: Math.cos(rad) * dist,
                      y: Math.sin(rad) * dist,
                      opacity: [0, 1, 0],
                      scale: [0.4, 1.1, 0.2],
                    }}
                    transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.05 + i * 0.04 }}
                    style={{
                      left: 0,
                      top: 0,
                      width: 4,
                      height: 4,
                      background: i % 2 === 0 ? GOLD_BRIGHT : accent,
                      boxShadow: `0 0 10px ${i % 2 === 0 ? GOLD : accent}, 0 0 18px ${i % 2 === 0 ? GOLD : accent}88`,
                    }}
                  />
                );
              })}
              {/* Pulso reativo — varia entre 5 estilos a cada clique/toque */}
              {pulseKey > 0 && (
                <TapPulse pulseKey={pulseKey} accent={accent} />
              )}
              {/* Lens flare horizontal — linha brilhante de assinatura */}
              <motion.span
                key={`arrival-flare-${stepId}`}
                aria-hidden
                className="absolute -translate-x-1/2 -translate-y-1/2"
                initial={{ opacity: 0, scaleX: 0.2 }}
                animate={{ opacity: [0, 0.85, 0], scaleX: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  width: 180,
                  height: 1.5,
                  background: `linear-gradient(90deg, transparent, ${GOLD_BRIGHT}, ${accent}, transparent)`,
                  boxShadow: `0 0 10px ${GOLD}cc`,
                }}
              />
            </>
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
                borderBottom: `7px solid rgba(8,12,20,0.5)`,
              }
            : {
                bottom: -5,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: `7px solid rgba(8,12,20,0.5)`,
              }),
        }}
      />

      <motion.div
        className="relative rounded-2xl border px-4 py-2.5 text-[12px] font-medium leading-snug text-white/90 backdrop-blur-md"
        style={{
          borderColor: `${accent}44`,
          background: `linear-gradient(135deg, ${accent}14 0%, rgba(8,12,20,0.42) 100%)`,
          boxShadow: `0 10px 28px -6px ${accent}33, 0 0 0 1px ${accent}18, inset 0 1px 0 rgba(255,255,255,0.06)`,
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
      </motion.div>
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
  /** Esconde o núcleo do orbe (ex.: durante decomposição radial). */
  hideCore?: boolean;
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
  hideCore = false,
}: MaestroVisualProps) {
  return (
    <motion.div className="relative" style={{ width: TOTAL_WIDTH, height: SIZE }}>
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

      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: SIZE, height: SIZE }}
        animate={{ opacity: hideCore ? 0 : 1, scale: hideCore ? 0.85 : 1 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
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

        {/* Rim light — borda iluminada de um lado (depth) */}
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: 30,
            background: `radial-gradient(ellipse at 30% 28%, ${GOLD_BRIGHT}66 0%, ${GOLD}22 18%, transparent 38%)`,
            mixBlendMode: 'screen',
          }}
          animate={
            reduceMotion
              ? undefined
              : { opacity: [0.6, 0.9, 0.7, 0.95, 0.6] }
          }
          transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Anel iridescente cromático — assinatura futurista, rotação lenta */}
        {!reduceMotion && (
          <motion.div
            className="absolute rounded-full"
            style={{
              inset: 26,
              background: `conic-gradient(from 0deg, ${accent}00, ${accent}55 18%, ${GOLD_BRIGHT}88 32%, ${accent}55 48%, ${accent}00 64%, ${GOLD}33 82%, ${accent}00 100%)`,
              maskImage:
                'radial-gradient(circle, transparent 62%, black 68%, black 78%, transparent 84%)',
              WebkitMaskImage:
                'radial-gradient(circle, transparent 62%, black 68%, black 78%, transparent 84%)',
              filter: 'blur(0.4px)',
              opacity: 0.85,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* Specular highlight — ponto brilhante simulando luz vinda de cima/esquerda */}
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: 48,
            background: `radial-gradient(ellipse at 28% 25%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 8%, transparent 22%)`,
            mixBlendMode: 'screen',
          }}
          animate={
            reduceMotion
              ? undefined
              : { opacity: [0.75, 1, 0.85, 1, 0.75] }
          }
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Heat-haze shimmer — distorção sutil que respira */}
        {!reduceMotion && (
          <motion.div
            className="pointer-events-none absolute rounded-full"
            style={{
              inset: -20,
              background: `radial-gradient(circle, transparent 60%, ${accent}10 72%, transparent 86%)`,
              filter: 'blur(8px)',
            }}
            animate={{ scale: [1, 1.04, 0.98, 1.05, 1], opacity: [0.4, 0.7, 0.5, 0.75, 0.4] }}
            transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

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
      </motion.div>
    </motion.div>
  );
}
