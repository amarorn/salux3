import type { ViewportSize } from '@/domain/types';
import { STAGE_HEIGHT, STAGE_WIDTH } from '@/components/Stage';

/**
 * Retorna o tamanho do palco da apresentação. A apresentação roda dentro
 * de um `<Stage>` de dimensões fixas (1080×1920) escalado para preencher
 * a janela; toda a matemática de câmera, parallax e nodes deve raciocinar
 * nesse sistema de coordenadas, não no `window.innerWidth/Height`.
 */
export function useViewportSize(): ViewportSize {
  return { width: STAGE_WIDTH, height: STAGE_HEIGHT };
}
