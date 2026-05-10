import type { ReactNode } from 'react';
import { useStageScale } from '@/hooks/useStageScale';

export const STAGE_WIDTH = 1080;
export const STAGE_HEIGHT = 1920;

interface StageProps {
  children: ReactNode;
  width?: number;
  height?: number;
}

/**
 * Palco de dimensões fixas (default 1080×1920, 9:16) com transform: scale
 * para preencher qualquer viewport (totem vertical, desktop, mobile) sem
 * quebrar o layout interno. Letterbox automático em proporções diferentes.
 */
export function Stage({ children, width = STAGE_WIDTH, height = STAGE_HEIGHT }: StageProps) {
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
