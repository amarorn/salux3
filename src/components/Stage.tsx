import type { ReactNode } from 'react';
import { dimensionsForStageAspect } from '@/domain/stageAspect';
import { useStageScale } from '@/hooks/useStageScale';
import { usePresentationStore } from '@/store/presentationStore';

interface StageProps {
  children: ReactNode;
}

/**
 * Palco de dimensões fixas (Totem 9:16 ou PS 16:9) com transform: scale para
 * preencher a janela preservando proporção (letterbox automático).
 */
export function Stage({ children }: StageProps) {
  const mode = usePresentationStore((s) => s.stageAspectMode);
  const { width, height } = dimensionsForStageAspect(mode);
  const { scale, offsetX, offsetY } = useStageScale(width, height);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#05070d]">
      <div
        style={{
          width,
          height,
          transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
          transformOrigin: '0 0',
          ['--stage-scale' as string]: scale,
        }}
        className="relative origin-top-left"
      >
        {children}
      </div>
    </div>
  );
}
