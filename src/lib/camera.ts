import type { CameraState, PresentationStep, ViewportSize } from '@/domain/types';

const NODE_PADDING = 480;

/**
 * Largura/altura máxima estimada do conteúdo de um step (FloatingCard:
 * painel até 760px + foto lateral 240 + gap 12 ≈ 1012; mais um pouco de
 * folga para badges e sombras). Usado para impedir que `step.scale`
 * deixe o conteúdo maior que o palco em telas verticais.
 */
const MAX_STEP_CONTENT_WIDTH = 1024;
const MAX_STEP_CONTENT_HEIGHT = 1280;
const SAFE_MARGIN = 0.92;

export function cameraForStep(step: PresentationStep, viewport: ViewportSize): CameraState {
  const fitScale = Math.min(
    step.scale,
    (viewport.width * SAFE_MARGIN) / MAX_STEP_CONTENT_WIDTH,
    (viewport.height * SAFE_MARGIN) / MAX_STEP_CONTENT_HEIGHT,
  );
  return {
    scale: fitScale,
    x: viewport.width / 2 - step.position.x * fitScale,
    y: viewport.height / 2 - step.position.y * fitScale,
  };
}

export function cameraForOverview(steps: PresentationStep[], viewport: ViewportSize): CameraState {
  if (steps.length === 0) {
    return { x: viewport.width / 2, y: viewport.height / 2, scale: 1 };
  }

  const xs = steps.map((s) => s.position.x);
  const ys = steps.map((s) => s.position.y);
  const minX = Math.min(...xs) - NODE_PADDING;
  const maxX = Math.max(...xs) + NODE_PADDING;
  const minY = Math.min(...ys) - NODE_PADDING;
  const maxY = Math.max(...ys) + NODE_PADDING;

  const width = maxX - minX;
  const height = maxY - minY;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  const scale = Math.min(viewport.width / width, viewport.height / height, 0.55);

  return {
    scale,
    x: viewport.width / 2 - cx * scale,
    y: viewport.height / 2 - cy * scale,
  };
}
