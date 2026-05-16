export interface MaestroElementTarget {
  cx: number;
  cy: number;
  width: number;
  height: number;
  borderRadius: number;
}

export const MAESTRO_CARD_WIDTH = 920;

export interface MaestroForbiddenBox {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export function buildMaestroForbiddenBox(
  stageWidth: number,
  stageHeight: number,
  padding = 0,
): MaestroForbiddenBox {
  const cardH = Math.min(stageHeight * 0.72, 1400);
  const left = (stageWidth - MAESTRO_CARD_WIDTH) / 2;
  const top = (stageHeight - cardH) / 2;
  return {
    left: left - padding,
    right: left + MAESTRO_CARD_WIDTH + padding,
    top: top - padding,
    bottom: top + cardH + padding,
  };
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function parseBorderRadiusPx(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 12;
}

function isVisibleAnchor(el: HTMLElement): boolean {
  const r = el.getBoundingClientRect();
  if (r.width < 8 || r.height < 8) return false;
  const style = getComputedStyle(el);
  return style.visibility !== 'hidden' && style.display !== 'none' && style.opacity !== '0';
}

function measureElement(
  el: HTMLElement,
  stageRoot: HTMLElement,
  stageLogicalWidth: number,
): MaestroElementTarget {
  const stageRect = stageRoot.getBoundingClientRect();
  const ratio = stageLogicalWidth / stageRect.width;
  const r = el.getBoundingClientRect();
  const style = getComputedStyle(el);

  return {
    cx: (r.left + r.width / 2 - stageRect.left) * ratio,
    cy: (r.top + r.height / 2 - stageRect.top) * ratio,
    width: Math.min(r.width * ratio, stageLogicalWidth * 0.92),
    height: Math.min(r.height * ratio, stageLogicalWidth * 0.55),
    borderRadius: parseBorderRadiusPx(style.borderRadius) * ratio,
  };
}

/** Centro do orbe ou eco não pode ficar dentro da caixa do card. */
export function targetOverlapsForbidden(
  target: MaestroElementTarget,
  forbidden: MaestroForbiddenBox,
  orbMargin = 0,
): boolean {
  const mx = orbMargin;
  return (
    target.cx > forbidden.left - mx &&
    target.cx < forbidden.right + mx &&
    target.cy > forbidden.top - mx &&
    target.cy < forbidden.bottom + mx
  );
}

export function pointInsideForbidden(
  x: number,
  y: number,
  forbidden: MaestroForbiddenBox,
): boolean {
  return (
    x > forbidden.left && x < forbidden.right && y > forbidden.top && y < forbidden.bottom
  );
}

/** Empurra o orbe para o corredor mais próximo fora do card. */
export function clampSlotToCorridor(
  slot: { x: number; y: number },
  stageWidth: number,
  stageHeight: number,
  orbHalf: number,
  screenMargin: number,
): { x: number; y: number } {
  const pad = orbHalf + 24;
  const forbidden = buildMaestroForbiddenBox(stageWidth, stageHeight, pad);
  let { x, y } = slot;

  if (pointInsideForbidden(x, y, forbidden)) {
    const distTop = y - forbidden.top;
    const distBottom = forbidden.bottom - y;
    const distLeft = x - forbidden.left;
    const distRight = forbidden.right - x;
    const min = Math.min(distTop, distBottom, distLeft, distRight);
    if (min === distTop) y = forbidden.top;
    else if (min === distBottom) y = forbidden.bottom;
    else if (min === distLeft) x = forbidden.left;
    else x = forbidden.right;
  }

  const m = orbHalf + screenMargin;
  return {
    x: Math.max(m, Math.min(stageWidth - m, x)),
    y: Math.max(orbHalf + 16, Math.min(stageHeight - orbHalf - 16, y)),
  };
}

/**
 * Escolhe um `data-maestro-anchor` visível. Só devolve alvo se o eco puder
 * assinalar o elemento sem levar o orbe para dentro do card.
 */
export function pickMaestroAnchor(
  stageRoot: HTMLElement,
  stageLogicalWidth: number,
  _stageLogicalHeight: number,
  stepId: string,
  _orbHalf: number,
): MaestroElementTarget | null {
  const anchors = Array.from(
    stageRoot.querySelectorAll<HTMLElement>('[data-maestro-anchor]'),
  ).filter(isVisibleAnchor);

  if (!anchors.length) return null;

  const sorted = [...anchors].sort((a, b) => {
    const pa = Number(a.dataset.maestroAnchorPriority ?? 0);
    const pb = Number(b.dataset.maestroAnchorPriority ?? 0);
    return pb - pa;
  });

  const start = hashString(stepId) % sorted.length;
  const el = sorted[start]!;
  return measureElement(el, stageRoot, stageLogicalWidth);
}

export type MaestroBubblePlacement = 'above' | 'below' | 'left' | 'right';

export interface MaestroBubbleLayout {
  placement: MaestroBubblePlacement;
  shiftX: number;
  shiftY: number;
  maxWidth: number;
}

const BUBBLE_ORB_R = 80;
const BUBBLE_GAP = 22;
const BUBBLE_STAGE_MARGIN = 32;

/**
 * Escolhe onde o balão de fala deve abrir para permanecer legível dentro do palco.
 */
export function computeBubbleLayout(
  orbX: number,
  orbY: number,
  stageW: number,
  stageH: number,
  text: string,
  maxBubbleW = 320,
): MaestroBubbleLayout {
  const maxWidth = Math.min(maxBubbleW, stageW - BUBBLE_STAGE_MARGIN * 2);
  const lines = Math.max(1, Math.ceil(text.length / 38));
  const estH = 28 + lines * 20;
  const estW = Math.min(maxWidth, Math.max(148, text.length * 5.4));

  const room = {
    above: orbY - BUBBLE_ORB_R - BUBBLE_GAP - BUBBLE_STAGE_MARGIN,
    below: stageH - orbY - BUBBLE_ORB_R - BUBBLE_GAP - BUBBLE_STAGE_MARGIN,
    left: orbX - BUBBLE_ORB_R - BUBBLE_GAP - BUBBLE_STAGE_MARGIN,
    right: stageW - orbX - BUBBLE_ORB_R - BUBBLE_GAP - BUBBLE_STAGE_MARGIN,
  };

  type Candidate = { placement: MaestroBubblePlacement; room: number; fits: boolean };
  const vertical: Candidate[] = [
    { placement: 'above', room: room.above, fits: room.above >= estH },
    { placement: 'below', room: room.below, fits: room.below >= estH },
  ];
  const horizontal: Candidate[] = [
    { placement: 'left', room: room.left, fits: room.left >= estW },
    { placement: 'right', room: room.right, fits: room.right >= estW },
  ];

  const all = [...vertical, ...horizontal].sort((a, b) => {
    if (a.fits !== b.fits) return a.fits ? -1 : 1;
    return b.room - a.room;
  });

  let placement = all[0]?.placement ?? 'above';

  if (orbY > stageH - BUBBLE_STAGE_MARGIN - estH - BUBBLE_ORB_R - BUBBLE_GAP) {
    placement = 'above';
  }
  if (orbY < BUBBLE_STAGE_MARGIN + estH + BUBBLE_ORB_R + BUBBLE_GAP) {
    placement = 'below';
  }
  if (
    orbX > stageW * 0.68 &&
    (placement === 'above' || placement === 'below') &&
    room.left >= estW * 0.85
  ) {
    placement = 'left';
  }
  if (
    orbX < stageW * 0.32 &&
    (placement === 'above' || placement === 'below') &&
    room.right >= estW * 0.85
  ) {
    placement = 'right';
  }

  let shiftX = 0;
  let shiftY = 0;
  const halfW = estW / 2;

  if (placement === 'above' || placement === 'below') {
    if (orbX - halfW < BUBBLE_STAGE_MARGIN) shiftX = BUBBLE_STAGE_MARGIN - (orbX - halfW);
    if (orbX + halfW > stageW - BUBBLE_STAGE_MARGIN) {
      shiftX = stageW - BUBBLE_STAGE_MARGIN - (orbX + halfW);
    }
  } else {
    const halfH = estH / 2;
    if (orbY - halfH < BUBBLE_STAGE_MARGIN) shiftY = BUBBLE_STAGE_MARGIN - (orbY - halfH);
    if (orbY + halfH > stageH - BUBBLE_STAGE_MARGIN) {
      shiftY = stageH - BUBBLE_STAGE_MARGIN - (orbY + halfH);
    }
  }

  return { placement, shiftX, shiftY, maxWidth };
}

/** @deprecated use pickMaestroAnchor */
export function measureMaestroAnchor(
  stageRoot: HTMLElement,
  stageLogicalWidth: number,
  stepId: string,
): MaestroElementTarget | null {
  const h = stageRoot.getBoundingClientRect().height;
  const ratio =
    stageRoot.getBoundingClientRect().width > 0
      ? stageLogicalWidth / stageRoot.getBoundingClientRect().width
      : 1;
  return pickMaestroAnchor(stageRoot, stageLogicalWidth, h * ratio, stepId, 80);
}
