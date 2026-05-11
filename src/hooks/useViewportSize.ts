import type { ViewportSize } from '@/domain/types';
import { dimensionsForStageAspect } from '@/domain/stageAspect';
import { usePresentationStore } from '@/store/presentationStore';

/**
 * Tamanho do palco da apresentação no sistema de coordenadas internas.
 * Segue o modo Totem (1080×1920) ou PS (1920×1080) escolhido no intro.
 */
export function useViewportSize(): ViewportSize {
  const mode = usePresentationStore((s) => s.stageAspectMode);
  return dimensionsForStageAspect(mode);
}
