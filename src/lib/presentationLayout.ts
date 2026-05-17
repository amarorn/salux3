import type { ViewportSize } from '@/domain/types';

/** Largura alvo dos cards na apresentação (coordenadas do palco). */
export const UNIFIED_CARD_WIDTH = 920;

/** Escala tipográfica aplicada no painel do FloatingCard. */
export const CARD_TEXT_SCALE = 1.08;

const STAGE_SAFE = 0.9;

export function cardWidthForViewport(viewportWidth: number): number {
  return Math.min(UNIFIED_CARD_WIDTH, Math.floor(viewportWidth * STAGE_SAFE));
}

export function cardMaxHeightForViewport(viewportHeight: number): number {
  return Math.floor(viewportHeight * STAGE_SAFE);
}

export function bannerHeightForViewport(viewportHeight: number): number {
  return Math.min(460, Math.round(viewportHeight * 0.36));
}

/** Escala da câmera para o card (banner + painel) caber inteiro no palco. */
export function cameraFitScale(stepScale: number, viewport: ViewportSize): number {
  const cardW = cardWidthForViewport(viewport.width) * CARD_TEXT_SCALE;
  const cardH = cardMaxHeightForViewport(viewport.height);

  return Math.min(
    stepScale,
    (viewport.width * STAGE_SAFE) / cardW,
    (viewport.height * STAGE_SAFE) / cardH,
  );
}
