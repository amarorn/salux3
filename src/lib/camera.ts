import type { CameraState, PresentationStep, ViewportSize } from '@/domain/types';
import { cameraFitScale } from '@/lib/presentationLayout';

const NODE_PADDING = 480;

export function cameraForStep(step: PresentationStep, viewport: ViewportSize): CameraState {
  const fitScale = cameraFitScale(step.scale, viewport);
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
