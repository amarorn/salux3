import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { PresentationStep, ViewportSize } from '@/domain/types';
import { cameraFitScale } from '@/lib/presentationLayout';

interface CenteredStageFrameProps {
  step: PresentationStep;
  viewport: ViewportSize;
  children: ReactNode;
}

/**
 * Moldura fixa no centro do palco: o cartão ativo permanece centralizado
 * e limitado à área segura (não ultrapassa as bordas do viewport).
 */
export function CenteredStageFrame({ step, viewport, children }: CenteredStageFrameProps) {
  const fitScale = cameraFitScale(step.scale, viewport);
  const padX = Math.round(viewport.width * 0.05);
  const padY = Math.round(viewport.height * 0.05);
  const maxW = Math.floor(viewport.width * 0.9);
  const maxH = Math.floor(viewport.height * 0.9);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ padding: `${padY}px ${padX}px` }}
      data-centered-stage
    >
      <div
        className="flex w-full items-center justify-center overflow-hidden"
        style={{
          maxWidth: maxW,
          maxHeight: maxH,
          transform: `scale(${fitScale})`,
          transformOrigin: 'center center',
        }}
      >
        <motion.div
          className="flex w-full min-h-0 max-h-full min-w-0 max-w-full flex-col items-center justify-center overflow-hidden"
          style={{ width: maxW }}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
}
